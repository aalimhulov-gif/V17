import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../firebase/auth.jsx';
import { useBudget } from '../context/BudgetProvider.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { budgetId, theme, toggleTheme } = useBudget();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Проверяем, находимся ли мы на странице авторизации
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Блокировка скролла при открытом мобильном меню
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Очистка при размонтировании
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { to: '/', label: 'Главная' },
    { to: '/categories', label: 'Категории' },
    { to: '/goals', label: 'Цели' },
    { to: '/operations', label: 'Операции' },
    { to: '/budget', label: 'Семья' },
    { to: '/settings', label: 'Настройки' },
  ];

  return (
    <>
    <header 
      className="sticky top-0 z-[100] transition-all duration-300"
      style={{
        background: `
          linear-gradient(to bottom, 
            rgba(10, 10, 15, 0.95) 0%, 
            rgba(10, 10, 15, 0.8) 100%
          )
        `,
        backdropFilter: 'blur(20px) saturate(150%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="container-custom flex items-center justify-between py-4">
        {/* Логотип */}
        <Link to="/" className="flex items-center gap-3 text-xl font-bold group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            💸
          </div>
          <span className="hidden sm:inline bg-gradient-primary bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
            Budget Buddy
          </span>
        </Link>

        {/* Десктопная навигация */}
        {!isAuthPage && (
          <nav className="hidden lg:flex items-center gap-2 p-2 rounded-2xl" 
               style={{
                 background: 'rgba(255, 255, 255, 0.05)',
                 backdropFilter: 'blur(10px)',
                 border: '1px solid rgba(255, 255, 255, 0.1)'
               }}>
            {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `relative flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 overflow-hidden group ${
                  isActive 
                    ? 'text-white' 
                    : 'text-zinc-400 hover:text-white'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
              } : {}}
            >
              <span className="relative z-10">{item.label}</span>
              {/* Hover эффект */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </NavLink>
          ))}
        </nav>
        )}

        {/* Правая часть */}
        <div className="flex items-center gap-3">
          {/* Информация о бюджете */}
          {user && budgetId && !isAuthPage && (
            <div 
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-zinc-400">Семья:</span>
              <span className="text-white font-medium">{budgetId.slice(-6)}</span>
            </div>
          )}

          {/* Переключатель темы */}
          {!isAuthPage && (
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl hover:scale-110 transition-all duration-300 group"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <span className="text-lg group-hover:rotate-180 transition-transform duration-500 block">
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
            </button>
          )}

          {/* Пользователь */}
          {user ? (
            <>
              {/* Аватар пользователя */}
              <div 
                className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl hover:scale-105 transition-all duration-300 group cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover:rotate-12 transition-transform duration-300">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-zinc-300 max-w-32 truncate">
                  {user.email}
                </span>
              </div>

              {/* Кнопка выхода */}
              <button
                onClick={handleLogout}
                className="p-3 rounded-xl hover:scale-110 transition-all duration-300 group hover:bg-red-500/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                title="Выйти"
              >
                <span className="text-lg group-hover:rotate-12 transition-transform duration-300 block">
                  🚪
                </span>
              </button>
            </>
          ) : !isAuthPage && (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-xl font-medium text-zinc-300 hover:text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                Войти
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                }}
              >
                Регистрация
              </Link>
            </div>
          )}

          {/* Мобильное меню */}
          {!isAuthPage && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-3 rounded-xl hover:scale-110 transition-all duration-300 group"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <span className="text-lg group-hover:rotate-180 transition-transform duration-300 block">
                {mobileOpen ? '✕' : '☰'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
    
    {/* Мобильное меню через портал */}
    {mobileOpen && !isAuthPage && createPortal(
      <div className="lg:hidden fixed inset-0 z-[9999]">
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={() => setMobileOpen(false)}
        />
        
        {/* Боковая панель */}
        <div 
          className="absolute top-0 right-0 w-80 h-full overflow-y-auto"
          style={{
            background: `
              linear-gradient(to bottom, 
                rgba(10, 10, 15, 0.98) 0%, 
                rgba(25, 25, 35, 0.95) 100%
              )
            `,
            backdropFilter: 'blur(30px) saturate(150%)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="p-6 space-y-6">
            {/* Заголовок */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center text-white">
                  💸
                </div>
                <h3 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                  Budget Buddy
                </h3>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-xl hover:scale-110 transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <span className="text-lg">✕</span>
              </button>
            </div>

            {/* Профиль пользователя */}
            {user && (
              <div 
                className="p-4 rounded-2xl"
                style={{
                  background: `
                    linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.1) 0%, 
                      rgba(255, 255, 255, 0.05) 100%
                    )
                  `,
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{user.email}</div>
                    <div className="text-xs text-zinc-400">Активный пользователь</div>
                  </div>
                </div>
                
                {budgetId && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-zinc-400">Семья:</span>
                    <span className="text-white font-medium">{budgetId.slice(-6)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Навигация */}
            <nav className="space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-zinc-500 font-medium px-2">Навигация</h4>
              {navItems.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => 
                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden ${
                      isActive 
                        ? 'text-white' 
                        : 'text-zinc-400 hover:text-white'
                    }`
                  }
                  style={({ isActive }) => isActive ? {
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3))',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)'
                  } : {
                    background: 'rgba(255, 255, 255, 0.03)'
                  }}
                >
                  <span className="relative z-10 text-lg">
                    {item.to === '/' && '🏠'}
                    {item.to === '/categories' && '📂'}
                    {item.to === '/goals' && '🎯'}
                    {item.to === '/operations' && '💱'}
                    {item.to === '/budget' && '👨‍👩‍👧‍👦'}
                    {item.to === '/settings' && '⚙️'}
                  </span>
                  <span className="relative z-10">{item.label}</span>
                  {/* Hover эффект */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </NavLink>
              ))}
            </nav>

            {/* Нижняя панель */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white transition-all duration-300 group"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <span className="text-lg group-hover:rotate-180 transition-transform duration-500">
                  {theme === 'dark' ? '☀️' : '🌙'}
                </span>
                <span>Переключить тему</span>
              </button>
              
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-red-400 transition-all duration-300 group hover:bg-red-500/10"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <span className="text-lg group-hover:rotate-12 transition-transform duration-300">🚪</span>
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}