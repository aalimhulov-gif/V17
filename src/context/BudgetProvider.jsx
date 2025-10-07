import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { db } from '../firebase/firebaseConfig'
import {
  addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy,
  query, serverTimestamp, setDoc, updateDoc, where
} from 'firebase/firestore'
import { useAuth } from '../firebase/auth.jsx'

const BudgetCtx = createContext(null)

export function BudgetProvider({ children }) {
  const { user } = useAuth()

  const [budgetId, setBudgetId] = useState(localStorage.getItem('budgetId') || null)
  const [budgetCode, setBudgetCode] = useState(localStorage.getItem('budgetCode') || '')
  const [profiles, setProfiles] = useState([])
  const [categories, setCategories] = useState([])
  const [goals, setGoals] = useState([])
  const [operations, setOperations] = useState([])

  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'PLN')
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [rates, setRates] = useState({ PLN: 1, USD: 0.25, UAH: 4 })

  // Theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  // Currency
  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  // FX Rates
  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch('https://api.exchangerate.host/latest?base=PLN&symbols=PLN,USD,UAH')
        const data = await res.json()
        if (data?.rates) setRates({ PLN: data.rates.PLN || 1, USD: data.rates.USD || 0.25, UAH: data.rates.UAH || 4 })
      } catch (e) { console.error('Rates fetch error', e) }
    }
    loadRates()
  }, [])

  // Live subscriptions
  useEffect(() => {
    if (!user || !budgetId) return
    const unsubProfiles = onSnapshot(collection(db, 'budgets', budgetId, 'profiles'), (snap) => {
      setProfiles(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    const unsubCategories = onSnapshot(collection(db, 'budgets', budgetId, 'categories'), (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    const unsubGoals = onSnapshot(collection(db, 'budgets', budgetId, 'goals'), (snap) => {
      setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    const unsubOps = onSnapshot(
      query(collection(db, 'budgets', budgetId, 'operations'), orderBy('date', 'desc')),
      (snap) => setOperations(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return () => { unsubProfiles(); unsubCategories(); unsubGoals(); unsubOps() }
  }, [user, budgetId])

  // Calculations
  const balances = useMemo(() => {
    const byId = {}
    profiles.forEach(p => { byId[p.id] = 0 })
    operations.forEach(op => {
      const amount = Number(op.amount || 0)
      if (op.type === 'income' && op.profileId) byId[op.profileId] += amount
      if (op.type === 'expense' && op.profileId) byId[op.profileId] -= amount
      if (op.type === 'transfer' && op.fromProfileId && op.toProfileId) {
        byId[op.fromProfileId] -= amount
        byId[op.toProfileId] += amount
      }
      if (op.type === 'goal' && op.profileId) byId[op.profileId] -= amount
    })
    return byId
  }, [operations, profiles])

  const totals = useMemo(() => {
    let income = 0, expense = 0
    operations.forEach(op => {
      const amt = Number(op.amount || 0)
      if (op.type === 'income') income += amt
      if (op.type === 'expense' || op.type === 'goal') expense += amt
    })
    return { income, expense, balance: income - expense }
  }, [operations])

  const totalsByProfile = useMemo(() => {
    const map = {}
    profiles.forEach(p => map[p.id] = { income: 0, expense: 0, balance: 0 })
    operations.forEach(op => {
      const amt = Number(op.amount || 0)
      if (op.type === 'income' && op.profileId) {
        map[op.profileId].income += amt
        map[op.profileId].balance += amt
      }
      if (op.type === 'expense' && op.profileId) {
        map[op.profileId].expense += amt
        map[op.profileId].balance -= amt
      }
      if (op.type === 'transfer' && op.fromProfileId && op.toProfileId) {
        map[op.fromProfileId].expense += amt
        map[op.fromProfileId].balance -= amt
        map[op.toProfileId].income += amt
        map[op.toProfileId].balance += amt
      }
      if (op.type === 'goal' && op.profileId) {
        map[op.profileId].expense += amt
        map[op.profileId].balance -= amt
      }
    })
    return map
  }, [operations, profiles])

  const spentByCategory = useMemo(() => {
    const map = {}
    operations.forEach(op => {
      if (op.type === 'expense' && op.categoryId) {
        map[op.categoryId] = (map[op.categoryId] || 0) + Number(op.amount || 0)
      }
    })
    return map
  }, [operations])

  const savedByGoal = useMemo(() => {
    const map = {}
    operations.forEach(op => {
      if (op.type === 'goal' && op.goalId) {
        map[op.goalId] = (map[op.goalId] || 0) + Number(op.amount || 0)
      }
    })
    return map
  }, [operations])

  function getGoalSaved(goalId) {
    return savedByGoal[goalId] || 0
  }

  // Helpers
  function convert(amountPLN) {
    const rate = rates[currency] || 1
    return Number(amountPLN) * rate
  }

  // Budget
  function genCode(len = 6) {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let s = ''
    for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)]
    return s
  }

  async function createBudget() {
    const code = genCode(6)
    const budgetRef = doc(collection(db, 'budgets'))
    await setDoc(budgetRef, {
      owner: user?.uid || null,
      createdAt: serverTimestamp(),
      currency: 'PLN',
      code
    })
    await addDoc(collection(budgetRef, 'profiles'), { name: 'Артур', createdAt: serverTimestamp(), online: false, lastSeen: null })
    await addDoc(collection(budgetRef, 'profiles'), { name: 'Валерия', createdAt: serverTimestamp(), online: false, lastSeen: null })
    setBudgetId(budgetRef.id)
    setBudgetCode(code)
    localStorage.setItem('budgetId', budgetRef.id)
    localStorage.setItem('budgetCode', code)
    return budgetRef.id
  }

  async function joinBudget(idOrCode) {
    const raw = (idOrCode || '').trim()
    if (!raw) throw new Error('Пустой ID/код бюджета')

    const tryId = await getDoc(doc(db, 'budgets', raw))
    if (tryId.exists()) {
      setBudgetId(tryId.id)
      setBudgetCode(tryId.data()?.code || '')
      localStorage.setItem('budgetId', tryId.id)
      if (tryId.data()?.code) localStorage.setItem('budgetCode', tryId.data().code)
      return tryId.id
    }

    const q = query(collection(db, 'budgets'), where('code', '==', raw.toUpperCase()))
    const snap = await getDocs(q)
    if (!snap.empty) {
      const d = snap.docs[0]
      setBudgetId(d.id)
      setBudgetCode(d.data()?.code || '')
      localStorage.setItem('budgetId', d.id)
      if (d.data()?.code) localStorage.setItem('budgetCode', d.data().code)
      return d.id
    }
    throw new Error('Бюджет не найден')
  }

  async function updateBudgetCode(newCode) {
    if (!budgetId) throw new Error('Нет активного бюджета')
    const code = (newCode || '').toUpperCase().replace(/\\s+/g, '')
    if (!code || code.length < 4) throw new Error('Код слишком короткий')
    await updateDoc(doc(db, 'budgets', budgetId), { code })
    setBudgetCode(code)
    localStorage.setItem('budgetCode', code)
  }

  // Categories (emoji + limit)
  async function addCategory(payload) {
    const data = { name: payload.name, emoji: payload.emoji || '📂', limit: payload.limit ? Number(payload.limit) : 0, createdAt: serverTimestamp() }
    await addDoc(collection(db, 'budgets', budgetId, 'categories'), data)
  }
  async function updateCategory(id, payload) {
    const patch = {}
    if (payload.name !== undefined) patch.name = payload.name
    if (payload.emoji !== undefined) patch.emoji = payload.emoji
    if (payload.limit !== undefined) patch.limit = Number(payload.limit) || 0
    await updateDoc(doc(db, 'budgets', budgetId, 'categories', id), patch)
  }
  async function deleteCategory(id) {
    await deleteDoc(doc(db, 'budgets', budgetId, 'categories', id))
  }
  async function setLimitForCategory(id, limit) {
    await updateDoc(doc(db, 'budgets', budgetId, 'categories', id), { limit: Number(limit) || 0 })
  }

  // Goals
  async function addGoal(payload) {
    const data = { name: payload.name, emoji: payload.emoji || '🎯', amount: Number(payload.amount || payload.target || 0), deadline: payload.deadline || '', createdAt: serverTimestamp() }
    await addDoc(collection(db, 'budgets', budgetId, 'goals'), data)
  }
  async function contributeToGoal(goalId, profileId, amount, note='') {
    await addDoc(collection(db, 'budgets', budgetId, 'operations'), {
      type: 'goal',
      goalId, profileId,
      amount: Number(amount),
      note,
      date: new Date().toISOString(),
      createdBy: user?.uid || null,
      createdAt: serverTimestamp()
    })
  }

  // Operations
  async function addOperation(op) {
    await addDoc(collection(db, 'budgets', budgetId, 'operations'), {
      ...op,
      amount: Number(op.amount),
      date: op.date || new Date().toISOString(),
      createdBy: user?.uid || null,
      createdAt: serverTimestamp()
    })
  }
  async function deleteOperation(id) {
    await deleteDoc(doc(db, 'budgets', budgetId, 'operations', id))
  }

  // Presence
  async function setOnlineStatus(profileId, isOnline) {
    await updateDoc(doc(db, 'budgets', budgetId, 'profiles', profileId), {
      online: isOnline,
      lastSeen: isOnline ? serverTimestamp() : new Date().toISOString()
    })
  }

  const value = {
    budgetId, setBudgetId,
    budgetCode, updateBudgetCode,
    createBudget, joinBudget,

    profiles, categories, goals, operations,

    addCategory, updateCategory, deleteCategory, setLimitForCategory,
    addGoal, contributeToGoal, getGoalSaved,
    addOperation, deleteOperation,

    balances, totals, totalsByProfile,
    spentByCategory, savedByGoal,

    currency, setCurrency,
    theme, setTheme, toggleTheme,
    rates, convert,

    setOnlineStatus
  }

  return <BudgetCtx.Provider value={value}>{children}</BudgetCtx.Provider>
}

export function useBudget() {
  return useContext(BudgetCtx)
}
