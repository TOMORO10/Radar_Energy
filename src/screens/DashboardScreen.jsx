import { useApp } from '../context/AppContext';
import { KPICard, ProspectoCard, formatCOP, etapaInfo } from '../components/UI';

export default function DashboardScreen() {
  const { currentUser, visibleProspectos, diasSinActividad, navigate, actividades } = useApp();

  const MOCK_DATE = new Date('2026-04-01');

  const active = visibleProspectos.filter(p => p.etapa !== 'cierre_ganado' && p.etapa !== 'cierre_perdido');
  const pipelineWeighted = active.reduce((s, p) => s + (p.valor_estimado_cop || 0) * (p.probabilidad / 100), 0);
  const calientes = active.filter(p => p.temperatura === 'caliente').slice(0, 3);
  const stale = active.filter(p => diasSinActividad(p) > 5).slice(0, 3);

  // próximas acciones: actividades con fecha_proxima_accion ≤ hoy+2
  const upcomingActs = actividades
    .filter(a => {
      if (!a.fecha_proxima_accion) return false;
      const d = new Date(a.fecha_proxima_accion);
      const diff = (d - MOCK_DATE) / 86400000;
      return diff <= 2;
    })
    .slice(0, 3);

  const metaMensual = 1_200_000_000;
  const cerrados = visibleProspectos.filter(p => p.etapa === 'cierre_ganado')
    .reduce((s, p) => s + (p.valor_estimado_cop || 0), 0);
  const metaPct = Math.min(100, Math.round(cerrados / metaMensual * 100));

  return (
    <div className="screen animate-in">
      {/* Header */}
      <div style={{ padding: '8px 16px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
              ⚡ Radar Energy 4.0
            </div>
            <div style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>
              Hola, {currentUser.nombre.split(' ')[0]} 👋
            </div>
          </div>
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: 'linear-gradient(135deg,var(--primary),var(--primary-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, color: '#fff'
          }}>
            {currentUser.avatar}
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          Martes, 1 abril 2026
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '10px 12px 4px' }}>
        <KPICard
          label="Pipeline Ponderado"
          value={formatCOP(pipelineWeighted)}
          sub={`${active.length} oportunidades activas`}
          accent="var(--primary)"
        />
        <KPICard
          label="Prospectos Calientes"
          value={calientes.length}
          sub="temperatura = 🔴 caliente"
          accent="var(--red)"
        />
      </div>
      <div style={{ padding: '0 12px 4px' }}>
        <KPICard
          label="Meta mensual de cierre"
          value={`${metaPct}%`}
          sub={`${formatCOP(cerrados)} de ${formatCOP(metaMensual)} objetivo`}
        />
        <div style={{ marginTop: 8 }}>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${metaPct}%` }} />
          </div>
        </div>
      </div>

      {/* Alertas */}
      {stale.length > 0 && (
        <>
          <div className="section-title">⚠️ Requieren atención</div>
          {stale.map(p => (
            <div key={p.id} className="alert-strip" onClick={() => navigate('ficha', { prospectoId: p.id })} style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: 18 }}>🚨</span>
              <div>
                <div style={{ fontWeight: 600 }}>{p.empresa}</div>
                <div style={{ fontSize: 11, opacity: .8 }}>{diasSinActividad(p)} días sin actividad · {etapaInfo(p.etapa).label}</div>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Calientes hoy */}
      {calientes.length > 0 && (
        <>
          <div className="section-title">🔥 Oportunidades calientes</div>
          {calientes.map(p => (
            <ProspectoCard key={p.id} prospecto={p} onClick={p => navigate('ficha', { prospectoId: p.id })} />
          ))}
        </>
      )}

      {/* Próximas acciones */}
      {upcomingActs.length > 0 && (
        <>
          <div className="section-title">📅 Próximas acciones</div>
          {upcomingActs.map(a => {
            const p = visibleProspectos.find(x => x.id === a.prospecto_id);
            if (!p) return null;
            return (
              <div key={a.id}
                className="card"
                style={{ margin: '0 12px 8px', cursor: 'pointer', padding: '12px 14px' }}
                onClick={() => navigate('ficha', { prospectoId: p.id })}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.empresa}</div>
                    <div style={{ fontSize: 12, color: 'var(--primary)', marginTop: 3 }}>→ {a.proxima_accion}</div>
                  </div>
                  <span style={{
                    fontSize: 11, color: 'var(--yellow)', background: 'var(--yellow-bg)',
                    padding: '2px 8px', borderRadius: 10, fontWeight: 600
                  }}>{a.fecha_proxima_accion}</span>
                </div>
              </div>
            );
          })}
        </>
      )}

      <div style={{ height: 20 }} />

      {/* FAB */}
      <button className="fab" onClick={() => navigate('nuevo_prospecto')}>+</button>
    </div>
  );
}
