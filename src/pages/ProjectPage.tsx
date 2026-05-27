import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Editor from '@monaco-editor/react';

const LANGUAGES = [
    { id: 'python', name: 'Python', color: '#4B8BBE', ext: 'py', comment: '#' },
    { id: 'javascript', name: 'JavaScript', color: '#F7DF1E', ext: 'js', comment: '//' },
    { id: 'java', name: 'Java', color: '#B07219', ext: 'java', comment: '//' },
    { id: 'cpp', name: 'C++', color: '#f34b7d', ext: 'cpp', comment: '//' },
    { id: 'c', name: 'C', color: '#555555', ext: 'c', comment: '//' },
    { id: 'csharp', name: 'C#', color: '#178600', ext: 'cs', comment: '//' },
    { id: 'lua', name: 'Lua', color: '#000080', ext: 'lua', comment: '--' },
    { id: 'php', name: 'PHP', color: '#4F5D95', ext: 'php', comment: '//' },
    { id: 'go', name: 'Go', color: '#00ADD8', ext: 'go', comment: '//' },
    { id: 'dart', name: 'Dart', color: '#00B4AB', ext: 'dart', comment: '//' },
    { id: 'rust', name: 'Rust', color: '#dea584', ext: 'rs', comment: '//' },
    { id: 'r', name: 'R', color: '#198CE7', ext: 'r', comment: '#' },
    { id: 'ruby', name: 'Ruby', color: '#701516', ext: 'rb', comment: '#' },
    { id: 'swift', name: 'Swift', color: '#ffac45', ext: 'swift', comment: '//' },
];

export const ProjectPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState<any>(null);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

    const codeRef = useRef(code);
    const fetchProject = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/user/projects/${projectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProject(data.project);

                const langDef = LANGUAGES.find(l => l.id === data.project.language);
                const defaultCode = `${langDef?.comment || '//'} Welcome to your project!\n${langDef?.comment || '//'} Start coding below\n\n`;

                setCode(data.project.code || defaultCode);
            } else {
                navigate('/projects');
            }
        } catch (e) {
            console.error(e);
            navigate('/projects');
        }
    };

    const saveProject = async (codeToSave: string) => {
        setSaveStatus('saving');
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/user/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ code: codeToSave })
            });
            setSaveStatus('saved');
            if (project) {
                setProject({ ...project, code: codeToSave });
            }
        } catch (e) {
            console.error('Failed to save', e);
            setSaveStatus('unsaved');
        }
    };

    useEffect(() => {
        codeRef.current = code;
    }, [code]);

    useEffect(() => {
        if (!user || user.xp < 300) {
            navigate('/projects');
            return;
        }
        fetchProject();
    }, [projectId, user]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (saveStatus === 'unsaved') {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (project && codeRef.current !== project.code) {
                saveProject(codeRef.current);
            }
        };
    }, [project, saveStatus]);

    useEffect(() => {
        if (!project || code === project.code) return;

        setSaveStatus('unsaved');
        const timeout = setTimeout(() => {
            saveProject(code);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [code, project]);


    const handleRunCode = async () => {
        if (!project || isRunning) return;
        setIsRunning(true);
        setOutput('Executing code...');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user/code/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    language: project.language,
                    code
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({ error: 'Unknown server error' }));
                setOutput(`Error: ${errData.error || res.statusText}`);
                setIsRunning(false);
                return;
            }

            const data = await res.json();

            let finalOutput = '';
            if (data.stderr) {
                finalOutput = data.stderr;
            } else {
                finalOutput = data.stdout;
                if (!finalOutput || finalOutput.trim() === '') {
                    finalOutput = 'Program executed with no output';
                }
            }
            setOutput(finalOutput);
        } catch (err: any) {
            setOutput(`Execution failed: ${err.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    if (!project) {
        return <div className="flex h-screen items-center justify-center bg-grey-dark text-white">Loading...</div>;
    }

    const langDef = LANGUAGES.find(l => l.id === project.language) || LANGUAGES[0];
    const fileName = `main.${langDef.ext}`;


    return (
        <div className="flex flex-col h-screen w-full bg-grey-dark text-white overflow-hidden">
            <div className="h-[50px] bg-[#222324] border-b border-grey-lighter flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
                <div className="flex items-center gap-4">
                    <Link to="/projects" className="text-text-secondary hover:text-white transition-colors cursor-pointer flex items-center justify-center p-1 rounded-md hover:bg-grey-light/50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="font-bold text-white text-[15px]">{project.title}</h1>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#1c1c1c] border border-grey-lighter text-[11px] font-bold" style={{ color: langDef.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langDef.color }}></span>
                            {langDef.name}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-[12px] font-semibold text-text-secondary">
                    <div className="flex items-center gap-1.5">
                        {saveStatus === 'saving' && (
                            <>
                                <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Saving...
                            </>
                        )}
                        {saveStatus === 'saved' && (
                            <span className="text-white/60">Auto-saved</span>
                        )}
                        {saveStatus === 'unsaved' && (
                            <span className="text-orange/80">Unsaved changes</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="w-[240px] bg-[#222324] border-r border-grey-lighter shrink-0 flex flex-col z-10">
                    <div className="px-4 py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-text-secondary border-b border-grey-lighter shadow-sm">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Files
                        </div>
                        <svg className="w-4 h-4 cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-grey-lighter cursor-pointer">
                            <svg className="w-4 h-4 text-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium text-white">{fileName}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-[#1c1c1c] relative z-0">
                    <div className="h-[40px] bg-grey-dark border-b border-grey-lighter flex justify-between items-center px-4 shrink-0 select-none shadow-sm z-10">
                        <div className="bg-[#1c1c1c] text-xs text-white/90 px-4 ml-2 py-2 border-t-2 border-blue-light font-semibold rounded-t-lg mt-[6px] flex items-center gap-2">
                            {fileName}
                            <svg className="w-3 h-3 text-text-secondary cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex-1 bg-[#1c1c1c] relative flex overflow-hidden">
                        <div className="flex-1 h-full">
                            <Editor
                                height="100%"
                                language={project.language || 'python'}
                                theme="vs-dark"
                                value={code}
                                onChange={(val) => setCode(val || '')}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    scrollbar: {
                                        vertical: 'auto',
                                        horizontal: 'auto'
                                    },
                                    fontFamily: 'monospace',
                                }}
                            />
                        </div>

                        <div className="absolute bottom-4 right-4 flex gap-3 z-10">
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning}
                                className={`bg-[#247B9E] text-white px-3 gap-2 py-2 rounded-lg flex items-center text-sm font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg ${isRunning ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isRunning ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Running...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        Run Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="h-[250px] bg-[#1e1e1e] border-t border-grey-lighter flex flex-col shadow-inner z-10">
                        <div className="h-8 bg-[#252526] flex items-center justify-between px-4 border-b border-grey-lighter shrink-0">
                            <span className="text-[11px] font-bold text-white/70 tracking-wider uppercase">Console</span>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-text-secondary hover:text-white cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1 p-3 overflow-y-auto">
                            {output ? (
                                <div className={`font-mono text-sm whitespace-pre-wrap ${output.includes('Error') || output.includes('failed') ? 'text-red-400' : 'text-white/90'}`}>
                                    {output}
                                </div>
                            ) : (
                                <div className="text-text-secondary text-sm italic font-mono opacity-50">
                                    Click "Run Code" to see your output here
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
