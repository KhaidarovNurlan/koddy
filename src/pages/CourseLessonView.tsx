import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export function CourseLessonView() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth() || {};

    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [isPassed, setIsPassed] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiText, setAiText] = useState('');

    useEffect(() => {
        fetchCourseData();
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/courses/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCourse(data.course);
                setLessons(data.lessons || []);
                setCurrentLessonIndex(0);
                if (data.lessons && data.lessons.length > 0) {
                    setCode(getDefaultCode(data.course.language, data.lessons[0]));
                    setIsPassed(data.lessons[0].passed);
                }
            } else {
                toast.error("Failed to load course");
                navigate('/courses');
            }
        } catch (e) {
            console.error(e);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const getDefaultCode = (lang: string, _lesson: any) => {
        switch (lang.toLowerCase()) {
            case 'python':
                return `def solution():\n    # Write your code here\n    pass\n`;
            case 'javascript':
                return `function solution() {\n    // Write your code here\n}\n`;
            case 'c++':
                return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n`;
            case 'java':
                return `public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}\n`;
            case 'c#':
                return `using System;\n\nclass Solution {\n    static void Main() {\n        // Write your code here\n    }\n}\n`;
            default:
                return '';
        }
    };

    const mapLanguageToMonaco = (lang: string) => {
        switch (lang.toLowerCase()) {
            case 'python': return 'python';
            case 'javascript': return 'javascript';
            case 'c++': return 'cpp';
            case 'java': return 'java';
            case 'c#': return 'csharp';
            default: return 'javascript';
        }
    };

    const handleLessonChange = (index: number) => {
        if (index < 0 || index >= lessons.length) return;
        setCurrentLessonIndex(index);
        setCode(getDefaultCode(course.language, lessons[index]));
        setIsPassed(lessons[index].passed);
        setOutput('');
    };

    const handleRunCode = async () => {
        if (!code.trim()) {
            toast.error("Please write some code first");
            return;
        }

        try {
            setIsRunning(true);
            setOutput('');
            const token = localStorage.getItem('token');
            const res = await fetch('/api/user/code/run', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    language: course.language,
                    code
                })
            });

            if (res.ok) {
                const data = await res.json();
                const runOutput = (data.stdout || '') + (data.stderr || '');
                setOutput(runOutput.trim());

                const expected = lessons[currentLessonIndex].expectedOutput.trim();
                if (runOutput.trim() === expected) {
                    setIsPassed(true);
                    toast.success("All test cases passed!");
                } else {
                    toast.error("Output did not match expected output.");
                }
            } else {
                toast.error("Failed to run code");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error running code");
        } finally {
            setIsRunning(false);
        }
    };

    const handleNextLesson = async () => {
        const lesson = lessons[currentLessonIndex];

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/courses/lessons/${lesson.id}/complete`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setLessons(prev => {
                    const next = [...prev];
                    next[currentLessonIndex].passed = true;
                    return next;
                });

                await refreshUser?.();

                if (currentLessonIndex < lessons.length - 1) {
                    handleLessonChange(currentLessonIndex + 1);
                } else {
                    toast.success("Congratulations! You completed the course!");
                    navigate('/courses');
                }
            } else {
                const errData = await res.json();
                toast.error(errData.error || "Failed to save progress");
            }
        } catch (e) {
            console.error(e);
            toast.error("Network error saving progress");
        }
    };

    const triggerAiAssistant = () => {
        const lesson = lessons[currentLessonIndex];
        setAiText(`To complete the challenge: "${lesson.title}", you need to output exactly:\n\n"${lesson.expectedOutput}"\n\nMake sure your code prints this output to the standard output/console when run.`);
        setShowAiModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-grey-dark flex items-center justify-center">
                <p className="text-text-secondary">Loading course...</p>
            </div>
        );
    }

    const currentLesson = lessons[currentLessonIndex];

    return (
        <div className="h-screen flex flex-col bg-grey-dark overflow-hidden font-sans">
            <div className="h-[61px] bg-grey-dark border-b border-grey-lighter flex items-center justify-between px-6 z-10 select-none">
                <div className="flex items-center gap-4">
                    <Link to="/courses" className="hover:opacity-80 transition-opacity">
                        <img src="/left-white.svg" className="w-6 h-6" alt="back" />
                    </Link>
                    <span className="text-white font-bold text-sm tracking-wide truncate max-w-[200px]">
                        {course?.title}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleLessonChange(currentLessonIndex - 1)}
                        disabled={currentLessonIndex === 0}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-grey/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                        <span className="text-white text-md font-bold">&lt;</span>
                    </button>

                    <div className="flex items-center gap-1.5 overflow-x-auto max-w-[300px] sm:max-w-[450px] px-1 custom-scrollbar">
                        {lessons.map((les, index) => {
                            const isActive = index === currentLessonIndex;
                            const isCompleted = les.passed;

                            return (
                                <button
                                    key={les.id}
                                    onClick={() => handleLessonChange(index)}
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2
                                        ${isActive
                                            ? 'border-blue-light bg-blue text-white scale-110 shadow-md'
                                            : isCompleted
                                                ? 'border-green bg-green text-white'
                                                : 'border-grey-light/50 bg-grey-dark text-white/50 hover:border-white/50 hover:text-white'
                                        }`}
                                >
                                    {isCompleted ? '✓' : index + 1}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handleLessonChange(currentLessonIndex + 1)}
                        disabled={currentLessonIndex === lessons.length - 1}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-grey/50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                        <span className="text-white text-md font-bold">&gt;</span>
                    </button>
                </div>

                <div className="flex items-center gap-5 text-sm font-bold">
                    <div className="flex items-center">
                        <span className="text-white mr-1.5">{user?.streak ?? 0}</span>
                        <img src="/fire-filled.svg" className="w-4 h-4" alt="streak" />
                    </div>
                    <div className="flex items-center">
                        <span className="text-white mr-1.5">{user?.tokens ?? 0}</span>
                        <img src="/token.svg" className="w-4 h-4" alt="tokens" />
                    </div>
                    <div className="flex items-center">
                        <span className="text-white mr-1.5">{user?.energy ?? 5}</span>
                        <img src="/energy.svg" className="w-4 h-4" alt="energy" />
                    </div>
                    <img src="/avatar_placeholder.png" className="w-7 h-7 rounded-full border border-grey-light" alt="user" />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {currentLesson && (
                    <div className="w-[380px] bg-grey-dark border-r border-grey-lighter flex flex-col p-6 overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-2">{currentLesson.title}</h2>

                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue/20 text-blue-light border border-blue-light/30">
                                Challenge
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-grey-light/20 text-white capitalize">
                                {course.difficulty}
                            </span>
                        </div>

                        <p className="text-[15px] leading-relaxed text-white/90 whitespace-pre-wrap flex-1 mb-8">
                            {currentLesson.description}
                        </p>

                        <div className="flex flex-col gap-4 mt-auto">
                            <button
                                onClick={triggerAiAssistant}
                                className="w-full py-2.5 bg-grey border-3 border-grey-light hover:border-blue-light/50 rounded-xl text-white font-bold transition-all text-sm flex items-center justify-center gap-2"
                            >
                                <img src="/ai-assistant.svg" className="w-5 h-5" alt="" />
                                Explain challenge
                            </button>

                            {isPassed && (
                                <button
                                    onClick={handleNextLesson}
                                    className="w-full py-3.5 bg-blue text-white font-bold rounded-xl transition-all shadow-[0_5px_0_0_#264D73] hover:shadow-[0_0px_0_0_#264D73] hover:translate-y-[3px] text-sm text-center uppercase"
                                >
                                    {currentLessonIndex === lessons.length - 1 ? 'Finish Course' : 'Next'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 flex flex-col overflow-hidden relative">

                        <div className="h-10 bg-grey-dark border-b border-grey-lighter flex items-center justify-between px-4 text-xs font-bold text-text-secondary select-none shrink-0">
                            <span className="uppercase tracking-wider">{course?.language}</span>
                        </div>

                        <div className="flex-1 bg-[#1c1c1c] relative flex overflow-hidden">
                            <div className="flex-1 h-full">
                                <Editor
                                    height="100%"
                                    language={mapLanguageToMonaco(course?.language || '')}
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
                                    className={`bg-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold hover:brightness-110 active:scale-95 transition-all shadow-md ${isRunning ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                                            <img src="/play-white.svg" className="w-5 h-5" alt="run" />
                                            Run Code
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="h-[200px] bg-grey-dark border-t border-grey-lighter flex flex-col shadow-inner z-10 shrink-0">
                            <div className="flex-1 flex p-5 text-sm font-mono overflow-y-auto">
                                <div className="flex-1 border-r border-grey-lighter pr-6">
                                    <div className="text-text-secondary text-xs mb-2 font-sans uppercase tracking-wider font-bold">Output</div>
                                    <div className={`text-white/90 p-3 rounded-lg border font-mono whitespace-pre-wrap min-h-[40px] ${output.includes('Error') ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-grey border-grey-light text-white/90'}`}>
                                        {output || '(empty)'}
                                    </div>
                                </div>
                                <div className="flex-1 pl-6">
                                    <div className="text-text-secondary text-xs mb-2 font-sans uppercase tracking-wider font-bold">Expected Output</div>
                                    <div className="text-white/90 bg-grey p-3 rounded-lg border border-grey-light font-mono whitespace-pre-wrap">
                                        {currentLesson?.expectedOutput}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showAiModal && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
                    <div className="bg-grey-dark border-3 border-grey-light rounded-2xl w-full max-w-[450px] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
                        <div className="p-6 border-b border-grey-lighter flex justify-between items-center">
                            <h3 className="font-bold text-white text-md flex items-center gap-2">
                                <img src="/ai-assistant.svg" className="w-6 h-6" alt="" />
                                AI Explanation
                            </h3>
                            <button onClick={() => setShowAiModal(false)} className="text-white/60 hover:text-white transition-colors">
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                                {aiText}
                            </p>
                        </div>
                        <div className="p-6 border-t border-grey-lighter flex justify-end">
                            <button
                                onClick={() => setShowAiModal(false)}
                                className="px-5 py-2 bg-blue text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all text-sm"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
