import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProspectoCard, EtapaBadge } from '../components/UI';
import { ETAPAS, CIUDADES } from '../data/mockData';

const TEMPS = [
  { code: '', label: 'Todos' },
  { code: 'frio',     label: '🧊 Frío' },
  { code: 'tibio',    label: '🟡 Tibio' },
  { code: 'caliente', label: '🔥 Caliente' },
];

export default function ProspectosScreen() {
  const { visibleProspectos, navigate, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [filterEtapa, setFilterEtapa] = useState('');
  const [filterTemp, setFilterTemp] = useState('');
  const [filterCiudad, setFilterCiudad] = useState('');

  const filtered = visibleProspectos.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.empresa.toLowerCase().includes(q) || p.contacto_nombre.toLowerCase().includes(q);
    const matchEtapa  = !filterEtapa  || p.etapa === filterEtapa;
    const matchTemp   = !filterTemp   || p.temperatura === filterTemp;
    const matchCiudad = !filterCiudad || p.ciudad === filterCiudad;
    return matchSearch && matchEtapa && matchTemp && matchCiudad;
  });

  return (
    <div className="screen animate-in" style={{ position: 'relative' }}>
      {/* Header */}
      <div className="screen-header">
        <div>
          <div className="screen-header-title">Prospectos</div>
          <div className="screen-header-sub">
            {currentUser.rol === 'asesor' ? 'Mis prospectos' : 'Todo el equipo'} · {filtered.length} resultados
          </div>
        </div>
        <span style={{ fontSize: 22 }}>🔍</span>
      </div>

      {/* Search */}
      <div style={{ padding: '0 12px 8px' }}>
        <input
          className="input-field"
          placeholder="Buscar empresa o contacto..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filters row */}
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '0 12px 8px', scrollbarWidth: 'none' }}>
        {/* Etapa */}
        {[{ code: '', label: 'Todas etapas' }, ...ETAPAS.slice(0, 5)].map(e => (
          <button
            key={e.code}
            className={`pill-sm ${filterEtapa === e.code ? 'active' : ''}`}
            style={{ marginRight: 6, whiteSpace: 'nowrap' }}
            onClick={() => setFilterEtapa(e.code)}
          >
            {e.label || 'Todas etapas'}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '0 12px 10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TEMPS.map(t => (
          <button
            key={t.code}
            className={`pill-sm ${filterTemp === t.code ? 'active' : ''}`}
            onClick={() => setFilterTemp(t.code)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {t.label}
          </button>
        ))}
        {[{ code: '', label: 'Todas ciudades' }, ...CIUDADES.map(c => ({ code: c, label: c }))].map(c => (
          <button
            key={c.code}
            className={`pill-sm ${filterCiudad === c.code ? 'active' : ''}`}
            onClick={() => setFilterCiudad(c.code)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔭</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Sin resultados</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Ajusta los filtros o crea un nuevo prospecto</div>
        </div>
      ) : (
        filtered.map(p => (
          <ProspectoCard key={p.id} prospecto={p} onClick={p => navigate('ficha', { prospectoId: p.id })} />
        ))
      )}

      <button className="fab" onClick={() => navigate('nuevo_prospecto')}>+</button>
    </div>
  );
}
