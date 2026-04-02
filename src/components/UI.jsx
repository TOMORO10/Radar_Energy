import { useApp } from '../context/AppContext';
import { ETAPAS, FUENTES, TIPOS_ACTIVIDAD } from '../data/mockData';

// ─── Helpers ─────────────────────────────────────────────────────────────
export function etapaInfo(code) {
  return ETAPAS.find(e => e.code === code) || { label: code, color: '#64748B' };
}
export function fuenteInfo(code) {
  return FUENTES.find(f => f.code === code) || { label: code, icon: '📌' };
}
export function tipoInfo(code) {
  return TIPOS_ACTIVIDAD.find(t => t.code === code) || { label: code, icon: '📝' };
}
export function formatCOP(v) {
  if (!v) return '—';
  if (v >= 1_000_000_000) return `$${(v/1_000_000_000).toFixed(1).replace('.0','')} MIL M`;
  if (v >= 1_000_000)     return `$${(v/1_000_000).toFixed(0)}M`;
  return `$${v.toLocaleString('es-CO')}`;
}
export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'2-digit' });
}

// ─── Temperatura Badge ────────────────────────────────────────────────────
export function TempBadge({ temp }) {
  const map = {
    frio:     { label: 'Frío',     cls: 'badge-blue',   dot: 'temp-frio' },
    tibio:    { label: 'Tibio',    cls: 'badge-yellow',  dot: 'temp-tibio' },
    caliente: { label: 'Caliente', cls: 'badge-red',     dot: 'temp-caliente' },
  };
  const t = map[temp] || map.frio;
  return (
    <span className={`badge ${t.cls}`}>
      <span className={`temp-dot ${t.dot}`} />
      {t.label}
    </span>
  );
}

// ─── Etapa Badge ──────────────────────────────────────────────────────────
export function EtapaBadge({ etapa }) {
  const e = etapaInfo(etapa);
  const clsMap = {
    contacto_inicial: 'badge-purple',
    calificacion:     'badge-purple',
    visita_tecnica:   'badge-yellow',
    propuesta:        'badge-blue',
    negociacion:      'badge-green',
    cierre_ganado:    'badge-green',
    cierre_perdido:   'badge-red',
  };
  return <span className={`badge ${clsMap[etapa] || 'badge-slate'}`}>{e.label}</span>;
}

// ─── Days badge ───────────────────────────────────────────────────────────
export function DaysBadge({ dias }) {
  const cls = dias > 7 ? 'stale' : dias > 3 ? 'warn' : 'ok';
  return (
    <span className={`days-badge badge ${cls}`}>
      {dias}d sin act.
    </span>
  );
}

// ─── ProspectoCard ────────────────────────────────────────────────────────
export function ProspectoCard({ prospecto, onClick }) {
  const { diasSinActividad } = useApp();
  const dias = diasSinActividad(prospecto);
  return (
    <div
      className={`prospecto-card temp-${prospecto.temperatura} animate-up`}
      onClick={() => onClick && onClick(prospecto)}
    >
      <div className="pc-top">
        <div>
          <div className="pc-empresa">{prospecto.empresa}</div>
          <div className="pc-contacto">{prospecto.contacto_nombre} · {prospecto.ciudad}</div>
        </div>
        <TempBadge temp={prospecto.temperatura} />
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <EtapaBadge etapa={prospecto.etapa} />
        <span className="badge badge-slate">{fuenteInfo(prospecto.fuente).icon} {fuenteInfo(prospecto.fuente).label}</span>
      </div>
      <div className="pc-bottom">
        <div>
          <div className="pc-valor">{formatCOP(prospecto.valor_estimado_cop)}</div>
          <div className="pc-meta">{prospecto.probabilidad}% prob. · {prospecto.consumo_kwh_mes?.toLocaleString()} kWh/mes</div>
        </div>
        <DaysBadge dias={dias} />
      </div>
    </div>
  );
}

// ─── Probability Ring ─────────────────────────────────────────────────────
export function ProbRing({ value }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div className="prob-ring">
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="4" />
        <circle
          cx="26" cy="26" r={r} fill="none"
          stroke="var(--primary)" strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .4s' }}
        />
      </svg>
      <div className="prob-ring-num">{value}%</div>
    </div>
  );
}

// ─── Etapa Stepper ────────────────────────────────────────────────────────
const ACTIVE_ETAPAS = ['contacto_inicial','calificacion','visita_tecnica','propuesta','negociacion'];
export function EtapaStepper({ etapa }) {
  const idx = ACTIVE_ETAPAS.indexOf(etapa);
  return (
    <div className="etapa-stepper">
      {ACTIVE_ETAPAS.map((e, i) => {
        const info = etapaInfo(e);
        const cls = i < idx ? 'done' : i === idx ? 'current' : '';
        return (
          <div key={e} className={`etapa-step ${cls}`}>
            <div className="etapa-dot">{i < idx ? '✓' : i + 1}</div>
            <span className="etapa-label">{info.label.replace(' ', '\u00A0')}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Activity Item ────────────────────────────────────────────────────────
export function ActivityItem({ act }) {
  const info = tipoInfo(act.tipo);
  const resBg = {
    positivo: 'rgba(34,197,94,.12)',
    neutro:   'rgba(245,158,11,.12)',
    negativo: 'rgba(239,68,68,.12)',
  }[act.resultado] || 'var(--surface-2)';
  const resCo = {
    positivo: 'var(--green)',
    neutro:   'var(--yellow)',
    negativo: 'var(--red)',
  }[act.resultado] || 'var(--slate)';

  return (
    <div className="timeline-item animate-in">
      <div className="timeline-icon" style={{ background: resBg }}>
        {info.icon}
      </div>
      <div className="timeline-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span className="timeline-tipo">{info.label}</span>
          <span className="timeline-date">{formatDate(act.created_at)}</span>
        </div>
        <div className="timeline-desc">{act.descripcion}</div>
        {act.proxima_accion && (
          <div className="timeline-next" style={{ color: resCo }}>
            → {act.proxima_accion} ({formatDate(act.fecha_proxima_accion)})
          </div>
        )}
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────
export function KPICard({ label, value, sub, accent }) {
  return (
    <div className="kpi-card" style={accent ? { borderColor: accent+'33' } : {}}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={accent ? { color: accent } : {}}>{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  );
}
