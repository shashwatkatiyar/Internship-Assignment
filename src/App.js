import React, { useCallback, useState } from "react";
import Mindmap from "./Mindmap";
import Sidebar from "./Sidebar";
import initialData from "./data.json";

function addChild(root, parentId, newChild) {
  if (root.id === parentId) {
    root.children = root.children || [];
    root.children.push(newChild);
    return true;
  }
  if (!root.children) return false;
  for (const c of root.children) {
    if (addChild(c, parentId, newChild)) return true;
  }
  return false;
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [tree, setTree] = useState(initialData);

  const handleAddNode = useCallback((title, summary) => {
    if (!selected) return alert("Select a parent node first.");
    const newChild = {
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `node-${Date.now()}`,
      title,
      summary
    };
    const next = JSON.parse(JSON.stringify(tree));
    const ok = addChild(next, selected.id || tree.id, newChild);
    if (!ok) return alert("Could not add node.");
    setTree(next);
  }, [selected, tree]);

  const handleDownload = () => {
    const json = JSON.stringify(tree, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mindmap.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 3 }}>
        <Mindmap tree={tree} onSelect={(data) => setSelected({ ...data })} />
      </div>
      <div style={{ flex: 1, position: "relative" }}>
        <Sidebar node={selected} />
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, background: "#0c2e66", padding: 10, borderRadius: 8 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const title = e.target.title.value.trim();
              const summary = e.target.summary.value.trim();
              if (!title) return alert("Title is required.");
              handleAddNode(title, summary);
              e.target.reset();
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <input name="title" placeholder="New node title" style={{ flex: 1, padding: 8, borderRadius: 6, background: "#0c2e66", color: "#fff", border: "1px solid #1f4a90" }} />
              <input name="summary" placeholder="Summary (optional)" style={{ flex: 1, padding: 8, borderRadius: 6, background: "#0c2e66", color: "#fff", border: "1px solid #1f4a90" }} />
              <button type="submit" style={{ padding: "8px 12px", borderRadius: 6, background: "#2ea44f", color: "#fff", border: "none" }}>Add node</button>
              <button type="button" onClick={handleDownload} style={{ padding: "8px 12px", borderRadius: 6, background: "#2f6de0", color: "#fff", border: "none" }}>Download JSON</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}