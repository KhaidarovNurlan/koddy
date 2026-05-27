import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const LANGUAGES = [
    { id: 'python', name: 'Python', color: '#4B8BBE' },
    { id: 'javascript', name: 'JavaScript', color: '#F7DF1E' },
    { id: 'java', name: 'Java', color: '#B07219' },
    { id: 'cpp', name: 'C++', color: '#f34b7d' },
    { id: 'c', name: 'C', color: '#555555' },
    { id: 'csharp', name: 'C#', color: '#178600' },
    { id: 'lua', name: 'Lua', color: '#000080' },
    { id: 'php', name: 'PHP', color: '#4F5D95' },
    { id: 'go', name: 'Go', color: '#00ADD8' },
    { id: 'dart', name: 'Dart', color: '#00B4AB' },
    { id: 'rust', name: 'Rust', color: '#dea584' },
    { id: 'r', name: 'R', color: '#198CE7' },
    { id: 'ruby', name: 'Ruby', color: '#701516' },
    { id: 'swift', name: 'Swift', color: '#ffac45' },
];

export const Projects = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
    const [creating, setCreating] = useState(false);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProjects(data.projects || []);
            }
        } catch (e) {
            console.error('Failed to fetch projects', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "My Projects - Koddy";
        if (user && user.xp >= 300) {
            fetchProjects();
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleCreateProject = async () => {
        if (!newTitle.trim()) return;
        setCreating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription,
                    language: selectedLanguage,
                    code: ''
                })
            });
            if (res.ok) {
                const data = await res.json();
                navigate(`/projects/${data.project.id}`);
            }
        } catch (e) {
            console.error('Failed to create project', e);
            setCreating(false);
        }
    };

    if (loading) return null;

    if (!user || user.xp < 300) {
        return (
            <div className="flex-1 p-8 w-full max-w-[700px]">
                <div className="mb-8">
                    <h1 className="text-[20px] font-bold text-white mb-1">My Projects</h1>
                    <p className="text-text-secondary text-[15px] font-medium">Build, experiment, and bring your ideas to code</p>
                </div>

                <div className="bg-grey border-3 border-grey-light rounded-xl p-4 relative overflow-hidden flex items-start min-h-[140px]">
                    <div className="flex-1 z-10 relative">
                        <h3 className="text-[18px] font-bold text-white mb-1">Projects are locked</h3>
                        <p className="text-text-secondary text-[16px] font-medium">Earn 300 XP to unlock Projects!</p>
                    </div>

                    <div className="absolute right-6 -bottom-6 w-24 h-24 z-0">
                        <img
                            src="/projects.svg"
                            alt="Projects locked"
                            className="w-full h-full object-contain drop-shadow-lg opacity-90"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 w-full max-w-[700px]">
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-[#2B2D2E] rounded-3xl p-6 w-[500px] shadow-2xl flex flex-col border border-grey-light" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Create a New Project</h2>
                            <svg className="w-5 h-5 text-text-secondary cursor-pointer hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={() => setShowModal(false)}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-bold text-white mb-2">Project Name</label>
                            <input
                                type="text"
                                className="w-full bg-transparent border border-grey-light rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-light transition-colors"
                                placeholder="e.g. My Calculator"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-white mb-2">
                                Description <span className="text-text-secondary font-normal">— optional</span>
                            </label>
                            <textarea
                                className="w-full bg-[#1c1c1c] border border-grey-light rounded-lg p-3 text-sm text-white h-24 resize-none placeholder-text-secondary focus:outline-none focus:border-blue-light transition-colors"
                                placeholder="What will your project do?"
                                value={newDescription}
                                onChange={e => setNewDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-bold text-white mb-3">Pick a Language</label>
                            <div className="grid grid-cols-4 gap-3 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
                                {LANGUAGES.map(lang => (
                                    <div
                                        key={lang.id}
                                        onClick={() => setSelectedLanguage(lang.id)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${selectedLanguage === lang.id ? 'bg-blue/10 border-blue-light text-white' : 'bg-[#1c1c1c] border-grey-light text-text-secondary hover:border-grey-lighter hover:text-white'}`}
                                    >
                                        <div className="w-8 h-8 rounded mb-2 flex items-center justify-center font-bold" style={{ backgroundColor: lang.color, color: '#fff', fontSize: '10px' }}>
                                            {lang.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-[11px] font-bold">{lang.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 rounded-xl bg-transparent border border-grey-light hover:bg-white/5 active:translate-y-[2px] transition-all font-bold text-sm text-white uppercase tracking-wider"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateProject}
                                disabled={!newTitle.trim() || creating}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm text-white uppercase tracking-wider border-b-4 transition-all ${!newTitle.trim() || creating ? 'bg-grey border-grey-light opacity-50 cursor-not-allowed' : 'bg-blue border-blue-dark hover:brightness-110 active:border-b-2 active:translate-y-[2px]'}`}
                            >
                                {creating ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-[20px] font-bold text-white mb-1">My Projects</h1>
                <p className="text-text-secondary text-[15px] font-medium">Build, experiment, and bring your ideas to code</p>
            </div>

            <div className="flex flex-wrap gap-6">
                <div
                    onClick={() => setShowModal(true)}
                    className="w-[220px] h-[160px] rounded-2xl border-2 border-dashed border-grey-light hover:border-text-secondary flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-white/5 group"
                >
                    <div className="w-12 h-12 rounded-full bg-blue text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="font-bold text-white">New Project</span>
                </div>

                {projects.map(p => {
                    const lang = LANGUAGES.find(l => l.id === p.language);
                    return (
                        <Link
                            to={`/projects/${p.id}`}
                            key={p.id}
                            className="w-[280px] h-[160px] bg-grey border border-grey-light hover:border-grey-lighter rounded-2xl p-5 flex flex-col cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-inner" style={{ backgroundColor: lang?.color || '#333', color: '#fff' }}>
                                    {lang ? lang.name.substring(0, 2).toUpperCase() : '??'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base leading-tight truncate w-[180px]">{p.title}</h3>
                                </div>
                            </div>
                            <p className="text-text-secondary text-sm line-clamp-2 flex-1">{p.description || 'No description provided'}</p>

                            <div className="flex items-center mt-3 pt-3 border-t border-grey-light">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: lang?.color || '#333' }}></span>
                                    {lang?.name}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
