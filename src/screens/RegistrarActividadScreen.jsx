import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TIPOS_ACTIVIDAD } from '../data/mockData';

export default function RegistrarActividadScreen() {
  const { getProspecto, addActividad, goBack, selectedProspectoId } = useApp();
  const prospecto = getProspecto(selectedProspectoId);

  const [formData, setFormData] = useState({
    tipo: 'llamada',
    descripcion: '',
    resultado: 'positivo',
    proxima_accion: '',
    fecha_proxima_accion: new Date().toISOString().split('T')[0],
  });

  if (!prospecto) return <div className="screen">Prospecto no encontrado</div>;

  const handleSave = () => {
    if (!formData.descripcion) {
      alert('Por favor describe que sucedió en la actividad');
      return;
    }
    addActividad({
      prospecto_id: prospecto.id,
      ...formData,
    });
    goBack();
  };

  return (
    <div className="screen animate-up">
      <div className="screen-header">
        <button className="back-btn" onClick={goBack}>←</button>
        <div className="screen-header-title">Registrar Actividad</div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '4px 16px 20px' }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>PROSPECTO</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{prospecto.empresa}</div>
        </div>

        <div className="input-group">
          <label className="input-label">Tipo de interacción</label>
          <div className="pill-group">
            {TIPOS_ACTIVIDAD.map(t => (
              <button
                key={t.code}
                className={`pill ${formData.tipo === t.code ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, tipo: t.code })}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Resumen de la actividad</label>
          <textarea
            className="input-field"
            placeholder="¿Qué se habló con el cliente?"
            value={formData.descripcion}
            onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Resultado</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['positivo', 'neutro', 'negativo'].map(r => (
              <button
                key={r}
                className={`resultado-btn ${r} ${formData.resultado === r ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, resultado: r })}
              >
                {r === 'positivo' ? '👍 Positivo' : r === 'neutro' ? '😐 Neutro' : '👎 Negativo'}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" style={{ margin: '20px 0' }} />

        <div className="input-group">
          <label className="input-label">Siguiente paso concreto</label>
          <input
            className="input-field"
            placeholder="Ej: Enviar cotización formal"
            value={formData.proxima_accion}
            onChange={e => setFormData({ ...formData, proxima_accion: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">¿Cuándo realizarlo?</label>
          <input
            className="input-field"
            type="date"
            value={formData.fecha_proxima_accion}
            onChange={e => setFormData({ ...formData, fecha_proxima_accion: e.target.value })}
          />
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="btn-primary" onClick={handleSave}>Registrar Actividad</button>
          <button
            className="btn-secondary"
            style={{ marginTop: 10, border: 'none', background: 'none', color: 'var(--slate)' }}
            onClick={goBack}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
