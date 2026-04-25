import React, { useState, useMemo } from 'react';
import { Target, TrendingUp, CircleDashed, CheckCircle2, Lock, BookOpen, ChevronRight, ChevronDown, Activity, Award } from 'lucide-react';


export default function ProgressTracker({ pathsData, onClose }) {
  const [expandedPaths, setExpandedPaths] = useState({});
  const [expandedNodes, setExpandedNodes] = useState({});

  const togglePath = (e, key) => {
    e.stopPropagation();
    setExpandedPaths(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleNode = (e, id) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Global Computation
  const stats = useMemo(() => {
    let total = 0;
    let complete = 0;
    let inProgress = 0;
    let locked = 0; // Everything else
    
    let pathsInfo = [];

    Object.keys(pathsData || {}).forEach(pk => {
      const p = pathsData[pk];
      if (!p) return;
      let pTotal = 0;
      let pComplete = 0;
      let pInProg = 0;
      let nodesInfo = [];

      (p.nodes || []).forEach(n => {
        let nTotal = 0;
        let nComplete = 0;
        let pInProgN = 0;

        (n.modules || []).forEach(m => {
          total++; pTotal++; nTotal++;
          if (m.status === 'complete') { complete++; pComplete++; nComplete++; }
          else if (m.status === 'in_progress') { inProgress++; pInProg++; pInProgN++; }
          else locked++;

        });

        nodesInfo.push({
          id: n.id, title: n.title,
          total: nTotal, complete: nComplete, inProgress: pInProgN,
          pct: nTotal > 0 ? Math.round((nComplete / nTotal) * 100) : 0,
          modules: n.modules || []
        });
      });

      pathsInfo.push({
        key: pk, title: p.title || `Path ${pk}`, color: p.color || '#00ff88',
        total: pTotal, complete: pComplete, inProgress: pInProg,
        pct: pTotal > 0 ? Math.round((pComplete / pTotal) * 100) : 0,
        nodes: nodesInfo
      });
    });

    const globalPct = total > 0 ? Math.round((complete / total) * 100) : 0;
    return { total, complete, inProgress, locked, globalPct, pathsInfo };
  }, [pathsData]);

  // SVG Donut Chart Logic
  const size = 200;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  const getOffset = (percent) => circumference - (percent / 100) * circumference;
  
  const completePct = stats.total > 0 ? (stats.complete / stats.total) * 100 : 0;
  const inProgPct = stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg)", height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "24px 40px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg2)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ background: "rgba(0,255,136,0.1)", color: "#00ff88", padding: 10, borderRadius: 10 }}>
            <Activity size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "var(--text)", letterSpacing: "-.5px" }}>Global Analytics Dashboard</h2>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4, fontWeight: 500 }}>Track your study path progress, completion metrics, and deep hierarchy state.</div>
          </div>
        </div>
        <button onClick={onClose} className="rg-btn" style={{ padding: "8px 16px", background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>Close Dashboard</button>
      </div>

      <div style={{ flex: 1, padding: "32px 40px", overflowY: "auto", display: "flex", gap: 32, alignItems: "flex-start" }}>
        
        {/* Left Col: Master Analytics */}
        <div style={{ width: "340px", flexShrink: 0, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Master Overview Card */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: 13, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text2)", fontWeight: 800 }}>Overall Progress</h3>
            
            {/* SVG Donut Chart */}
            <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                {/* Background Ring */}
                <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--bg4)" strokeWidth={strokeWidth} />
                
                {/* In Progress Ring (drawn UNDER complete) */}
                {inProgPct > 0 && (
                  <circle 
                    cx={size/2} cy={size/2} r={radius} fill="none" 
                    stroke="#f59e0b" strokeWidth={strokeWidth} 
                    strokeDasharray={circumference} 
                    strokeDashoffset={getOffset(completePct + inProgPct)}
                    strokeLinecap="round"
                  />
                )}

                {/* Complete Ring */}
                {completePct > 0 && (
                  <circle 
                    cx={size/2} cy={size/2} r={radius} fill="none" 
                    stroke="#00ff88" strokeWidth={strokeWidth} 
                    strokeDasharray={circumference} 
                    strokeDashoffset={getOffset(completePct)}
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 8px rgba(0,255,136,0.5))" }}
                  />
                )}
              </svg>

              {/* Center Text */}
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 42, fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>{stats.globalPct}<span style={{ fontSize: 20 }}>%</span></span>
                <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, letterSpacing: 1, marginTop: 4 }}>COMPLETED</span>
              </div>
            </div>

            {/* Legend Stats */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, marginTop: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--text2)", fontWeight: 600 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} /> Completed
                </div>
                <div style={{ fontWeight: 800, color: "var(--text)", fontFamily: "var(--mono)" }}>{stats.complete} <span style={{color:"var(--text3)"}}>modules</span></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--text2)", fontWeight: 600 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} /> In Progress
                </div>
                <div style={{ fontWeight: 800, color: "var(--text)", fontFamily: "var(--mono)" }}>{stats.inProgress} <span style={{color:"var(--text3)"}}>modules</span></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--text3)", fontWeight: 600 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--bg4)" }} /> Locked / Pending
                </div>
                <div style={{ fontWeight: 800, color: "var(--text)", fontFamily: "var(--mono)" }}>{stats.locked} <span style={{color:"var(--text3)"}}>modules</span></div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <Target size={18} color="#00ff88" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>{stats.total}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform:"uppercase", letterSpacing: 1 }}>Total Modules</div>
            </div>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <Award size={18} color="#a855f7" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>{stats.pathsInfo.filter(p => p.pct === 100).length}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform:"uppercase", letterSpacing: 1 }}>Paths Mastered</div>
            </div>
          </div>
        </div>

        {/* Right Col: Deep Hierarchy Tracker */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
          <ActivityHeatmap pathsData={pathsData} />

          {stats.pathsInfo.map(path => (
            <div key={path.key} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
              {/* Path Header */}
              <div 
                style={{ padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "center", background: expandedPaths[path.key] ? "var(--bg3)" : "transparent", transition: "all .2s" }}
                onClick={(e) => togglePath(e, path.key)}
              >
                <div style={{ marginRight: 16, color: "var(--text3)" }}>{expandedPaths[path.key] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.3px" }}>{path.title}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, fontFamily: "var(--mono)", color: path.color }}>{path.pct}%</div>
                  </div>
                  <div style={{ width: "100%", height: 6, background: "var(--bg4)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${path.pct}%`, background: path.color, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              </div>

              {/* Node Breakdown */}
              {expandedPaths[path.key] && (
                <div style={{ padding: "0 24px 24px 60px" }}>
                  {path.nodes.map(node => (
                    <div key={node.id} style={{ marginTop: 24 }}>
                      <div 
                        style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 12 }}
                        onClick={(e) => toggleNode(e, node.id)}
                      >
                        <div style={{ color: "var(--text3)" }}>{expandedNodes[node.id] ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}</div>
                        <h4 style={{ margin: 0, fontSize: 14, color: "var(--text2)", fontWeight: 700, flex: 1 }}>{node.title}</h4>
                        <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>{node.complete} / {node.total}</span>
                        <div style={{ width: 100, height: 4, background: "var(--bg4)", borderRadius: 2, overflow: "hidden" }}>
                           <div style={{ height: "100%", width: `${node.pct}%`, background: path.color, opacity: 0.8 }} />
                        </div>
                      </div>

                      {/* Module Detailed Checklist */}
                      {expandedNodes[node.id] && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 28, marginTop: 12 }}>
                          {node.modules.map(mod => (
                            <div key={mod.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8 }}>
                               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                  {mod.status === 'complete' ? <CheckCircle2 size={16} color="#00ff88" /> 
                                   : mod.status === 'in_progress' ? <CircleDashed size={16} color="#f59e0b" />
                                   : <Lock size={16} color="var(--text3)" />}
                                  <span style={{ fontSize: 13, fontWeight: 600, color: mod.status === 'complete' ? "var(--text)" : "var(--text2)" }}>{mod.title}</span>
                               </div>
                               <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                 <span style={{ fontSize: 10, color: "var(--text3)", display: "flex", gap: 6, alignItems: "center", fontWeight: 600, textTransform: "uppercase" }}>
                                   <BookOpen size={12}/> {mod.topics || 0} topics
                                 </span>
                                 <span style={{ fontSize: 9, fontWeight: 700, padding: "4px 8px", borderRadius: 4, background: "var(--bg4)", color: mod.status === 'complete' ? "#00ff88" : mod.status === 'in_progress' ? "#f59e0b" : "var(--text3)" }}>
                                   {mod.status === 'complete' ? 'COMPLETED' : mod.status === 'in_progress' ? 'IN PROGRESS' : 'LOCKED'}
                                 </span>
                               </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

const ActivityHeatmap = ({ pathsData }) => {
  const weeks = 52;
  const daysPerWeek = 7;
  const totalDays = weeks * daysPerWeek;
  
  const { data, monthLabels, stats } = useMemo(() => {
    const activity = new Array(totalDays).fill(0);
    const dateObjects = new Array(totalDays).fill(null);
    const now = new Date();
    
    // To align with Mon-Sun rows, we start the grid on a Monday
    // Find the Monday of the current week (or last week if we want today to be near the end)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    const diffToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() + (6 - (dayOfWeek === 0 ? 7 : dayOfWeek) + 1)); // End of current week

    const endDate = new Date(today);
    // Let's keep it simple: the last day of the grid is the Sunday of the current week
    const gridEnd = new Date(today);
    gridEnd.setDate(today.getDate() + (dayOfWeek === 0 ? 0 : 7 - dayOfWeek));
    
    const gridStart = new Date(gridEnd);
    gridStart.setDate(gridEnd.getDate() - totalDays + 1);
    gridStart.setHours(0, 0, 0, 0);

    const completionEvents = [];
    
    // Scan all paths for any subtopic or module with a completionDate
    Object.values(pathsData || {}).forEach(path => {
      (path.nodes || []).forEach(node => {
        (node.modules || []).forEach(module => {
          if (module.status === 'complete' && module.completionDate) {
            completionEvents.push({ date: new Date(module.completionDate), title: module.title });
          }
          (module.subtopics || []).forEach(subtopic => {
            if (typeof subtopic === 'object' && subtopic.completionDate) {
              completionEvents.push({ date: new Date(subtopic.completionDate), title: subtopic.title });
            }
          });
        });
      });
    });

    completionEvents.forEach(event => {
      const diffTime = event.date.getTime() - gridStart.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < totalDays) {
        activity[diffDays]++;
      }
    });

    // Generate month labels centered over their weeks
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = [];
    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      const weekDate = new Date(gridStart);
      weekDate.setDate(gridStart.getDate() + w * 7);
      const month = weekDate.getMonth();
      if (month !== lastMonth) {
        labels.push({ name: monthNames[month], index: w });
        lastMonth = month;
      }
    }

    // Prepare square data
    const squares = activity.map((count, i) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);
      
      let level = 0;
      if (count > 0) {
        if (count <= 2) level = 1;
        else if (count <= 4) level = 2;
        else if (count <= 8) level = 3;
        else level = 4;
      }

      return {
        level,
        count,
        date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
        isToday: date.getTime() === today.getTime()
      };
    });

    return { data: squares, monthLabels: labels, stats: { total: completionEvents.length } };
  }, [pathsData, totalDays]);

  const getColor = (level) => {
    switch (level) {
      case 0: return 'var(--bg4)';
      case 1: return '#064e3b';
      case 2: return '#065f46';
      case 3: return '#059669';
      case 4: return '#10b981';
      default: return 'var(--bg4)';
    }
  };

  return (
    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: "24px", marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 13, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text2)", fontWeight: 800 }}>Learning Activity</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--text3)", fontWeight: 600 }}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(l => (
            <div key={l} style={{ width: 10, height: 10, borderRadius: 2, background: getColor(l) }} />
          ))}
          <span>More</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflowX: 'auto' }}>
        {/* Month Labels */}
        <div style={{ position: 'relative', height: 15, marginLeft: 38, marginBottom: 4 }}>
          {monthLabels.map((m, idx) => (
            <div key={idx} style={{ 
              position: 'absolute', 
              left: `${(m.index / weeks) * 100}%`, 
              fontSize: 9, 
              color: "var(--text3)",
              whiteSpace: 'nowrap'
            }}>
              {m.name}
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Day Labels */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4px 0', height: 90, width: 30 }}>
            {['Mon', 'Wed', 'Fri', 'Sun'].map(d => (
              <span key={d} style={{ fontSize: 9, color: "var(--text3)" }}>{d}</span>
            ))}
          </div>
          
          {/* Heatmap Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${weeks}, 1fr)`, 
            gridTemplateRows: `repeat(${daysPerWeek}, 1fr)`, 
            gridAutoFlow: 'column',
            gap: 3, 
            flex: 1,
            minWidth: 650
          }}>
            {data.map((day, i) => (
              <div 
                key={i} 
                title={`${day.count} activities on ${day.date}`}
                style={{ 
                  width: '100%', 
                  aspectRatio: '1/1', 
                  background: getColor(day.level), 
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: day.isToday ? '1px solid #00ff88' : 'none',
                  boxShadow: day.isToday ? '0 0 5px rgba(0,255,136,0.5)' : 'none'
                }} 
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.4)';
                  e.currentTarget.style.zIndex = '10';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.zIndex = '1';
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

