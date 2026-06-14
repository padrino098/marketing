import React, { useState, useEffect, useRef, useMemo } from 'react';
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

// Initialize core Firebase pointers
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
  console.warn("Using offline standalone state engine.", e);
}

// Ultra-muted premium color mapping for eye comfort
const STYLING_PRESETS = {
  zinc: { label: 'Slate Zinc', classes: 'border-zinc-800 text-zinc-400 bg-zinc-900/30 font-semibold' },
  red: { label: 'Crimson Red', classes: 'border-red-900/50 text-red-400 bg-red-950/10 font-semibold' },
  orange: { label: 'Sunset Orange', classes: 'border-orange-900/50 text-orange-400 bg-orange-950/10 font-semibold' },
  amber: { label: 'Vibrant Amber', classes: 'border-amber-900/50 text-amber-500 bg-[#3a2a0d]/30 font-semibold' },
  emerald: { label: 'Neo Emerald', classes: 'border-emerald-900/50 text-emerald-400 bg-[#0d3a24]/30 font-semibold' },
  blue: { label: 'Ocean Blue', classes: 'border-blue-900/50 text-blue-400 bg-blue-950/10 font-semibold' },
  indigo: { label: 'Royal Indigo', classes: 'border-indigo-900/50 text-indigo-400 bg-[#1e1b4b]/30 font-semibold' },
  fuchsia: { label: 'Fuchsia Pink', classes: 'border-fuchsia-900/50 text-fuchsia-400 bg-[#47123a]/30 font-semibold' }
};

const TEAM_ROLES = [
  'Marketing Head',
  'Campaign Writer',
  'Operations Manager',
  'Director',
  'Video Editor',
  'Social Media Manager'
];

// Expanded default pipeline stages with the "Ready for Upload" stage positioned in between review and published
const INITIAL_STAGES = [
  { id: 'Ideation', name: 'Ideation', colorKey: 'zinc' },
  { id: 'Scripting', name: 'Scripting', colorKey: 'orange' },
  { id: 'Pre-Prod', name: 'Pre-Prod', colorKey: 'indigo' },
  { id: 'Shooting', name: 'Shooting', colorKey: 'fuchsia' },
  { id: 'Editing', name: 'Editing', colorKey: 'blue' },
  { id: 'Review', name: 'Review', colorKey: 'amber' },
  { id: 'Ready for Upload', name: 'Ready for Upload', colorKey: 'indigo' },
  { id: 'Published', name: 'Published', colorKey: 'emerald' }
];

const INITIAL_TYPES = [
  { name: 'JobZ YT', colorKey: 'red' },
  { name: 'TMT Shorts', colorKey: 'indigo' },
  { name: 'JobZ Shorts', colorKey: 'blue' },
  { name: 'Facebook Ads', colorKey: 'amber' },
  { name: 'Instagram', colorKey: 'fuchsia' }
];

const INITIAL_CAMPAIGNS = [
  { name: 'TMT Activate', colorKey: 'indigo' },
  { name: 'Launchpad', colorKey: 'orange' },
  { name: '3-day challenge', colorKey: 'emerald' },
  { name: 'Evergreen', colorKey: 'zinc' }
];

const INITIAL_PRIORITIES = ['High', 'Medium', 'Low'];

const INITIAL_PROJECTS = [
  {
    id: 'yt-1',
    dayAdded: '2026-06-01',
    type: 'JobZ YT',
    campaign: 'TMT Activate',
    purpose: 'Minimalist Desk Setup Upgrades 2026 with clean lighting.',
    priority: 'High',
    title: 'Modern Minimal Desk Upgrade Tour',
    assignee: 'Sarah (Director)',
    by: 'Marketing Lead',
    script: 'https://docs.google.com/document/d/1',
    raw: 'https://dropbox.com/sh/yt-1-raw',
    edit: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
    adLink: '',
    notes: 'Prioritize flat low-contrast grading profiles.',
    overall: 'Review',
    thumbnailSeed: 'setup',
    checklist: [{ id: 'ytc-1', text: 'Render soft highlight overlays', completed: true }],
    assets: [],
    comments: [{ id: 'ytcom-1', userName: 'Sarah', text: 'Trim secondary ambient clips by 2s', timeMarker: '00:15', resolved: false }],
    isArchived: false,
    
    shootTime: '10:00 AM',
    shootDuration: 2,
    shootDetails: 'Studio A: Natural backlight, model setup and tech walkthrough.',
    socMedPlatform: 'YouTube',
    postTime: '06:00 PM',
    adPlatforms: ['YouTube Ads', 'Google Ads'],
    adTime: 'Active 09:00 AM - 10:00 PM',
    adStartDate: '2026-06-01',
    adEndDate: '2026-06-05'
  },
  {
    id: 'yt-2',
    dayAdded: '2026-06-02',
    type: 'JobZ YT',
    campaign: 'Launchpad',
    purpose: 'Complete guide explaining Log profile color matching inside DaVinci.',
    priority: 'Medium',
    title: 'DaVinci Log Grading Essentials',
    assignee: 'Marcus (Colorist)',
    by: 'Sarah (Director)',
    script: 'https://docs.google.com/document/d/2',
    raw: 'https://dropbox.com/sh/yt-2-raw',
    edit: '',
    notes: 'Keep scopes within 0-100 range strictly.',
    overall: 'Editing',
    thumbnailSeed: 'camera',
    checklist: [{ id: 'ytc-2', text: 'Color match A-cam to B-cam', completed: false }],
    assets: [],
    comments: [],
    isArchived: false,

    shootTime: '02:00 PM',
    shootDuration: 1,
    shootDetails: 'Editing Deck B: High quality scopes screen-capture and mic setup.',
    socMedPlatform: 'YouTube',
    postTime: '04:00 PM',
    adPlatforms: ['Google Ads'],
    adTime: 'Continuous Run'
  },
  {
    id: 'ts-1',
    dayAdded: '2026-06-03',
    type: 'TMT Shorts',
    campaign: '3-day challenge',
    purpose: 'Review common visual errors that break cinematic pacing rules.',
    priority: 'Low',
    title: 'Top 5 Rhythm Traps For Editors',
    assignee: 'Leo (Editor)',
    by: 'Lead Producer',
    script: 'https://docs.google.com/document/d/3',
    raw: 'https://dropbox.com/sh/ts-1-raw',
    edit: 'https://frame.io/review/ts-1',
    notes: 'Highlight timing curves with grid graphs.',
    overall: 'Scripting',
    thumbnailSeed: 'cyberpunk',
    checklist: [],
    assets: [],
    comments: [],
    isArchived: false,

    shootTime: '09:00 AM',
    shootDuration: 3,
    shootDetails: 'Main Studio: Fast cut demos, pacing metronome setup.',
    socMedPlatform: 'TikTok',
    postTime: '08:00 PM',
    adPlatforms: ['TikTok Ads', 'Instagram Ads'],
    adTime: 'Active 05:00 PM - 11:30 PM',
    adStartDate: '2026-06-03',
    adEndDate: '2026-06-06'
  },
  {
    id: 'ts-2',
    dayAdded: '2026-06-04',
    type: 'TMT Shorts',
    campaign: 'TMT Activate',
    purpose: 'Evaluating timeline automation toolkits.',
    priority: 'Medium',
    title: 'Generative AI Workspace Tools Ranked',
    assignee: 'Dave (Lead Marketing)',
    by: 'Executive Producer',
    script: 'https://docs.google.com/document/d/5',
    raw: 'https://dropbox.com/sh/ts-2-raw',
    edit: '',
    notes: 'Include quick comparison matrices.',
    overall: 'Ideation',
    thumbnailSeed: 'cyberpunk',
    checklist: [],
    assets: [],
    comments: [],
    isArchived: false,

    shootTime: '11:00 AM',
    shootDuration: 1,
    shootDetails: 'Workspace: Demoing automated zoom scripts on vertical feeds.',
    socMedPlatform: 'Instagram',
    postTime: '01:00 PM',
    adPlatforms: ['Instagram Ads'],
    adTime: 'Active 12:00 PM - 09:00 PM'
  },
  {
    id: 'js-1',
    dayAdded: '2026-06-05',
    type: 'JobZ Shorts',
    campaign: 'Launchpad',
    purpose: 'Workspace acoustic panel absorption setups.',
    priority: 'Medium',
    title: 'Studio Soundproofing Guide',
    assignee: 'Leo (Editor)',
    by: 'Marketing Team',
    script: '',
    raw: '',
    edit: '',
    notes: 'Include audio comparative waveform clips.',
    overall: 'Shooting',
    thumbnailSeed: 'setup',
    checklist: [],
    assets: [],
    comments: [],
    isArchived: false,

    shootTime: '04:00 PM',
    shootDuration: 2,
    shootDetails: 'Audio Suite: Acoustic insulation setup, frequency response test.',
    socMedPlatform: 'Instagram',
    postTime: '05:30 PM',
    adPlatforms: ['Facebook Ads'],
    adTime: 'Continuous Run'
  },
  {
    id: 'js-2',
    dayAdded: '2026-06-06',
    type: 'JobZ Shorts',
    campaign: '3-day challenge',
    purpose: 'Balancing keylights to mimic realistic low light windows.',
    priority: 'High',
    title: 'Advanced Ambient Soft-box Tech',
    assignee: 'Sarah (Director)',
    by: 'Lead Producer',
    script: 'https://docs.google.com/document/d/8',
    raw: 'https://dropbox.com/sh/js-2-raw',
    edit: '',
    notes: 'Maintain neutral 5600K kelvin target.',
    overall: 'Editing',
    thumbnailSeed: 'setup',
    checklist: [],
    assets: [],
    comments: [],
    isArchived: false,

    shootTime: '01:00 PM',
    shootDuration: 2,
    shootDetails: 'Studio B: Rigging soft-boxes behind artificial window pane.',
    socMedPlatform: 'TikTok',
    postTime: '07:00 PM',
    adPlatforms: ['TikTok Ads'],
    adTime: 'Active 06:00 PM - Midnight'
  },
  {
    id: 'fb-1',
    dayAdded: '2026-06-07',
    type: 'Facebook Ads',
    campaign: 'TMT Activate',
    purpose: 'Minimalist brand apparel teaser highlight reel.',
    priority: 'High',
    title: 'Minimal Apparel Teaser Drop',
    assignee: 'Dave (Lead Marketing)',
    by: 'Marketing Team',
    script: 'https://docs.google.com/document/d/fb1',
    raw: 'https://dropbox.com/sh/fb-1-raw',
    edit: 'https://frame.io/review/fb-1',
    adLink: 'https://business.facebook.com/adsmanager/manage/campaigns',
    notes: 'Use high-contrast silhouette scenes.',
    overall: 'Published',
    thumbnailSeed: 'cyberpunk',
    checklist: [],
    assets: [],
    comments: [],
    isArchived: false,

    shootTime: '10:00 AM',
    shootDuration: 1,
    shootDetails: 'Dark Room: Silhouette clothing tracking with spotlight accents.',
    socMedPlatform: 'Facebook',
    postTime: '09:00 AM',
    adPlatforms: ['Facebook Ads', 'Instagram Ads'],
    adTime: 'Active 08:00 AM - 11:30 PM',
    adStartDate: '2026-06-07',
    adEndDate: '2026-06-12'
  }
];

const getVideoEmbedInfo = (url) => {
  if (!url) return null;
  const str = url.toLowerCase();
  
  if (str.endsWith('.mp4') || str.endsWith('.webm') || str.endsWith('.ogg')) {
    return { type: 'html5', url: url };
  }
  
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return { type: 'youtube', url: `https://www.youtube.com/embed/${ytMatch[1]}` };
  }
  
  const gDriveMatch = url.match(/(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/open\?id=)([\w-]+)/i);
  if (gDriveMatch && gDriveMatch[1]) {
    return { type: 'gdrive', url: `https://drive.google.com/file/d/${gDriveMatch[1]}/preview` };
  }
  
  return null;
};

// Converters for schedule planning: 12-hour string to standard 24-hour decimal
const parseTimeToDecimal = (timeStr) => {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours + (minutes / 60);
  }
  const match24 = timeStr.match(/(\d+):(\d+)/);
  if (match24) {
    return parseInt(match24[1], 10) + parseInt(match24[2], 10) / 60;
  }
  const simpleMatch = timeStr.match(/(\d+)\s*(AM|PM)/i);
  if (simpleMatch) {
    let hours = parseInt(simpleMatch[1], 10);
    const ampm = simpleMatch[2].toUpperCase();
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours;
  }
  return null;
};

// Decimal format converter back to standard AM/PM time label string
const formatDecimalToTime = (decimalHours) => {
  const hoursInt = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hoursInt) * 60);
  const ampm = hoursInt >= 12 ? 'PM' : 'AM';
  let hours12 = hoursInt % 12;
  if (hours12 === 0) hours12 = 12;
  return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
};

