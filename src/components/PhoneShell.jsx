import { useApp } from '../context/AppContext';
import { USUARIOS } from '../data/mockData';

export default function PhoneShell({ children }) {
  const { currentUser, setCurrentUser } = useApp();
  return (
    <div className="phone-shell-wrapper">

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
