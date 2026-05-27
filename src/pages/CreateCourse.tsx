import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface LessonInput {
    title: string;
    description: string;
    expectedOutput: string;
}

export const CreateCourse = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('Python');
    const [difficulty, setDifficulty] = useState('Easy');
    const [lessons, setLessons] = useState<LessonInput[]>([
        { title: '', description: '', expectedOutput: '' }
    ]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        document.title = "Create Course - Koddy";
    }, []);

    const addLesson = () => {
        setLessons(prev => [...prev, { title: '', description: '', expectedOutput: '' }]);
    };

    const removeLesson = (index: number) => {
        if (lessons.length === 1) {
            toast.error("A course must have at least one lesson");
            return;
        }
        setLessons(prev => prev.filter((_, i) => i !== index));
    };

    const updateLesson = (index: number, field: keyof LessonInput, value: string) => {
        setLessons(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Please enter a course title");
            return;
        }

        for (let i = 0; i < lessons.length; i++) {
            const les = lessons[i];
            if (!les.title.trim()) {
                toast.error(`Lesson ${i + 1} is missing a title`);
                return;
            }
            if (!les.description.trim()) {
                toast.error(`Lesson ${i + 1} is missing a task description`);
                return;
            }
            if (!les.expectedOutput.trim()) {
                toast.error(`Lesson ${i + 1} is missing expected output`);
                return;
            }
        }

        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            const res = await fetch('/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    language,
                    difficulty,
                    lessons
                })
            });

            if (res.ok) {
                toast.success("Course created successfully!");
                navigate('/courses');
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to create course");
            }
        } catch (e) {
            console.error(e);
            toast.error("Network error, please try again");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex-1 p-8 w-full max-w-[800px] mx-auto animate-in fade-in duration-200">
            <Link to="/courses" className="flex items-center gap-2 text-white text-lg mb-6 hover:opacity-80 w-fit">
                <img src="/left-white.svg" alt="Back" className="w-6 h-6" />
                Back
            </Link>

            <h1 className="text-2xl font-bold text-white mb-8">Create New Course</h1>

            <form onSubmit={handleSave} className="flex flex-col gap-6">
                <div className="bg-grey border-3 border-grey-light rounded-2xl p-6 flex flex-col gap-5">
                    <div>
                        <label className="block text-text-secondary font-bold text-sm mb-2 uppercase">Course Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Master Python Functions"
                            className="w-full bg-grey-dark border-3 border-grey-light rounded-xl py-3 px-4 text-white placeholder-text-secondary outline-none focus:border-blue-light transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-secondary font-bold text-sm mb-2 uppercase">Programming Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-grey-dark border-3 border-grey-light rounded-xl py-3 px-4 text-white outline-none focus:border-blue-light transition-colors"
                            >
                                <option value="Python">Python</option>
                                <option value="JavaScript">JavaScript</option>
                                <option value="C++">C++</option>
                                <option value="Java">Java</option>
                                <option value="C#">C#</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-text-secondary font-bold text-sm mb-2 uppercase">Difficulty</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full bg-grey-dark border-3 border-grey-light rounded-xl py-3 px-4 text-white outline-none focus:border-blue-light transition-colors"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Course Lessons</h2>
                        <button
                            type="button"
                            onClick={addLesson}
                            className="px-4 py-2 bg-grey border-3 border-grey-light hover:border-blue-light/50 rounded-xl text-white font-bold transition-all text-sm"
                        >
                            + ADD LESSON
                        </button>
                    </div>

                    {lessons.map((les, index) => (
                        <div key={index} className="bg-grey border-3 border-grey-light rounded-2xl p-6 relative flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-150">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-white text-md">Lesson #{index + 1}</h3>
                                {lessons.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeLesson(index)}
                                        className="text-[#ff4d4d] hover:text-[#ff3333] font-bold text-xs uppercase"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>

                            <div>
                                <label className="block text-text-secondary font-bold text-xs mb-1 uppercase">Lesson Title</label>
                                <input
                                    type="text"
                                    value={les.title}
                                    onChange={(e) => updateLesson(index, 'title', e.target.value)}
                                    placeholder="e.g. Introduction to print"
                                    className="w-full bg-grey-dark border-3 border-grey-light rounded-xl py-2.5 px-3.5 text-white placeholder-text-secondary outline-none focus:border-blue-light transition-colors text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-text-secondary font-bold text-xs mb-1 uppercase">Code Task Description</label>
                                <textarea
                                    value={les.description}
                                    onChange={(e) => updateLesson(index, 'description', e.target.value)}
                                    placeholder="Describe what the student should code. e.g. Write a function named 'hello' that prints 'Hello World!' to the screen."
                                    rows={3}
                                    className="w-full bg-grey-dark border-3 border-grey-light rounded-xl py-2.5 px-3.5 text-white placeholder-text-secondary outline-none focus:border-blue-light transition-colors text-sm resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-text-secondary font-bold text-xs mb-1 uppercase">Expected Console Output</label>
                                <input
                                    type="text"
                                    value={les.expectedOutput}
                                    onChange={(e) => updateLesson(index, 'expectedOutput', e.target.value)}
                                    placeholder="e.g. Hello World!"
                                    className="w-full bg-grey-dark border-3 border-grey-light rounded-xl py-2.5 px-3.5 text-white placeholder-text-secondary outline-none focus:border-blue-light transition-colors text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full mt-4 py-4 bg-blue text-white text-[18px] font-bold rounded-2xl transition-all shadow-[0_5px_0_0_#264D73] hover:shadow-[0_0px_0_0_#264D73] hover:translate-y-[3px] disabled:opacity-50 disabled:pointer-events-none"
                >
                    {saving ? "SAVING..." : "CREATE COURSE"}
                </button>
            </form>
        </div>
    );
};