// Declared globally to fix ReferenceError
const VERTICAL_CALENDAR_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function App() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [user, setUser] = useState(null);
  
  // Navigation
  const [activeTab, setActiveTab] = useState('my-desk');
  const [currentRole, setCurrentRole] = useState('Marketing Head');
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Custom Workspace categories states
  const [types, setTypes] = useState(INITIAL_TYPES);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [priorities, setPriorities] = useState(INITIAL_PRIORITIES);
  const [stages, setStages] = useState(INITIAL_STAGES);

  const [useFirebaseSync, setUseFirebaseSync] = useState(isFirebaseAvailable);
  const [collapsedCategories, setCollapsedCategories] = useState({});

  // Settings Panel Config
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('zinc');
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignColor, setNewCampaignColor] = useState('zinc');
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('zinc');

  // Search, sorting & filters
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [campaignFilter, setCampaignFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dayAdded');
  const [showArchived, setShowArchived] = useState(false);

  // Calendar State View & Sub-calendar selectors
  const [calendarMode, setCalendarMode] = useState('production'); // production, socmed, ads
  const [socMedPlatformFilter, setSocMedPlatformFilter] = useState('All');
  const [adPlatformFilter, setAdPlatformFilter] = useState('All');
  
  const [calendarStageFilter, setCalendarStageFilter] = useState('All');
  const [calendarDate, setCalendarDate] = useState(new Date('2026-06-01T00:00:00'));

  // Adaptive Period Navigation handlers
  const handlePrevMonth = () => {
    if (calendarMode === 'production') {
      setCalendarDate(prev => new Date(prev.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (calendarMode === 'production') {
      setCalendarDate(prev => new Date(prev.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else {
      setCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }
  };

  const handleToday = () => setCalendarDate(new Date('2026-06-08T00:00:00')); // Mapped to current active sprint

  // Simulated Media Canvas controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(120);
  const videoIntervalRef = useRef(null);
  const canvasRef = useRef(null);
  const realVideoRef = useRef(null);

  // Form parameters 
  const [newTitle, setNewTitle] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [newType, setNewType] = useState('JobZ YT');
  const [newCampaign, setNewCampaign] = useState('TMT Activate');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newOverall, setNewOverall] = useState('Ideation');
  const [newDayAdded, setNewDayAdded] = useState('2026-06-07');
  const [newAssignee, setNewAssignee] = useState('');
  const [newBy, setNewBy] = useState('');
  const [newScript, setNewScript] = useState('');
  const [newRaw, setNewRaw] = useState('');
  const [newEdit, setNewEdit] = useState('');
  const [newAdLink, setNewAdLink] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const [newChecklistText, setNewChecklistText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // AI loading queues
  const [aiGeneratingChecklist, setAiGeneratingChecklist] = useState(false);
  const [aiGeneratingHook, setAiGeneratingHook] = useState(false);
  const [aiGeneratingCampaign, setAiGeneratingCampaign] = useState(false);

  // Firebase setup logic
  useEffect(() => {
    const initAuth = async () => {
      if (!isFirebaseAvailable || !auth) {
        setUser({ uid: 'mock-user-123', displayName: 'Apex Editor', email: 'editor@neocut.io' });
        return;
      }
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.warn("Auth initialization skipped, using standalone mode.", err);
      }
    };

    initAuth();

    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          setUser(authUser);
        } else {
          setUser({ uid: 'mock-user-123', displayName: 'Apex Editor', email: 'editor@neocut.io' });
        }
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (!db || !user || !useFirebaseSync) return;

    const collectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'projects');
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = [];
        snapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        setProjects(fetched);
      } else {
        INITIAL_PROJECTS.forEach(async (p) => {
          try {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', p.id), p);
          } catch (writeErr) {
            setUseFirebaseSync(false);
          }
        });
      }
    }, (error) => {
      console.warn("Subscribed to database via standalone memory fallback engine.", error.message || error);
      setUseFirebaseSync(false);
    });

    return () => unsubscribe();
  }, [user, useFirebaseSync]);

  const persistProjects = async (updatedProjectsList) => {
    setProjects(updatedProjectsList);
    if (db && user && useFirebaseSync) {
      try {
        for (const p of updatedProjectsList) {
          await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', p.id), p);
        }
      } catch (e) {
        console.info("Workspace modifications successfully cached to secure local memory layer.", e.message || e);
        setUseFirebaseSync(false);
      }
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- GEMINI LLM INTEGRATION ROUTINES ---
  const askGemini = async (prompt, systemInstruction = "") => {
    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    if (systemInstruction) {
      payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
        throw new Error("Empty content.");
      } catch (err) {
        if (attempt === 4) throw err;
        await delay(Math.pow(2, attempt) * 1000);
      }
    }
  };

  const handleAiGenerateChecklist = async (projId) => {
    if (!selectedProject) return;
    setAiGeneratingChecklist(true);
    triggerToast("✨ AI is formulating micro-production tasks...");
    
    const prompt = `Formulate exactly 4 technical subtask checkboxes for:
    Title: "${selectedProject.title}"
    Scope: "${selectedProject.purpose}"
    Format: Output only clean JSON array of strings, no backticks, no markdown wrap. ["Task 1", "Task 2", "Task 3", "Task 4"]`;

    try {
      const resultText = await askGemini(prompt, "You are a professional film editor. Deliver clean structural checklists.");
      const cleanedJson = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedArray = JSON.parse(cleanedJson);
      
      if (Array.isArray(parsedArray)) {
        const newItems = parsedArray.map((text, i) => ({
          id: `ch-ai-${Date.now()}-${i}`,
          text: String(text),
          completed: false
        }));

        const updated = projects.map(p => {
          if (p.id === projId) {
            return { ...p, checklist: [...(p.checklist || []), ...newItems] };
          }
          return p;
        });

        persistProjects(updated);
        setSelectedProject(prev => ({ ...prev, checklist: [...(prev.checklist || []), ...newItems] }));
        triggerToast("✨ Task checklist imported.");
      }
    } catch (err) {
      triggerToast("AI compilation skipped.");
    } finally {
      setAiGeneratingChecklist(false);
    }
  };

  const handleAiGenerateHook = async (projId) => {
    if (!selectedProject) return;
    setAiGeneratingHook(true);
    triggerToast("✨ Writing attention script hooks...");

    const prompt = `Draft three 5-second attention retention hooks for video script:
    Title: "${selectedProject.title}"
    Focus: "${selectedProject.purpose}"
    Keep under 100 words in total.`;

    try {
      const generatedScriptText = await askGemini(prompt, "You are a viral YouTube director. Write high impact visual openings.");
      const updated = projects.map(p => {
        if (p.id === projId) {
          return { ...p, notes: generatedScriptText };
        }
        return p;
      });

      persistProjects(updated);
      setSelectedProject(prev => ({ ...prev, notes: generatedScriptText }));
      triggerToast("✨ Hooks written directly into annotations.");
    } catch (err) {
      triggerToast("AI generation bypassed.");
    } finally {
      setAiGeneratingHook(false);
    }
  };

  const handleAiGenerateCampaign = async (projId) => {
    if (!selectedProject) return;
    setAiGeneratingCampaign(true);
    triggerToast("✨ Composing social captions & tags...");

    const prompt = `Formulate one post caption with 3 hashtags for format "${selectedProject.type}". 
    Title: "${selectedProject.title}"`;

    try {
      const resultText = await askGemini(prompt, "Expert copywriter.");
      const marker = formatTimecode(videoTime);
      const newComment = {
        id: `c-ai-${Date.now()}`,
        userName: "✨ Gemini Writer",
        text: resultText,
        timeMarker: marker,
        resolved: false
      };

      const updated = projects.map(p => {
        if (p.id === projId) {
          return { ...p, comments: [...(p.comments || []), newComment] };
        }
        return p;
      });

      persistProjects(updated);
      setSelectedProject(prev => ({ ...prev, comments: [...(prev.comments || []), newComment] }));
      triggerToast("✨ Copy drafts saved in reviews feedback feed.");
    } catch (err) {
      triggerToast("AI copywriting skipped.");
    } finally {
      setAiGeneratingCampaign(false);
    }
  };

  const formatTimecode = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isPlaying) {
      videoIntervalRef.current = setInterval(() => {
        setVideoTime((prev) => {
          if (prev >= videoDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    }
    return () => {
      if (videoIntervalRef.current) clearInterval(videoIntervalRef.current);
    };
  }, [isPlaying, videoDuration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const currentThemeSeed = selectedProject ? selectedProject.thumbnailSeed : 'cyberpunk';
      let primaryColor = '#a1a1aa'; 
      let secondaryColor = '#52525b';
      if (currentThemeSeed === 'cyberpunk') {
        primaryColor = '#ffffff';
        secondaryColor = '#3f3f46';
      } else if (currentThemeSeed === 'setup') {
        primaryColor = '#d4d4d8';
        secondaryColor = '#27272a';
      }

      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      const timeFactor = isPlaying ? Date.now() * 0.003 : 0;
      ctx.beginPath();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < canvas.width; i++) {
        const y = canvas.height / 2 + Math.sin(i * 0.03 + timeFactor) * 15 * (isPlaying ? 1 : 0.2);
        if (i === 0) ctx.moveTo(i, y); else ctx.lineTo(i, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i++) {
        const y = canvas.height / 2 + Math.cos(i * 0.02 - timeFactor) * 10 * (isPlaying ? 1.2 : 0.1);
        if (i === 0) ctx.moveTo(i, y); else ctx.lineTo(i, y);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      const bSize = 10; const pad = 20;
      ctx.beginPath(); ctx.moveTo(pad + bSize, pad); ctx.lineTo(pad, pad); ctx.lineTo(pad, pad + bSize); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(canvas.width - pad - bSize, pad); ctx.lineTo(canvas.width - pad, pad); ctx.lineTo(canvas.width - pad, pad + bSize); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad + bSize, canvas.height - pad); ctx.lineTo(pad, canvas.height - pad); ctx.lineTo(pad, canvas.height - pad + bSize); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(canvas.width - pad - bSize, canvas.height - pad); ctx.lineTo(canvas.width - pad, canvas.height - pad); ctx.lineTo(canvas.width - pad, canvas.height - pad + bSize); ctx.stroke();

      if (isPlaying) {
        const pulse = Math.abs(Math.sin(Date.now() * 0.005));
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + pulse * 0.6})`;
        ctx.beginPath(); ctx.arc(35, 35, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#a1a1aa'; ctx.font = '9px monospace'; ctx.fillText('RECORDING', 46, 38);
      }

      ctx.fillStyle = '#71717a';
      ctx.font = '9px monospace';
      ctx.fillText(`${selectedProject ? selectedProject.type : 'YouTube'} format`, 35, canvas.height - 30);
      ctx.fillText(`TC ${formatTimecode(videoTime)}`, canvas.width - 90, 38);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedProject, isPlaying, videoTime]);

  const handleAddType = (e) => {
    e.preventDefault();
    if (!newTypeName.trim() || types.some(t => (t.name || '').toLowerCase() === newTypeName.trim().toLowerCase())) return;
    const addedType = {
      name: newTypeName.trim(),
      colorKey: newTypeColor
    };
    setTypes([...types, addedType]);
    triggerToast(`Added custom Type: "${newTypeName.trim()}"`);
    setNewTypeName('');
  };

  const handleAddCampaign = (e) => {
    e.preventDefault();
    if (!newCampaignName.trim() || campaigns.some(c => (c.name || '').toLowerCase() === newCampaignName.trim().toLowerCase())) return;
    const addedCampaign = {
      name: newCampaignName.trim(),
      colorKey: newCampaignColor
    };
    setCampaigns([...campaigns, addedCampaign]);
    triggerToast(`Added Campaign: "${newCampaignName.trim()}"`);
    setNewCampaignName('');
  };

  const handleAddStage = (e) => {
    e.preventDefault();
    if (!newStageName.trim() || stages.some(s => (s.name || '').toLowerCase() === newStageName.trim().toLowerCase())) return;
    const addedStage = {
      id: newStageName.trim(),
      name: newStageName.trim(),
      colorKey: newStageColor
    };
    setStages([...stages, addedStage]);
    triggerToast(`Added column: "${newStageName.trim()}"`);
    setNewStageName('');
  };

  const handleDeleteType = (typeNameToDelete) => {
    if (types.length <= 1) {
      triggerToast("Keep at least one layout type.");
      return;
    }
    setTypes(types.filter(t => t.name !== typeNameToDelete));
  };

  const handleDeleteCampaign = (campaignNameToDelete) => {
    if (campaigns.length <= 1) {
      triggerToast("Keep at least one campaign category.");
      return;
    }
    setCampaigns(campaigns.filter(c => c.name !== campaignNameToDelete));
  };

  const handleDeleteStage = (stageIdToDelete) => {
    if (stages.length <= 1) {
      triggerToast("Keep at least one column stage.");
      return;
    }
    setStages(stages.filter(s => s.id !== stageIdToDelete));
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj = {
      id: `proj-${Date.now()}`,
      dayAdded: newDayAdded,
      type: newType,
      campaign: newCampaign,
      purpose: newPurpose,
      priority: newPriority,
      title: newTitle,
      assignee: newAssignee,
      by: newBy,
      script: newScript,
      raw: newRaw,
      edit: newEdit,
      adLink: newAdLink,
      notes: newNotes,
      overall: newOverall,
      thumbnailSeed: 'setup',
      checklist: [
        { id: `ch-${Date.now()}-1`, text: 'Write Hook Script', completed: false },
        { id: `ch-${Date.now()}-2`, text: 'Assemble Rough Cut', completed: false }
      ],
      assets: [],
      comments: [],
      isArchived: false,
      shootTime: '12:00 PM',
      shootDuration: 1,
      shootDetails: 'Studio session scheduled.',
      socMedPlatform: 'Instagram',
      postTime: '05:00 PM',
      adPlatforms: ['Instagram Ads'],
      adTime: 'Continuous Active Mode',
      adStartDate: newDayAdded,
      adEndDate: newDayAdded
    };

    const updated = [...projects, newProj];
    persistProjects(updated);
    setIsCreateModalOpen(false);
    triggerToast(`"${newTitle}" added to schedule`);

    // Reset Form
    setNewTitle(''); setNewPurpose(''); 
    setNewType(types[0]?.name || 'JobZ YT'); 
    setNewCampaign(campaigns[0]?.name || 'TMT Activate');
    setNewPriority(priorities[0] || 'Medium');
    setNewOverall(stages[0]?.id || 'Ideation'); 
    setNewDayAdded('2026-06-07'); setNewAssignee('');
    setNewBy(''); setNewScript(''); setNewRaw(''); setNewEdit(''); setNewNotes(''); setNewAdLink('');
  };

  const handleUpdateField = (projId, field, value) => {
    const updated = projects.map(p => {
      if (p.id === projId) {
        return { ...p, [field]: value };
      }
      return p;
    });

    persistProjects(updated);

    if (selectedProject && selectedProject.id === projId) {
      setSelectedProject(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDrop = (e, targetStage) => {
    const projId = e.dataTransfer.getData('projectId');
    if (!projId) return;

    const updated = projects.map(p => {
      if (p.id === projId) {
        return { ...p, overall: targetStage };
      }
      return p;
    });
    persistProjects(updated);
    triggerToast(`Moved stage to "${targetStage}"`);
  };

  const handleCalendarDrop = (e, targetDate) => {
    e.preventDefault();
    const projId = e.dataTransfer.getData('projectId');
    if (!projId) return;

    const updated = projects.map(p => {
      if (p.id === projId) {
        if (calendarMode === 'ads') {
          const start = p.adStartDate || p.dayAdded;
          const end = p.adEndDate || start;
          const startD = new Date(start + 'T12:00:00Z');
          const endD = new Date(end + 'T12:00:00Z');
          const diffDays = Math.max(0, Math.round((endD - startD) / (1000 * 60 * 60 * 24)));
          
          const newStartD = new Date(targetDate + 'T12:00:00Z');
          const newEndD = new Date(newStartD);
          newEndD.setUTCDate(newEndD.getUTCDate() + diffDays);
          const newEndStr = newEndD.toISOString().split('T')[0];

          return { ...p, adStartDate: targetDate, adEndDate: newEndStr };
        }
        return { ...p, dayAdded: targetDate };
      }
      return p;
    });
    persistProjects(updated);
    triggerToast(calendarMode === 'ads' ? `Ad schedule moved to start on ${targetDate}` : `Rescheduled to ${targetDate}`);
  };

  const handleHourlyShootDrop = (e, targetDate, hourDecimal) => {
    e.preventDefault();
    const projId = e.dataTransfer.getData('projectId');
    if (!projId) return;

    const formattedTimeLabel = formatDecimalToTime(hourDecimal);
    const updated = projects.map(p => {
      if (p.id === projId) {
        return {
          ...p,
          dayAdded: targetDate,
          shootTime: formattedTimeLabel
        };
      }
      return p;
    });
    persistProjects(updated);
    triggerToast(`Rescheduled shoot to ${targetDate} at ${formattedTimeLabel}`);
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('projectId', id);
  };

  const handleToggleChecklist = (projId, checklistItemId) => {
    const updated = projects.map(p => {
      if (p.id === projId) {
        const updatedChecklist = p.checklist.map(item => {
          if (item.id === checklistItemId) {
            return { ...item, completed: !item.completed };
          }
          return item;
        });
        return { ...p, checklist: updatedChecklist };
      }
      return p;
    });
    persistProjects(updated);

    if (selectedProject && selectedProject.id === projId) {
      setSelectedProject(prev => ({
        ...prev,
        checklist: prev.checklist.map(i => i.id === checklistItemId ? { ...i, completed: !i.completed } : i)
      }));
    }
  };

  const handleAddChecklistItem = (e, projId) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;

    const newItem = { id: `ch-${Date.now()}`, text: newChecklistText, completed: false };
    const updated = projects.map(p => {
      if (p.id === projId) {
        return { ...p, checklist: [...(p.checklist || []), newItem] };
      }
      return p;
    });

    persistProjects(updated);
    if (selectedProject && selectedProject.id === projId) {
      setSelectedProject(prev => ({ ...prev, checklist: [...(prev.checklist || []), newItem] }));
    }
    setNewChecklistText('');
  };

  const handleAddComment = (e, projId) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const marker = formatTimecode(videoTime);
    const newComment = {
      id: `c-${Date.now()}`,
      userName: user ? user.displayName || currentRole : 'Producer Agent',
      text: newCommentText,
      timeMarker: marker,
      resolved: false
    };

    const updated = projects.map(p => {
      if (p.id === projId) {
        return { ...p, comments: [...(p.comments || []), newComment] };
      }
      return p;
    });

    persistProjects(updated);
    if (selectedProject && selectedProject.id === projId) {
      setSelectedProject(prev => ({ ...prev, comments: [...(prev.comments || []), newComment] }));
    }
    setNewCommentText('');
    triggerToast(`Added timeline note at [${marker}]`);
  };

  const handleToggleCommentResolved = (projId, commentId) => {
    const updated = projects.map(p => {
      if (p.id === projId) {
        const updatedComments = p.comments.map(c => {
          if (c.id === commentId) {
            return { ...c, resolved: !c.resolved };
          }
          return c;
        });
        return { ...p, comments: updatedComments };
      }
      return p;
    });

    persistProjects(updated);
    if (selectedProject && selectedProject.id === projId) {
      setSelectedProject(prev => ({
        ...prev,
        comments: prev.comments.map(c => c.id === commentId ? { ...c, resolved: !c.resolved } : c)
      }));
    }
  };

  const handleToggleArchive = (projId) => {
    const updated = projects.map(p => p.id === projId ? { ...p, isArchived: !p.isArchived } : p);
    persistProjects(updated);
    setSelectedProject(null);
    triggerToast(showArchived ? "Campaign restored to active." : "Campaign safely archived.");
  };

  const handleDeleteProject = (projId) => {
    const updated = projects.filter(p => p.id !== projId);
    persistProjects(updated);
    setSelectedProject(null);
    triggerToast("Campaign permanently deleted.");
  };

  const handleJumpToTimestamp = (markerStr) => {
    const [mins, secs] = markerStr.split(':').map(Number);
    setVideoTime((mins * 60) + secs);
    setIsPlaying(false);
  };

  const toggleCollapse = (catName) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  const typeColorMap = useMemo(() => {
    const map = {};
    types.forEach(t => {
      map[t.name] = STYLING_PRESETS[t.colorKey] || STYLING_PRESETS.zinc;
    });
    return map;
  }, [types]);

  const campaignColorMap = useMemo(() => {
    const map = {};
    campaigns.forEach(c => {
      map[c.name] = STYLING_PRESETS[c.colorKey] || STYLING_PRESETS.zinc;
    });
    return map;
  }, [campaigns]);

  const stageColorMap = useMemo(() => {
    const map = {};
    stages.forEach(s => {
      map[s.id] = STYLING_PRESETS[s.colorKey] || STYLING_PRESETS.zinc;
    });
    return map;
  }, [stages]);

  const filteredProjects = useMemo(() => {
    let result = projects.filter(p => {
      const isArch = Boolean(p.isArchived);
      if (isArch !== showArchived) return false;

      const matchesSearch = 
        (p.title || '').toLowerCase().includes((searchQuery || '').toLowerCase()) || 
        (p.purpose || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        (p.assignee || '').toLowerCase().includes((searchQuery || '').toLowerCase());
      const matchesType = typeFilter === 'All' || p.type === typeFilter;
      const matchesCampaign = campaignFilter === 'All' || p.campaign === campaignFilter;
      const matchesPriority = priorityFilter === 'All' || p.priority === priorityFilter;
      return matchesSearch && matchesType && matchesCampaign && matchesPriority;
    });

    return result.sort((a, b) => {
      if (sortBy === 'dayAdded') {
        return new Date(a.dayAdded).getTime() - new Date(b.dayAdded).getTime();
      }
      if (sortBy === 'priority') {
        const pWeight = { High: 3, Medium: 2, Low: 1 };
        return (pWeight[b.priority] || 0) - (pWeight[a.priority] || 0);
      }
      if (sortBy === 'type') {
        return (a.type || '').localeCompare(b.type || '');
      }
      if (sortBy === 'campaign') {
        return (a.campaign || '').localeCompare(b.campaign || '');
      }
      if (sortBy === 'assignee') {
        return (a.assignee || '').localeCompare(b.assignee || '');
      }
      return 0;
    });
  }, [projects, searchQuery, typeFilter, campaignFilter, priorityFilter, sortBy, showArchived]);

  const totals = useMemo(() => {
    const activeProjects = projects.filter(p => !p.isArchived);
    const count = activeProjects.length;
    const publishedCount = activeProjects.filter(p => p.overall === 'Published').length;
    const highPriorityCount = activeProjects.filter(p => p.priority === 'High' && p.overall !== 'Published').length;
    
    const platformBreakdown = {};
    types.forEach(t => {
      platformBreakdown[t.name] = activeProjects.filter(p => p.type === t.name).length;
    });

    const stageBreakdown = {};
    stages.forEach(s => {
      stageBreakdown[s.id] = activeProjects.filter(p => p.overall === s.id).length;
    });

    const criticalReviews = activeProjects.filter(p => p.priority === 'High' && p.overall === 'Review');

    // Calculate the bottleneck stage (highest count in active non-Published stages)
    let maxStageId = null;
    let maxStageCount = -1;
    stages.forEach(s => {
      if (s.id !== 'Published') {
        const stageCount = stageBreakdown[s.id] || 0;
        if (stageCount > maxStageCount) {
          maxStageCount = stageCount;
          maxStageId = s.id;
        }
      }
    });
    const bottleneckStage = stages.find(s => s.id === maxStageId);

    return { count, publishedCount, highPriorityCount, platformBreakdown, stageBreakdown, criticalReviews, bottleneckStage };
  }, [projects, types, stages]);

  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const grid = [];
    
    // Previous month padding
    for (let i = 0; i < firstDay; i++) {
      const dayNum = daysInPrevMonth - firstDay + 1 + i;
      const prevMonthDate = new Date(year, month - 1, dayNum);
      grid.push({ 
        dayNum: dayNum, 
        isCurrentMonth: false, 
        fullDate: `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}` 
      });
    }
    
    // Current month
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push({ 
        dayNum: day, 
        isCurrentMonth: true, 
        fullDate: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` 
      });
    }

    // Next month padding
    const totalCells = grid.length > 35 ? 42 : 35; // Standard 5 or 6 week grid mapping
    const remaining = totalCells - grid.length;
    for (let day = 1; day <= remaining; day++) {
      const nextMonthDate = new Date(year, month + 1, day);
      grid.push({ 
        dayNum: day, 
        isCurrentMonth: false, 
        fullDate: `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` 
      });
    }

    return grid;
  }, [calendarDate]);

  // Derived week days calculation for Shoot Calendar weekly view
  const calendarWeekDays = useMemo(() => {
    const current = new Date(calendarDate);
    const dayOfWeek = current.getDay(); // 0 (Sunday) to 6 (Saturday)
    const sunday = new Date(current.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(sunday.getTime() + i * 24 * 60 * 60 * 1000);
      week.push({
        dayNum: day.getDate(),
        fullDate: `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`,
        label: day.toLocaleDateString('default', { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }
    return week;
  }, [calendarDate]);

  // Derived days array specifically for the Media Buyer Timeline Gantt view
  const adsTimelineDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({length: daysInMonth}, (_, i) => {
      const d = new Date(year, month, i + 1);
      return {
        dayNum: i + 1,
        fullDate: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
        shortDay: d.toLocaleDateString('default', { weekday: 'narrow' })
      };
    });
  }, [calendarDate]);

  // Unscheduled projects pool list for side-drag actions on Production mode
  const unscheduledProjectsBacklog = useMemo(() => {
    return projects.filter(p => !p.isArchived && !p.shootTime);
  }, [projects]);

  // Dynamic shoot card duration adjustment helper
  const handleModifyShootDuration = (projId, action) => {
    const updated = projects.map(p => {
      if (p.id === projId) {
        const currentDur = p.shootDuration || 1;
        let newDur = action === 'increment' ? currentDur + 1 : currentDur - 1;
        if (newDur < 1) newDur = 1;
        if (newDur > 6) newDur = 6; // Max 6-hour shoots block
        return { ...p, shootDuration: newDur };
      }
      return p;
    });
    persistProjects(updated);
    triggerToast(action === 'increment' ? "Extended shoot duration" : "Shortened shoot duration");
  };

  // --- ROLE-BASED DASHBOARD LOGIC ---
  const myDeskData = useMemo(() => {
    let focusStages = [];
    let roleActionLabel = "Open Project";
    let roleActionIcon = Link2;
    let roleActionLinkProp = null; 

    switch(currentRole) {
      case 'Campaign Writer':
        focusStages = ['Ideation', 'Scripting'];
        roleActionLabel = "Open Script Doc";
        roleActionIcon = PenTool;
        roleActionLinkProp = 'script';
        break;
      case 'Director':
        focusStages = ['Pre-Prod', 'Shooting'];
        roleActionLabel = "Upload Raw Assets";
        roleActionIcon = Film;
        roleActionLinkProp = 'raw';
        break;
      case 'Video Editor':
        focusStages = ['Editing'];
        roleActionLabel = "Jump to Frame.io";
        roleActionIcon = Scissors;
        roleActionLinkProp = 'edit';
        break;
      case 'Social Media Manager':
        focusStages = ['Review', 'Ready for Upload', 'Published'];
        roleActionLabel = "Draft Social Copy";
        roleActionIcon = Smartphone;
        roleActionLinkProp = 'edit'; 
        break;
      case 'Marketing Head':
      case 'Operations Manager':
      default:
        focusStages = stages.map(s => s.id); 
        roleActionLabel = "Review Status";
        roleActionIcon = Gauge;
        roleActionLinkProp = null; 
        break;
    }

    const activeRoleProjects = projects.filter(p => !p.isArchived && focusStages.includes(p.overall));
    
    // Sort so high priority is at top
    activeRoleProjects.sort((a, b) => {
      const pWeight = { High: 3, Medium: 2, Low: 1 };
      return (pWeight[b.priority] || 0) - (pWeight[a.priority] || 0);
    });

    return { focusStages, activeRoleProjects, roleActionLabel, roleActionIcon, roleActionLinkProp };
  }, [currentRole, projects, stages]);

  // Derived metrics tailored explicitly for the Marketing Head view
  const formatMetrics = useMemo(() => {
    const activeProjects = projects.filter(p => !p.isArchived);
    return types.map(t => {
      const list = activeProjects.filter(p => p.type === t.name);
      const done = list.filter(p => p.overall === 'Published');
      const running = list.filter(p => ['Shooting', 'Editing', 'Review', 'Ready for Upload'].includes(p.overall));
      const prep = list.filter(p => ['Ideation', 'Scripting', 'Pre-Prod'].includes(p.overall));
      
      const completionPercentage = list.length > 0 
        ? Math.round((done.length / list.length) * 100) 
        : 0;

      return {
        name: t.name,
        colorKey: t.colorKey,
        done: done.length,
        running: running.length,
        prep: prep.length,
        total: list.length,
        completionPercentage,
        doneItems: done,
        runningItems: running
      };
    });
  }, [projects, types]);

  // Overall Marketing Head week totals
  const weeklyVelocity = useMemo(() => {
    const activeProjects = projects.filter(p => !p.isArchived);
    const doneCount = activeProjects.filter(p => p.overall === 'Published').length;
    const runningCount = activeProjects.filter(p => ['Shooting', 'Editing', 'Review', 'Ready for Upload'].includes(p.overall) || p.shootTime).length;
    const prepCount = activeProjects.filter(p => ['Ideation', 'Scripting', 'Pre-Prod'].includes(p.overall)).length;
    const totalCount = activeProjects.length || 1;
    const velocityPercentage = Math.round((doneCount / totalCount) * 100);

    return {
      doneCount,
      runningCount,
      prepCount,
      totalCount,
      velocityPercentage
    };
  }, [projects]);

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Global Minimal Scrollbar Styles, Fonts & Form Webkit Resets */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        
        .font-mono {
          font-family: 'JetBrains Mono', monospace !important;
        }

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(82, 82, 91, 0.5);
          border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(113, 113, 122, 0.9);
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(82, 82, 91, 0.5) transparent;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 0.9;
        }
        select option {
          background-color: #09090b !important;
          color: #e4e4e7 !important;
        }
      `}</style>

      {/* --- MINIMALIST HEADER --- */}
      <header className="sticky top-0 z-40 bg-[#050507]/90 backdrop-blur-md border-b border-zinc-900/80 px-8 py-5 flex flex-col gap-4 md:flex-row md:items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
            <Video className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base font-extrabold tracking-widest uppercase text-zinc-100 font-mono">
                Marketing Dashboard
              </h1>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-2 py-0.5 rounded-full font-mono uppercase tracking-widest font-bold">Active</span>
            </div>
          </div>
        </div>

        {/* Workspace controls */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* PROFILE / ROLE SWITCHER */}
          <div className="flex items-center gap-2.5 bg-[#09090b] border border-zinc-800 rounded-lg px-3.5 py-2 shadow-sm">
            <User className="w-4 h-4 text-zinc-400" />
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="bg-transparent text-xs font-bold tracking-wider text-zinc-200 focus:outline-none cursor-pointer font-mono"
            >
              {TEAM_ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold tracking-wide rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-all"
            title="Configure Workspace Schema Colors & Options"
          >
            <Settings className="w-4 h-4 text-zinc-400" />
          </button>

          {/* View switcher - Redundant Stages tab removed, keeping Board */}
          <div className="flex items-center bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
            {[
              { id: 'my-desk', label: 'My Desk', icon: User },
              { id: 'overview', label: 'Team Overview', icon: Grid },
              { id: 'list', label: 'Grid', icon: List },
              { id: 'board', label: 'Board', icon: Kanban },
              { id: 'calendar', label: 'Calendar', icon: CalendarIcon }
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wide rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-zinc-800 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-extrabold bg-zinc-100 hover:bg-white text-zinc-950 rounded-lg transition-all tracking-wider shadow-lg shadow-white/5"
          >
            <Plus className="w-4 h-4" />
            NEW
          </button>
        </div>
      </header>

      {/* --- TOAST MESSAGES --- */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl text-sm font-bold text-zinc-200 font-mono">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filters */}
      {['list', 'board', 'calendar'].includes(activeTab) && (
        <section className="bg-[#050507] px-8 py-4 border-b border-zinc-900/80 flex flex-col lg:flex-row items-center gap-5 text-sm text-zinc-400">
          
          <div className="flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800 shrink-0 font-sans">
            <button
              onClick={() => setShowArchived(false)}
              className={`px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest rounded-md transition-all ${
                !showArchived ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest rounded-md transition-all ${
                showArchived ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Archived
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 w-full relative ml-0 lg:ml-2 font-sans">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5" />
            <input
              type="text"
              placeholder="Search campaigns, assignees, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:bg-zinc-950 transition-all font-medium"
            />
          </div>

          {/* Filtering & Sorting Controls Wrapper */}
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Format:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer hover:text-white transition-colors font-mono"
              >
                <option value="All">All Types</option>
                {types.map(t => (
                  <option key={t.name || ''} value={t.name || ''}>{t.name || ''}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Campaign:</span>
              <select
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer hover:text-white transition-colors font-mono"
              >
                <option value="All">All Campaigns</option>
                {campaigns.map(c => (
                  <option key={c.name || ''} value={c.name || ''}>{c.name || ''}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer hover:text-white transition-colors font-mono"
              >
                <option value="All">All Priorities</option>
                {priorities.map(p => (
                  <option key={p || ''} value={p || ''}>{p || ''}</option>
                ))}
              </select>
            </div>

            {/* Dynamic Sorting Selection Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold font-mono">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer hover:text-white transition-colors font-mono"
              >
                <option value="dayAdded">Date Added</option>
                <option value="priority">Priority</option>
                <option value="type">Type Format</option>
                <option value="campaign">Campaign</option>
                <option value="assignee">Assignee</option>
              </select>
            </div>
          </div>
        </section>
      )}

      {/* --- MAIN INTERFACE MODULES --- */}
      <main className="flex-1 p-8 overflow-x-auto relative bg-[#050507]">
        
        {/* --- MY DESK (ROLE-BASED PROFILE VIEW) --- */}
        {activeTab === 'my-desk' && (
          <div className="space-y-10 max-w-6xl mx-auto animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/80 pb-8">
               <div>
                 <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Welcome, {currentRole}</h2>
                 <p className="text-sm text-zinc-400 font-medium mt-3 max-w-2xl leading-relaxed">
                   {currentRole === 'Marketing Head' 
                     ? "Content Velocity & Multi-Format Operational Control. Track real-time distribution across your core marketing channels."
                     : `Here is your tailored action plan. You are currently tracking ${myDeskData.activeRoleProjects.length} deliverables in your focused stages (${myDeskData.focusStages.join(', ')}).`
                   }
                 </p>
               </div>
               
               {/* Role Macro KPI */}
               <div className="bg-[#0a0a0f] border border-zinc-800 rounded-2xl p-5 flex items-center gap-5 shadow-lg">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                    <Target className="w-6 h-6 text-zinc-300" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-zinc-500 font-extrabold block mb-1">Weekly Velocity</span>
                    <span className="text-3xl font-black text-white">
                      {weeklyVelocity.velocityPercentage}% <span className="text-xs text-emerald-400 font-mono font-bold">Done</span>
                    </span>
                  </div>
               </div>
            </div>

            {/* MARKETING HEAD - NEW DYNAMIC KPI OPERATIONS COCKPIT */}
            {currentRole === 'Marketing Head' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                
                {/* Section A: Running vs Done Weekly Scorecard */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  {/* KPI Card 1: Content Done (Published) */}
                  <div className="bg-[#0a0a0f] border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-all shadow-lg">
                    <div className="absolute right-4 top-4 p-2.5 rounded-lg bg-emerald-955/20 text-emerald-400 border border-emerald-900/40">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <span className="text-zinc-500 text-[10px] uppercase font-extrabold tracking-widest font-mono block">DONE / PUBLISHED</span>
                    <div className="flex items-baseline gap-3 mt-4">
                      <span className="text-5xl font-black text-white">{weeklyVelocity.doneCount}</span>
                      <span className="text-xs font-mono font-semibold text-zinc-500">FORMATS</span>
                    </div>
                    <div className="text-[11px] font-mono font-medium text-zinc-400 mt-4 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Completed live assets this cycle
                    </div>
                  </div>

                  {/* KPI Card 2: Running Content (Post Production Pipeline) */}
                  <div className="bg-[#0a0a0f] border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-all shadow-lg">
                    <div className="absolute right-4 top-4 p-2.5 rounded-lg bg-blue-950/20 text-blue-400 border border-blue-900/40">
                      <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-zinc-500 text-[10px] uppercase font-extrabold tracking-widest font-mono block">RUNNING / IN PROD</span>
                    <div className="flex items-baseline gap-3 mt-4">
                      <span className="text-5xl font-black text-blue-400">{weeklyVelocity.runningCount}</span>
                      <span className="text-xs font-mono font-semibold text-zinc-500">LIVE SLOTS</span>
                    </div>
                    <div className="text-[11px] font-mono font-medium text-zinc-400 mt-4 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                      Shooting, Editing, Review & Uploads
                    </div>
                  </div>

                  {/* KPI Card 3: Backlog Strategy & Prep */}
                  <div className="bg-[#0a0a0f] border border-zinc-800 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-all shadow-lg">
                    <div className="absolute right-4 top-4 p-2.5 rounded-lg bg-orange-955/20 text-orange-400 border border-orange-900/40">
                      <PenTool className="w-5 h-5" />
                    </div>
                    <span className="text-zinc-500 text-[10px] uppercase font-extrabold tracking-widest font-mono block">STRATEGY & PREP</span>
                    <div className="flex items-baseline gap-3 mt-4">
                      <span className="text-5xl font-black text-orange-400">{weeklyVelocity.prepCount}</span>
                      <span className="text-xs font-mono font-semibold text-zinc-500">IDEAS</span>
                    </div>
                    <div className="text-[11px] font-mono font-medium text-zinc-400 mt-4 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                      Ideation, Scripting & Pre-Prod
                    </div>
                  </div>

                  {/* KPI Card 4: Main Production Bottleneck */}
                  <div className="bg-[#0a0a0f] border border-[#3a1d1d]/80 p-6 rounded-2xl relative overflow-hidden group hover:border-red-900/50 transition-all shadow-lg">
                    <div className="absolute right-4 top-4 p-2.5 rounded-lg bg-red-950/20 text-red-400 border border-red-900/40 font-sans">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <span className="text-red-400/80 text-[10px] uppercase font-extrabold tracking-widest font-mono block font-sans">CRITICAL BOTTLENECK</span>
                    <div className="flex items-baseline gap-3 mt-4">
                      <span className="text-2xl font-black text-white truncate max-w-[150px]">
                        {totals.bottleneckStage?.name || 'None'}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono font-medium text-zinc-400 mt-4 leading-relaxed font-sans">
                      Accumulating highest pending queue density
                    </p>
                  </div>

                </div>

                {/* Section B: FORMAT OPERATIONS MATRIX */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Format Operational Densities</h3>
                      <p className="text-xs text-zinc-500 mt-1 font-sans font-medium">Cross-format velocities. Click format keys to sync dynamic table view parameters.</p>
                    </div>
                    <div className="text-xs font-mono font-bold text-zinc-500 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      Calculated globally from unarchived metrics
                    </div>
                  </div>

                  {/* Format Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                    {formatMetrics.map(metrics => {
                      const styling = STYLING_PRESETS[metrics.colorKey] || STYLING_PRESETS.zinc;
                      return (
                        <div key={metrics.name} className="bg-[#0a0a0f]/80 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-md group">
                          
                          {/* Card Top: Header & Quick Focus */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`inline-block px-3 py-1 text-[10px] rounded-lg border font-mono font-black tracking-widest uppercase ${styling.classes}`}>
                                {metrics.name}
                              </span>
                              
                              <button
                                onClick={() => {
                                  setTypeFilter(metrics.name);
                                  setActiveTab('list');
                                  triggerToast(`Filter synched for: ${metrics.name}`);
                                }}
                                className="opacity-0 group-hover:opacity-100 text-[10px] font-mono font-extrabold tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-2.5 py-1 rounded-md transition-all flex items-center gap-1 font-sans"
                              >
                                Filter Grid <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Velocity Bar */}
                            <div className="space-y-1.5 pt-2">
                              <div className="flex justify-between items-center text-xs font-mono font-bold">
                                <span className="text-zinc-500 uppercase tracking-widest">Velocity Rating</span>
                                <span className="text-white">{metrics.completionPercentage}% Complete</span>
                              </div>
                              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-zinc-400 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${metrics.completionPercentage}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Card Middle: Sub-status counts */}
                          <div className="grid grid-cols-3 gap-2 border-y border-zinc-900 py-4 my-5 text-center bg-zinc-950/40 rounded-xl">
                            <div>
                              <span className="text-[10px] font-mono font-extrabold text-emerald-400 block">DONE</span>
                              <span className="text-xl font-black text-white">{metrics.done}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono font-extrabold text-blue-400 block">RUNNING</span>
                              <span className="text-xl font-black text-white">{metrics.running}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono font-extrabold text-zinc-500 block">PREP</span>
                              <span className="text-xl font-black text-white">{metrics.prep}</span>
                            </div>
                          </div>

                          {/* Card Bottom: Running / Done Title Feeds */}
                          <div className="space-y-4">
                            
                            {/* Running items list */}
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-mono font-extrabold uppercase text-blue-400 block tracking-widest">
                                📡 Running Currently ({metrics.runningItems.length})
                              </span>
                              {metrics.runningItems.length === 0 ? (
                                <span className="text-[11px] text-zinc-600 font-mono italic block">No active production runs</span>
                              ) : (
                                <div className="space-y-1 max-h-[85px] overflow-y-auto pr-1 font-sans">
                                  {metrics.runningItems.map(p => (
                                    <div 
                                      key={p.id} 
                                      onClick={() => setSelectedProject(p)}
                                      className="flex items-center justify-between text-xs font-medium py-1 px-1.5 rounded bg-[#050507]/40 border border-zinc-900 hover:border-zinc-800 hover:bg-[#0c0c14] cursor-pointer transition-all"
                                    >
                                      <span className="text-zinc-300 truncate max-w-[140px] font-sans">{p.title}</span>
                                      <span className="text-[9px] font-mono font-bold text-zinc-500 shrink-0 bg-zinc-900 px-1.5 py-0.5 rounded uppercase">{p.overall}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Done items list */}
                            <div className="space-y-1.5 font-sans font-medium">
                              <span className="text-[9px] font-mono font-extrabold uppercase text-emerald-400 block tracking-widest font-sans font-bold">
                                ✅ Published Done ({metrics.doneItems.length})
                              </span>
                              {metrics.doneItems.length === 0 ? (
                                <span className="text-[11px] text-zinc-600 font-mono italic block">No completed assets this week</span>
                              ) : (
                                <div className="space-y-1 max-h-[85px] overflow-y-auto pr-1">
                                  {metrics.doneItems.map(p => (
                                    <div 
                                      key={p.id} 
                                      onClick={() => setSelectedProject(p)}
                                      className="flex items-center justify-between text-xs font-medium py-1 px-1.5 rounded bg-[#050507]/40 border border-zinc-900 hover:border-zinc-800 hover:bg-[#0c140f] cursor-pointer transition-all"
                                    >
                                      <span className="text-zinc-400 truncate max-w-[160px]">{p.title}</span>
                                      <CheckSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* Standard non-Marketing Head roles active views list */}
            {currentRole !== 'Marketing Head' && (
              <>
                {myDeskData.activeRoleProjects.length === 0 ? (
                  <div className="w-full p-16 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl bg-[#0a0a0f]">
                     <CheckCircle2 className="w-16 h-16 text-zinc-600 mb-6" />
                     <h3 className="text-2xl font-extrabold text-zinc-200">Your desk is clear!</h3>
                     <p className="text-base text-zinc-500 mt-2 font-medium">There are no unarchived deliverables currently sitting in your pipeline stages.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {myDeskData.activeRoleProjects.map(p => {
                      const stStyle = stageColorMap[p.overall] || STYLING_PRESETS.zinc;
                      const completedCheck = p.checklist ? p.checklist.filter(item => item.completed).length : 0;
                      const Icon = myDeskData.roleActionIcon;
                      const actionLink = p[myDeskData.roleActionLinkProp];

                      return (
                        <div key={p.id} className="bg-[#0a0a0f] border border-zinc-800 hover:border-zinc-600 rounded-xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 transition-all shadow-sm gap-4">
                          
                          {/* Left: Info */}
                          <div className="flex flex-col gap-2 flex-1 min-w-0">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${p.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : p.priority === 'Medium' ? 'bg-amber-500' : 'bg-zinc-500'}`} title={`${p.priority} Priority`} />
                              <h4 className="text-base font-bold text-zinc-100 truncate">{p.title}</h4>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-zinc-500 truncate ml-5">
                               <span className="text-zinc-300 font-sans">{p.type}</span> 
                               {p.campaign && <><span className="opacity-40">•</span> <span className="font-sans">{p.campaign}</span></>}
                               <span className="opacity-40">•</span> 
                               <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Due: {p.dayAdded}</span>
                            </div>
                          </div>
                          
                          {/* Middle: Stage & Progress */}
                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:gap-1.5 w-full md:w-32 shrink-0">
                             <span className={`text-[9px] font-extrabold border px-2.5 py-1 rounded-md uppercase font-mono ${stStyle?.classes || ''}`}>
                                {p.overall}
                             </span>
                             {p.checklist && p.checklist.length > 0 && (
                               <span className="text-[10px] font-mono text-zinc-500 font-bold font-sans font-medium">Subtasks: {completedCheck}/{p.checklist.length}</span>
                             )}
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center justify-end gap-2.5 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-800 shrink-0">
                            {myDeskData.roleActionLinkProp && actionLink ? (
                              <a 
                                href={actionLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-extrabold tracking-wide rounded-lg transition-colors shadow-sm"
                              >
                                <Icon className="w-4 h-4" />
                                {myDeskData.roleActionLabel}
                              </a>
                            ) : myDeskData.roleActionLinkProp ? (
                              <button 
                                onClick={() => setSelectedProject(p)}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-extrabold tracking-wide rounded-lg transition-colors shadow-sm"
                              >
                                <PlusCircle className="w-4 h-4" />
                                Add Link
                              </button>
                            ) : (
                              <button 
                                onClick={() => setSelectedProject(p)}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-[11px] font-extrabold tracking-wide rounded-lg transition-colors shadow-sm"
                              >
                                <Icon className="w-4 h-4" />
                                {myDeskData.roleActionLabel}
                              </button>
                            )}
                            
                            <button 
                              onClick={() => setSelectedProject(p)}
                              className="p-2 bg-transparent hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* --- EXECUTIVE OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300 font-sans">
            {/* Top Row: Analytics widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Distribution */}
              <div className="lg:col-span-2 bg-[#0a0a0f] p-8 rounded-2xl border border-zinc-800 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-300 font-mono">Operational Density</h3>
                  <p className="text-xs text-zinc-500 font-medium mt-1 font-sans">Active task variables currently mapped inside our layout lists.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {types.map(type => {
                    const count = totals.platformBreakdown[type.name] || 0;
                    const maxCount = Math.max(...Object.values(totals.platformBreakdown), 1);
                    const percentage = Math.round((count / maxCount) * 100);
                    const colorStyle = typeColorMap[type.name] || STYLING_PRESETS.zinc;

                    return (
                      <div key={type.name} className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800/80 space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className={`inline-block px-2 py-0.5 text-[10px] rounded border font-mono font-bold tracking-widest uppercase ${colorStyle?.classes || ''}`}>
                            {type.name} format
                          </span>
                          <span className="text-zinc-400 font-mono text-xs font-bold">{count} Active</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-zinc-400 h-full rounded-full transition-all duration-300" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-[#0a0a0f] p-8 rounded-2xl border border-zinc-800 flex flex-col justify-between space-y-6 shadow-sm">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-300 font-mono">Current Phase Distribution</h3>
                  <p className="text-xs text-zinc-500 font-medium mt-1 font-sans font-medium">Status allocation percentages calculated globally.</p>
                </div>

                <div className="space-y-4 flex-1 justify-center flex flex-col">
                  {stages.map(stage => {
                    const count = totals.stageBreakdown[stage.id] || 0;
                    const totalCount = projects.length || 1;
                    const percentage = Math.round((count / totalCount) * 100);
                    const stageStyle = stageColorMap[stage.id] || STYLING_PRESETS.zinc;

                    return (
                      <div key={stage.id} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-zinc-300 font-mono flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full inline-block ${(stageStyle?.classes || '').includes('text-') ? stageStyle.classes.split(' ').find(c => c.startsWith('text-')) : 'bg-zinc-400'}`}></span>
                            {stage.name}
                          </span>
                          <span className="text-zinc-500 font-mono">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-zinc-500" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Row: Highlight list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Bottleneck queue */}
              <div className="lg:col-span-2 bg-[#0a0a0f] p-8 rounded-2xl border border-zinc-800 space-y-6 shadow-sm font-sans font-sans">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-200 flex items-center gap-2 font-mono">
                    <AlertCircle className="w-5 h-5 text-zinc-400" />
                    Critical Production Reviews Required
                  </h3>
                  <span className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold font-mono">High priority review filters</span>
                </div>

                <div className="divide-y divide-zinc-800/80 max-h-[350px] overflow-y-auto space-y-2 pr-2">
                  {totals.criticalReviews.length === 0 ? (
                    <div className="p-10 text-center text-zinc-500 text-sm font-medium italic font-mono border border-dashed border-zinc-800 rounded-xl">
                      No active high-priority review blocks detected.
                    </div>
                  ) : (
                    totals.criticalReviews.map(p => {
                      const typeStyle = typeColorMap[p.type] || STYLING_PRESETS.zinc;
                      return (
                        <div 
                          key={p.id} 
                          onClick={() => setSelectedProject(p)}
                          className="py-4 px-3 hover:bg-zinc-900/50 rounded-lg cursor-pointer transition-colors flex items-center justify-between group"
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] border px-2 py-0.5 rounded font-mono uppercase font-bold tracking-widest ${typeStyle?.classes || ''}`}>
                                {p.type}
                              </span>
                              <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{p.title}</span>
                            </div>
                            <p className="text-xs text-zinc-500 line-clamp-1 font-medium">{p.purpose}</p>
                          </div>

                          <div className="text-right text-[11px] font-mono font-bold text-zinc-500 space-y-1">
                            <div className="text-zinc-400">By: {p.by || 'Admin'}</div>
                            <div>Due: {p.dayAdded}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Workspace tips */}
              <div className="bg-[#0a0a0f] p-8 rounded-2xl border border-zinc-800 space-y-6 flex flex-col justify-between shadow-sm">
                <div className="space-y-3 font-sans">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-200 flex items-center gap-2 font-mono">
                    <Workflow className="w-5 h-5 text-zinc-400" />
                    Quick Action Assistant
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium leading-relaxed font-sans">Optimize and configure active schema metadata instantly via our dynamic parameters editor.</p>
                </div>

                <div className="space-y-4 pt-4">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2.5 py-3 bg-[#0a0a0f] border border-zinc-800 text-zinc-200 hover:text-white text-sm font-extrabold rounded-xl transition-all active:scale-[0.98] font-mono tracking-wider shadow-lg shadow-white/5"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Create Dynamic Campaign
                  </button>
                  
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 space-y-2">
                    <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest block font-mono">Deployment Information</span>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed font-mono font-sans font-medium">
                      All additions are stored as relational parameters, instantly refreshing active tables, calendar blocks, and statuses.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- DYNAMIC CAMPAIGN GRID --- */}
        {activeTab === 'list' && (
          <div className="space-y-8 animate-in fade-in duration-300 font-sans">
            {types.map((currentType) => {
              const typeProjects = filteredProjects.filter(p => p.type === currentType.name);
              const isCollapsed = collapsedCategories[currentType.name] || false;
              const typeStyle = typeColorMap[currentType.name] || STYLING_PRESETS.zinc;
              
              return (
                <div 
                  key={currentType.name} 
                  className="bg-[#0a0a0f] rounded-2xl border border-zinc-800 p-5 space-y-5 shadow-sm"
                >
                  <div 
                    onClick={() => toggleCollapse(currentType.name)}
                    className="flex items-center justify-between px-2 cursor-pointer select-none hover:opacity-85 transition-opacity"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full inline-block ${typeStyle.classes.includes('text-') ? typeStyle.classes.split(' ').find(c => c.startsWith('text-')) : 'bg-zinc-500'}`}></span>
                      <h3 className="text-sm font-extrabold tracking-widest uppercase text-zinc-300 font-mono">
                        {currentType.name} Deliverables ({typeProjects.length})
                      </h3>
                    </div>

                    <div className="flex items-center gap-2.5 text-zinc-500">
                      <span className="text-[10px] uppercase font-bold tracking-widest font-mono">
                        {isCollapsed ? 'Expand List' : 'Collapse List'}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-0'}`} />
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className="bg-zinc-955 rounded-xl border border-zinc-800 overflow-x-auto shadow-inner">
                      <div className="min-w-[1700px]">
                        {/* Headers */}
                        <div className="grid grid-cols-[100px_130px_130px_200px_90px_320px_120px_100px_85px_85px_85px_155px_110px] gap-4 p-4 bg-zinc-900/40 border-b border-zinc-800 text-[11px] uppercase tracking-widest font-extrabold text-zinc-500 font-mono">
                          <div>Day Added</div>
                          <div>Type</div>
                          <div>Campaign</div>
                          <div>Purpose</div>
                          <div className="text-center">Priority</div>
                          <div className="pl-6">Title Project Campaign</div>
                          <div>Assignee</div>
                          <div>By</div>
                          <div className="text-center">Script</div>
                          <div className="text-center">Raw</div>
                          <div className="text-center">Edit</div>
                          <div>Notes</div>
                          <div className="text-center">Overall (Status)</div>
                        </div>

                        {/* Row items */}
                        <div className="divide-y divide-zinc-800/60 font-sans">
                          {typeProjects.length === 0 ? (
                            <div className="p-10 text-center text-zinc-500 text-sm font-medium italic font-mono">
                              No {currentType.name} tasks scheduled in this layout partition.
                            </div>
                          ) : (
                            typeProjects.map((p) => {
                              const pTypeStyle = typeColorMap[p.type] || STYLING_PRESETS.zinc;
                              const pCampStyle = campaignColorMap[p.campaign] || STYLING_PRESETS.zinc;
                              const pStageStyle = stageColorMap[p.overall] || STYLING_PRESETS.zinc;
                              return (
                                <div 
                                  key={p.id}
                                  className="grid grid-cols-[100px_130px_130px_200px_90px_320px_120px_100px_85px_85px_85px_155px_110px] gap-4 p-4 items-center hover:bg-zinc-900/50 transition-colors text-sm text-zinc-300"
                                >
                                  {/* 1. Day Added */}
                                  <div className="font-mono font-medium text-zinc-400">
                                    <input 
                                      type="date" 
                                      value={p.dayAdded} 
                                      onChange={(e) => handleUpdateField(p.id, 'dayAdded', e.target.value)}
                                      className="bg-transparent text-zinc-300 border-none hover:bg-zinc-800/80 px-2 py-1 rounded w-full focus:outline-none focus:bg-zinc-800 font-mono transition-colors"
                                    />
                                  </div>

                                  {/* 2. Type */}
                                  <div>
                                    <select
                                      value={p.type}
                                      onChange={(e) => handleUpdateField(p.id, 'type', e.target.value)}
                                      className={`bg-transparent border-none hover:bg-zinc-800/80 px-2 py-1 rounded w-full focus:outline-none focus:bg-zinc-800 cursor-pointer font-mono font-bold tracking-wide ${pTypeStyle?.classes || ''}`}
                                    >
                                      {types.map(t => (
                                        <option key={t.name || ''} value={t.name || ''} className="bg-zinc-950 text-zinc-300">{t.name || ''}</option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* 3. Campaign */}
                                  <div>
                                    <select
                                      value={p.campaign || ''}
                                      onChange={(e) => handleUpdateField(p.id, 'campaign', e.target.value)}
                                      className={`bg-transparent border-none hover:bg-zinc-800/80 px-2 py-1 rounded w-full focus:outline-none focus:bg-zinc-800 cursor-pointer font-mono font-bold tracking-wide ${pCampStyle?.classes || ''}`}
                                    >
                                      <option value="" className="bg-zinc-950 text-zinc-400 font-sans">None</option>
                                      {campaigns.map(c => (
                                        <option key={c.name || ''} value={c.name || ''} className="bg-zinc-950 text-zinc-300">{c.name || ''}</option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* 4. Purpose */}
                                  <div>
                                    <input 
                                      type="text" 
                                      value={p.purpose || ''} 
                                      onChange={(e) => handleUpdateField(p.id, 'purpose', e.target.value)}
                                      placeholder="Add purpose..."
                                      className="bg-transparent text-[#e4e4e7] font-medium border-none hover:bg-zinc-800/80 focus:bg-zinc-800 px-2.5 py-1 rounded w-full focus:outline-none truncate transition-colors font-sans"
                                    />
                                  </div>

                                  {/* 5. Priority */}
                                  <div className="text-center font-mono">
                                    <select
                                      value={p.priority || ''}
                                      onChange={(e) => handleUpdateField(p.id, 'priority', e.target.value)}
                                      className={`bg-transparent font-extrabold border-none text-center hover:bg-zinc-800/80 focus:bg-zinc-800 px-2 py-1 rounded w-full focus:outline-none cursor-pointer tracking-wide transition-colors ${
                                        p.priority === 'High' ? 'text-red-400' :
                                        p.priority === 'Medium' ? 'text-amber-500' : 'text-zinc-500'
                                      }`}
                                    >
                                      {priorities.map(prio => (
                                        <option key={prio || ''} value={prio || ''} className="bg-[#09090e] text-zinc-300 font-sans">{prio || ''}</option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* 6. Title */}
                                  <div className="flex items-center gap-2">
                                    <span className="p-1.5 bg-zinc-800/80 hover:bg-zinc-700 rounded-lg cursor-pointer shrink-0 transition-colors" onClick={() => setSelectedProject(p)}>
                                      <Play className="w-3 h-3 text-zinc-300 hover:text-white" />
                                    </span>
                                    <input 
                                      type="text" 
                                      value={p.title || ''} 
                                      onChange={(e) => handleUpdateField(p.id, 'title', e.target.value)}
                                      className="bg-transparent text-zinc-100 font-bold border-none hover:bg-zinc-800/80 focus:bg-zinc-800 px-2.5 py-1 rounded w-full focus:outline-none transition-colors"
                                    />
                                  </div>

                                  {/* 7. Assignee */}
                                  <div>
                                    <input 
                                      type="text" 
                                      value={p.assignee || ''} 
                                      onChange={(e) => handleUpdateField(p.id, 'assignee', e.target.value)}
                                      placeholder="Unassigned"
                                      className="bg-transparent text-[#e4e4e7] font-medium border-none hover:bg-zinc-800/80 focus:bg-zinc-800 px-2.5 py-1 rounded w-full focus:outline-none truncate transition-colors"
                                    />
                                  </div>

                                  {/* 8. By */}
                                  <div className="font-mono text-xs font-medium text-zinc-500">
                                    <input 
                                      type="text" 
                                      value={p.by || ''} 
                                      onChange={(e) => handleUpdateField(p.id, 'by', e.target.value)}
                                      placeholder="Requester..."
                                      className="bg-transparent text-zinc-500 border-none hover:bg-zinc-800/80 focus:bg-zinc-800 px-2.5 py-1 rounded w-full focus:outline-none truncate transition-colors"
                                    />
                                  </div>

                                  {/* 9. Script */}
                                  <div className="text-center font-sans">
                                    {p.script ? (
                                      <a 
                                        href={p.script} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-200 hover:text-white transition-all text-[11px] font-bold font-mono w-full justify-center shadow-sm"
                                      >
                                        <FileText className="w-3.5 h-3.5 text-zinc-400" />
                                        Script
                                      </a>
                                    ) : (
                                      <button 
                                        onClick={() => setSelectedProject(p)}
                                        className="text-[11px] font-bold font-mono text-zinc-600 hover:text-zinc-400 w-full text-center py-1.5 border border-dashed border-zinc-700 rounded-md hover:border-zinc-500 transition-colors"
                                      >
                                        + Link
                                      </button>
                                    )}
                                  </div>

                                  {/* 10. Raw */}
                                  <div className="text-center font-sans">
                                    {p.raw ? (
                                      <a 
                                        href={p.raw} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-200 hover:text-white transition-all text-[11px] font-bold font-mono w-full justify-center shadow-sm"
                                      >
                                        <Layers className="w-3.5 h-3.5 text-zinc-400" />
                                        Raw
                                      </a>
                                    ) : (
                                      <button 
                                        onClick={() => setSelectedProject(p)}
                                        className="text-[11px] font-bold font-mono text-zinc-600 hover:text-zinc-400 w-full text-center py-1.5 border border-dashed border-zinc-700 rounded-md hover:border-zinc-500 transition-colors"
                                      >
                                        + Link
                                      </button>
                                    )}
                                  </div>

                                  {/* 11. Edit */}
                                  <div className="text-center font-sans">
                                    {p.edit ? (
                                      <a 
                                        href={p.edit} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-200 hover:text-white transition-all text-[11px] font-bold font-mono w-full justify-center shadow-sm"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                                        Edit
                                      </a>
                                    ) : (
                                      <button 
                                        onClick={() => setSelectedProject(p)}
                                        className="text-[11px] font-bold font-mono text-zinc-600 hover:text-zinc-400 w-full text-center py-1.5 border border-dashed border-zinc-700 rounded-md hover:border-zinc-500 transition-colors"
                                      >
                                        + Link
                                      </button>
                                    )}
                                  </div>

                                  {/* 12. Notes */}
                                  <div>
                                    <input 
                                      type="text" 
                                      value={p.notes || ''} 
                                      onChange={(e) => handleUpdateField(p.id, 'notes', e.target.value)}
                                      placeholder="Annotations..."
                                      className="bg-transparent text-zinc-400 font-medium border-none hover:bg-zinc-800/80 focus:bg-zinc-800 px-2.5 py-1 rounded w-full focus:outline-none truncate transition-colors font-sans"
                                    />
                                  </div>

                                  {/* 13. Overall */}
                                  <div className="text-center font-mono">
                                    <select
                                      value={p.overall}
                                      onChange={(e) => handleUpdateField(p.id, 'overall', e.target.value)}
                                      className={`bg-transparent border-none text-center hover:bg-zinc-800/80 focus:bg-zinc-800 px-2 py-1.5 rounded-md w-full focus:outline-none cursor-pointer font-mono font-bold tracking-wide text-[11px] transition-colors ${pStageStyle?.classes || ''}`}
                                    >
                                      {stages.map(stage => (
                                        <option key={stage.id || ''} value={stage.id || ''} className="bg-zinc-950 text-zinc-300">
                                          {stage.name || ''}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* --- KANBAN BOARD VIEW (DYNAMIC COLUMNS) --- */}
        {activeTab === 'board' && (
          <div className="flex gap-6 min-w-[2400px] h-[calc(100vh-220px)] pb-4 select-none animate-in fade-in duration-300 font-sans">
            {stages.map((stage) => {
              const stageProjects = filteredProjects.filter(p => p.overall === stage.id);
              const stageStyle = stageColorMap[stage.id] || STYLING_PRESETS.zinc;
              
              return (
                <div 
                  key={stage.id} 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                  className="flex-1 flex flex-col bg-[#0a0a0f] rounded-2xl border border-zinc-800 overflow-hidden shadow-sm"
                >
                  <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full inline-block ${(stageStyle?.classes || '').includes('text-') ? stageStyle.classes.split(' ').find(c => c.startsWith('text-')) : 'bg-zinc-400'}`}></span>
                      <h3 className="font-extrabold text-xs tracking-widest uppercase text-zinc-200 font-mono">{stage.name}</h3>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0e0e15] border border-zinc-800 text-zinc-400 font-bold">
                      {stageProjects.length}
                    </span>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto space-y-4">
                    {stageProjects.length === 0 ? (
                      <div className="h-24 rounded-xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center p-4 text-center text-zinc-600">
                        <p className="text-[10px] uppercase tracking-widest font-extrabold font-mono">Drag Task Here</p>
                      </div>
                    ) : (
                      stageProjects.map((p) => {
                        const typeStyle = typeColorMap[p.type] || STYLING_PRESETS.zinc;
                        const campStyle = campaignColorMap[p.campaign] || STYLING_PRESETS.zinc;

                        return (
                          <div
                            key={p.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, p.id)}
                            onClick={() => {
                              setSelectedProject(p);
                              setVideoTime(0);
                            }}
                            className="p-5 bg-[#0e0e15] hover:bg-zinc-900/80 border border-zinc-800/80 rounded-xl transition-all cursor-pointer group hover:border-zinc-600 relative shadow-md"
                          >
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase font-mono tracking-widest border ${typeStyle?.classes || ''}`}>
                                  {p.type}
                                </span>
                                {p.campaign && (
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase font-mono tracking-widest border ${campStyle?.classes || ''}`}>
                                    {p.campaign}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-bold text-zinc-100 group-hover:text-white leading-relaxed line-clamp-3 font-sans">{p.title}</h4>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- MONTHLY CALENDAR VIEW --- */}
        {activeTab === 'calendar' && (
          <div className="bg-[#0a0a0f] rounded-2xl border border-zinc-800 p-8 animate-in fade-in duration-300 space-y-8 shadow-sm max-w-7xl mx-auto">
            
            {/* Calendar Controls & Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-200 flex items-center gap-2.5 font-mono">
                  <CalendarIcon className="w-5 h-5 text-zinc-400 font-sans" />
                  {calendarMode === 'production' ? (
                    `WEEK OF ${calendarWeekDays[0]?.label} - ${calendarWeekDays[6]?.label}, ${calendarDate.getFullYear()} (PRODUCTION HOURLY PLANNER)`
                  ) : (
                    `${calendarDate.toLocaleString('default', { month: 'long' })} ${calendarDate.getFullYear()} Campaign Calendar`
                  )}
                </h2>
                <p className="text-xs text-zinc-500 mt-1 font-sans">Schedules automatically adjust. Drag card segments freely to reschedule dates and hours.</p>
              </div>

              <div className="flex items-center gap-2 bg-[#050507] p-1.5 rounded-xl border border-zinc-800 shadow-inner font-mono">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors" title={calendarMode === 'production' ? "Previous Week" : "Previous Month"}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={handleToday} className="px-4 py-2 text-[10px] font-bold font-mono tracking-widest uppercase text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                  Today
                </button>
                <button onClick={handleNextMonth} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors" title={calendarMode === 'production' ? "Next Week" : "Next Month"}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* --- SUB-CALENDAR DISPATCH SWITCHER TABS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-zinc-900 pb-6">
              
              {/* 1. Production Mode Tab */}
              <button
                onClick={() => setCalendarMode('production')}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all text-zinc-100 ${
                  calendarMode === 'production'
                    ? 'bg-[#181825]/60 border-indigo-500/50 shadow-md shadow-indigo-500/5'
                    : 'bg-[#09090d]/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${calendarMode === 'production' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-900 text-zinc-400'}`}>
                    <Film className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-400 block font-extrabold">MODE 01</span>
                    <span className="text-xs font-black text-zinc-100 font-sans">Production Shoots</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                  {projects.filter(p => !p.isArchived && p.shootTime).length} Active
                </span>
              </button>

              {/* 2. SocMed Posts Mode Tab */}
              <button
                onClick={() => setCalendarMode('socmed')}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all text-zinc-100 ${
                  calendarMode === 'socmed'
                    ? 'bg-[#251821]/60 border-fuchsia-500/50 shadow-md shadow-fuchsia-500/5'
                    : 'bg-[#09090d]/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${calendarMode === 'socmed' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-zinc-900 text-zinc-400'}`}>
                    <Smartphone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-400 block font-extrabold">MODE 02</span>
                    <span className="text-xs font-black text-zinc-101 font-sans">SocMed Publish Schedule</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                  {projects.filter(p => !p.isArchived && p.socMedPlatform).length} Scheduled
                </span>
              </button>

              {/* 3. Running Paid Ads Mode Tab */}
              <button
                onClick={() => setCalendarMode('ads')}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all text-zinc-100 ${
                  calendarMode === 'ads'
                    ? 'bg-[#18251e]/60 border-emerald-500/50 shadow-md shadow-emerald-500/5'
                    : 'bg-[#09090d]/60 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${calendarMode === 'ads' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-900 text-zinc-400'}`}>
                    <Megaphone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-400 block font-extrabold">MODE 03</span>
                    <span className="text-xs font-black text-zinc-101 font-sans">Live Traffic Campaigns</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300">
                  {projects.filter(p => !p.isArchived && p.adPlatforms && p.adPlatforms.length > 0).length} Slots Live
                </span>
              </button>

            </div>

            {/* PLATFORMS SUB-FILTERS & PIPELINE CONTROL BAR */}
            <div className="bg-[#050507] border border-zinc-900 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 font-mono">
              
              {/* Render controls aligned to active sub-calendar choice */}
              {calendarMode === 'production' && (
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400 font-extrabold">⚡ DRAG BACKLOG ITEMS FROM LEFT SIDEBAR ONTO TIMELINE ROWS BELOW:</span>
                </div>
              )}

              {calendarMode === 'socmed' && (
                <div className="flex items-center gap-3 font-sans">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">Social Channel:</span>
                  <div className="flex flex-wrap gap-1.5 font-sans">
                    {['All', 'YouTube', 'Instagram', 'TikTok', 'Facebook'].map(plat => (
                      <button
                        key={plat}
                        onClick={() => setSocMedPlatformFilter(plat)}
                        className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all ${
                          socMedPlatformFilter === plat
                            ? 'bg-fuchsia-600 text-white'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        {plat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {calendarMode === 'ads' && (
                <div className="flex items-center gap-3 font-sans">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">Traffic Source:</span>
                  <div className="flex flex-wrap gap-1.5 font-sans">
                    {['All', 'Facebook Ads', 'Instagram Ads', 'YouTube Ads', 'TikTok Ads', 'Google Ads'].map(adPlat => (
                      <button
                        key={adPlat}
                        onClick={() => setAdPlatformFilter(adPlat)}
                        className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all ${
                          adPlatformFilter === adPlat
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        {adPlat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Status Legend */}
              <div className="text-[11px] font-mono font-semibold text-zinc-500 flex items-center gap-2 font-sans font-sans font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block animate-pulse"></span>
                {calendarMode === 'production' && "Crew camera schedules with hourly timing logs"}
                {calendarMode === 'socmed' && "Target publish times, platform previews & annotations"}
                {calendarMode === 'ads' && "Active bid routes & active continuous run variables"}
              </div>
            </div>

            {/* --- CALENDAR RENDER CONTAINER --- */}
            {calendarMode === 'production' ? (
              // Weekly Shoot Schedule View
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* BACKLOG PANEL (LEFT SIDEBAR) */}
                <div className="lg:col-span-3 bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-zinc-900 font-sans">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-300 font-mono font-sans font-sans">Unscheduled Backlog ({unscheduledProjectsBacklog.length})</h3>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed font-sans font-sans">
                    Drag any campaign block from this backlog onto a day and hour row cell on the scheduler timeline grid.
                  </p>

                  <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1 font-sans font-sans">
                    {unscheduledProjectsBacklog.length === 0 ? (
                      <div className="p-6 text-center text-xs text-zinc-600 border border-dashed border-zinc-800 rounded-lg italic font-sans font-sans">
                        No unscheduled backlogs.
                      </div>
                    ) : (
                      unscheduledProjectsBacklog.map(p => (
                        <div
                          key={p.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, p.id)}
                          className="p-3 bg-[#0a0a0f] hover:bg-[#111118] border border-zinc-800 rounded-lg cursor-grab active:cursor-grabbing transition-all space-y-1.5 shadow"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-400 font-bold font-mono">
                              {p.type}
                            </span>
                            <span className={`w-2 h-2 rounded-full ${p.priority === 'High' ? 'bg-red-500' : 'bg-zinc-600'}`}></span>
                          </div>
                          <h4 className="text-xs font-bold text-zinc-200 line-clamp-1">{p.title}</h4>
                          <p className="text-[10px] text-zinc-500 line-clamp-2">{p.purpose}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* TIMELINE SCHEDULER */}
                <div className="lg:col-span-9 bg-zinc-950 p-5 rounded-xl border border-zinc-900 overflow-x-auto shadow-inner">
                  <div className="min-w-[850px] relative font-sans">
                    
                    {/* Time Schedule Headers */}
                    <div className="grid grid-cols-8 border-b border-zinc-900 pb-3 mb-2 text-center">
                      <div className="text-[10px] font-mono font-extrabold uppercase text-zinc-500">Hour</div>
                      {calendarWeekDays.map((dayCell, idx) => {
                        const isToday = dayCell.fullDate === '2026-06-08'; 
                        return (
                          <div key={idx} className="flex flex-col items-center">
                            <span className={`text-[10px] font-mono uppercase tracking-widest font-extrabold ${isToday ? 'text-indigo-400' : 'text-zinc-500'}`}>
                              {dayCell.label.split(',')[0]}
                            </span>
                            <span className={`text-sm font-black ${isToday ? 'text-white' : 'text-zinc-300'}`}>
                              {dayCell.label.split(',')[1]}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Hourly scheduler rows */}
                    <div className="space-y-0.5 font-mono">
                      {VERTICAL_CALENDAR_HOURS.map((hourDecimal) => {
                        const label = hourDecimal >= 12 ? `${hourDecimal === 12 ? 12 : hourDecimal - 12} PM` : `${hourDecimal} AM`;

                        return (
                          <div key={hourDecimal} className="grid grid-cols-8 items-stretch h-[80px]">
                            
                            {/* Left Time ruler label */}
                            <div className="text-[10px] font-mono font-black text-zinc-500 flex items-center justify-center border-r border-zinc-900 bg-zinc-955/40 font-sans">
                              {label}
                            </div>

                            {/* 7 Columns representation for this specific hour */}
                            {calendarWeekDays.map((dayCell, idx) => {
                              // Filter shoots starting at this exact hour on this day
                              const startingShoots = projects.filter(p => {
                                if (p.isArchived || p.dayAdded !== dayCell.fullDate) return false;
                                const decimal = parseTimeToDecimal(p.shootTime);
                                return decimal !== null && Math.floor(decimal) === hourDecimal;
                              });

                              return (
                                <div
                                  key={idx}
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => handleHourlyShootDrop(e, dayCell.fullDate, hourDecimal)}
                                  className="border-r border-b border-zinc-900 p-1 bg-zinc-950/20 hover:bg-[#11111a]/40 transition-colors relative flex flex-col justify-start group"
                                  title={`Schedule shoot on ${dayCell.label} at ${label}`}
                                >
                                  {/* Plus icon on hover */}
                                  <button
                                    onClick={() => {
                                      setNewDayAdded(dayCell.fullDate);
                                      setNewOverall('Shooting');
                                      const formattedTime = formatDecimalToTime(hourDecimal);
                                      setNewNotes(`Shoot scheduled at ${formattedTime}`);
                                      setIsCreateModalOpen(true);
                                    }}
                                    className="absolute top-1 right-1 p-0.5 bg-zinc-900 border border-zinc-800 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                  >
                                    <Plus className="w-3 h-3 text-zinc-400 hover:text-white" />
                                  </button>

                                  {/* Render shoot cards scheduled inside this block */}
                                  {startingShoots.map(p => {
                                    const shootDur = p.shootDuration || 1;
                                    
                                    const cardHeightStyle = {
                                      height: `calc(${shootDur} * 80px - 8px)`,
                                      zIndex: 10
                                    };

                                    return (
                                      <div
                                        key={p.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, p.id)}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedProject(p);
                                        }}
                                        style={cardHeightStyle}
                                        className="absolute top-1 left-1 right-1 p-2 bg-[#10101c] border border-indigo-500/40 rounded-lg hover:border-indigo-400 hover:bg-[#15152a] transition-all cursor-grab active:cursor-grabbing flex flex-col justify-between shadow-lg text-left"
                                      >
                                        <div className="space-y-1">
                                          <div className="flex justify-between items-center gap-1 font-mono">
                                            <div className="flex items-center gap-1 truncate font-sans">
                                              <span className="text-zinc-500 select-none">⋮⋮</span>
                                              <span className="text-[9px] font-black font-mono text-indigo-300">
                                                {p.shootTime} - {formatDecimalToTime(parseTimeToDecimal(p.shootTime) + shootDur)}
                                              </span>
                                            </div>
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                          </div>
                                          <h4 className="text-[10px] font-extrabold text-zinc-101 leading-tight truncate">
                                            {p.title}
                                          </h4>
                                          <p className="text-[8px] text-zinc-500 font-sans line-clamp-1">
                                            {p.shootDetails || 'Call sheet details unwritten.'}
                                          </p>
                                        </div>

                                        {/* Dynamic Duration Incrementor Control Row */}
                                        <div className="flex items-center justify-between pt-1 border-t border-zinc-900 font-mono">
                                          <div className="flex items-center gap-1 bg-[#09090e] p-0.5 rounded border border-zinc-800 font-sans">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleModifyShootDuration(p.id, 'decrement');
                                              }}
                                              className="px-1 py-0.2 hover:bg-zinc-800 text-[9px] font-bold text-zinc-400 hover:text-white font-mono rounded"
                                              title="Shrink Shoot Block duration by 1 Hour"
                                            >
                                              -
                                            </button>
                                            <span className="text-[8px] font-black text-zinc-300 px-1 font-mono font-sans">{shootDur}h</span>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleModifyShootDuration(p.id, 'increment');
                                              }}
                                              className="px-1 py-0.2 hover:bg-zinc-800 text-[9px] font-bold text-zinc-400 hover:text-white font-mono rounded"
                                              title="Stretch Shoot Block duration by 1 Hour"
                                            >
                                              +
                                            </button>
                                          </div>
                                          <span className="text-[8px] text-zinc-500 truncate max-w-[50px] font-mono">
                                            {p.assignee ? p.assignee.split(' ')[0] : 'No crew'}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}

                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

              </div>
            ) : calendarMode === 'ads' ? (
              // Media Buyer Timeline (Gantt Chart View) for Active Ads
              <div className="bg-[#0e0e15] rounded-xl border border-zinc-900 overflow-x-auto shadow-inner animate-in fade-in duration-500 font-sans font-sans">
                <div className="min-w-[1100px] relative">
                  
                  {/* Timeline Header */}
                  <div className="flex border-b border-zinc-900 bg-[#0a0a0f] sticky top-0 z-20 font-mono">
                    <div className="w-[320px] shrink-0 p-4 border-r border-zinc-900 flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-zinc-500 font-mono">Live Ad Pipelines</span>
                      <span className="text-[9px] font-extrabold text-emerald-500 font-mono bg-emerald-950/30 border border-emerald-900/50 px-2 py-1 rounded shadow-sm">Media Buyer Gantt</span>
                    </div>
                    <div className="flex-1 flex font-mono">
                      {adsTimelineDays.map(day => (
                        <div key={day.dayNum} className={`flex-1 min-w-[35px] border-r border-zinc-900/50 flex flex-col items-center justify-center py-2.5 ${day.isWeekend ? 'bg-zinc-900/20' : ''}`}>
                          <span className="text-[9px] font-bold text-zinc-600 uppercase font-mono">{day.shortDay}</span>
                          <span className={`text-xs font-black font-mono mt-0.5 ${day.fullDate === '2026-06-08' ? 'text-emerald-400 bg-emerald-955/40 w-6 h-6 flex items-center justify-center rounded-full ring-1 ring-emerald-500/50' : 'text-zinc-400'}`}>
                            {day.dayNum}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Timeline Rows */}
                  <div className="divide-y divide-zinc-900/80 pb-6 font-sans">
                    {(() => {
                       const monthStartStr = adsTimelineDays[0].fullDate;
                       const monthEndStr = adsTimelineDays[adsTimelineDays.length - 1].fullDate;

                       const adProjects = projects.filter(p => {
                         if (p.isArchived) return false;
                         if (!p.adPlatforms || p.adPlatforms.length === 0) return false;
                         
                         const matchesStage = calendarStageFilter === 'All' || p.overall === calendarStageFilter;
                         const matchesSearch = (p.title || '').toLowerCase().includes((searchQuery || '').toLowerCase()) || 
                                               (p.purpose || '').toLowerCase().includes((searchQuery || '').toLowerCase());
                         const matchesType = typeFilter === 'All' || p.type === typeFilter;
                         const matchesCampaign = campaignFilter === 'All' || p.campaign === campaignFilter;
                         const matchesPriority = priorityFilter === 'All' || p.priority === priorityFilter;

                         if (!matchesStage || !matchesSearch || !matchesType || !matchesCampaign || !matchesPriority) {
                           return false;
                         }
                         
                         if (adPlatformFilter !== 'All' && !p.adPlatforms.includes(adPlatformFilter)) return false;

                         const startStr = p.adStartDate || p.dayAdded;
                         const endStr = p.adEndDate || startStr;
                         if (endStr < monthStartStr || startStr > monthEndStr) return false;

                         return true;
                       });

                       if (adProjects.length === 0) {
                         return <div className="p-16 text-center text-zinc-600 font-mono text-sm italic border-dashed border-2 border-zinc-900 m-4 rounded-xl flex items-center justify-center gap-3"><AlertCircle className="w-5 h-5"/> No active ad campaigns span across this month.</div>;
                       }

                       return adProjects.map(p => {
                          const startStr = p.adStartDate || p.dayAdded;
                          const endStr = p.adEndDate || startStr;
                          
                          let startIndex = adsTimelineDays.findIndex(d => d.fullDate === startStr);
                          let endIndex = adsTimelineDays.findIndex(d => d.fullDate === endStr);
                          
                          let isCutLeft = false;
                          let isCutRight = false;
                          
                          if (startIndex === -1 && startStr < monthStartStr) { startIndex = 0; isCutLeft = true; }
                          if (endIndex === -1 && endStr > monthEndStr) { endIndex = adsTimelineDays.length - 1; isCutRight = true; }
                          
                          const leftPercent = (startIndex / adsTimelineDays.length) * 100;
                          const widthPercent = ((endIndex - startIndex + 1) / adsTimelineDays.length) * 100;

                          return (
                            <div key={p.id} className="flex group hover:bg-zinc-900/30 transition-colors cursor-pointer font-sans" onClick={() => setSelectedProject(p)}>
                              
                              {/* Left Meta Info */}
                              <div className="w-[320px] shrink-0 p-4 border-r border-zinc-900 flex flex-col justify-center gap-1.5 bg-[#0a0a0f] z-10">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="text-sm font-bold text-[#e4e4e7] line-clamp-1 group-hover:text-emerald-400 transition-colors">{p.title}</h4>
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                </div>
                                <p className="text-[10px] text-zinc-500 line-clamp-1 font-sans font-medium">{p.purpose}</p>
                                <div className="flex items-center gap-2 mt-1.5 font-mono">
                                  <span className="text-[9px] px-1.5 py-0.5 rounded border border-emerald-900/40 bg-emerald-950/30 text-emerald-400 uppercase truncate max-w-[140px] tracking-wider">{p.adPlatforms.join(', ')}</span>
                                  <span className="text-[9px] text-zinc-500 font-mono font-bold bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 tracking-widest shrink-0">
                                    {startStr.substring(5).replace('-','/')} → {endStr.substring(5).replace('-','/')}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Gantt Bar Area */}
                              <div className="flex-1 relative flex">
                                {adsTimelineDays.map(day => (
                                  <div key={day.dayNum} className={`flex-1 border-r border-zinc-900/50 ${day.isWeekend ? 'bg-zinc-900/10' : ''}`} />
                                ))}
                                
                                {/* Dynamic Campaign Ribbon */}
                                <div className="absolute top-2.5 bottom-2.5 z-10 py-1" style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}>
                                  <div className={`w-full h-full bg-emerald-500/10 border border-emerald-500/50 flex items-center px-3 shadow-[0_0_15px_rgba(16,185,129,0.05)] overflow-hidden group-hover:bg-emerald-500/20 group-hover:border-emerald-400 transition-colors
                                     ${isCutLeft ? 'rounded-l-none border-l-0' : 'rounded-l-lg'} 
                                     ${isCutRight ? 'rounded-r-none border-r-0' : 'rounded-r-lg'}
                                  `}>
                                    <span className="text-[10px] font-black text-emerald-300 font-mono uppercase truncate tracking-widest drop-shadow-md font-mono">
                                      {p.adTime || 'Continuous Run'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                       });
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              // Monthly Release View for SocMed Campaigns
              <>
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold font-mono uppercase tracking-widest text-zinc-500 mb-3">
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>

                {/* Rescheduling Grid */}
                <div className="grid grid-cols-7 gap-3 min-h-[600px] font-mono">
                  {calendarDays.map((cell, idx) => {
                    const dayProjects = projects.filter(p => {
                      const matchesDate = p.dayAdded === cell.fullDate;
                      const matchesStage = calendarStageFilter === 'All' || p.overall === calendarStageFilter;
                      const matchesSearch = (p.title || '').toLowerCase().includes((searchQuery || '').toLowerCase()) || 
                                            (p.purpose || '').toLowerCase().includes((searchQuery || '').toLowerCase());
                      const matchesType = typeFilter === 'All' || p.type === typeFilter;
                      const matchesCampaign = campaignFilter === 'All' || p.campaign === campaignFilter;
                      const matchesPriority = priorityFilter === 'All' || p.priority === priorityFilter;

                      if (!matchesStage || !matchesSearch || !matchesType || !matchesCampaign || !matchesPriority) {
                        return false;
                      }

                      if (calendarMode === 'socmed') {
                        if (p.dayAdded !== cell.fullDate) return false;
                        if (socMedPlatformFilter !== 'All' && p.socMedPlatform !== socMedPlatformFilter) return false;
                      } else {
                        if (p.dayAdded !== cell.fullDate) return false;
                      }

                      return true;
                    });

                    return (
                      <div
                        key={idx}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleCalendarDrop(e, cell.fullDate)}
                        className={`min-h-[110px] p-3 rounded-xl border transition-all flex flex-col justify-between ${
                          cell.isCurrentMonth 
                            ? 'bg-zinc-950 border-zinc-800/80 shadow-sm' 
                            : 'bg-transparent border-transparent text-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                          <span className={`text-[11px] font-bold font-mono ${cell.isCurrentMonth ? 'text-zinc-400' : 'text-zinc-800'}`}>
                            {cell.dayNum}
                          </span>
                        </div>

                        <div className="flex-1 mt-2 space-y-2 flex flex-col justify-end font-sans">
                          {dayProjects.map(p => {
                            let dynamicBorderColor = 'border-fuchsia-900/60 hover:border-fuchsia-500';
                            let dynamicBadgeBackground = 'bg-[#251821]/80 text-fuchsia-300';
                            let dynamicBorderRadius = 'rounded-lg';

                            return (
                              <div
                                key={p.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, p.id)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProject(p);
                                }}
                                className={`p-2 text-[9px] border cursor-grab active:cursor-grabbing transition-all font-mono truncate flex flex-col gap-1 select-none shadow-sm hover:brightness-110 ${dynamicBorderColor} ${dynamicBadgeBackground} ${dynamicBorderRadius}`}
                                title={`Drag to reschedule: ${p.title}`}
                              >
                                <div className="flex items-center gap-1.5 w-full">
                                  <span className="text-zinc-500 shrink-0 font-extrabold select-none text-[8px] font-mono font-mono">⋮⋮</span>
                                  <span className="truncate font-sans font-bold w-full text-zinc-100">{p.title}</span>
                                </div>
                                
                                {calendarMode === 'socmed' && p.socMedPlatform && (
                                  <div className="mt-1 space-y-0.5">
                                    <span className="text-[9px] font-extrabold uppercase text-fuchsia-400 block font-mono">📱 {p.socMedPlatform}: {p.postTime || 'TBD'}</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* --- OVERLAY MODALS AND CABINET DRAWERS --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex justify-end font-sans">
          <div className="w-full max-w-4xl h-full bg-[#0a0a0f] border-l border-zinc-800 flex flex-col overflow-y-auto p-8 md:p-10 animate-in slide-in-from-right duration-300 shadow-2xl">
            
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-extrabold tracking-widest px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 uppercase font-mono shadow-sm">
                  {selectedProject.type} Format
                </span>
                <span className="text-xs text-zinc-500 font-bold font-mono">ID: {selectedProject.id}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setIsPlaying(false);
                }}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 text-xs font-bold transition-all font-mono focus:outline-none shadow-sm"
              >
                CLOSE ✕
              </button>
            </div>

            {/* Stage Selector header */}
            <div className="bg-[#0e0e15] rounded-2xl p-5 border border-zinc-800 mb-8 flex flex-col gap-5 sm:flex-row sm:items-center justify-between shadow-sm">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest block font-mono mb-1.5">Overall Task Status</span>
                <div className="flex flex-wrap gap-2">
                  {stages.map(stage => {
                    const stStyle = stageColorMap[stage.id] || STYLING_PRESETS.zinc;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => handleUpdateField(selectedProject.id, 'overall', stage.id)}
                        className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all border font-mono ${
                          selectedProject.overall === stage.id
                            ? `${stStyle?.classes || ''} border-zinc-300 ring-1 ring-zinc-500 shadow-md`
                            : 'bg-transparent text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:bg-zinc-900'
                        }`}
                      >
                        {stage.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleArchive(selectedProject.id)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:text-white border border-zinc-800 hover:bg-zinc-800/80 rounded-xl transition-all font-mono shadow-sm"
                >
                  {selectedProject.isArchived ? (
                    <><ArchiveRestore className="w-4 h-4" /> Restore</>
                  ) : (
                    <><Archive className="w-4 h-4" /> Archive</>
                  )}
                </button>
                
                {selectedProject.isArchived && (
                  <button
                    onClick={() => handleDeleteProject(selectedProject.id)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-500 hover:text-red-400 border border-red-900/30 hover:bg-red-950/20 rounded-xl transition-all font-mono shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>

            {/* Content splits */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start font-sans">
              
              {/* Left detail grid */}
              <div className="lg:col-span-5 space-y-8 font-sans">
                <div>
                  <label className="block text-[10px] uppercase font-extrabold text-zinc-500 tracking-widest mb-2 font-mono">Title</label>
                  <input
                    type="text"
                    value={selectedProject.title || ''}
                    onChange={(e) => handleUpdateField(selectedProject.id, 'title', e.target.value)}
                    className="w-full bg-[#09090e] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-zinc-600 transition-colors shadow-inner"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] uppercase font-extrabold text-zinc-500 tracking-widest font-mono font-sans">Purpose / Focus Summary</label>
                    <button
                      onClick={() => handleAiGenerateHook(selectedProject.id)}
                      disabled={aiGeneratingHook}
                      className="text-[9px] text-zinc-300 hover:text-white bg-indigo-600/20 border border-indigo-500/30 px-2.5 py-1 rounded-md font-mono font-bold flex items-center gap-1.5 transition-all font-sans"
                    >
                      {aiGeneratingHook ? <Loader2 className="w-3 h-3 animate-spin" /> : '✨ Script Hooks'}
                    </button>
                  </div>
                  <textarea
                    rows="3"
                    value={selectedProject.purpose || ''}
                    onChange={(e) => handleUpdateField(selectedProject.id, 'purpose', e.target.value)}
                    className="w-full bg-[#09090e] border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 font-medium focus:outline-none focus:border-zinc-600 resize-none leading-relaxed transition-colors shadow-inner"
                  />
                </div>

                {/* Variable fields stack */}
                <div className="bg-[#0e0e15] p-6 rounded-2xl border border-zinc-800/80 space-y-5 text-sm shadow-sm font-sans">
                  <div className="grid grid-cols-2 gap-5 font-sans">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block font-mono mb-1.5">Type Layout</span>
                      <select
                        value={selectedProject.type || ''}
                        onChange={(e) => handleUpdateField(selectedProject.id, 'type', e.target.value)}
                        className="bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-zinc-600 w-full cursor-pointer font-mono transition-colors"
                      >
                        {types.map(t => (
                          <option key={t.name || ''} value={t.name || ''} className="bg-[#09090e]">{t.name || ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block font-mono mb-1.5">Priority</span>
                      <select
                        value={selectedProject.priority || ''}
                        onChange={(e) => handleUpdateField(selectedProject.id, 'priority', e.target.value)}
                        className="bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2 text-xs font-bold text-zinc-200 focus:outline-none focus:border-zinc-600 w-full cursor-pointer font-mono transition-colors"
                      >
                        {priorities.map(prio => (
                          <option key={prio || ''} value={prio || ''} className="bg-[#09090e]">{prio || ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block font-mono mb-1.5">Campaign</span>
                      <select
                        value={selectedProject.campaign || ''}
                        onChange={(e) => handleUpdateField(selectedProject.id, 'campaign', e.target.value)}
                        className="bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-zinc-600 w-full cursor-pointer font-mono transition-colors"
                      >
                        <option value="" className="bg-[#09090e] font-mono">None</option>
                        {campaigns.map(c => (
                          <option key={c.name || ''} value={c.name || ''} className="bg-[#09090e]">{c.name || ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block font-mono mb-1.5">Day Added</span>
                      <input 
                        type="date"
                        value={selectedProject.dayAdded || ''}
                        onChange={(e) => handleUpdateField(selectedProject.id, 'dayAdded', e.target.value)}
                        className="bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 focus:outline-none focus:border-zinc-600 w-full font-mono transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-5 font-sans font-sans">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block font-mono mb-1.5">Assignee</span>
                      <input 
                        type="text"
                        value={selectedProject.assignee || ''}
                        onChange={(e) => handleUpdateField(selectedProject.id, 'assignee', e.target.value)}
                        className="bg-transparent border-b border-zinc-700 hover:border-zinc-500 focus:border-zinc-400 focus:outline-none text-zinc-200 font-medium w-full py-1 text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest block font-mono mb-1.5">By (Requester)</span>
                      <input 
                        type="text"
                        value={selectedProject.by || ''}
                        onChange={(e) => handleUpdateField(selectedProject.id, 'by', e.target.value)}
                        className="bg-transparent border-b border-zinc-700 hover:border-zinc-500 focus:border-zinc-400 focus:outline-none text-zinc-200 font-medium w-full py-1 text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-zinc-800/80 font-mono">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-mono">Script Document Link</span>
                        {selectedProject.script && (
                          <a href={selectedProject.script} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold">
                            Open <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <input 
                        type="text"
                        value={selectedProject.script || ''}
                        onChange={(e) => handleUpdateField(selectedProject.id, 'script', e.target.value)}
                        placeholder="https://"
                        className="bg-[#050507] border border-zinc-800 focus:border-zinc-600 focus:outline-none text-zinc-300 text-xs w-full py-2 rounded-lg px-3 transition-colors animate-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-mono">Raw Storage Location</span>
                        {selectedProject.raw && (
                          <a href={selectedProject.raw} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold">
                            Open <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <input 
                        type="text"
                        value={selectedProject.raw || ''}
                        onChange={(e) => handleUpdateField(selectedProject.id, 'raw', e.target.value)}
                        placeholder="Dropbox link"
                        className="bg-[#050507] border border-zinc-800 focus:border-zinc-600 focus:outline-none text-[#e4e4e7] text-xs w-full py-2 rounded-lg px-3 transition-colors animate-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-mono font-sans font-bold">Edit Preview Link</span>
                        {selectedProject.edit && (
                          <a href={selectedProject.edit} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold font-sans font-sans">
                            Open <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <input 
                        type="text"
                        value={selectedProject.edit || ''}
                        onChange={(e) => handleUpdateField(selectedProject.id, 'edit', e.target.value)}
                        placeholder="Frame.io preview"
                        className="bg-[#050507] border border-zinc-300 text-xs w-full py-2 rounded-lg px-3 transition-colors animate-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-widest font-mono font-sans font-bold font-sans">Live Ad URL (FB/IG)</span>
                        {selectedProject.adLink && (
                          <a href={selectedProject.adLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold font-sans font-sans">
                            Ads Manager <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <input 
                        type="text"
                        value={selectedProject.adLink || ''}
                        onChange={(e) => handleUpdateField(selectedProject.id, 'adLink', e.target.value)}
                        placeholder="Paste Facebook Ads link..."
                        className="bg-[#050507] border border-emerald-900/40 rounded-lg px-4 py-2.5 text-sm text-zinc-300 font-semibold focus:outline-none focus:border-emerald-600/50 transition-colors animate-none"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 font-sans">
                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest font-mono mb-2 block font-mono font-bold">Notes & Annotations</span>
                    <textarea 
                      rows="3"
                      value={selectedProject.notes || ''}
                      onChange={(e) => handleUpdateField(selectedProject.id, 'notes', e.target.value)}
                      placeholder="Special creative notes..."
                      className="bg-[#050507] border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 font-medium focus:outline-none focus:border-zinc-600 w-full resize-none transition-colors shadow-inner font-sans"
                    />
                  </div>
                </div>

                {/* --- DISPATCH SCHEDULING DISCOVERY CABINET --- */}
                <div className="bg-[#0e0e15] p-6 rounded-2xl border border-zinc-800/80 space-y-6 font-mono text-xs font-sans">
                  <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 font-mono font-sans">
                    <CalendarIcon className="w-4 h-4 text-indigo-400 font-sans" />
                    <h4 className="text-xs font-extrabold font-mono uppercase tracking-wider text-zinc-200">Sub-Calendar Dispatch Settings</h4>
                  </div>

                  {/* 1. Production Shoot Slot */}
                  <div className="space-y-3 font-sans">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block font-mono font-sans font-bold font-sans">🎥 Video Shoot Dispatch Schedule</span>
                    <div className="grid grid-cols-3">
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-1">Time of Day</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 10:00 AM"
                          value={selectedProject.shootTime || ''}
                          onChange={(e) => handleUpdateField(selectedProject.id, 'shootTime', e.target.value)}
                          className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50 font-mono transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-1">Duration (Hours)</label>
                        <input 
                          type="number" 
                          min="1"
                          max="6"
                          value={selectedProject.shootDuration || 1}
                          onChange={(e) => handleUpdateField(selectedProject.id, 'shootDuration', parseInt(e.target.value, 10) || 1)}
                          className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50 font-mono transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-1">Set location details</label>
                        <input 
                          type="text" 
                          placeholder="Scene description"
                          value={selectedProject.shootDetails || ''}
                          onChange={(e) => handleUpdateField(selectedProject.id, 'shootDetails', e.target.value)}
                          className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500/50 font-mono transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. SocMed Release Slot */}
                  <div className="space-y-3 pt-3 border-t border-zinc-900 font-sans">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-fuchsia-400 block font-mono font-sans font-bold font-sans">📱 SocMed Placement Schedule</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-1">Publish Platform</label>
                        <select
                          value={selectedProject.socMedPlatform || 'YouTube'}
                          onChange={(e) => handleUpdateField(selectedProject.id, 'socMedPlatform', e.target.value)}
                          className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-zinc-200 focus:outline-none cursor-pointer"
                        >
                          <option value="YouTube">YouTube</option>
                          <option value="Instagram">Instagram</option>
                          <option value="TikTok">TikTok</option>
                          <option value="Facebook">Facebook</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-1">Post Time</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 05:30 PM"
                          value={selectedProject.postTime || ''}
                          onChange={(e) => handleUpdateField(selectedProject.id, 'postTime', e.target.value)}
                          className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-fuchsia-500/50 font-mono transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Running Ads Slot */}
                  <div className="space-y-3 pt-3 border-t border-zinc-900 font-sans font-sans">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block font-mono font-sans font-bold font-sans font-sans font-sans">📣 Live Ads Run Slots</span>
                    
                    <div className="grid grid-cols-2 gap-3 mb-2 font-sans">
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-1">Ad Start Date</label>
                        <input 
                          type="date" 
                          value={selectedProject.adStartDate || selectedProject.dayAdded || ''}
                          onChange={(e) => handleUpdateField(selectedProject.id, 'adStartDate', e.target.value)}
                          className="w-full bg-[#050507] border border-emerald-900/40 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50 font-mono transition-colors animate-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-1 font-bold">Ad End Date</label>
                        <input 
                          type="date" 
                          value={selectedProject.adEndDate || selectedProject.adStartDate || selectedProject.dayAdded || ''}
                          onChange={(e) => handleUpdateField(selectedProject.id, 'adEndDate', e.target.value)}
                          className="w-full bg-[#050507] border border-emerald-900/40 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50 font-mono transition-colors animate-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-1 font-sans">Target Networks (Split with commas)</label>
                        <input 
                          type="text" 
                          placeholder="Facebook Ads, YouTube Ads"
                          value={selectedProject.adPlatforms ? selectedProject.adPlatforms.join(', ') : ''}
                          onChange={(e) => {
                            const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            handleUpdateField(selectedProject.id, 'adPlatforms', list);
                          }}
                          className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50 font-mono transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-zinc-500 uppercase block mb-1 font-sans">Daily Run Window</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Active 08:00 AM - 11:30 PM"
                          value={selectedProject.adTime || ''}
                          onChange={(e) => handleUpdateField(selectedProject.id, 'adTime', e.target.value)}
                          className="w-full bg-[#050507] border border-emerald-900/40 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/50 font-mono transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Checklists */}
                <div className="space-y-4 font-sans">
                  <div className="flex items-center justify-between font-sans">
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-300 flex items-center gap-2 font-mono font-sans font-bold">
                      <CheckSquare className="w-4 h-4 text-zinc-500 font-sans" />
                      Campaign Checklist
                    </h3>
                    <button
                      onClick={() => handleAiGenerateChecklist(selectedProject.id)}
                      disabled={aiGeneratingChecklist}
                      className="text-[10px] text-indigo-300 hover:text-white bg-indigo-600/20 border border-indigo-500/30 px-2.5 py-1.5 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      {aiGeneratingChecklist ? <Loader2 className="w-3 h-3 animate-spin animate-spin-slow" /> : '✨ AI Subtasks'}
                    </button>
                  </div>

                  <div className="space-y-2 bg-[#0e0e15] p-5 rounded-2xl border border-zinc-800/80 shadow-sm font-sans">
                    {selectedProject.checklist?.map(item => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleChecklist(selectedProject.id, item.id)}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-900/60 cursor-pointer transition-all"
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                          item.completed ? 'bg-zinc-300 border-zinc-300 text-zinc-955' : 'border-zinc-700 bg-[#09090e]'
                        }`}>
                          {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={`text-sm font-medium ${item.completed ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>{item.text}</span>
                      </div>
                    ))}

                    <form onSubmit={(e) => handleAddChecklistItem(e, selectedProject.id)} className="mt-4 flex gap-3 font-sans font-sans">
                      <input
                        type="text"
                        placeholder="Add checklist subtask..."
                        value={newChecklistText}
                        onChange={(e) => setNewChecklistText(e.target.value)}
                        className="flex-1 bg-[#050507] border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-201 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors shadow-inner"
                      />
                      <button type="submit" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-[11px] font-extrabold text-zinc-200 rounded-lg border border-zinc-700 font-mono transition-all shadow-sm">ADD</button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right timeline feedback screen */}
              <div className="lg:col-span-7 space-y-8 font-sans animate-none font-sans font-sans">
                <div className="bg-[#0e0e15] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-lg font-sans">
                  
                  {/* Canvas block / Video Player */}
                  <div className="relative aspect-video bg-black w-full overflow-hidden">
                    {(() => {
                      const embedInfo = getVideoEmbedInfo(selectedProject.edit);
                      if (embedInfo?.type === 'html5') {
                        return (
                          <video 
                            ref={realVideoRef}
                            src={embedInfo.url} 
                            controls 
                            className="w-full h-full object-contain" 
                            onTimeUpdate={(e) => setVideoTime(Math.floor(e.currentTarget.currentTime))}
                            onDurationChange={(e) => setVideoDuration(Math.floor(e.currentTarget.duration))}
                          />
                        );
                      }
                      if (embedInfo?.type === 'youtube' || embedInfo?.type === 'gdrive') {
                        return <iframe src={embedInfo.url} title="Video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full animate-none"></iframe>;
                      }
                      return (
                        <>
                          <canvas ref={canvasRef} width={640} height={360} className="w-full h-full block animate-none animate-none" />
                          {!isPlaying && (
                            <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                              <button
                                onClick={() => setIsPlaying(true)}
                                className="w-14 h-14 rounded-full bg-zinc-100 hover:bg-white text-[#0a0a0f] flex items-center justify-center transition-transform active:scale-95 shadow-xl"
                              >
                                <Play className="w-5 h-5 translate-x-0.5 fill-current" />
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Player layout details */}
                  {(() => {
                    const embedInfo = getVideoEmbedInfo(selectedProject.edit);
                    const isExternal = embedInfo?.type === 'youtube' || embedInfo?.type === 'gdrive';
                    
                    return (
                      <div className="p-5 bg-[#0e0e15] border-t border-zinc-800/80 space-y-4">
                        <div className="space-y-1.5">
                          <input
                            type="range"
                            min="0"
                            max={videoDuration}
                            value={videoTime}
                            onChange={(e) => {
                              const newTime = Number(e.target.value);
                              setVideoTime(newTime);
                              if (realVideoRef.current && embedInfo?.type === 'html5') {
                                realVideoRef.current.currentTime = newTime;
                              }
                            }}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                          />
                          <div className="flex justify-between text-[10px] text-zinc-500 font-bold font-mono">
                            <span>{formatTimecode(videoTime)}</span>
                            <span>{formatTimecode(videoDuration)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between font-sans">
                          <div className="flex items-center gap-4">
                            {!isExternal && (
                              <button
                                onClick={() => {
                                  if (realVideoRef.current && embedInfo?.type === 'html5') {
                                    if (isPlaying) realVideoRef.current.pause();
                                    else realVideoRef.current.play();
                                  }
                                  setIsPlaying(!isPlaying);
                                }}
                                className="p-2 rounded-lg bg-[#050507] text-zinc-300 hover:bg-zinc-800 border border-zinc-800 transition-colors shadow-sm animate-none"
                              >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </button>
                            )}

                            <button
                              onClick={() => {
                                  setVideoTime(0);
                                  if (realVideoRef.current && embedInfo?.type === 'html5') realVideoRef.current.currentTime = 0;
                              }}
                              className="text-[10px] font-bold font-mono bg-[#050507] hover:bg-zinc-800 px-3 py-1.5 border border-zinc-800 rounded-lg text-zinc-400 transition-colors shadow-sm animate-none"
                            >
                              RESET TC
                            </button>
                          </div>

                          <span className="text-[10px] font-bold font-mono text-zinc-600 tracking-widest uppercase font-sans">
                            {isExternal ? "External Video: Scrub to set timestamp" : "Audio Waveform simulator"}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Annotation lists */}
                <div className="space-y-5 font-sans">
                  <div className="flex items-center justify-between font-sans font-sans font-sans">
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-zinc-300 flex items-center gap-2 font-mono">
                      <Clock className="w-4 h-4 text-zinc-500" />
                      Timeline Annotation Notes ({selectedProject.comments?.length || 0})
                    </h3>

                    <div className="flex items-center gap-3 font-mono font-sans font-sans font-sans">
                      <button
                        onClick={() => handleAiGenerateCampaign(selectedProject.id)}
                        disabled={aiGeneratingCampaign}
                        className="text-[10px] text-indigo-300 hover:text-white bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        {aiGeneratingCampaign ? <Loader2 className="w-3 h-3 animate-spin animate-spin-slow" /> : '✨ AI Caption'}
                      </button>

                      <button
                        onClick={() => {
                          const marker = formatTimecode(videoTime);
                          setNewCommentText(`@${marker} feedback: `);
                          triggerToast(`Synced playhead to input [${marker}]`);
                        }}
                        className="text-[10px] font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 font-mono transition-colors shadow-sm"
                      >
                        <span>Grab playhead [ {formatTimecode(videoTime)} ]</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedProject.comments && selectedProject.comments.length > 0 ? (
                      selectedProject.comments.map(c => (
                        <div key={c.id} className={`p-4 rounded-xl border ${c.resolved ? 'bg-[#0e0e15]/40 border-zinc-900 opacity-50' : 'bg-[#0e0e15] border-zinc-800/80 shadow-sm'}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 font-sans font-sans font-sans">
                              <div className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center font-extrabold text-[10px] text-zinc-300 font-mono font-mono">
                                {(c.userName || 'Anonymous').charAt(0)}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-zinc-200">{c.userName || 'Anonymous'}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleJumpToTimestamp(c.timeMarker)}
                              className="text-[10px] font-bold font-mono px-2 py-1 rounded-md bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700 flex items-center gap-1.5 transition-all shadow-sm font-mono font-mono"
                            >
                              <Play className="w-3 h-3" />
                              {c.timeMarker}
                            </button>
                          </div>

                          <p className="text-sm text-zinc-300 font-medium mt-3 pl-1 font-mono whitespace-pre-wrap leading-relaxed">{c.text || ''}</p>

                          <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between font-sans">
                            <span className="text-[10px] text-zinc-600 font-bold font-mono">Click tag to jump video timeline</span>
                            <button
                              onClick={() => handleToggleCommentResolved(selectedProject.id, c.id)}
                              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-md uppercase tracking-wider ${
                                c.resolved ? 'bg-[#050507] text-zinc-500 border border-zinc-800' : 'bg-zinc-200 text-zinc-950 hover:bg-white shadow-sm transition-colors'
                              }`}
                            >
                              {c.resolved ? 'Resolved' : 'Resolve'}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-zinc-500 text-sm font-medium italic font-mono border border-dashed border-zinc-800 rounded-xl font-sans font-sans">
                        No annotations recorded yet.
                      </div>
                    )}

                    <form onSubmit={(e) => handleAddComment(e, selectedProject.id)} className="space-y-3 pt-4 border-t border-zinc-900 font-sans">
                      <textarea
                        rows="3"
                        placeholder={`Write feedback tag at playhead frame [${formatTimecode(videoTime)}]...`}
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="w-full bg-[#050507] border border-zinc-800 rounded-xl p-4 text-sm text-zinc-201 font-medium placeholder-zinc-600 focus:outline-none focus:border-zinc-600 resize-none font-mono transition-colors shadow-inner font-sans font-sans font-sans"
                      />
                      <div className="flex justify-between items-center px-1 font-mono">
                        <span className="text-[10px] text-zinc-500 font-bold font-mono uppercase tracking-widest font-mono font-mono font-sans font-sans font-sans font-sans">Target frame: [{formatTimecode(videoTime)}]</span>
                        <button type="submit" className="px-5 py-2 bg-zinc-200 hover:bg-white text-xs font-extrabold tracking-wide rounded-lg text-zinc-950 transition-colors shadow-sm font-sans">Post feedback</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- INITIATION FORM MODAL --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans font-sans font-sans">
          <div className="w-full max-w-lg bg-[#09090d] rounded-2xl border border-zinc-800 p-8 space-y-6 relative animate-in zoom-in-95 shadow-2xl font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 font-sans font-sans font-sans">
              <h3 className="text-sm font-extrabold tracking-widest uppercase text-zinc-101 flex items-center gap-2.5 font-mono">
                <Video className="w-5 h-5 text-zinc-500" />
                New Entry
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-zinc-500 hover:text-white font-bold font-mono font-sans">✕</button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-5 font-sans">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Campaign Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-101 font-semibold placeholder-zinc-700 focus:outline-none focus:border-zinc-600 transition-colors shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono">Day Added</label>
                  <input
                    type="date"
                    required
                    value={newDayAdded}
                    onChange={(e) => setNewDayAdded(e.target.value)}
                    className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-101 font-medium focus:outline-none focus:border-zinc-600 font-mono transition-colors shadow-inner font-sans font-sans font-sans font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono">Purpose</label>
                <textarea
                  rows="2"
                  placeholder="Campaign focus scope..."
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  className="w-full bg-[#050507] border border-zinc-800 rounded-lg p-4 text-sm text-zinc-101 font-medium placeholder-zinc-700 focus:outline-none focus:border-zinc-600 resize-none transition-colors shadow-inner font-sans font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono font-sans font-bold">Type Format</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2.5 text-sm font-semibold text-zinc-300 focus:outline-none focus:border-zinc-600 cursor-pointer font-mono transition-colors"
                  >
                    {types.map(t => (
                      <option key={t.name || ''} value={t.name || ''} className="bg-zinc-950">{t.name || ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2.5 text-sm font-bold text-zinc-300 focus:outline-none focus:border-zinc-600 cursor-pointer font-sans"
                  >
                    {priorities.map(prio => (
                      <option key={prio || ''} value={prio || ''} className="bg-[#09090e] text-zinc-300 font-sans">{prio || ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1.5 font-mono font-sans font-bold">Assignee</label>
                  <input
                    type="text"
                    placeholder="Creator name"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-101 font-medium focus:outline-none focus:border