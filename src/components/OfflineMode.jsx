import React from 'react'

export default function OfflineMode() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#09090b',
      color: '#fafafa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui',
      padding: '20px'
    }}>
      <div style={{
        background: '#18181b',
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid #27272a',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#6366f1',
          marginBottom: '16px'
        }}>
          🔧 Режим отладки
        </h1>
        
        <p style={{
          color: '#a1a1aa',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          Приложение запущено в автономном режиме для диагностики проблем.
        </p>

        <div style={{
          background: '#0f0f23',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'left',
          fontSize: '14px'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>✅ React:</strong> Загружен успешно
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>✅ CSS:</strong> Базовые стили применены
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>🔍 Firebase:</strong> Проверяется...
          </div>
          <div>
            <strong>🌐 Сеть:</strong> {navigator.onLine ? 'Подключена' : 'Отключена'}
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#6366f1',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          Попробовать снова
        </button>
        
        <div style={{
          marginTop: '16px',
          fontSize: '12px',
          color: '#71717a'
        }}>
          Откройте DevTools (F12) для просмотра подробных логов
        </div>
      </div>
    </div>
  )
}