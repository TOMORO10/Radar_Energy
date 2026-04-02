import { useApp } from './context/AppContext';
import PhoneShell from './components/PhoneShell';
import BottomNav from './components/BottomNav';

// Screens
import DashboardScreen from './screens/DashboardScreen';
import ProspectosScreen from './screens/ProspectosScreen';
import PipelineScreen from './screens/PipelineScreen';
import FichaProspectoScreen from './screens/FichaProspectoScreen';
import NuevoProspectoScreen from './screens/NuevoProspectoScreen';
import RegistrarActividadScreen from './screens/RegistrarActividadScreen';

function ScreenRenderer() {
  const { screen } = useApp();

  switch (screen) {
    case 'dashboard':         return <DashboardScreen />;
    case 'pipeline':          return <PipelineScreen />;
    case 'prospectos':        return <ProspectosScreen />;
    case 'ficha':             return <FichaProspectoScreen />;
    case 'nuevo_prospecto':   return <NuevoProspectoScreen />;
    case 'registrar_actividad': return <RegistrarActividadScreen />;
    case 'perfil':
      return (
        <div className="screen animate-in" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: 'var(--surface-2)', margin: '40px auto 20px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: 32 }}>⚙️</div>
          <h2 style={{ fontFamily: 'Outfit' }}>Configuración</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: 10 }}>Módulo de perfil y ajustes en desarrollo para V1.1</p>
        </div>
      );
    default:
      return <DashboardScreen />;
  }
}

function App() {
  return (
    <PhoneShell>
      <ScreenRenderer />
      <BottomNav />
    </PhoneShell>
  );
}

export default App;
