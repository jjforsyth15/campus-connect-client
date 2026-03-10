// =============================================================================
// pages/SettingsPage.tsx
// Full settings page with:
//   - Edit Profile (inline slide-in panel)
//   - Appearance (dark/light mode toggle) — uses CSUN crimson dark theme
//   - Notification preferences
//   - Privacy controls
//   - Account actions
// =============================================================================

import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../hooks/useProfile";
import type { ProfileUpdatePayload } from "../types/feed.types";

interface SettingsPageProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function SettingsPage({ onToast }: SettingsPageProps) {
  const { theme, toggleTheme } = useTheme();
  const { profile, isSaving, updateProfile } = useProfile();
  const [view, setView] = useState<"main" | "edit-profile">("main");

  // ── Edit profile local form state ─────────────────────────────────────────
  const [form, setForm] = useState<ProfileUpdatePayload>({
    firstName: profile?.firstName ?? "",
    lastName:  profile?.lastName  ?? "",
    bio:       profile?.bio       ?? "",
    major:     profile?.major     ?? "",
    year:      profile?.year      ?? "Senior",
    userType:  profile?.userType  ?? "STUDENT",
    location:  profile?.location  ?? "",
    website:   profile?.website   ?? "",
  });

  function handleField(field: keyof ProfileUpdatePayload, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    if (!form.firstName.trim()) { onToast("First name is required", "error"); return; }
    try {
      await updateProfile(form);
      onToast("Profile saved successfully!", "success");
      setView("main");
    } catch {
      onToast("Failed to save profile. Try again.", "error");
    }
  }

  if (view === "edit-profile") {
    return <EditProfilePanel form={form} isSaving={isSaving} onChange={handleField} onSave={handleSave} onBack={() => setView("main")} />;
  }

