import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ETAPAS } from '../data/mockData';
import { formatCOP } from '../components/UI';

export default function PipelineScreen() {
  const { visibleProspectos, updateProspecto, navigate } = useApp();
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const activeEtapas = ETAPAS.slice(0, 5); // From Contacto to Negociacion

  const handleDragStart = (id) => {
    setDraggedId(id);
  };

  const handleDrop = (etapaCode) => {
    if (draggedId) {
      updateProspecto(draggedId, { etapa: etapaCode });
    }
    setDraggedId(null);
    setDragOverCol(null);
  };

  return (
    <div className="screen animate-in">
      <div className="screen-header">
        <div>
          <div className="screen-header-title">Pipeline Comercial</div>
          <div className="screen-header-sub">Arrastra para mover entre etapas</div>
        </div>
      </div>

      <div className="kanban-scroll">
        {activeEtapas.map(etapa => {
          const inCol = visibleProspectos.filter(p => p.etapa === etapa.code);
          const totalCol = inCol.reduce((s, p) => s + (p.valor_estimado_cop || 0), 0);
          const isOver = dragOverCol === etapa.code;

          return (
            <div
              key={etapa.code}
              className={`kanban-col ${isOver ? 'drag-over' : ''}`}
              onDragOver={e => {
                e.preventDefault();
                setDragOverCol(etapa.code);
              }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={() => handleDrop(etapa.code)}
            >
              <div className="kanban-col-header">
                <span className="kanban-col-title">{etapa.label}</span>
                <span className="kanban-col-count">{inCol.length}</span>
              </div>
              <div className="kanban-col-valor">{formatCOP(totalCol)}</div>

              {inCol.map(p => (
                <div
                  key={p.id}
                  className="kanban-card"
                  draggable
                  onDragStart={() => handleDragStart(p.id)}
                  onClick={() => navigate('ficha', { prospectoId: p.id })}
                >
                  <div className="kanban-card-empresa">{p.empresa}</div>
                  <div className="kanban-card-valor">{formatCOP(p.valor_estimado_cop)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{p.probabilidad}% prob.</div>
                    <div className={`temp-dot temp-${p.temperatura}`} />
                  </div>
                </div>
              ))}

              {inCol.length === 0 && !isOver && (
                <div style={{
                  padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)',
                  fontSize: 11, border: '1px dashed var(--border)', borderRadius: 8
                }}>
                  Vacio
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>
        <span style={{ fontSize: 16 }}>💡</span> Tip: Desliza horizontalmente para ver todas las etapas
      </div>
    </div>
  );
}
