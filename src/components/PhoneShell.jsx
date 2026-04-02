import { useApp } from '../context/AppContext';
import { USUARIOS } from '../data/mockData';

export default function PhoneShell({ children }) {
  const { currentUser, setCurrentUser } = useApp();
  return (
    <div className="phone-shell-wrapper">
      {/* User switcher (demo only) */}
      <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 999, display: 'flex', gap: 6 }}>
        {USUARIOS.map(u => (
          <button
            key={u.id}
            className={`user-chip ${currentUser.id === u.id ? 'active' : ''}`}
            onClick={() => setCurrentUser(u)}
          >
            {u.avatar} · {u.rol === 'asesor' ? 'Asesor' : u.rol === 'director' ? 'Director' : 'Admin'}
          </button>
        ))}
      </div>

      <div className="phone-shell">
        <div className="phone-notch" />
        <div className="phone-screen">
          {/* Status Bar */}
          <div className="status-bar">
            <span>9:41</span>
            <div className="status-bar-icons">
              <span>⚡</span>
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