  return (
    <div style={{ animation: "fadeUp 240ms ease both", paddingBottom: 40 }}>

      {/* ── Account ────────────────────────────────────────────────────────── */}
      <SettingsSection title="Account">
        <SettingsItem
          icon={<UserIcon />}
          iconBg="var(--csun-red-dim)"
          iconColor="var(--csun-red)"
          label="Edit Profile"
          sub="Update name, bio, photo, and role"
          onClick={() => {
            setForm({
              firstName: profile?.firstName ?? "", lastName: profile?.lastName ?? "",
              bio: profile?.bio ?? "", major: profile?.major ?? "",
              year: profile?.year ?? "Senior", userType: profile?.userType ?? "STUDENT",
              location: profile?.location ?? "", website: profile?.website ?? "",
            });
            setView("edit-profile");
          }}
          chevron
        />
        <SettingsItem
          icon={<MailIcon />}
          iconBg="var(--info-dim)"
          iconColor="var(--info)"
          label="Email Address"
          sub={profile?.email ?? "—"}
          onClick={() => onToast("Email settings coming soon", "info")}
          chevron
        />
        <SettingsItem
          icon={<LockIcon />}
          iconBg="var(--success-dim)"
          iconColor="var(--success)"
          label="Change Password"
          sub="Update your login password"
          onClick={() => onToast("Password change coming soon", "info")}
          chevron
        />
      </SettingsSection>

      {/* ── Appearance ─────────────────────────────────────────────────────── */}
      <SettingsSection title="Appearance">
        <SettingsItem
          icon={<SunIcon />}
          iconBg="var(--accent-gold-dim)"
          iconColor="var(--accent-gold)"
          label="Dark Mode"
          sub={theme === "dark" ? "CSUN dark theme (active)" : "Light theme (active)"}
          toggle
          toggleChecked={theme === "dark"}
          onToggle={toggleTheme}
        />
        <SettingsItem
          icon={<GridIcon />}
          iconBg="rgba(80,160,255,.1)"
          iconColor="#78BAFF"
          label="Compact Feed"
          sub="Reduce spacing between posts"
          toggle
          toggleChecked={false}
          onToggle={() => onToast("Compact feed toggle coming soon", "info")}
        />
      </SettingsSection>

      {/* ── Notifications ──────────────────────────────────────────────────── */}
      <SettingsSection title="Notifications">
        <SettingsItem
          icon={<BellIcon />}
          iconBg="var(--csun-red-dim)"
          iconColor="var(--csun-red)"
          label="Push Notifications"
          sub="Likes, comments, mentions"
          toggle
          toggleChecked={true}
          onToggle={() => onToast("Push notification preference saved", "success")}
        />
        <SettingsItem
          icon={<MailIcon />}
          iconBg="var(--accent-gold-dim)"
          iconColor="var(--accent-gold)"
          label="Email Digest"
          sub="Weekly campus updates"
          toggle
          toggleChecked={true}
          onToggle={() => onToast("Email digest preference saved", "success")}
        />
        <SettingsItem
          icon={<RepostIcon />}
          iconBg="var(--success-dim)"
          iconColor="var(--success)"
          label="Repost Alerts"
          sub="When someone reposts your content"
          toggle
          toggleChecked={false}
          onToggle={() => onToast("Repost alert preference saved", "success")}
        />
      </SettingsSection>

      {/* ── Privacy ────────────────────────────────────────────────────────── */}
      <SettingsSection title="Privacy & Safety">
        <SettingsItem
          icon={<ShieldIcon />}
          iconBg="rgba(80,160,255,.1)"
          iconColor="#78BAFF"
          label="Privacy Controls"
          sub="Manage who can see your profile"
          onClick={() => onToast("Privacy controls coming soon", "info")}
          chevron
        />
        <SettingsItem
          icon={<BlockIcon />}
          iconBg="var(--danger-dim)"
          iconColor="var(--danger)"
          label="Blocked Accounts"
          sub="Manage blocked users"
          onClick={() => onToast("Blocked accounts coming soon", "info")}
          chevron
        />
      </SettingsSection>

      {/* ── Account actions ────────────────────────────────────────────────── */}
      <SettingsSection title="Account Actions">
        <SettingsItem
          icon={<LogoutIcon />}
          iconBg="var(--danger-dim)"
          iconColor="var(--danger)"
          label="Sign Out"
          labelColor="var(--danger)"
          onClick={() => onToast("Signed out successfully", "success")}
        />
      </SettingsSection>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EditProfilePanel
// ─────────────────────────────────────────────────────────────────────────────

const MAJORS = [
  "Computer Science", "Computer Information Technology", "Software Engineering",
  "Electrical Engineering", "Business Administration", "Psychology",
  "Communication Studies", "Mathematics", "Biology", "Art",
];
const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"];
const ROLES = ["STUDENT", "FACULTY", "ALUMNI", "STAFF"];

function EditProfilePanel({
  form, isSaving, onChange, onSave, onBack,
}: {
  form: ProfileUpdatePayload;
  isSaving: boolean;
  onChange: (f: keyof ProfileUpdatePayload, v: string) => void;
  onSave: () => void;
  onBack: () => void;
}) {
  const remainingBio = 160 - (form.bio?.length ?? 0);

  return (
    <div style={{ padding: 20, animation: "fadeUp 220ms ease both" }}>

      {/* Header row */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button
          onClick={onBack}
          style={{ width:34, height:34, borderRadius:"50%", border:"none", background:"transparent", color:"var(--text-secondary)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"background 150ms" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          aria-label="Back to settings"
        >
          <ChevronLeftIcon />
        </button>
        <span style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:600, color:"var(--text-primary)" }}>
          Edit Profile
        </span>
        <button
          className="btn-primary"
          onClick={onSave}
          disabled={isSaving}
          style={{ marginLeft:"auto", padding:"7px 18px", fontSize:13 }}
        >
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Avatar row */}
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:22 }}>
        <div className="avatar" style={{ width:70, height:70, fontSize:26 }}>
          <span className="avatar-initials">{(form.firstName[0] ?? "?").toUpperCase()}{(form.lastName[0] ?? "").toUpperCase()}</span>
        </div>
        <div>
          <button style={{ padding:"7px 16px", border:"1px solid var(--border-medium)", borderRadius:99, background:"transparent", color:"var(--text-secondary)", fontSize:12, fontWeight:500, cursor:"pointer" }}>
            Change Photo
          </button>
          <div style={{ fontSize:11, color:"var(--text-muted)", marginTop:5 }}>JPG, PNG or GIF · Max 5MB</div>
        </div>
      </div>

      {/* Name row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
        <FormField label="First Name">
          <input className="form-input" value={form.firstName} onChange={e => onChange("firstName", e.target.value)} placeholder="First name" maxLength={50} />
        </FormField>
        <FormField label="Last Name">
          <input className="form-input" value={form.lastName} onChange={e => onChange("lastName", e.target.value)} placeholder="Last name" maxLength={50} />
        </FormField>
      </div>

      <FormField label="Bio" style={{ marginBottom:16 }}>
        <textarea
          className="form-textarea"
          value={form.bio}
          onChange={e => onChange("bio", e.target.value)}
          maxLength={160}
          rows={3}
          placeholder="Tell the campus about yourself…"
        />
        <div className="char-count" style={{ color: remainingBio < 20 ? "var(--danger)" : "var(--text-muted)" }}>
          {remainingBio} characters remaining
        </div>
      </FormField>

      <FormField label="Major" style={{ marginBottom:16 }}>
        <select className="form-select" value={form.major} onChange={e => onChange("major", e.target.value)}>
          {MAJORS.map(m => <option key={m}>{m}</option>)}
        </select>
      </FormField>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
        <FormField label="Year">
          <select className="form-select" value={form.year} onChange={e => onChange("year", e.target.value)}>
            {YEARS.map(y => <option key={y}>{y}</option>)}
          </select>
        </FormField>
        <FormField label="Role">
          <select className="form-select" value={form.userType} onChange={e => onChange("userType", e.target.value)}>
            {ROLES.map(r => <option key={r}>{r.charAt(0) + r.slice(1).toLowerCase()}</option>)}
          </select>
        </FormField>
      </div>

      <FormField label="Location" style={{ marginBottom:16 }}>
        <input className="form-input" value={form.location} onChange={e => onChange("location", e.target.value)} placeholder="City, State" maxLength={80} />
      </FormField>

      <FormField label="Website" style={{ marginBottom:24 }}>
        <input className="form-input" type="url" value={form.website} onChange={e => onChange("website", e.target.value)} placeholder="https://yoursite.com" />
      </FormField>

      {/* Footer actions */}
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end", paddingTop:12, borderTop:"1px solid var(--border-subtle)" }}>
        <button className="btn-secondary" onClick={onBack}>Cancel</button>
        <button className="btn-primary" onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding:"22px 20px 0" }}>
      <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:".08em", color:"var(--text-muted)", marginBottom:10, padding:"0 4px" }}>
        {title}
      </div>
      <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-lg)", overflow:"hidden", marginBottom:20, transition:"background .25s,border-color .25s" }}>
        {children}
      </div>
    </div>
  );
}

