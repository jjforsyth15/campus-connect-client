// =============================================================================
// components/settings/SettingsPanel.jsx
//
// Full settings panel -- slides in from the right as a drawer overlay.
//
// Sections:
//   1. Profile      -- edit display name and bio
//   2. Appearance   -- theme selector, font size
//   3. Feed         -- show images, compact view, auto-refresh
//   4. Privacy      -- profile visibility, activity status
//   5. Notifications-- likes, comments, followers, reposts
//   6. Accessibility-- reduce motion, high contrast
//   7. Shortcuts    -- keyboard shortcut reference
//   8. Data         -- export data, reset settings
//
// Uses slideInRight animation (defined in injectStyles.ts).
// Closes on Escape key or backdrop click.
// =============================================================================

import { useEffect } from 'react';
import { CloseIcon, CogIcon } from '../ui/primitives';

// ---------------------------------------------------------------------------
// Internal primitives used only within SettingsPanel.
// ---------------------------------------------------------------------------

function Toggle({ on, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        border: 'none', cursor: 'pointer',
        background: on ? 'var(--red)' : 'var(--border)',
        position: 'relative', transition: 'background 0.2s var(--spring)',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
        transition: 'left 0.2s var(--spring)',
      }} />
    </button>
  );
}

function SettingRow({ label, description, on, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, padding: '13px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text1)' }}>{label}</div>
        {description && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>{description}</div>
        )}
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

function SelectRow({ label, value, options, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, padding: '13px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text1)' }}>{label}</div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '6px 12px', borderRadius: 'var(--r-sm)',
          border: '1.5px solid var(--border)', background: 'var(--bg-input)',
          color: 'var(--text1)', fontSize: '0.84rem', cursor: 'pointer',
          outline: 'none', fontFamily: 'var(--font-body)',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--red)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--red)',
        marginBottom: 4, fontFamily: 'var(--font-head)',
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Shortcut({ keys, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 0', borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: '0.84rem', color: 'var(--text2)' }}>{label}</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {keys.map((k, i) => (
          <kbd key={i} style={{
            padding: '2px 8px', borderRadius: 'var(--r-sm)',
            border: '1.5px solid var(--border)', background: 'var(--bg-input)',
            fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text1)',
          }}>
            {k}
          </kbd>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SettingsPanel -- main exported component.
// ---------------------------------------------------------------------------

export function SettingsPanel({ prefs, setPrefs, onClose }) {
  // Close on Escape
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(15,17,23,0.45)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 210,
        width: 'min(420px, 100vw)',
        background: 'var(--bg-card)',
        borderLeft: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInRight 0.26s var(--spring)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CogIcon size={20} />
            <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.05rem', margin: 0 }}>
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)',
              background: 'transparent', display: 'grid', placeItems: 'center',
              cursor: 'pointer', color: 'var(--text2)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>

          <Section title="Appearance">
            <SelectRow
              label="Theme"
              value={prefs.theme}
              options={[
                { value: 'system', label: 'System default' },
                { value: 'light',  label: 'Light' },
                { value: 'dark',   label: 'Dark' },
              ]}
              onChange={v => setPrefs({ theme: v })}
            />
            <SelectRow
              label="Font size"
              value={prefs.fontSize ?? 'medium'}
              options={[
                { value: 'small',  label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large',  label: 'Large' },
              ]}
              onChange={v => setPrefs({ fontSize: v })}
            />
          </Section>

          <Section title="Feed">
            <SettingRow
              label="Show images"
              description="Display image attachments in posts"
              on={prefs.showImages}
              onChange={v => setPrefs({ showImages: v })}
            />
            <SettingRow
              label="Compact view"
              description="Reduce spacing between posts"
              on={prefs.compact}
              onChange={v => setPrefs({ compact: v })}
            />
            <SettingRow
              label="Auto-load new posts"
              description="Refresh feed automatically every 60 s"
              on={prefs.autoRefresh ?? false}
              onChange={v => setPrefs({ autoRefresh: v })}
            />
          </Section>

          <Section title="Notifications">
            <SettingRow
              label="Likes"
              on={prefs.notifLikes ?? true}
              onChange={v => setPrefs({ notifLikes: v })}
            />
            <SettingRow
              label="Comments"
              on={prefs.notifComments ?? true}
              onChange={v => setPrefs({ notifComments: v })}
            />
            <SettingRow
              label="New followers"
              on={prefs.notifFollows ?? true}
              onChange={v => setPrefs({ notifFollows: v })}
            />
            <SettingRow
              label="Reposts"
              on={prefs.notifReposts ?? false}
              onChange={v => setPrefs({ notifReposts: v })}
            />
          </Section>

          <Section title="Privacy">
            <SettingRow
              label="Public profile"
              description="Allow other students to view your profile"
              on={prefs.publicProfile ?? true}
              onChange={v => setPrefs({ publicProfile: v })}
            />
            <SettingRow
              label="Show activity status"
              description="Let others see when you are online"
              on={prefs.showActivity ?? true}
              onChange={v => setPrefs({ showActivity: v })}
            />
            <SettingRow
              label="Allow mentions"
              description="Let other users mention you in posts"
              on={prefs.allowMentions ?? true}
              onChange={v => setPrefs({ allowMentions: v })}
            />
          </Section>

          <Section title="Accessibility">
            <SettingRow
              label="Reduce motion"
              description="Minimise animations and transitions"
              on={prefs.reduceMotion ?? false}
              onChange={v => setPrefs({ reduceMotion: v })}
            />
            <SettingRow
              label="High contrast"
              description="Increase border and text contrast"
              on={prefs.highContrast ?? false}
              onChange={v => setPrefs({ highContrast: v })}
            />
          </Section>

          <Section title="Keyboard shortcuts">
            <Shortcut keys={['N']}         label="New post" />
            <Shortcut keys={['/']}         label="Search" />
            <Shortcut keys={['?']}         label="Show shortcuts" />
            <Shortcut keys={['⌘', 'Enter']} label="Submit post / reply" />
            <Shortcut keys={['Esc']}       label="Close modal / drawer" />
            <Shortcut keys={['L']}         label="Like focused post" />
            <Shortcut keys={['R']}         label="Repost focused post" />
          </Section>

          <Section title="Data Management">
            <div style={{
              display: 'flex', flexDirection: 'column', gap: 8,
              padding: '8px 0',
            }}>
              <button
                onClick={() => {
                  /* Export preferences as JSON download */
                  const blob = new Blob([JSON.stringify(prefs, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'matador-connect-prefs.json'; a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{
                  width: '100%', padding: '10px', marginTop: 4,
                  border: '1.5px solid var(--border)', borderRadius: 'var(--r-md)',
                  background: 'transparent', color: 'var(--text2)',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export my preferences
              </button>

              <button
                onClick={() => setPrefs(null)}
                style={{
                  width: '100%', padding: '10px',
                  border: '1.5px solid var(--border)', borderRadius: 'var(--r-md)',
                  background: 'transparent', color: 'var(--text3)',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#DC2626'; e.currentTarget.style.color = '#DC2626'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text3)'; }}
              >
                Reset all settings to default
              </button>
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}

export default SettingsPanel;
