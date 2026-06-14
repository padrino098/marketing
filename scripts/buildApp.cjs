const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');

// Read original
const orig = fs.readFileSync(path.join(dir, 'marketing_dashboard_app.tsx'), 'utf8').split('\n');
console.log('Original lines:', orig.length);

// Header block (replaces lines 1-404 of original)
const header = `import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Kanban, 
  Calendar as CalendarIcon, 
  Plus, 
  CheckSquare, 
  Link2, 
  Play, 
  Pause, 
  Clock, 
  User, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Trash2, 
  ExternalLink, 
  Layers, 
  CheckCircle2, 
  Search, 
  AlertCircle, 
  PlusCircle, 
  Maximize2,
  FileText,
  Workflow,
  Sparkles,
  ChevronDown,
  Settings,
  Grid,
  Archive,
  ArchiveRestore,
  List,
  Target,
  PenTool,
  Film,
  Scissors,
  Smartphone,
  Gauge,
  Loader2,
  Megaphone,
  TrendingUp,
  Activity,
  CheckCircle
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  onSnapshot 
} from 'firebase/firestore';

// ── Separated data & utilities ──────────────────────────────────
import {
  STYLING_PRESETS,
  TEAM_ROLES,
  INITIAL_STAGES,
  INITIAL_TYPES,
  INITIAL_CAMPAIGNS,
  INITIAL_PRIORITIES,
  INITIAL_PROJECTS,
  VERTICAL_CALENDAR_HOURS,
} from '@/data/initialData';
import { getVideoEmbedInfo } from '@/utils/videoUtils';
import { parseTimeToDecimal, formatDecimalToTime, formatTimecode } from '@/utils/timeUtils';

// ── Firebase bootstrap ──────────────────────────────────────────
let db = null;
let auth = null;
let appId = 'asana-video-clone';
let isFirebaseAvailable = false;

try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    const firebaseConfig = JSON.parse(__firebase_config);
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    appId = typeof __app_id !== 'undefined' ? __app_id : 'asana-video-clone';
    isFirebaseAvailable = true;
  }
} catch (e) {
  console.warn('Using offline standalone state engine.', e);
}
`;

// App body: original lines 405..3777 (0-indexed: 404..3776, excludes truncated last line)
const appBody = orig.slice(404, orig.length - 1).join('\n');

// Missing tail: completes the truncated create modal
const tail = `                    className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-300 font-medium focus:outline-none focus:border-zinc-600 transition-colors shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono">Requested By</label>
                  <input
                    type="text"
                    placeholder="Requester name"
                    value={newBy}
                    onChange={(e) => setNewBy(e.target.value)}
                    className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-300 font-medium focus:outline-none focus:border-zinc-600 transition-colors shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono">Campaign</label>
                  <select
                    value={newCampaign}
                    onChange={(e) => setNewCampaign(e.target.value)}
                    className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-300 focus:outline-none focus:border-zinc-600 cursor-pointer font-mono transition-colors"
                  >
                    {campaigns.map(c => (
                      <option key={c.name || ''} value={c.name || ''} className="bg-zinc-950">{c.name || ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono">Stage</label>
                  <select
                    value={newOverall}
                    onChange={(e) => setNewOverall(e.target.value)}
                    className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-300 focus:outline-none focus:border-zinc-600 cursor-pointer font-mono transition-colors"
                  >
                    {stages.map(s => (
                      <option key={s.id || ''} value={s.id || ''} className="bg-zinc-950">{s.name || ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono">Script Link</label>
                  <input type="url" placeholder="https://docs.google.com/..." value={newScript} onChange={(e) => setNewScript(e.target.value)} className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors shadow-inner" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono">Raw Assets</label>
                  <input type="url" placeholder="https://dropbox.com/..." value={newRaw} onChange={(e) => setNewRaw(e.target.value)} className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors shadow-inner" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono">Edit / Review</label>
                  <input type="url" placeholder="https://frame.io/..." value={newEdit} onChange={(e) => setNewEdit(e.target.value)} className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors shadow-inner" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono">Ad Link</label>
                <input type="url" placeholder="https://business.facebook.com/..." value={newAdLink} onChange={(e) => setNewAdLink(e.target.value)} className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 transition-colors shadow-inner" />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono">Notes</label>
                <textarea rows={2} placeholder="Production notes, grading targets, copy direction..." value={newNotes} onChange={(e) => setNewNotes(e.target.value)} className="w-full bg-[#050507] border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-zinc-600 resize-none transition-colors shadow-inner" />
              </div>

              <button type="submit" className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-extrabold rounded-xl tracking-wider text-sm transition-all shadow-lg">
                + ADD TO PIPELINE
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
`;

const full = header + '\n' + appBody + '\n' + tail;
fs.writeFileSync(path.join(dir, 'src', 'App.tsx'), full, 'utf8');
const written = fs.readFileSync(path.join(dir, 'src', 'App.tsx'), 'utf8').split('\n');
console.log('App.tsx written. Lines:', written.length);
console.log('Last 3 lines:');
written.slice(-3).forEach(l => console.log(JSON.stringify(l)));
