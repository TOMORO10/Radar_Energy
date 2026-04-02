import { useApp } from '../context/AppContext';

const TABS = [
  { id: 'dashboard',   label: 'Inicio',    icon: '🏠' },
  { id: 'pipeline',    label: 'Pipeline',  icon: '📊' },
  { id: 'prospectos',  label: 'Lista',     icon: '👥' },
  { id: 'perfil',      label: 'Perfil',    icon: '⚙️' },
];

export default function BottomNav() {
  const { screen, navTo } = useApp();
  return (
    <div className="bottom-nav">
      {TABS.map(t => (
        <button
          key={t.id}
          className={`bottom-nav-item ${screen === t.id ? 'active' : ''}`}
          onClick={() => navTo(t.id)}
        >
          <span className="bottom-nav-icon">{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
