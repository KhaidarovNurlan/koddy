import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Courses = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDropdown, setActiveDropdown] = useState<'language' | 'difficulty' | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

    const languageRef = useRef<HTMLDivElement>(null);
    const difficultyRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Explore Courses - Koddy";
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch('/api/courses', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCourses(data.courses || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const clickedLanguage = languageRef.current?.contains(target);
            const clickedDifficulty = difficultyRef.current?.contains(target);

            if (!clickedLanguage && !clickedDifficulty) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (type: 'language' | 'difficulty') => {
        setActiveDropdown(prev => prev === type ? null : type);
    };

    const filteredCourses = courses.filter(course => {
        const matchesLanguage = selectedLanguage === 'All' || course.language.toLowerCase() === selectedLanguage.toLowerCase();
        const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
        return matchesLanguage && matchesDifficulty;
    });

    return (
        <div className="flex-1 p-8 w-full max-w-[850px] mx-auto animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-[20px] font-bold text-white">Courses</h1>
                <Link to="/courses/create" className="inline-flex items-center justify-center px-4 lg:px-8 py-2.5 bg-blue text-white text-[16px] lg:text-[18px] font-semibold rounded-xl transition-all shadow-[0_5px_0_0_#264D73] hover:shadow-[0_0px_0_0_#264D73] hover:translate-y-[3px]">
                    CREATE COURSE
                </Link>
            </div>

            <div className="flex gap-3 mb-8 relative z-30">
                <div className="relative" ref={languageRef}>
                    <div
                        onClick={() => toggleDropdown('language')}
                        className={`flex items-center gap-2 px-3 py-1.5 border border-grey-light/50 rounded-lg cursor-pointer hover:bg-grey/50 transition-colors ${activeDropdown === 'language' ? 'bg-grey/50' : ''}`}
                    >
                        <span className="text-[16px] lg:text-[18px] font-medium text-white">
                            Language: {selectedLanguage}
                        </span>
                        <img
                            src="/down-white.svg"
                            className={`w-4 h-4 opacity-50 transition-transform duration-200 ${activeDropdown === 'language' ? 'rotate-180' : ''}`}
                        />
                    </div>

                    {activeDropdown === 'language' && (
                        <div className="absolute left-0 top-[calc(100%+6px)] w-48 bg-grey-dark border border-grey-light/50 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            {['All', 'Python', 'JavaScript', 'C++', 'Java', 'C#'].map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => {
                                        setSelectedLanguage(lang);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-grey/50 text-[15px] font-medium transition-colors text-white"
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative" ref={difficultyRef}>
                    <div
                        onClick={() => toggleDropdown('difficulty')}
                        className={`flex items-center gap-2 px-3 py-1.5 border border-grey-light/50 rounded-lg cursor-pointer hover:bg-grey/50 transition-colors ${activeDropdown === 'difficulty' ? 'bg-grey/50' : ''}`}
                    >
                        <span className="text-[16px] lg:text-[18px] font-medium text-white">
                            Difficulty: {selectedDifficulty}
                        </span>
                        <img
                            src="/down-white.svg"
                            className={`w-4 h-4 opacity-50 transition-transform duration-200 ${activeDropdown === 'difficulty' ? 'rotate-180' : ''}`}
                        />
                    </div>

                    {activeDropdown === 'difficulty' && (
                        <div className="absolute left-0 top-[calc(100%+6px)] w-48 bg-grey-dark border border-grey-light/50 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                                <button
                                    key={diff}
                                    onClick={() => {
                                        setSelectedDifficulty(diff);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-grey/50 text-[15px] font-medium transition-colors text-white font-semibold"
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col mb-8">
                {loading ? (
                    <p className="text-text-secondary py-4 text-center">Loading courses...</p>
                ) : filteredCourses.length === 0 ? (
                    <p className="text-text-secondary py-4 text-center">No courses found matching filters.</p>
                ) : (
                    filteredCourses.map((course, i) => (
                        <div
                            key={course.id || i}
                            onClick={() => navigate(`/courses/${course.id}`)}
                            className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-0 justify-between py-4 border-b border-grey-light/20 last:border-0 hover:bg-grey/30 px-3 rounded-lg cursor-pointer transition-colors -mx-3"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl bg-blue flex-shrink-0 flex items-center justify-center text-[12px] font-bold text-white shadow-md">
                                    {course.language.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[16px] lg:text-[18px] text-white font-bold">{course.title}</span>
                                    <span className="text-[12px] text-text-secondary font-medium">By @{course.creatorName}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pl-9 lg:pl-4">
                                <div className="px-3 py-1 rounded-full bg-grey-light/20 min-w-[75px] flex items-center justify-center border border-grey-light/25">
                                    <span className="text-[14px] font-medium text-white">{course.language}</span>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-grey-light/20 min-w-[75px] flex items-center justify-center border border-grey-light/25">
                                    <span className="text-[14px] font-medium text-white capitalize">{course.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};