import { useState, useRef, useEffect } from "react";

const GOLD = "#C9A84C";
const BURGUNDY = "#6B1D2E";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

  @keyframes fadeIn {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes slideIn {
    from { opacity:0; transform:translateX(-12px); }
    to   { opacity:1; transform:translateX(0); }
  }

  .notes-root {
    min-height: 100vh;
    background: transparent;
    font-family: 'Cormorant Garamond', serif;
    color: #d4c9b0;
    padding-bottom: 80px;
  }

  /* HEADER */
  .notes-header {
    padding: 52px 24px 20px;
    border-bottom: 0.5px solid rgba(201,168,76,0.12);
  }
  .notes-header-title {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.5);
    margin-bottom: 6px;
  }
  .notes-header-h1 {
    font-family: 'Cinzel', serif;
    font-size: 22px;
    font-weight: 600;
    color: #e8dcc8;
    letter-spacing: 0.06em;
    margin: 0;
  }

  /* FOLDER LIST */
  .folder-list { padding: 16px 0 8px; }
  .folder-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    cursor: pointer;
    transition: background 0.2s;
    animation: slideIn 0.3s ease both;
  }
  .folder-item:hover { background: rgba(201,168,76,0.04); }
  .folder-item.active { background: rgba(201,168,76,0.07); }
  .folder-icon {
    width: 34px; height: 34px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }
  .folder-meta { flex: 1; min-width: 0; }
  .folder-name {
    font-family: 'Cinzel', serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: #d4c9b0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .folder-count {
    font-size: 11px;
    color: rgba(201,168,76,0.4);
    margin-top: 2px;
    font-style: italic;
  }
  .folder-chevron { color: rgba(201,168,76,0.3); font-size: 14px; }

  /* NOTE LIST */
  .note-list { padding: 8px 0; }
  .note-item {
    padding: 14px 24px;
    cursor: pointer;
    border-bottom: 0.5px solid rgba(201,168,76,0.06);
    transition: background 0.2s;
    animation: fadeIn 0.25s ease both;
  }
  .note-item:hover { background: rgba(201,168,76,0.04); }
  .note-item-title {
    font-family: 'Cinzel', serif;
    font-size: 13px;
    font-weight: 600;
    color: #e0d4bc;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }
  .note-item-preview {
    font-size: 13px;
    color: rgba(201,168,76,0.4);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    font-style: italic;
  }
  .note-item-date {
    font-size: 10px;
    color: rgba(201,168,76,0.3);
    margin-top: 5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .note-shared-badge {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
    color: rgba(201,168,76,0.6);
    border: 0.5px solid rgba(201,168,76,0.25);
    border-radius: 3px; padding: 1px 5px; margin-top: 4px;
    font-family: 'Cinzel', serif;
  }

  /* EDITOR */
  .editor-wrap {
    min-height: 100vh;
    animation: fadeIn 0.25s ease both;
  }
  .editor-topbar {
    display: flex; align-items: center; gap: 12px;
    padding: 52px 16px 16px;
    border-bottom: 0.5px solid rgba(201,168,76,0.1);
  }
  .editor-back {
    width: 34px; height: 34px;
    background: rgba(201,168,76,0.08);
    border: none; border-radius: 50%;
    color: rgba(201,168,76,0.7); font-size: 16px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .editor-title-input {
    flex: 1;
    background: transparent; border: none; outline: none;
    font-family: 'Cinzel', serif; font-size: 18px; font-weight: 600;
    color: #e8dcc8; letter-spacing: 0.05em;
  }
  .editor-title-input::placeholder { color: rgba(201,168,76,0.2); }
  .editor-actions {
    display: flex; gap: 8px;
  }
  .editor-btn {
    width: 32px; height: 32px;
    background: rgba(201,168,76,0.08);
    border: none; border-radius: 8px;
    color: rgba(201,168,76,0.6); font-size: 14px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, color 0.2s;
  }
  .editor-btn:hover, .editor-btn.active {
    background: rgba(201,168,76,0.18); color: #C9A84C;
  }

  /* TOOLBAR */
  .editor-toolbar {
    display: flex; align-items: center; gap: 4px;
    padding: 10px 16px;
    border-bottom: 0.5px solid rgba(201,168,76,0.08);
    overflow-x: auto; scrollbar-width: none;
  }
  .editor-toolbar::-webkit-scrollbar { display: none; }
  .toolbar-btn {
    min-width: 32px; height: 30px;
    background: none; border: none;
    color: rgba(201,168,76,0.45); font-size: 13px;
    cursor: pointer; border-radius: 6px; padding: 0 8px;
    font-family: 'Cormorant Garamond', serif;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .toolbar-btn:hover { background: rgba(201,168,76,0.1); color: #C9A84C; }
  .toolbar-sep { width: 0.5px; height: 20px; background: rgba(201,168,76,0.15); margin: 0 4px; }

  /* EDITOR BODY */
  .editor-body { padding: 20px 20px 40px; }
  .editor-content {
    min-height: 300px;
    outline: none;
    font-size: 16px;
    line-height: 1.85;
    color: #c8bda4;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    caret-color: #C9A84C;
  }
  .editor-content:empty::before {
    content: attr(data-placeholder);
    color: rgba(201,168,76,0.18);
    font-style: italic;
    pointer-events: none;
  }
  .editor-content h1 {
    font-family: 'Cinzel', serif; font-size: 20px; font-weight: 600;
    color: #e8dcc8; letter-spacing: 0.05em; margin: 16px 0 8px;
  }
  .editor-content h2 {
    font-family: 'Cinzel', serif; font-size: 15px; font-weight: 600;
    color: #d4c9b0; letter-spacing: 0.08em; margin: 14px 0 6px;
    text-transform: uppercase;
  }
  .editor-content strong { color: #e0d4bc; font-weight: 500; }
  .editor-content em { color: rgba(201,168,76,0.7); }
  .editor-content ul { padding-left: 20px; margin: 8px 0; }
  .editor-content li { margin: 4px 0; }

  /* CHECKLIST */
  .checklist-item {
    display: flex; align-items: flex-start; gap: 10px;
    margin: 6px 0;
  }
  .checklist-box {
    width: 16px; height: 16px; flex-shrink: 0; margin-top: 3px;
    border: 1px solid rgba(201,168,76,0.35); border-radius: 3px;
    background: transparent; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, border-color 0.2s;
  }
  .checklist-box.checked { background: rgba(201,168,76,0.25); border-color: #C9A84C; }
  .checklist-text {
    flex: 1; outline: none; background: transparent; border: none;
    font-family: 'Cormorant Garamond', serif; font-size: 16px;
    color: #c8bda4; line-height: 1.7; padding: 0;
    caret-color: #C9A84C;
  }
  .checklist-text.checked { text-decoration: line-through; color: rgba(201,168,76,0.3); }

  /* IMAGE BLOCK */
  .img-block {
    margin: 12px 0; border-radius: 10px; overflow: hidden;
    border: 0.5px solid rgba(201,168,76,0.15);
    position: relative;
  }
  .img-block img { width: 100%; display: block; }
  .img-placeholder {
    height: 80px; background: rgba(201,168,76,0.04);
    display: flex; align-items: center; justify-content: center;
    color: rgba(201,168,76,0.25); font-size: 13px;
    font-style: italic; cursor: pointer; border-radius: 10px;
    border: 0.5px dashed rgba(201,168,76,0.2);
    transition: background 0.2s;
  }
  .img-placeholder:hover { background: rgba(201,168,76,0.08); }

  /* SHARE MODAL */
  .share-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: flex-end; justify-content: center;
    z-index: 200; animation: fadeIn 0.2s ease;
  }
  .share-modal {
    width: 100%; max-width: 480px;
    background: #16130e;
    border-top: 0.5px solid rgba(201,168,76,0.2);
    border-radius: 20px 20px 0 0;
    padding: 28px 24px 48px;
  }
  .share-modal-title {
    font-family: 'Cinzel', serif; font-size: 12px; font-weight: 600;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(201,168,76,0.6); margin-bottom: 20px;
  }
  .share-toggle {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 0;
    border-bottom: 0.5px solid rgba(201,168,76,0.08);
  }
  .share-toggle-label { font-size: 15px; color: #d4c9b0; }
  .share-toggle-sub { font-size: 12px; color: rgba(201,168,76,0.35); margin-top: 2px; font-style: italic; }
  .toggle-switch {
    width: 42px; height: 24px;
    background: rgba(201,168,76,0.15); border-radius: 12px;
    position: relative; cursor: pointer; transition: background 0.3s;
    border: none; flex-shrink: 0;
  }
  .toggle-switch.on { background: rgba(201,168,76,0.4); }
  .toggle-knob {
    position: absolute; top: 3px; left: 3px;
    width: 18px; height: 18px; border-radius: 50%;
    background: #C9A84C; transition: transform 0.3s;
  }
  .toggle-switch.on .toggle-knob { transform: translateX(18px); }
  .share-save-btn {
    width: 100%; margin-top: 24px;
    background: rgba(107,29,46,0.6);
    border: 0.5px solid rgba(201,168,76,0.2);
    border-radius: 10px; padding: 14px;
    color: #C9A84C; font-family: 'Cinzel', serif;
    font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
    cursor: pointer; transition: background 0.2s;
  }
  .share-save-btn:hover { background: rgba(107,29,46,0.8); }

  /* NEW FOLDER */
  .new-folder-input {
    background: rgba(201,168,76,0.04);
    border: 0.5px solid rgba(201,168,76,0.15);
    border-radius: 10px; padding: 12px 16px;
    color: #d4c9b0; font-family: 'Cinzel', serif;
    font-size: 13px; outline: none; width: 100%;
    box-sizing: border-box; letter-spacing: 0.05em;
  }
  .new-folder-input::placeholder { color: rgba(201,168,76,0.2); }

  /* FAB */
  .fab {
    position: fixed; bottom: 90px; right: 24px;
    width: 52px; height: 52px;
    background: ${BURGUNDY};
    border: 0.5px solid rgba(201,168,76,0.3);
    border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    z-index: 50;
  }
  .fab:hover { transform: scale(1.08); box-shadow: 0 6px 32px rgba(0,0,0,0.5); }
`;

// ── Helpers ──────────────────────────────────────────────
function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('fi-FI', { day:'numeric', month:'short', year:'numeric' });
}

function getPreview(blocks) {
  for (const b of blocks) {
    if (b.type === 'text' && b.content) return b.content.replace(/<[^>]+>/g,'').slice(0,60);
    if (b.type === 'checklist' && b.items?.length) return b.items[0]?.text || '';
  }
  return '';
}

// ── Default data ─────────────────────────────────────────
const DEFAULT_FOLDERS = [
  { id: 'f1', name: 'Ideat', emoji: '💡', color: '#2a1f0a' },
  { id: 'f2', name: 'Biisit', emoji: '🎵', color: '#0a1a2a' },
  { id: 'f3', name: 'Päiväkirja', emoji: '📖', color: '#1a0a10' },
];

const DEFAULT_NOTES = [
  {
    id: 'n1', folderId: 'f1', title: 'Hook-ideat',
    blocks: [{ type: 'text', content: 'Ensimmäinen ajatus...' }],
    shared: false, createdAt: Date.now() - 86400000 * 2,
  },
];

// ── Checklist block ───────────────────────────────────────
function ChecklistBlock({ items, onChange }) {
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="checklist-item">
          <button
            className={`checklist-box ${item.checked ? 'checked' : ''}`}
            onClick={() => {
              const next = [...items];
              next[i] = { ...item, checked: !item.checked };
              onChange(next);
            }}
          >
            {item.checked && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>}
          </button>
          <input
            className={`checklist-text ${item.checked ? 'checked' : ''}`}
            value={item.text}
            placeholder="Tehtävä..."
            onChange={e => {
              const next = [...items];
              next[i] = { ...item, text: e.target.value };
              onChange(next);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const next = [...items];
                next.splice(i + 1, 0, { text: '', checked: false });
                onChange(next);
              }
              if (e.key === 'Backspace' && item.text === '' && items.length > 1) {
                e.preventDefault();
                const next = items.filter((_, j) => j !== i);
                onChange(next);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Note Editor ───────────────────────────────────────────
function NoteEditor({ note, onSave, onBack, isClub = false }) {
  const [title, setTitle] = useState(note.title);
  const [blocks, setBlocks] = useState(note.blocks.length ? note.blocks : [{ type: 'text', content: '' }]);
  const [shared, setShared] = useState(note.shared);
  const [showShare, setShowShare] = useState(false);
  const contentRef = useRef(null);
  const fileRef = useRef(null);

  const save = () => onSave({ ...note, title, blocks, shared });

  const addBlock = (type) => {
    if (type === 'checklist') {
      setBlocks(b => [...b, { type: 'checklist', items: [{ text: '', checked: false }] }]);
    } else if (type === 'image') {
      fileRef.current?.click();
    } else if (type === 'h1') {
      document.execCommand('formatBlock', false, 'h1');
    } else if (type === 'h2') {
      document.execCommand('formatBlock', false, 'h2');
    } else if (type === 'bold') {
      document.execCommand('bold');
    } else if (type === 'italic') {
      document.execCommand('italic');
    }
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setBlocks(b => [...b, { type: 'image', src: ev.target.result }]);
    };
    reader.readAsDataURL(file);
  };

  const updateTextBlock = (i, html) => {
    setBlocks(b => { const n=[...b]; n[i]={...n[i],content:html}; return n; });
  };

  return (
    <div className="editor-wrap">
      <div className="editor-topbar">
        <button className="editor-back" onClick={() => { save(); onBack(); }}>‹</button>
        <input
          className="editor-title-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Otsikko..."
        />
        <div className="editor-actions">
          {isClub && (
            <button className={`editor-btn ${shared ? 'active' : ''}`} onClick={() => setShowShare(true)} title="Jaa">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="13" cy="3" r="2" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="3" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="13" cy="13" r="2" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="4.8" y1="7" x2="11.2" y2="4" stroke="currentColor" strokeWidth="1.2"/>
                <line x1="4.8" y1="9" x2="11.2" y2="12" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </button>
          )}
          <button className="editor-btn" onClick={save} title="Tallenna">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M13 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5l-3-3z" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M11 2v4H5V2M5 9h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="editor-toolbar">
        <button className="toolbar-btn" style={{fontWeight:'bold'}} onClick={()=>addBlock('bold')}>B</button>
        <button className="toolbar-btn" style={{fontStyle:'italic'}} onClick={()=>addBlock('italic')}>I</button>
        <div className="toolbar-sep"/>
        <button className="toolbar-btn" onClick={()=>addBlock('h1')}>H1</button>
        <button className="toolbar-btn" onClick={()=>addBlock('h2')}>H2</button>
        <div className="toolbar-sep"/>
        <button className="toolbar-btn" onClick={()=>addBlock('checklist')}>☑ Todo</button>
        <button className="toolbar-btn" onClick={()=>addBlock('image')}>⌅ Kuva</button>
        <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleImage}/>
      </div>

      <div className="editor-body">
        {blocks.map((block, i) => {
          if (block.type === 'checklist') {
            return (
              <ChecklistBlock
                key={i}
                items={block.items}
                onChange={items => {
                  const n=[...blocks]; n[i]={...n[i],items}; setBlocks(n);
                }}
              />
            );
          }
          if (block.type === 'image') {
            return (
              <div key={i} className="img-block">
                <img src={block.src} alt="" />
              </div>
            );
          }
          // text block
          return (
            <div
              key={i}
              ref={i===0?contentRef:null}
              className="editor-content"
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Kirjoita jotain..."
              dangerouslySetInnerHTML={{__html: block.content}}
              onInput={e => updateTextBlock(i, e.currentTarget.innerHTML)}
            />
          );
        })}
      </div>

      {showShare && (
        <div className="share-modal-overlay" onClick={()=>setShowShare(false)}>
          <div className="share-modal" onClick={e=>e.stopPropagation()}>
            <div className="share-modal-title">Jakaminen</div>
            <div className="share-toggle">
              <div>
                <div className="share-toggle-label">Jaa klubin jäsenille</div>
                <div className="share-toggle-sub">Jäsenet näkevät tämän noten</div>
              </div>
              <button className={`toggle-switch ${shared?'on':''}`} onClick={()=>setShared(s=>!s)}>
                <div className="toggle-knob"/>
              </button>
            </div>
            <button className="share-save-btn" onClick={()=>{ save(); setShowShare(false); }}>Tallenna asetukset</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main NotesView ────────────────────────────────────────
export default function NotesView({ isClub = false }) {
  const STORAGE_KEY = isClub ? 'duvaan_club_notes' : 'duvaan_personal_notes';

  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { folders: DEFAULT_FOLDERS, notes: DEFAULT_NOTES };
  };

  const [data, setData] = useState(load);
  const [view, setView] = useState('folders'); // 'folders' | 'notes' | 'editor'
  const [activeFolder, setActiveFolder] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const persist = (d) => {
    setData(d);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {}
  };

  const openFolder = (folder) => {
    setActiveFolder(folder);
    setView('notes');
  };

  const openNote = (note) => {
    setActiveNote(note);
    setView('editor');
  };

  const newNote = () => {
    const note = {
      id: 'n' + Date.now(),
      folderId: activeFolder?.id || data.folders[0]?.id,
      title: '',
      blocks: [{ type: 'text', content: '' }],
      shared: false,
      createdAt: Date.now(),
    };
    setActiveNote(note);
    setView('editor');
  };

  const saveNote = (note) => {
    const exists = data.notes.find(n => n.id === note.id);
    const notes = exists
      ? data.notes.map(n => n.id === note.id ? note : n)
      : [...data.notes, note];
    persist({ ...data, notes });
  };

  const addFolder = () => {
    if (!newFolderName.trim()) return;
    const emojis = ['📁','✨','🎯','🔥','⚡','🌙','🎪','🏛️'];
    const folder = {
      id: 'f' + Date.now(),
      name: newFolderName.trim(),
      emoji: emojis[Math.floor(Math.random()*emojis.length)],
      color: '#1a1410',
    };
    persist({ ...data, folders: [...data.folders, folder] });
    setNewFolderName('');
    setShowNewFolder(false);
  };

  const folderNotes = activeFolder
    ? data.notes.filter(n => n.folderId === activeFolder.id)
    : [];

  // EDITOR VIEW
  if (view === 'editor' && activeNote) {
    return (
      <>
        <style>{css}</style>
        <div className="notes-root">
          <NoteEditor
            note={activeNote}
            onSave={saveNote}
            isClub={isClub}
            onBack={() => {
              setView(activeFolder ? 'notes' : 'folders');
            }}
          />
        </div>
      </>
    );
  }

  // NOTE LIST VIEW
  if (view === 'notes' && activeFolder) {
    return (
      <>
        <style>{css}</style>
        <div className="notes-root">
          <div className="notes-header">
            <div className="notes-header-title" style={{cursor:'pointer'}} onClick={()=>setView('folders')}>
              ‹ Notes
            </div>
            <h1 className="notes-header-h1">{activeFolder.emoji} {activeFolder.name}</h1>
          </div>

          <div className="note-list">
            {folderNotes.length === 0 && (
              <div style={{padding:'40px 24px',textAlign:'center',color:'rgba(201,168,76,0.25)',fontStyle:'italic',fontSize:14}}>
                Ei muistiinpanoja vielä.
              </div>
            )}
            {folderNotes.map((note, idx) => (
              <div key={note.id} className="note-item" style={{animationDelay:`${idx*0.05}s`}} onClick={()=>openNote(note)}>
                <div className="note-item-title">{note.title || 'Nimetön'}</div>
                <div className="note-item-preview">{getPreview(note.blocks) || '—'}</div>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div className="note-item-date">{formatDate(note.createdAt)}</div>
                  {note.shared && <span className="note-shared-badge">◎ Jaettu</span>}
                </div>
              </div>
            ))}
          </div>

          <button className="fab" onClick={newNote}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 10h12" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </>
    );
  }

  // FOLDERS VIEW
  return (
    <>
      <style>{css}</style>
      <div className="notes-root">
        <div className="notes-header">
          <div className="notes-header-title">{isClub ? 'Club' : 'Personal'}</div>
          <h1 className="notes-header-h1">Notes</h1>
        </div>

        <div className="folder-list">
          {data.folders.map((folder, idx) => {
            const count = data.notes.filter(n=>n.folderId===folder.id).length;
            return (
              <div key={folder.id} className="folder-item" style={{animationDelay:`${idx*0.06}s`}} onClick={()=>openFolder(folder)}>
                <div className="folder-icon" style={{background:folder.color||'rgba(201,168,76,0.06)'}}>
                  {folder.emoji}
                </div>
                <div className="folder-meta">
                  <div className="folder-name">{folder.name}</div>
                  <div className="folder-count">{count} {count===1?'note':'notea'}</div>
                </div>
                <span className="folder-chevron">›</span>
              </div>
            );
          })}
        </div>

        {showNewFolder && (
          <div style={{padding:'8px 24px 16px',animation:'fadeIn 0.2s ease'}}>
            <input
              className="new-folder-input"
              placeholder="Kansion nimi..."
              value={newFolderName}
              autoFocus
              onChange={e=>setNewFolderName(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter') addFolder(); if(e.key==='Escape') setShowNewFolder(false); }}
            />
          </div>
        )}

        <button className="fab" onClick={()=>setShowNewFolder(v=>!v)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {showNewFolder
              ? <path d="M5 5l10 10M15 5L5 15" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"/>
              : <path d="M10 4v12M4 10h12" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round"/>
            }
          </svg>
        </button>
      </div>
    </>
  );
}