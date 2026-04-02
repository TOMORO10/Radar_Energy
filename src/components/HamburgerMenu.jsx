import { useState } from 'react';
import { useApp } from '../context/AppContext';

const ROL_META = {
  asesor:   { icon: '🧑‍💼', label: 'Asesor Comercial',  color: '#61A045' },
  director: { icon: '📊',   label: 'Director Comercial', color: '#2563EB' },
  admin:    { icon: '⚙️',   label: 'Administrador',      color: '#7C3AED' },
};

export default function HamburgerMenu() {
  const { currentUser, setCurrentUser, usuarios } = useApp();
  const [open, setOpen] = useState(false);

  const meta = ROL_META[currentUser.rol] || ROL_META.asesor;

  return (
    <>
      {/* ── Hamburger Trigger ─────────────────────────────────────── */}
      <button
        id="hamburger-btn"
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 5, padding: '8px 10px',
          background: '#FFFFFF', border: '1.5px solid #E8E8E8',
          borderRadius: 14, cursor: 'pointer',
          position: 'relative',
          boxShadow: '0 1px 4px rgba(0,0,0,.06)',
        }}
      >
        <span style={{ width: 20, height: 2, background: '#3A3A3A', borderRadius: 2, display: 'block' }} />
        <span style={{ width: 14, height: 2, background: '#61A045', borderRadius: 2, display: 'block' }} />
        <span style={{ width: 20, height: 2, background: '#3A3A3A', borderRadius: 2, display: 'block' }} />
        <span style={{
          position: 'absolute', top: 7, right: 7, width: 7, height: 7,
          borderRadius: '50%', background: meta.color,
        }} />
      </button>

      {/* ── Overlay backdrop ──────────────────────────────────────── */}
      {open && (
        <div
          id="hamburger-backdrop"
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.25)',
            backdropFilter: 'blur(2px)',
            zIndex: 9000,
            animation: 'fadeIn .2s ease',
          }}
        />
      )}

      {/* ── Slide-in Drawer ───────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: '78vw', maxWidth: 300, height: '100%',
        background: '#FFFFFF',
        borderLeft: '1px solid #E8E8E8',
        boxShadow: '-4px 0 24px rgba(0,0,0,.10)',
        zIndex: 9001,
        transform: open ? 'translateX(0)' : 'translateX(105%)',
        transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header stripe */}
        <div style={{
          background: 'linear-gradient(135deg, #61A045, #B8D445)',
          padding: '48px 20px 24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.85)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                Sesión activa
              </div>
              <div style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', marginTop: 4 }}>
                {currentUser.nombre}
              </div>
              <div style={{
                marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,.3)', borderRadius: 20,
                padding: '3px 10px', fontSize: 12, color: '#fff', fontWeight: 600,
              }}>
                {meta.icon} {meta.label}
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'rgba(255,255,255,.3)', border: 'none', color: '#fff',
              width: 32, height: 32, borderRadius: 10, cursor: 'pointer',
              fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700,
            }}>×</button>
          </div>
        </div>

        {/* Users section */}
        <div style={{ padding: '20px 16px 0', flex: 1, overflowY: 'auto', background: '#F7F8F6' }}>
          <div style={{
            fontSize: 10, color: '#79797A', fontWeight: 700,
            letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12,
          }}>
            Cambiar Perfil / Rol
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {usuarios.map(u => {
              const m = ROL_META[u.rol] || ROL_META.asesor;
              const isActive = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  id={`role-btn-${u.id}`}
                  onClick={() => { setCurrentUser(u); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 14, cursor: 'pointer',
                    border: isActive ? `1.5px solid ${m.color}` : '1px solid #E8E8E8',
                    background: isActive ? `${m.color}14` : '#FFFFFF',
                    textAlign: 'left',
                    transition: 'all .15s',
                    boxShadow: isActive ? `0 2px 8px ${m.color}22` : '0 1px 3px rgba(0,0,0,.04)',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: isActive ? `linear-gradient(135deg, ${m.color}, ${m.color}cc)` : '#F0F0F0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Outfit', fontWeight: 700, fontSize: 14,
                    color: isActive ? '#fff' : '#79797A',
                    border: `1px solid ${isActive ? m.color : '#E8E8E8'}`,
                  }}>{u.avatar}</div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.2, color: '#1A1A1A' }}>{u.nombre}</div>
                    <div style={{ fontSize: 12, color: m.color, marginTop: 2, fontWeight: 500 }}>
                      {m.icon} {m.label}
                    </div>
                  </div>

                  {isActive && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Info note */}
          <div style={{
            marginTop: 20, padding: '10px 12px', borderRadius: 10,
            background: '#EDF5C5', border: '1px solid #B8D445',
            fontSize: 11, color: '#61A045', lineHeight: 1.6, fontWeight: 500,
          }}>
            💡 <strong>Asesor:</strong> ve solo sus prospectos.<br />
            📊 <strong>Director / Admin:</strong> ve todo el equipo.
          </div>
        </div>

        {/* Version footer */}
        <div style={{
          padding: '16px 20px', borderTop: '1px solid #E8E8E8',
          fontSize: 11, color: '#ADADAD', textAlign: 'center',
          background: '#FFFFFF',
        }}>
          ⚡ Radar Energy 4.0 · v0.1-mockup
        </div>
      </div>
    </>
  );
}
