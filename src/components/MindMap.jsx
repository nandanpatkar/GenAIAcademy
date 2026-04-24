import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  applyNodeChanges, 
  applyEdgeChanges, 
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow,
  BaseEdge,
  useStoreApi,
  Panel,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import { hierarchy, tree } from 'd3-hierarchy';
import { 
  Maximize, Minimize, ChevronRight, ChevronDown, PlusCircle, 
  Plus, Bold, Type, Palette, Link as LinkIcon, Image as ImageIcon, 
  Smile, Trash2, Undo2, Redo2, MousePointer2, Layout, Settings2,
  Info, HelpCircle, Download, FileJson, FileImage
} from 'lucide-react';

// --- Custom Edge (Horizontal Spline) ---
const MindMapEdge = ({ id, sourceX, sourceY, targetX, targetY, style = {} }) => {
  const controlPointX = (sourceX + targetX) / 2;
  const path = `M ${sourceX} ${sourceY} C ${controlPointX} ${sourceY}, ${controlPointX} ${targetY}, ${targetX} ${targetY}`;

  return (
    <BaseEdge 
      path={path} 
      style={{ 
        ...style, 
        stroke: '#BDBDBD', 
        strokeWidth: 2,
        strokeLinecap: 'round',
        opacity: 0.6
      }} 
    />
  );
};

