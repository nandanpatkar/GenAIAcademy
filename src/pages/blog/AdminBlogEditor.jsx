import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { 
  X, Save, Image as ImageIcon, Video, Code, Bold, Italic, 
  Heading1, Heading2, List, ListOrdered, Quote, Loader2, Upload
} from "lucide-react";
import { supabase } from "../../config/supabaseClient";

// Initialize lowlight for code blocks
const lowlight = createLowlight(common);

const MenuBar = ({ editor, onUploadImage }) => {
  if (!editor) return null;
  const fileInputRef = useRef(null);

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url, width: 640, height: 480 });
    }
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await onUploadImage(file);
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 6, padding: '10px 16px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
      <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} 
        style={{ padding: 6, borderRadius: 4, background: editor.isActive('bold') ? 'var(--primary)' : 'transparent', color: editor.isActive('bold') ? '#000' : 'var(--text2)', border: 'none', cursor: 'pointer' }}>
        <Bold size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()}
        style={{ padding: 6, borderRadius: 4, background: editor.isActive('italic') ? 'var(--primary)' : 'transparent', color: editor.isActive('italic') ? '#000' : 'var(--text2)', border: 'none', cursor: 'pointer' }}>
        <Italic size={16} />
      </button>
      <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
        style={{ padding: 6, borderRadius: 4, background: editor.isActive('heading', { level: 1 }) ? 'var(--primary)' : 'transparent', color: editor.isActive('heading', { level: 1 }) ? '#000' : 'var(--text2)', border: 'none', cursor: 'pointer' }}>
        <Heading1 size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
        style={{ padding: 6, borderRadius: 4, background: editor.isActive('heading', { level: 2 }) ? 'var(--primary)' : 'transparent', color: editor.isActive('heading', { level: 2 }) ? '#000' : 'var(--text2)', border: 'none', cursor: 'pointer' }}>
        <Heading2 size={16} />
      </button>
      <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} 
        style={{ padding: 6, borderRadius: 4, background: editor.isActive('bulletList') ? 'var(--primary)' : 'transparent', color: editor.isActive('bulletList') ? '#000' : 'var(--text2)', border: 'none', cursor: 'pointer' }}>
        <List size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        style={{ padding: 6, borderRadius: 4, background: editor.isActive('orderedList') ? 'var(--primary)' : 'transparent', color: editor.isActive('orderedList') ? '#000' : 'var(--text2)', border: 'none', cursor: 'pointer' }}>
        <ListOrdered size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} 
        style={{ padding: 6, borderRadius: 4, background: editor.isActive('blockquote') ? 'var(--primary)' : 'transparent', color: editor.isActive('blockquote') ? '#000' : 'var(--text2)', border: 'none', cursor: 'pointer' }}>
        <Quote size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
        style={{ padding: 6, borderRadius: 4, background: editor.isActive('codeBlock') ? 'var(--primary)' : 'transparent', color: editor.isActive('codeBlock') ? '#000' : 'var(--text2)', border: 'none', cursor: 'pointer' }}>
        <Code size={16} />
      </button>
      <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageFile} style={{ display: 'none' }} />
      <button onClick={() => fileInputRef.current?.click()} 
        style={{ padding: 6, borderRadius: 4, background: 'transparent', color: 'var(--text2)', border: 'none', cursor: 'pointer' }}>
        <ImageIcon size={16} />
      </button>
      <button onClick={addYoutubeVideo} 
        style={{ padding: 6, borderRadius: 4, background: 'transparent', color: 'var(--text2)', border: 'none', cursor: 'pointer' }}>
        <Video size={16} />
      </button>
    </div>
  );
};

