import React, { useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow
} from "reactflow";
import "reactflow/dist/style.css";

function buildGraph(root, expanded, x = 0, y = 0, level = 0, parentId = null) {
  const nodes = [
    {
      id: root.id,
      data: { label: root.title, summary: root.summary },
      position: { x, y },
      style: {
        background: level === 0 ? "#2f6de0" : "#2ea44f",
        color: "#fff",
        borderRadius: "50%",
        padding: 18,
        textAlign: "center",
        width: 180
      }
    }
  ];
  const edges = [];

  if (parentId) {
    edges.push({
      id: `${parentId}-${root.id}`,
      source: parentId,
      target: root.id,
      animated: true,
      style: { stroke: "#8fb3ff" }
    });
  }

  const isExpanded = expanded[root.id] ?? true;

  if (isExpanded && root.children) {
    const radius = 260;
    const angleStep = (2 * Math.PI) / root.children.length;
    root.children.forEach((child, i) => {
      const angle = i * angleStep;
      const childX = x + radius * Math.cos(angle);
      const childY = y + radius * Math.sin(angle);
      const { nodes: childNodes, edges: childEdges } = buildGraph(child, expanded, childX, childY, level + 1, root.id);
      nodes.push(...childNodes);
      edges.push(...childEdges);
    });
  }

  return { nodes, edges };
}

function findNodeById(root, id) {
  if (root.id === id) return root;
  if (!root.children) return null;
  for (const c of root.children) {
    const found = findNodeById(c, id);
    if (found) return found;
  }
  return null;
}

export default function Mindmap({ tree, onSelect }) {
  const [expanded, setExpanded] = useState({});
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hover, setHover] = useState({ nodeId: null, x: 0, y: 0 });

  const graph = useMemo(() => buildGraph(tree, expanded, 0, 0), [tree, expanded]);

  useEffect(() => {
    setNodes(graph.nodes);
    setEdges(graph.edges);
  }, [graph]);

  const handleNodeClick = (evt, node) => {
    onSelect(node.data);
  };

  const handleNodeDoubleClick = (evt, node) => {
    setExpanded(prev => ({ ...prev, [node.id]: !(prev[node.id] ?? true) }));
    setTimeout(() => {
    }, 0);
  };

  const handleMouseEnter = (evt, node) => {
    setHover({ nodeId: node.id, x: evt.clientX, y: evt.clientY });
  };

  const handleMouseMove = (evt, node) => {
    setHover(h => ({ ...h, x: evt.clientX, y: evt.clientY }));
  };

  const handleMouseLeave = () => {
    setHover({ nodeId: null, x: 0, y: 0 });
  };

  return (
    <div style={{ width: "100%", height: "100vh", background: "#0c2e66", position: "relative" }}>
      {hover.nodeId && (
        <div
          style={{
            position: "fixed",
            left: hover.x + 12,
            top: hover.y + 12,
            background: "rgba(15,55,111,0.95)",
            color: "#fff",
            padding: "8px 10px",
            borderRadius: 8,
            fontSize: 12,
            maxWidth: 260,
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
          }}
        >
          {findNodeById(tree, hover.nodeId)?.summary || ""}
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodeMouseEnter={handleMouseEnter}
        onNodeMouseMove={handleMouseMove}
        onNodeMouseLeave={handleMouseLeave}
      >
        <Controls />
        <Background color="#0a2a5c" gap={26} />
      </ReactFlow>
    </div>
  );
}