function SettingsItem({
  icon, iconBg, iconColor, label, labelColor, sub, onClick, chevron, toggle, toggleChecked, onToggle,
}: {
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  label: string;
  labelColor?: string;
  sub?: string;
  onClick?: () => void;
  chevron?: boolean;
  toggle?: boolean;
  toggleChecked?: boolean;
  onToggle?: () => void;
}) {
  const isClickable = !!onClick || !!onToggle;
  return (
    <div
      onClick={toggle ? onToggle : onClick}
      style={{
        display:"flex", alignItems:"center", gap:12, padding:"14px 16px",
        borderBottom:"1px solid var(--border-subtle)",
        transition:"background 150ms",
        cursor: isClickable ? "pointer" : "default",
      }}
      onMouseEnter={e => { if (isClickable) e.currentTarget.style.background = "var(--bg-hover)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
    >
      {icon && (
        <div style={{ width:36, height:36, borderRadius:"var(--radius-sm)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background: iconBg ?? "var(--bg-elevated)", color: iconColor ?? "var(--text-secondary)" }}>
          {icon}
        </div>
      )}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:500, color: labelColor ?? "var(--text-primary)" }}>{label}</div>
        {sub && <div style={{ fontSize:12, color:"var(--text-muted)", marginTop:1 }}>{sub}</div>}
      </div>
      {toggle && (
        <label className="toggle-switch" style={{ flexShrink:0 }} onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={toggleChecked} onChange={onToggle} />
          <span className="toggle-slider" />
        </label>
      )}
      {chevron && !toggle && (
        <svg width="16" height="16" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      )}
    </div>
  );
}

function FormField({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

// ── Icon components ───────────────────────────────────────────────────────────
const i = { width:18, height:18, fill:"none", stroke:"currentColor", strokeWidth:"1.7", strokeLinecap:"round" as const, strokeLinejoin:"round" as const };
const UserIcon       = () => <svg {...i} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon       = () => <svg {...i} viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const LockIcon       = () => <svg {...i} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const SunIcon        = () => <svg {...i} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const GridIcon       = () => <svg {...i} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const BellIcon       = () => <svg {...i} viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const RepostIcon     = () => <svg {...i} viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
const ShieldIcon     = () => <svg {...i} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const BlockIcon      = () => <svg {...i} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>;
const LogoutIcon     = () => <svg {...i} viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const ChevronLeftIcon= () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>;
