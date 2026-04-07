import { useState, useEffect } from "react";

export default function EditorModal({ type, data, onClose, onSave, onDelete, pathColor }) {
  const isModule = type === "module";
  const isPath = type === "path";
  const [formData, setFormData] = useState({});

  // Initialize form
  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
        if (isPath) {
          setFormData({
            id: `path-${Date.now()}`,
            title: "",
            subtitle: "Create your new curriculum",
            color: "#3b82f6",
            nodes: []
          });
        } else if (isModule) {
          setFormData({
            id: `mod-${Date.now()}`,
            title: "",
            subtitle: "",
            status: "default",
            duration: "",
            subtopics: [],
            videos: [],
            files: [],
            links: [],
            overview: ""
          });
        } else {
          setFormData({
            id: `node-${Date.now()}`,
            title: "",
            subtitle: "",
            tag: "CORE MODULE",
            tagColor: pathColor || "#00ff88",
            icon: "◈",
            modules: []
          });
        }
      }
  }, [data, isModule, isPath, pathColor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field) => {
    // Instead of parsing aggressively on every keystroke (which instantly deletes trailing commas), 
    // we store the raw string locally and parse it only on save.
    setFormData(prev => ({ ...prev, [`${field}Raw`]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData };
    
    // Convert raw subtopics strings into objects cleanly preserving pre-existing topic content 
    if (isModule && finalData.subtopicsRaw !== undefined) {
      const rawNames = finalData.subtopicsRaw.split(",").map(s => s.trim()).filter(Boolean);
      const existingArray = data?.subtopics || [];
      
      finalData.subtopics = rawNames.map(name => {
        const existingNode = existingArray.find(ex => (typeof ex === "object" ? (ex.title === name || ex.id === name) : ex === name));
        return existingNode || name;
      });
    }

    onSave(finalData);
  };

  return (
    <div className="editor-overlay">
      <div className="editor-modal">
        <div className="em-header">
          <h3>{data ? "Edit" : "Add"} {isPath ? "Path" : isModule ? "Module" : "Node"}</h3>
          <button className="em-close" onClick={onClose} type="button">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="em-form">
          <div className="em-field">
            <label>Title</label>
            <input name="title" value={formData.title || ""} onChange={handleChange} required />
          </div>
          
          <div className="em-field">
            <label>{isPath ? "Subtitle" : "Description"}</label>
            <textarea 
              name="subtitle" 
              value={formData.subtitle || ""} 
              onChange={handleChange} 
              rows={2} 
              placeholder={isPath ? "Curriculum subtitle..." : "Brief overview of this node..."}
            />
          </div>

          {isPath && (
             <div className="em-field">
               <label>Theme Color (Hex)</label>
               <input type="color" name="color" value={formData.color || "#3b82f6"} onChange={handleChange} />
             </div>
          )}

          {!isModule && !isPath && (
            <>
              <div className="em-field" style={{ display: "flex", flexDirection: "row", gap: 16 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <label>Tag (e.g. CORE)</label>
                  <input name="tag" value={formData.tag || ""} onChange={handleChange} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <label>Icon (Emoji)</label>
                  <input name="icon" value={formData.icon || "◈"} onChange={handleChange} maxLength={2} style={{ textAlign: "center", fontSize: 18 }} />
                </div>
              </div>
              
              <div className="em-field">
                <label>Tag Color (Hex)</label>
                <input type="color" name="tagColor" value={formData.tagColor || "#00ff88"} onChange={handleChange} />
              </div>
            </>
          )}

          {isModule && (
            <>
              <div className="em-field">
                <label>Duration (e.g. 10h)</label>
                <input name="duration" value={formData.duration || ""} onChange={handleChange} />
              </div>
              <div className="em-field">
                <label>Status</label>
                <select name="status" value={formData.status || "default"} onChange={handleChange}>
                  <option value="default">Default / Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="locked">Locked</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              <div className="em-field">
                <label>Overview</label>
                <textarea name="overview" value={formData.overview || ""} onChange={handleChange} rows={3} />
              </div>
              <div className="em-field">
                <label>Subtopics (comma separated)</label>
                <textarea 
                  value={formData.subtopicsRaw !== undefined ? formData.subtopicsRaw : (formData.subtopics || []).map(s => typeof s === "object" ? (s.title || s.id) : s).join(", ")} 
                  onChange={(e) => handleArrayChange(e, "subtopics")} 
                  rows={2} 
                />
              </div>
            </>
          )}

          <div className="em-actions" style={{ marginTop: 24 }}>
            {data && onDelete && (
              <button 
                type="button" 
                className="em-btn-cancel" 
                onClick={() => onDelete(data.id)}
                style={{ color: "#ff4444", borderColor: "#ff4444", marginRight: "auto" }}
              >
                Delete
              </button>
            )}
            <button type="button" className="em-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="em-btn-save" style={{ background: pathColor || "var(--primary)" }}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