export default function AdminBlogEditor({ blog, onClose }) {
  const [title, setTitle] = useState(blog?.title || "");
  const [slug, setSlug] = useState(blog?.slug || "");
  const [tagsStr, setTagsStr] = useState(blog?.tags ? blog.tags.join(", ") : "");
  const [status, setStatus] = useState(blog?.status || "draft");
  const [coverImage, setCoverImage] = useState(blog?.cover_image || "");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const coverInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Youtube,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: blog?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] p-6 text-[17px] leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (!blog && title && !slug.includes("-")) {
      const gslug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setSlug(gslug);
    }
  }, [title, blog, slug]);

  const handleUploadImage = async (file) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-file-name': encodeURIComponent(file.name), 'content-type': file.type },
        body: file,
      });
      
      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        if (response.status === 404) {
          throw new Error("Local dev server does not support /api/upload. Please start the app with `vercel dev` instead of `npm run dev`, or simply paste a public image URL below.");
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error(err);
      alert(err.message || "Image upload failed");
      return null;
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    const url = await handleUploadImage(file);
    if (url) setCoverImage(url);
    setIsUploadingCover(false);
  };

  const handleSave = async () => {
    if (!title || !slug) return alert("Title and Slug are required.");
    setIsSaving(true);
    
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    const content = editor.getHTML();
    
    const postData = {
      title,
      slug,
      content,
      tags,
      status,
      cover_image: coverImage,
    };

    if (blog?.id) {
      const { error } = await supabase.from('blogs').update(postData).eq('id', blog.id);
      if (error) alert("Error updating: " + error.message);
      else onClose();
    } else {
      const { error } = await supabase.from('blogs').insert([postData]);
      if (error) alert("Error creating: " + error.message);
      else onClose();
    }
    setIsSaving(false);
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: 60, borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <h2 style={{ margin: 0, fontSize: 18, color: 'var(--text)' }}>
          {blog ? "Edit Article" : "Write Article"}
        </h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Editor Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)', overflow: 'hidden' }}>
          <MenuBar editor={editor} onUploadImage={handleUploadImage} />
          <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', padding: '0 40px' }}>
            <input 
              type="text" 
              placeholder="Article Title" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%', fontSize: 40, fontWeight: 800, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', padding: '40px 24px 0', letterSpacing: '-0.02em', marginBottom: 20 }}
            />
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Metadata Sidebar */}
        <div style={{ width: 340, background: 'var(--bg2)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 8, fontWeight: 600 }}>Slug</label>
              <input type="text" value={slug} onChange={e => setSlug(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 8, fontWeight: 600 }}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', outline: 'none', cursor: 'pointer' }}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 8, fontWeight: 600 }}>Tags (comma separated)</label>
              <input type="text" value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="AI, React, Web" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 8, fontWeight: 600 }}>Cover Image</label>
              {coverImage ? (
                <div style={{ position: 'relative', width: '100%', height: 160, borderRadius: 8, overflow: 'hidden', marginBottom: 8, border: '1px solid var(--border)' }}>
                  <img src={coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setCoverImage("")} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', padding: 4, cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => !isUploadingCover && coverInputRef.current?.click()}
                  style={{ width: '100%', height: 120, border: '1px dashed var(--border)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: isUploadingCover ? 'not-allowed' : 'pointer', background: 'var(--bg)', color: 'var(--text2)' }}
                >
                  {isUploadingCover ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                  <span style={{ fontSize: 13, marginTop: 8 }}>{isUploadingCover ? "Uploading..." : "Upload Cover Image"}</span>
                </div>
              )}
              <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverUpload} style={{ display: 'none' }} />
              <input type="text" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="Or paste image URL" style={{ width: '100%', padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', marginTop: 8 }} />
            </div>
          </div>
          
          <div style={{ padding: 24, marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              style={{ width: '100%', background: 'var(--primary)', color: '#000', border: 'none', borderRadius: 6, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: isSaving ? 0.7 : 1 }}
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? "Saving..." : (status === "published" ? "Publish Article" : "Save Draft")}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .prose { min-width: 100%; }
        .prose .tiptap p.is-editor-empty:first-child::before {
          color: var(--text3);
          content: 'Start writing...';
          float: left;
          height: 0;
          pointer-events: none;
        }
        .prose img { border-radius: 8px; margin: 2rem auto; max-width: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .prose iframe { width: 100%; aspect-ratio: 16 / 9; border-radius: 8px; margin: 2rem 0; }
        .prose code { background: var(--bg2); padding: 0.2em 0.4em; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
        .prose pre { background: #0d1117; padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: monospace; margin: 1.5rem 0; border: 1px solid var(--border); }
        .prose pre code { background: none; padding: 0; color: #e6edf3; }
        .prose blockquote { border-left: 4px solid var(--primary); padding-left: 1rem; color: var(--text2); margin: 1.5rem 0; font-style: italic; }
        .prose p { margin-bottom: 1.2rem; outline: none; }
        .prose h1, .prose h2, .prose h3 { margin-top: 2rem; margin-bottom: 1rem; font-weight: 700; color: var(--text); }
        .prose ul, .prose ol { margin-bottom: 1.5rem; padding-left: 1.5rem; }
        .prose li { margin-bottom: 0.5rem; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
