// =============================================================================
// components/SkeletonPost.tsx
// Shimmer placeholder used while feed posts are loading.
// =============================================================================

interface SkeletonPostProps {
  count?: number;
}

export function SkeletonPost({ count = 3 }: SkeletonPostProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-subtle)",
            padding: "18px 20px",
            marginBottom: 12,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {/* Author row */}
          <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:16 }}>
            <div className="skeleton" style={{ width:42, height:42, borderRadius:"50%", flexShrink:0 }} />
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
              <div className="skeleton" style={{ width:"40%", height:11, borderRadius:6 }} />
              <div className="skeleton" style={{ width:"25%", height:10, borderRadius:6 }} />
            </div>
          </div>

          {/* Body lines */}
          <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:14 }}>
            <div className="skeleton" style={{ width:"100%", height:11, borderRadius:6 }} />
            <div className="skeleton" style={{ width:"92%", height:11, borderRadius:6 }} />
            <div className="skeleton" style={{ width:"70%", height:11, borderRadius:6 }} />
          </div>

          {/* Image placeholder — only show for every other skeleton */}
          {i % 2 === 0 && (
            <div className="skeleton" style={{ width:"100%", height:180, borderRadius: "var(--radius-md)", marginBottom:14 }} />
          )}

          {/* Action bar */}
          <div style={{ display:"flex", gap:18, paddingTop:12, borderTop:"1px solid var(--border-subtle)" }}>
            {[70, 55, 60, 40].map((w, j) => (
              <div key={j} className="skeleton" style={{ width:w, height:10, borderRadius:6 }} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