// --- Custom Node ---
const MindMapNode = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(data.label);
  const inputRef = useRef(null);

  useEffect(() => {
    setText(data.label);
  }, [data.label]);

  useEffect(() => {
    if (data.forceEdit) {
      setIsEditing(true);
    }
  }, [data.forceEdit]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const onDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  
  const onBlur = () => {
    setIsEditing(false);
    if (text.trim() !== data.label) {
      data.onLabelChange(id, text);
    } else {
      data.onLabelChange(id, data.label);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setText(data.label);
      data.onLabelChange(id, data.label);
    }
    e.stopPropagation();
  };

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.style.height = '0px';
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = scrollHeight + 'px';
    }
  }, [text, isEditing]);

  const isRoot = id === 'root';
  const hasChildren = data.childCount > 0;
  const isCollapsed = data.isCollapsed;
  const side = data.side || 'right';
  const depth = data.depth || 0;

  // Premium Level-based Theme
  const getTheme = () => {
    if (isRoot) return { bg: '#212121', text: '#FFFFFF', border: 'none' };
    if (depth === 1) return { bg: '#FFFFFF', text: '#333333', border: '1px solid #E0E0E0' };
    return { bg: '#FFFFFF', text: '#333333', border: '1px solid #EEEEEE' };
  };

  const theme = getTheme();
  const bgColor = data.bgColor || theme.bg;
  const textColor = data.textColor || theme.text;
  
  // Vibrant MindMup selection style
  const selectionStyle = selected ? {
    border: '3px solid #2196F3',
    boxShadow: '0 0 0 4px rgba(33, 150, 243, 0.2), 0 8px 24px rgba(0,0,0,0.12)',
    zIndex: 100
  } : {};

  return (
    <div 
      className={`mindmap-node ${selected ? 'selected' : ''} ${isCollapsed ? 'collapsed' : ''} ${isRoot ? 'root-node' : ''}`}
      onDoubleClick={onDoubleClick}
      style={{
        background: bgColor,
        color: textColor,
        border: theme.border,
        borderRadius: isRoot ? '12px' : '6px',
        padding: isRoot ? '14px 32px' : '10px 20px',
        minWidth: 80,
        maxWidth: 250,
        textAlign: 'center',
        boxShadow: selected ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
        cursor: 'grab',
        position: 'relative',
        fontSize: isRoot ? '16px' : '14px',
        fontWeight: isRoot ? '800' : '500',
        transition: 'all 0.1s ease',
        letterSpacing: isRoot ? '0.2px' : 'normal',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: data.isDragOver ? 'scale(1.05)' : 'scale(1)',
        ...selectionStyle
      }}
    >
      {/* Dynamic Handles based on side */}
      {!isRoot && (
        <Handle 
          type="target" 
          position={side === 'left' ? Position.Right : Position.Left} 
          style={{ visibility: 'hidden' }} 
        />
      )}
      
      {isRoot && (
        <>
          <Handle type="source" position={Position.Right} id="right" style={{ visibility: 'hidden' }} />
          <Handle type="source" position={Position.Left} id="left" style={{ visibility: 'hidden' }} />
        </>
      )}
      {!isRoot && (
        <Handle 
          type="source" 
          position={side === 'left' ? Position.Left : Position.Right} 
          style={{ visibility: 'hidden' }} 
        />
      )}
      
      <div style={{ width: '100%', position: 'relative' }}>
        {isEditing ? (
          <textarea
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              outline: 'none',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              fontWeight: 'inherit',
              textAlign: 'center',
              width: '100%',
              resize: 'none',
              overflow: 'hidden',
              padding: 0,
              margin: 0,
              display: 'block',
              lineHeight: 1.4
            }}
          />
        ) : (
          <div style={{ 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word', 
            lineHeight: 1.4 
          }}>
            {text || 'New Idea'}
          </div>
        )}
      </div>

      {/* Collapse Badge */}
      {hasChildren && !isEditing && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            data.onToggleCollapse(id);
          }}
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: isCollapsed ? '#2196F3' : '#FFFFFF',
            border: `2px solid ${isCollapsed ? '#2196F3' : '#BDBDBD'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: isCollapsed ? '#FFFFFF' : '#757575',
            position: 'absolute',
            [side === 'left' ? 'left' : 'right']: -11,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            fontWeight: 800,
            transition: 'all 0.1s ease'
          }}
        >
          {isCollapsed ? data.childCount : <Plus size={12} strokeWidth={3} />}
        </div>
      )}

      {/* Resize Handle (Visual only for high-fidelity) */}
      {selected && !isRoot && (
        <div style={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          width: 6,
          height: 6,
          borderRight: '2px solid #2196F3',
          borderBottom: '2px solid #2196F3',
          opacity: 0.5,
          pointerEvents: 'none'
        }} />
      )}

      {/* Side-based Add Buttons (Show only when selected) */}
      {selected && !isEditing && (
        <>
          <div style={{
            position: 'absolute',
            [side === 'left' ? 'left' : 'right']: hasChildren ? -42 : -32,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20
          }}>
            <button
              title="Add Child (Tab)"
              onClick={(e) => { e.stopPropagation(); data.onAddChild(id); }}
              style={{...quickBtnStyle, background: '#9C27B0'}}
            >
              <Plus size={16} />
            </button>
          </div>
          
          {!isRoot && (
            <div style={{
              position: 'absolute',
              bottom: -32,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20
            }}>
              <button
                title="Add Sibling (Enter)"
                onClick={(e) => { e.stopPropagation(); data.onAddSibling(id); }}
                style={{...quickBtnStyle, background: '#4CAF50'}}
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const quickBtnStyle = {
  background: '#4A90E2',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  transition: 'transform 0.2s',
  pointerEvents: 'all'
};

const nodeTypes = { mindmap: MindMapNode };
const edgeTypes = { mindmap: MindMapEdge };

// --- Layout Algorithm ---
const getLayoutedElements = (nodes, edges, collapsedNodes = new Set()) => {
  if (nodes.length === 0) return { nodes: [], edges: [] };

  const nodeMap = new Map();
  nodes.forEach(n => nodeMap.set(n.id, { ...n, children: [] }));

  const rootId = 'root';
  edges.forEach(edge => {
    const parent = nodeMap.get(edge.source);
    const child = nodeMap.get(edge.target);
    if (parent && child) parent.children.push(child);
  });

  const rootNodeData = nodeMap.get(rootId);
  if (!rootNodeData) return { nodes, edges };

  const buildHierarchy = (node) => {
    const isCollapsed = collapsedNodes.has(node.id);
    return {
      ...node,
      children: isCollapsed ? [] : node.children.map(buildHierarchy)
    };
  };

  // Split root children into two groups for left/right expansion
  const rootChildren = rootNodeData.children || [];
  const rightChildren = rootChildren.filter((_, i) => i % 2 === 0);
  const leftChildren = rootChildren.filter((_, i) => i % 2 !== 0);

  const treeLayout = tree().nodeSize([80, 260]); // Increased spacing for premium feel

  const getVisibleNodes = (rootData, side) => {
    if (!rootData) return [];
    const h = hierarchy(rootData);
    const layout = treeLayout(h);
    const nodes = [];
    layout.each(d => {
      const depth = d.depth;
      nodes.push({
        ...d.data,
        x: d.x,
        y: side === 'left' ? -d.y : d.y,
        side,
        depth
      });
    });
    return nodes;
  };

  // Process root separately
  const rootResult = { ...rootNodeData, x: 0, y: 0, side: 'center', depth: 0 };
  
  // Process sides
  const rightHierarchy = { id: 'root_right', children: rightChildren.map(buildHierarchy) };
  const leftHierarchy = { id: 'root_left', children: leftChildren.map(buildHierarchy) };
  
  const rightNodes = getVisibleNodes(rightHierarchy, 'right').filter(n => n.id !== 'root_right');
  const leftNodes = getVisibleNodes(leftHierarchy, 'left').filter(n => n.id !== 'root_left');

  const allVisibleNodes = [rootResult, ...rightNodes, ...leftNodes];
  const visibleNodeIds = new Set(allVisibleNodes.map(n => n.id));
  const newNodesMap = new Map();

  allVisibleNodes.forEach(n => {
    const originalNode = nodes.find(node => node.id === n.id);
    if (!originalNode) return;

    const actualChildren = edges.filter(e => e.source === n.id);
    
    newNodesMap.set(n.id, {
      ...originalNode,
      data: {
        ...originalNode.data,
        childCount: actualChildren.length,
        isCollapsed: collapsedNodes.has(n.id),
        side: n.side,
        depth: n.depth
      },
      position: { x: n.y, y: n.x },
      hidden: false
    });
  });

  const allNodes = nodes.map(n => {
    const layouted = newNodesMap.get(n.id);
    if (layouted) return layouted;
    
    // Hide nodes whose parents are hidden or collapsed
    let parentId = edges.find(e => e.target === n.id)?.source;
    let isHidden = true;
    while(parentId) {
      if (visibleNodeIds.has(parentId) && !collapsedNodes.has(parentId)) {
        isHidden = false;
        break;
      }
      if (collapsedNodes.has(parentId)) break;
      parentId = edges.find(e => e.target === parentId)?.source;
    }
    return { ...n, hidden: isHidden };
  });

  const allEdges = edges.map(e => ({
    ...e,
    type: 'mindmap',
    hidden: !visibleNodeIds.has(e.source) || !visibleNodeIds.has(e.target)
  }));

  return { nodes: allNodes, edges: allEdges };
};

// --- Main Flow Component ---
const Flow = ({ initialNodes, initialEdges, onSave }) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showNotes, setShowNotes] = useState(false);
  const [dragOverNode, setDragOverNode] = useState(null);
  const reactFlowInstance = useReactFlow();
  const store = useStoreApi();

  const doLayout = useCallback((nds, eds, collapsed) => {
    const { nodes: lNodes, edges: lEdges } = getLayoutedElements(nds, eds, collapsed);
    setNodes(lNodes);
    setEdges(lEdges);
  }, []);

  const saveToHistory = useCallback((nds, eds) => {
    const state = { 
      nodes: JSON.parse(JSON.stringify(nds)), 
      edges: JSON.parse(JSON.stringify(eds)) 
    };
    setHistory(prev => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, state].slice(-50);
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const state = history[historyIndex - 1];
      setNodes(state.nodes);
      setEdges(state.edges);
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const state = history[historyIndex + 1];
      setNodes(state.nodes);
      setEdges(state.edges);
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex, history]);

  const onLabelChange = useCallback((id, newLabel) => {
    setNodes(nds => {
      const next = nds.map(n => n.id === id ? { ...n, data: { ...n.data, label: newLabel, forceEdit: false } } : n);
      return next;
    });
  }, []);

  const onNotesChange = useCallback((id, newNotes) => {
    setNodes(nds => {
      const next = nds.map(n => n.id === id ? { ...n, data: { ...n.data, notes: newNotes } } : n);
      saveToHistory(next, edges);
      return next;
    });
  }, [edges, saveToHistory]);

  const addChild = useCallback((parentId) => {
    const id = `node_${Date.now()}`;
    const newNode = {
      id,
      type: 'mindmap',
      data: { label: '', forceEdit: true },
      position: { x: 0, y: 0 },
      selected: true
    };
    const newEdge = { id: `edge_${parentId}_${id}`, source: parentId, target: id, type: 'mindmap' };
    
    setNodes(nds => {
      const updated = nds.map(n => ({ ...n, selected: false })).concat(newNode);
      setEdges(eds => {
        const updatedEds = eds.concat(newEdge);
        saveToHistory(updated, updatedEds);
        return updatedEds;
      });
      return updated;
    });

    setCollapsedNodes(prev => {
      const next = new Set(prev);
      next.delete(parentId);
      return next;
    });
  }, [saveToHistory]);

  const addSibling = useCallback((nodeId) => {
    const edge = edges.find(e => e.target === nodeId);
    if (edge) addChild(edge.source);
  }, [edges, addChild]);

  const deleteNode = useCallback((nodeId) => {
    if (nodeId === 'root') return;
    const toDelete = new Set([nodeId]);
    let changed = true;
    while(changed) {
      changed = false;
      edges.forEach(e => {
        if (toDelete.has(e.source) && !toDelete.has(e.target)) {
          toDelete.add(e.target);
          changed = true;
        }
      });
    }
    setNodes(nds => {
      const updated = nds.filter(n => !toDelete.has(n.id));
      setEdges(eds => {
        const updatedEds = eds.filter(e => !toDelete.has(e.source) && !toDelete.has(e.target));
        saveToHistory(updated, updatedEds);
        return updatedEds;
      });
      return updated;
    });
  }, [edges, saveToHistory]);

  const onToggleCollapse = useCallback((id) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const onNodeDrag = useCallback((event, node) => {
    const { nodeInternals } = store.getState();
    const draggedNode = node;
    
    let nearestParent = null;
    let minDistance = 80;

    nodeInternals.forEach((n) => {
      if (n.id === draggedNode.id) return;
      
      const dx = n.position.x - draggedNode.position.x;
      const dy = n.position.y - draggedNode.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        nearestParent = n;
      }
    });

    setDragOverNode(nearestParent ? nearestParent.id : null);
  }, [store]);

  const onNodeDragStop = useCallback((event, node) => {
    const targetParentId = dragOverNode;
    setDragOverNode(null);

    if (targetParentId && targetParentId !== edges.find(e => e.target === node.id)?.source) {
      setEdges(eds => {
        const next = eds.map(e => e.target === node.id ? { ...e, source: targetParentId } : e);
        saveToHistory(nodes, next);
        return next;
      });
    }
  }, [dragOverNode, edges, nodes, saveToHistory]);

  useEffect(() => {
    setNodes(nds => nds.map(n => ({
      ...n,
      data: { 
        ...n.data, 
        onLabelChange, 
        onToggleCollapse, 
        onAddChild: addChild,
        onAddSibling: addSibling,
        isDragOver: dragOverNode === n.id
      }
    })));
  }, [onLabelChange, onToggleCollapse, addChild, addSibling, dragOverNode]);

  useEffect(() => {
    doLayout(nodes, edges, collapsedNodes);
  }, [collapsedNodes, doLayout]);

  const insertParent = useCallback((nodeId) => {
    if (nodeId === 'root') return;
    const edge = edges.find(e => e.target === nodeId);
    if (!edge) return;

    const parentId = edge.source;
    const newId = `node_${Date.now()}`;
    
    const newNode = {
      id: newId,
      type: 'mindmap',
      data: { label: '', forceEdit: true },
      position: { x: 0, y: 0 },
      selected: true
    };

    setEdges(eds => {
      const nextEds = eds
        .filter(e => e.id !== edge.id)
        .concat([
          { id: `edge_${parentId}_${newId}`, source: parentId, target: newId, type: 'mindmap' },
          { id: `edge_${newId}_${nodeId}`, source: newId, target: nodeId, type: 'mindmap' }
        ]);
      
      setNodes(nds => {
        const nextNds = nds.map(n => ({ ...n, selected: n.id === newId })).concat(newNode);
        saveToHistory(nextNds, nextEds);
        return nextNds;
      });
      return nextEds;
    });
  }, [edges, nodes, saveToHistory]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      const selectedNode = nodes.find(n => n.selected && !n.hidden);
      
      if ((e.ctrlKey || e.metaKey)) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) redo(); else undo();
          return;
        }
        if (e.key === 'y') {
          e.preventDefault();
          redo();
          return;
        }
      }

      if (!selectedNode) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        if (e.shiftKey) {
          insertParent(selectedNode.id);
        } else {
          addChild(selectedNode.id);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        addSibling(selectedNode.id);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        deleteNode(selectedNode.id);
      } else if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, forceEdit: true } } : n));
      } else if (e.key === '/' || e.key === 'f') {
        e.preventDefault();
        onToggleCollapse(selectedNode.id);
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        let targetId = null;
        const side = selectedNode.data.side || 'right';
        
        if (e.key === 'ArrowRight') {
          if (side === 'left' || selectedNode.id === 'root') {
            // Move to child
            const edge = edges.find(ed => ed.source === selectedNode.id && !nodes.find(n => n.id === ed.target).hidden && (nodes.find(n => n.id === ed.target).data.side === 'right' || selectedNode.id === 'root'));
            if (edge) targetId = edge.target;
          } else {
            // On the right side, move back to parent if at root, but here we are moving further right
            const edge = edges.find(ed => ed.source === selectedNode.id && !nodes.find(n => n.id === ed.target).hidden);
            if (edge) targetId = edge.target;
          }
        } else if (e.key === 'ArrowLeft') {
          if (side === 'right' || selectedNode.id === 'root') {
             // Move to parent or child on the left
             if (selectedNode.id === 'root') {
               const edge = edges.find(ed => ed.source === selectedNode.id && !nodes.find(n => n.id === ed.target).hidden && nodes.find(n => n.id === ed.target).data.side === 'left');
               if (edge) targetId = edge.target;
             } else {
               const edge = edges.find(ed => ed.target === selectedNode.id);
               if (edge) targetId = edge.source;
             }
          } else {
            // On the left side, move to child
            const edge = edges.find(ed => ed.source === selectedNode.id && !nodes.find(n => n.id === ed.target).hidden);
            if (edge) targetId = edge.target;
          }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          const pEdge = edges.find(ed => ed.target === selectedNode.id);
          if (pEdge) {
            const siblings = edges
              .filter(ed => ed.source === pEdge.source)
              .map(ed => ed.target)
              .filter(id => !nodes.find(n => n.id === id).hidden);
            const idx = siblings.indexOf(selectedNode.id);
            if (e.key === 'ArrowUp' && idx > 0) targetId = siblings[idx - 1];
            else if (e.key === 'ArrowDown' && idx < siblings.length - 1) targetId = siblings[idx + 1];
          }
        }
        if (targetId) setNodes(nds => nds.map(n => ({ ...n, selected: n.id === targetId })));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, edges, addChild, addSibling, deleteNode, onToggleCollapse, undo, redo, insertParent]);

  useEffect(() => {
    if (history.length === 0 && nodes.length > 0) {
      setHistory([{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }]);
      setHistoryIndex(0);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => onSave({ nodes, edges }), 1500);
    return () => clearTimeout(timer);
  }, [nodes, edges, onSave]);

  const updateSelectedStyle = (patch) => {
    setNodes(nds => {
      const next = nds.map(n => n.selected ? { ...n, data: { ...n.data, ...patch } } : n);
      saveToHistory(next, edges);
      return next;
    });
  };

  const updateBranchStyle = (patch) => {
    const selected = nodes.find(n => n.selected);
    if (!selected) return;

    const toUpdate = new Set([selected.id]);
    let changed = true;
    while(changed) {
      changed = false;
      edges.forEach(e => {
        if (toUpdate.has(e.source) && !toUpdate.has(e.target)) {
          toUpdate.add(e.target);
          changed = true;
        }
      });
    }

    setNodes(nds => {
      const next = nds.map(n => toUpdate.has(n.id) ? { ...n, data: { ...n.data, ...patch } } : n);
      saveToHistory(next, edges);
      return next;
    });
  };

  const selectedNode = nodes.find(n => n.selected);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', display: 'flex' }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .react-flow__handle { width: 8px; height: 8px; background: #999; }
        .mindmap-node:hover { box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
      `}</style>
      <div style={{ flex: 1, position: 'relative' }}>
      <Panel position="top-left" style={{ margin: 0, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 20, width: '100%', background: 'white', borderBottom: '1px solid #E0E0E0', zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#FF9800', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Layout size={20} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#333', letterSpacing: '-0.5px' }}>MindFlow Studio</span>
        </div>
        
        <div style={{ height: 24, width: 1, background: '#EEE' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button onClick={undo} disabled={historyIndex <= 0} title="Undo (Ctrl+Z)" style={toolBtnStyle}><Undo2 size={18} /></button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo (Ctrl+Shift+Z)" style={toolBtnStyle}><Redo2 size={18} /></button>
          <div style={dividerStyle} />
          <button onClick={() => reactFlowInstance.fitView({ padding: 0.2, duration: 800 })} title="Fit View" style={toolBtnStyle}><Layout size={18} /></button>
          <div style={dividerStyle} />
          <button onClick={() => updateSelectedStyle({ fontWeight: '700' })} title="Bold" style={toolBtnStyle}><Bold size={18} /></button>
          <button onClick={() => updateSelectedStyle({ bgColor: '#E3F2FD', border: '1px solid #2196F3' })} title="Color Node" style={{...toolBtnStyle, color: '#2196F3'}}><Palette size={18} /></button>
          <div style={dividerStyle} />
          <button 
            onClick={() => setShowNotes(!showNotes)} 
            title="Toggle Notes" 
            style={{...toolBtnStyle, background: showNotes ? '#F3F4F6' : 'none', color: '#4B5563'}}
          >
            <HelpCircle size={18} />
          </button>
          <div style={dividerStyle} />
          <button onClick={() => {
            const selected = nodes.find(n => n.selected);
            if (selected) deleteNode(selected.id);
          }} title="Delete (Del)" style={{...toolBtnStyle, color: '#EF4444'}}><Trash2 size={18} /></button>
        </div>

        {selectedNode && (
          <Panel 
            position="top-center" 
            style={{
              marginTop: 80,
              background: 'white',
              padding: '6px 12px',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              zIndex: 1500,
              border: '1px solid #EEE',
              animation: 'slideUp 0.2s ease-out'
            }}
          >
             <button onClick={() => updateSelectedStyle({ fontWeight: selectedNode.data.fontWeight === '700' ? '400' : '700' })} style={{...toolBtnStyle, background: selectedNode.data.fontWeight === '700' ? '#F3F4F6' : 'none'}} title="Bold"><Bold size={16} /></button>
             <button onClick={() => updateSelectedStyle({ fontStyle: selectedNode.data.fontStyle === 'italic' ? 'normal' : 'italic' })} style={{...toolBtnStyle, background: selectedNode.data.fontStyle === 'italic' ? '#F3F4F6' : 'none'}} title="Italic"><Type size={16} /></button>
             <div style={dividerStyle} />
             <button onClick={() => updateSelectedStyle({ bgColor: '#FFFFFF', textColor: '#333333' })} style={{...toolBtnStyle, color: '#333'}} title="Reset Style"><Smile size={16} /></button>
             <button onClick={() => updateSelectedStyle({ bgColor: '#1A1A1B', textColor: '#FFFFFF' })} style={{...toolBtnStyle, color: '#1A1A1B'}} title="Dark Theme"><Palette size={16} /></button>
             <div style={dividerStyle} />
             <button onClick={() => addChild(selectedNode.id)} style={{...toolBtnStyle, background: '#9C27B0', color: 'white'}} title="Add Child (Tab)"><Plus size={16} /></button>
             <button onClick={() => addSibling(selectedNode.id)} style={{...toolBtnStyle, background: '#4CAF50', color: 'white'}} title="Add Sibling (Enter)"><Plus size={16} /></button>
             {!selectedNode.id.includes('root') && (
               <button onClick={() => deleteNode(selectedNode.id)} style={{...toolBtnStyle, background: '#F44336', color: 'white'}} title="Delete (Del)"><Trash2 size={16} /></button>
             )}
          </Panel>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button style={{ ...toolBtnStyle, background: '#F5F5F5', borderRadius: 20, padding: '6px 16px', gap: 8, fontSize: 13, fontWeight: 600 }}>
             <Download size={16} /> Export
          </button>
          <button style={{ ...toolBtnStyle, background: '#4A90E2', color: 'white', borderRadius: 20, padding: '6px 20px', fontSize: 13, fontWeight: 600 }}>
             Save Map
          </button>
        </div>
      </Panel>
      
      <div style={{ flex: 1, position: 'relative', background: '#FFFFFF' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => setNodes(nds => applyNodeChanges(changes, nds))}
          onEdgesChange={(changes) => setEdges(eds => applyEdgeChanges(changes, eds))}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.05}
          maxZoom={4}
          proOptions={{ hideAttribution: true }}
          snapToGrid={true}
          snapGrid={[24, 24]}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#E0E0E0" />
          <Controls showInteractive={false} position="bottom-right" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none', borderRadius: 8, overflow: 'hidden' }} />
        <MiniMap 
          nodeStrokeColor="#E0E0E0" 
          nodeColor={(n) => n.data?.bgColor || '#FFF'} 
          maskColor="rgba(0,0,0,0.03)" 
          style={{ background: 'white', border: '1px solid #EEE', borderRadius: 8 }}
        />

        <Panel position="bottom-left" style={{ margin: 20, pointerEvents: 'none' }}>
           <div style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            padding: '16px 20px',
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Settings2 size={16} color="#2196F3" />
              <span style={{ fontWeight: 700, fontSize: 13, color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Keyboard Shortcuts</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: 12, color: '#555' }}>
              <Shortcut item="Tab" action="Child" />
              <Shortcut item="S+Tab" action="Parent" />
              <Shortcut item="Enter" action="Sibling" />
              <Shortcut item="Space" action="Edit" />
              <Shortcut item="Del" action="Delete" />
              <Shortcut item="Arrows" action="Move" />
            </div>
          </div>
        </Panel>
        </ReactFlow>
      </div>
      </div>

      {/* Notes Sidebar */}
      {showNotes && (
        <div style={{
          width: 350,
          background: 'white',
          borderLeft: '1px solid #E0E0E0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2000,
          boxShadow: '-4px 0 15px rgba(0,0,0,0.05)'
        }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #EEE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <HelpCircle size={18} color="#4A90E2" />
              <span style={{ fontWeight: 700, fontSize: 16 }}>Node Notes</span>
            </div>
            <button onClick={() => setShowNotes(false)} style={toolBtnStyle}><Minimize size={18} /></button>
          </div>
          
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {selectedNode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                <div style={{ padding: '12px', background: '#F9FAFB', borderRadius: 8, fontSize: 13, color: '#666', border: '1px solid #EEE' }}>
                  Editing notes for: <strong>{selectedNode.data.label || 'New Idea'}</strong>
                </div>
                <textarea
                  value={selectedNode.data.notes || ''}
                  onChange={(e) => onNotesChange(selectedNode.id, e.target.value)}
                  placeholder="Add detailed notes, links, or context here..."
                  style={{
                    width: '100%',
                    height: 'calc(100vh - 250px)',
                    border: '1px solid #E0E0E0',
                    borderRadius: 8,
                    padding: '15px',
                    fontSize: 14,
                    lineHeight: 1.6,
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#999', gap: 15, textAlign: 'center' }}>
                <MousePointer2 size={40} opacity={0.3} />
                <p>Select a node to view or edit its notes</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .react-flow__node.selected .mindmap-node {
          border-color: #4A90E2 !important;
          box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.25), 0 8px 24px rgba(0,0,0,0.12) !important;
          transform: translateY(-2px);
        }
        .mindmap-node:hover {
          border-color: #4A90E2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .mindmap-node.collapsed {
          border-style: dashed;
        }
        kbd {
          background: #F0F2F5;
          border: 1px solid #D1D5DB;
          border-bottom-width: 2px;
          border-radius: 4px;
          padding: 1px 4px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 10px;
          font-weight: 600;
          color: #374151;
        }
      `}} />
    </div>
  );
};

const Shortcut = ({ item, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
    <span style={{ opacity: 0.8 }}>{action}</span>
    <kbd>{item}</kbd>
  </div>
);

const toolBtnStyle = {
  background: 'none',
  border: 'none',
  padding: '8px',
  borderRadius: '8px',
  cursor: 'pointer',
  color: '#4B5563',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 0.9,
  '&:hover': {
    background: '#F3F4F6',
    color: '#111827',
    opacity: 1
  },
  '&:disabled': {
    opacity: 0.3,
    cursor: 'not-allowed'
  }
};

const dividerStyle = {
  width: '1px',
  height: '24px',
  background: '#E5E7EB',
  margin: '0 4px'
};

export default function MindMap() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('genai_mindmap_data_v3');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
      nodes: [{ id: 'root', type: 'mindmap', data: { label: 'Central Concept' }, position: { x: 0, y: 0 } }],
      edges: []
    };
  });

  const handleSave = useCallback((newData) => {
    try {
      localStorage.setItem('genai_mindmap_data_v3', JSON.stringify(newData));
    } catch(e) {}
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#F8F9FA', position: 'relative' }}>
      <ReactFlowProvider>
        <Flow initialNodes={data.nodes} initialEdges={data.edges} onSave={handleSave} />
      </ReactFlowProvider>
    </div>
  );
}
