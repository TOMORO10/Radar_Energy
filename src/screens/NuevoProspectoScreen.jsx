import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FUENTES, CIUDADES } from '../data/mockData';

export default function NuevoProspectoScreen() {
  const { createProspecto, navigate, goBack } = useApp();
  const [formData, setFormData] = useState({
    empresa: '',
    contacto_nombre: '',
    contacto_telefono: '',
    fuente: 'llamada_frio',
    ciudad: 'Barranquilla',
    consumo_kwh_mes: '',
    valor_estimado_cop: '',
    notas: '',
  });

  const [expanded, setExpanded] = useState(false);

  const handleSave = () => {
    if (!formData.empresa || !formData.contacto_nombre || !formData.contacto_telefono) {
      alert('Por favor completa los campos requeridos');
      return;
    }
    const newP = createProspecto({
      ...formData,
      consumo_kwh_mes: formData.consumo_kwh_mes ? parseFloat(formData.consumo_kwh_mes) : null,
      valor_estimado_cop: formData.valor_estimado_cop ? parseFloat(formData.valor_estimado_cop) : 0,
    });
    navigate('ficha', { prospectoId: newP.id });
  };

  return (
    <div className="screen animate-up">
      {/* Header */}
      <div className="screen-header">
        <button className="back-btn" onClick={goBack}>←</button>
        <div className="screen-header-title">Nuevo Prospecto</div>
        <div style={{ width: 36 }} /> {/* Spacer */}
      </div>

      <div style={{ padding: '4px 16px 20px' }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          Captura los datos básicos del cliente potencial para iniciar el seguimiento.
        </p>

        <div className="input-group">
          <label className="input-label">Empresa *</label>
          <input
            className="input-field"
            placeholder="Ej: Frigorífico del Norte"
            value={formData.empresa}
            onChange={e => setFormData({ ...formData, empresa: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Nombre de Contacto *</label>
          <input
            className="input-field"
            placeholder="Ej: Rafael Ávila"
            value={formData.contacto_nombre}
            onChange={e => setFormData({ ...formData, contacto_nombre: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Teléfono / WhatsApp *</label>
          <input
            className="input-field"
            placeholder="Ej: +57 300 123 4567"
            type="tel"
            value={formData.contacto_telefono}
            onChange={e => setFormData({ ...formData, contacto_telefono: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Ciudad</label>
          <select
            className="input-field"
            value={formData.ciudad}
            onChange={e => setFormData({ ...formData, ciudad: e.target.value })}
          >
            {CIUDADES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Fuente de Prospecto</label>
          <div className="pill-group">
            {FUENTES.map(f => (
              <button
                key={f.code}
                className={`pill ${formData.fuente === f.code ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, fuente: f.code })}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600, color: 'var(--primary)',
            background: 'none', border: 'none', padding: '10px 0',
            cursor: 'pointer'
          }}
        >
          {expanded ? '▲ Ocultar campos opcionales' : '▼ Mostrar más campos (consumo, valor...)'}
        </button>

        {expanded && (
          <div className="animate-in">
            <div className="input-group">
              <label className="input-label">Consumo mensual (kWh)</label>
              <input
                className="input-field"
                placeholder="Ej: 12500"
                type="number"
                value={formData.consumo_kwh_mes}
                onChange={e => setFormData({ ...formData, consumo_kwh_mes: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Valor estimado (COP)</label>
              <input
                className="input-field"
                placeholder="Ej: 180000000"
                type="number"
                value={formData.valor_estimado_cop}
                onChange={e => setFormData({ ...formData, valor_estimado_cop: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Notas iniciales</label>
              <textarea
                className="input-field"
                placeholder="Interesado en FENOGE, tiene techo de teja..."
                value={formData.notas}
                onChange={e => setFormData({ ...formData, notas: e.target.value })}
              />
            </div>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <button className="btn-primary" onClick={handleSave}>Guardar Prospecto</button>
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
