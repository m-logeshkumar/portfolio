import { create } from 'zustand';

const STORAGE_KEY = 'portfolio_data';

// Empty default structure (MongoDB is the source of truth)
const emptyData = {
  personalInfo: { name: '', title: '', location: '', email: '', phone: '', linkedin: '', github: '', resumeUrl: '' },
  stats: [],
  techStack: [],
  about: { intro: '', timeline: [] },
  skills: [],
  projects: [],
  experience: [],
  certificates: [],
};

// Load data from localStorage (used as instant cache, MongoDB is the source of truth)
const loadCachedData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : emptyData;
  } catch (error) {
    console.error('Error loading cached data:', error);
    return emptyData;
  }
};

// Save data to localStorage (cache) and MongoDB (permanent)
const saveData = async (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching data:', error);
  }
  // Save to MongoDB in background
  try {
    await fetch('/api/portfolio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
  }
};

export const usePortfolioStore = create((set, get) => ({
  // Data
  data: loadCachedData(),

  // UI State
  theme: 'dark',
  currentFilter: 'All',
  isEditMode: false,

  // Load data from MongoDB on startup
  loadFromDB: async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        set({ data });
        console.log('✅ Portfolio data loaded from MongoDB');
      }
    } catch (error) {
      console.log('Using cached data (MongoDB unavailable)');
    }
  },

  // Actions
  updatePersonalInfo: (info) => set((state) => {
    const newData = { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } };
    saveData(newData);
    return { data: newData };
  }),

  updateProjects: (projects) => set((state) => {
    const newData = { ...state.data, projects };
    saveData(newData);
    return { data: newData };
  }),

  addProject: (project) => set((state) => {
    const newProjects = [...state.data.projects, { ...project, id: Date.now() }];
    const newData = { ...state.data, projects: newProjects };
    saveData(newData);
    return { data: newData };
  }),

  updateProject: (id, updates) => set((state) => {
    const newProjects = state.data.projects.map(p =>
      p.id === id ? { ...p, ...updates } : p
    );
    const newData = { ...state.data, projects: newProjects };
    saveData(newData);
    return { data: newData };
  }),

  deleteProject: (id) => set((state) => {
    const newProjects = state.data.projects.filter(p => p.id !== id);
    const newData = { ...state.data, projects: newProjects };
    saveData(newData);
    return { data: newData };
  }),

  updateAbout: (about) => set((state) => {
    const newData = { ...state.data, about };
    saveData(newData);
    return { data: newData };
  }),

  updateSkills: (skills) => set((state) => {
    const newData = { ...state.data, skills };
    saveData(newData);
    return { data: newData };
  }),

  updateExperience: (experience) => set((state) => {
    const newData = { ...state.data, experience };
    saveData(newData);
    return { data: newData };
  }),

  addExperience: (exp) => set((state) => {
    const newExperience = [...state.data.experience, { ...exp, id: Date.now() }];
    const newData = { ...state.data, experience: newExperience };
    saveData(newData);
    return { data: newData };
  }),

  deleteExperience: (id) => set((state) => {
    const newExperience = state.data.experience.filter(e => e.id !== id);
    const newData = { ...state.data, experience: newExperience };
    saveData(newData);
    return { data: newData };
  }),

  // Certificate actions
  updateCertificates: (certificates) => set((state) => {
    const newData = { ...state.data, certificates };
    saveData(newData);
    return { data: newData };
  }),

  addCertificate: (cert) => set((state) => {
    const newCertificates = [...(state.data.certificates || []), { ...cert, id: Date.now() }];
    const newData = { ...state.data, certificates: newCertificates };
    saveData(newData);
    return { data: newData };
  }),

  updateCertificate: (id, updates) => set((state) => {
    const newCertificates = (state.data.certificates || []).map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    const newData = { ...state.data, certificates: newCertificates };
    saveData(newData);
    return { data: newData };
  }),

  deleteCertificate: (id) => set((state) => {
    const newCertificates = (state.data.certificates || []).filter(c => c.id !== id);
    const newData = { ...state.data, certificates: newCertificates };
    saveData(newData);
    return { data: newData };
  }),

  setFilter: (filter) => set({ currentFilter: filter }),

  setEditMode: (isEditMode) => set({ isEditMode }),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  resetData: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ data: emptyData });
    // Also reset in MongoDB
    fetch('/api/portfolio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emptyData),
    }).catch(() => { });
  },

  // Resume PDF Management (stored in MongoDB)
  hasResume: false,
  resumeFileName: '',

  // Check if resume exists in MongoDB
  checkResume: async () => {
    try {
      const res = await fetch('/api/resume/info');
      const info = await res.json();
      if (info.exists) {
        set({ hasResume: true, resumeFileName: info.fileName });
      } else {
        set({ hasResume: false, resumeFileName: '' });
      }
    } catch (error) {
      console.log('Could not check resume status');
    }
  },

  // Upload resume to MongoDB
  saveResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch('/api/resume', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }

    const result = await res.json();
    set({ hasResume: true, resumeFileName: result.fileName });
    return result;
  },

  // Download resume from MongoDB
  downloadResume: async () => {
    const { resumeFileName } = get();
    const res = await fetch('/api/resume');
    if (!res.ok) throw new Error('Download failed');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = resumeFileName || 'resume.pdf';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    // Delay cleanup so the browser has time to start the download
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);
  },

  // Delete resume from MongoDB
  clearResume: async () => {
    try {
      await fetch('/api/resume', { method: 'DELETE' });
      set({ hasResume: false, resumeFileName: '' });
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  },
}));
