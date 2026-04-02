import { createContext, useContext, useState } from 'react';
import { PROSPECTOS_INIT, ACTIVIDADES_INIT, USUARIOS } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(USUARIOS[0]); // default: asesor
  const [prospectos, setProspectos] = useState(PROSPECTOS_INIT);
  const [actividades, setActividades] = useState(ACTIVIDADES_INIT);
  const [screen, setScreen] = useState('dashboard');
  const [screenStack, setScreenStack] = useState([]);
  const [selectedProspectoId, setSelectedProspectoId] = useState(null);

  const navigate = (to, params = {}) => {
    setScreenStack(prev => [...prev, { screen, params: {} }]);
    setScreen(to);
    if (params.prospectoId) setSelectedProspectoId(params.prospectoId);
  };

  const goBack = () => {
    if (screenStack.length === 0) return;
    const prev = screenStack[screenStack.length - 1];
    setScreenStack(s => s.slice(0, -1));
    setScreen(prev.screen);
  };

  const navTo = (to) => {
    setScreenStack([]);
    setScreen(to);
    setSelectedProspectoId(null);
  };

  const createProspecto = (data) => {
    const now = new Date().toISOString();
    const newP = {
      id: 'p' + Date.now(),
      etapa: 'contacto_inicial',
      temperatura: 'frio',
      probabilidad: 20,
      motivo_perdida: null,
      fecha_primer_contacto: now.slice(0, 10),
      fecha_cierre_estimada: null,
      ultima_actividad: now.slice(0, 10),
      created_at: now,
      updated_at: now,
      asesor_id: currentUser.id,
      ...data,
    };
    setProspectos(prev => [newP, ...prev]);
    return newP;
  };

  const updateProspecto = (id, changes) => {
    setProspectos(prev =>
      prev.map(p => p.id === id ? { ...p, ...changes, updated_at: new Date().toISOString() } : p)
    );
  };

  const addActividad = (data) => {
    const now = new Date().toISOString();
    const newA = {
      id: 'a' + Date.now(),
      asesor_id: currentUser.id,
      created_at: now,
      ...data,
    };
    setActividades(prev => [newA, ...prev]);
    updateProspecto(data.prospecto_id, {
      ultima_actividad: now.slice(0, 10),
    });
    return newA;
  };

  const diasSinActividad = (p) => {
    const last = new Date(p.ultima_actividad);
    const today = new Date('2026-04-01'); // mockup date
    return Math.floor((today - last) / 86400000);
  };

  const getProspecto = (id) => prospectos.find(p => p.id === id);
  const getActividades = (prospectoId) =>
    actividades.filter(a => a.prospecto_id === prospectoId)
               .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const visibleProspectos = currentUser.rol === 'asesor'
    ? prospectos.filter(p => p.asesor_id === currentUser.id)
    : prospectos;

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, usuarios: USUARIOS,
      prospectos, visibleProspectos,
      actividades,
      screen, navigate, goBack, navTo,
      selectedProspectoId, setSelectedProspectoId,
      createProspecto, updateProspecto, addActividad,
      diasSinActividad, getProspecto, getActividades,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
