import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  TempBadge, EtapaBadge, EtapaStepper, ProbRing,
  ActivityItem, formatCOP, fuenteInfo, etapaInfo,
  DaysBadge,
} from '../components/UI';
import { ETAPAS } from '../data/mockData';

const TEMPS_OPT = ['frio','tibio','caliente'];

export default function FichaProspectoScreen() {
  const { getProspecto, getActividades, navigate, goBack, selectedProspectoId, updateProspecto, diasSinActividad } = useApp();
  const prospecto = getProspecto(selectedProspectoId);
  const actividades = getActividades(selectedProspectoId);

  const [tab, setTab] = useState('info'); // 'info' | 'actividades'

  if (!prospecto) return (
    <div className="screen" style={{ padding: 20, color: 'var(--text-muted)' }}>Prospecto no encontrado</div>
  );

  const dias = diasSinActividad(prospecto);
  const isTerminal = ['cierre_ganado','cierre_perdido'].includes(prospecto.etapa);

  const changeTemp = (t) => updateProspecto(prospecto.id, { temperatura: t });
  const changeEtapa = (e) => {
    if (e === 'cierre_ganado') {
      updateProspecto(prospecto.id, { etapa: e, probabilidad: 100 });
    } else if (e === 'cierre_perdido') {
      updateProspecto(prospecto.id, { etapa: e, probabilidad: 0 });
    } else {
      updateProspecto(prospecto.id, { etapa: e });
    }
  };

  return (
    <div className="screen animate-in" style={{ position: 'relative' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px 4px' }}>
        <button className="back-btn" onClick={goBack}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Outfit', fontSize: 17, fontWeight: 700, lineHeight: 1.2 }}>
            {prospecto.empresa}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{prospecto.ciudad} · {fuenteInfo(prospecto.fuente).icon} {fuenteInfo(prospecto.fuente).label}</div>
        </div>
        <DaysBadge dias={dias} />
      </div>

      {/* Hero card */}
      <div style={{
        margin: '8px 12px 0',
        background: 'linear-gradient(135deg, rgba(249,115,22,.12), rgba(99,102,241,.08))',
        border: '1px solid rgba(249,115,22,.2)',
        borderRadius: 16,
        padding: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 800, color: 'var(--primary)' }}>
              {formatCOP(prospecto.valor_estimado_cop)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {prospecto.potencia_estimada_kwp} kWp · {prospecto.consumo_kwh_mes?.toLocaleString()} kWh/mes
            </div>
          </div>
          <ProbRing value={prospecto.probabilidad} />
        </div>

        {/* Status badges */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          <EtapaBadge etapa={prospecto.etapa} />
          <TempBadge temp={prospecto.temperatura} />
          {prospecto.fecha_cierre_estimada && (
            <span className="badge badge-slate">📅 Cierre: {prospecto.fecha_cierre_estimada}</span>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            className="action-btn action-btn-call"
            href={`tel:${prospecto.contacto_telefono}`}
            onClick={e => e.preventDefault()}
          >
            📞 Llamar
          </a>
          <a
            className="action-btn action-btn-wa"
            href={`https://wa.me/${prospecto.contacto_telefono?.replace(/\D/g,'')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.preventDefault()}
          >
            💬 WhatsApp
          </a>
        </div>
      </div>

      {/* Temperatura selector */}
      {!isTerminal && (
        <div style={{ padding: '10px 12px 0' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Temperatura</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {TEMPS_OPT.map(t => {
              const map = { frio: '🧊 Frío', tibio: '🟡 Tibio', caliente: '🔥 Caliente' };
              return (
                <button
                  key={t}
                  className={`pill ${prospecto.temperatura === t ? 'active' : ''}`}
                  style={{ flex: 1, textAlign: 'center', padding: '8px 4px', fontSize: 12 }}
                  onClick={() => changeTemp(t)}
                >
                  {map[t]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Etapa stepper */}
      {!isTerminal && (
        <div style={{ padding: '12px 0 4px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em', paddingLeft: 16 }}>Etapa del pipeline</div>
          <EtapaStepper etapa={prospecto.etapa} />
          {/* Mover etapa */}
          <div style={{ display: 'flex', gap: 6, padding: '10px 12px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {ETAPAS.map(e => (
              <button
                key={e.code}
                className={`pill-sm ${prospecto.etapa === e.code ? 'active' : ''}`}
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => changeEtapa(e.code)}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Terminal status */}
      {isTerminal && (
        <div style={{
          margin: '10px 12px',
          padding: '12px',
          borderRadius: 12,
          background: prospecto.etapa === 'cierre_ganado' ? 'var(--green-bg)' : 'var(--red-bg)',
          border: `1px solid ${prospecto.etapa === 'cierre_ganado' ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`,
        }}>
          <div style={{ fontWeight: 600, color: prospecto.etapa === 'cierre_ganado' ? 'var(--green)' : 'var(--red)', fontSize: 14 }}>
            {prospecto.etapa === 'cierre_ganado' ? '🏆 Cierre Ganado — Proyecto creado' : '❌ Cierre Perdido'}
          </div>
          {prospecto.motivo_perdida && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Motivo: {prospecto.motivo_perdida}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', margin: '8px 12px 0' }}>
        {[['info','ℹ️ Datos'],['actividades','📋 Timeline']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex: 1,
              padding: '10px 0',
              fontSize: 13,
              fontWeight: 600,
              color: tab === id ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: tab === id ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'all .15s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Info */}
      {tab === 'info' && (
        <div style={{ padding: '12px 16px' }} className="animate-in">
          {[
            ['👤 Contacto', prospecto.contacto_nombre],
            ['📞 Teléfono', prospecto.contacto_telefono],
            ['📧 Email',    prospecto.contacto_email || '—'],
            ['📍 Dirección', prospecto.direccion || '—'],
            ['🌆 Ciudad', prospecto.ciudad],
            ['📅 1er contacto', prospecto.fecha_primer_contacto],
            ['📅 Cierre est.', prospecto.fecha_cierre_estimada || '—'],
            ['📝 Notas', prospecto.notas || '—'],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{k}</div>
              <div style={{ fontSize: 14, color: 'var(--text)', marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Actividades */}
      {tab === 'actividades' && (
        <div className="timeline animate-in">
          {actividades.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: 13 }}>
              Sin actividades registradas aún
            </div>
          ) : (
            actividades.map(a => <ActivityItem key={a.id} act={a} />)
          )}
        </div>
      )}

      <div style={{ height: 20 }} />

      {/* FAB registrar actividad */}
      {!isTerminal && (
        <button className="fab" onClick={() => navigate('registrar_actividad', { prospectoId: selectedProspectoId })}>
          ✏️
        </button>
      )}
    </div>
  );
}
