import React, { useMemo, useState } from "react";
import data from "./data.json";

export default function Sidebar({ node }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");

  const selectedLabel = node?.label || "No node selected";
  const selectedSummary = node?.summary || "Click a node to view details.";

  // Simple slug/id creator
  const newId = useMemo(() => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "new-node";
  }, [title]);

  return (
    <div style={{ padding: 16, color: "#fff", background: "#0f376f", height: "100vh", overflowY: "auto" }}>
      <h2 style={{ marginTop: 0 }}>Architecture documentation</h2>

      <div style={{ marginBottom: 14 }}>
        <h3 style={{ margin: "8px 0 4px" }}>{selectedLabel}</h3>
        <p style={{ margin: 0 }}>{selectedSummary}</p>
      </div>

      <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />

      <div style={{ marginTop: 12 }}>
        <h3 style={{ margin: "10px 0" }}>Add child node</h3>
        <p style={{ marginTop: 0, color: "rgba(255,255,255,0.85)" }}>
          Select a parent in the graph, then create a child below. Double‑click the parent to expand/collapse.
        </p>

        <label style={{ display: "block", fontWeight: 600, marginTop: 8 }}>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Immune signaling"
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #1f4a90", background: "#0c2e66", color: "#fff" }}
        />

        <label style={{ display: "block", fontWeight: 600, marginTop: 10 }}>Summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Short description"
          rows={3}
          style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #1f4a90", background: "#0c2e66", color: "#fff" }}
        />

        {/* Tip: The actual add happens in App.js, which receives this data via a callback */}
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
          When you press “Add node”, we’ll attach it as a child of the selected node.
        </p>
      </div>
    </div>
  );
}