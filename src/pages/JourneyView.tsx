import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { pythonJourney } from '../data/journeys';
import type { Lesson } from '../data/journeys';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const getJourney = (id: string) => {
    if (id === 'python') return pythonJourney;
    return null;
};

export const JourneyView = () => {
    const { journeyId } = useParams();
    const journey = getJourney(journeyId || '');
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { user, addJourney, journeys, lessons } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `${journey?.title || 'Journey'} - Koddy`;
        if (journeyId && journeyId !== 'python') {
            navigate('/journeys');
        } else if (journeyId) {
            localStorage.setItem('lastJourneyId', journeyId);
            if (!journeys.includes(journeyId)) {
                addJourney(journeyId).catch(console.error);
            }
        }
    }, [journey, journeyId, journeys, addJourney, navigate]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setActiveNode(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!journey) {
            navigate('/journeys');
        }
    }, [journey, navigate]);

    if (!journey) {
        return null;
    }

    const lessonStates = useMemo(() => {
        if (!journey) return {};
        const states: Record<string, 'passed' | 'unlocked' | 'locked'> = {};
        let isNextUnlocked = true;
        const firstLessonId = journey.chapters[0]?.lessons[0]?.id;

        journey.chapters.forEach(chapter => {
            chapter.lessons.forEach((lesson, index) => {
                const isPassed = lessons.some(l => l.lessonId === lesson.id && l.journeyId === journeyId);

                if (lesson.id === firstLessonId) {
                    if (isPassed) {
                        states[lesson.id] = 'passed';
                        isNextUnlocked = true;
                    } else {
                        states[lesson.id] = 'unlocked';
                        isNextUnlocked = false;
                    }
                    return;
                }

                if (lesson.type === 'lesson-trophy') {
                    const allPrevPassed = chapter.lessons.slice(0, index).filter(l => l.type !== 'lesson-mastery').every(l => states[l.id] === 'passed');
                    if (allPrevPassed) {
                        states[lesson.id] = 'passed';
                        isNextUnlocked = true;
                    } else {
                        states[lesson.id] = 'locked';
                    }
                } else if (lesson.type === 'lesson-mastery') {
                    const prevLesson = chapter.lessons[index - 1];
                    const prevPassed = prevLesson ? states[prevLesson.id] === 'passed' : false;
                    if (isPassed) states[lesson.id] = 'passed';
                    else if (prevPassed) states[lesson.id] = 'unlocked';
                    else states[lesson.id] = 'locked';
                } else {
                    if (isPassed) {
                        states[lesson.id] = 'passed';
                        isNextUnlocked = true;
                    } else if (isNextUnlocked) {
                        states[lesson.id] = 'unlocked';
                        isNextUnlocked = false;
                    } else {
                        states[lesson.id] = 'locked';
                    }
                }
            });
        });
        return states;
    }, [journey, journeyId, lessons]);

    const handleStartLesson = (lesson: Lesson) => {
        if (lessonStates[lesson.id] === 'locked' || lessonStates[lesson.id] === 'passed') return;

        if ((user?.energy ?? 5) <= 0) {
            toast.error('Not enough energy to start a lesson!', {
                style: {
                    background: '#202425',
                    color: '#fff',
                    border: '2px solid #323639',
                    borderRadius: '12px'
                }
            });
            return;
        }

        navigate(`/journeys/${journeyId}/lessons/${lesson.id}`);
    };

    return (
        <div className="flex-1 p-8 w-full max-w-[700px]" onClick={() => setActiveNode(null)} ref={containerRef}>
            <div className="w-full max-w-[600px] px-4 flex flex-col items-center relative">
                {journey.chapters.map((chapter, chapterIndex) => {
                    const mainLessons = chapter.lessons.filter(l => l.type !== 'lesson-mastery');

                    return (
                        <div key={chapter.id} className="w-full mb-16 flex flex-col items-center relative z-10">
                            {/* Синяя плашка — зафиксирована на месте (не sticky) */}
                            <div className="w-full max-w-[600px] mb-10 z-40">
                                <div className="bg-blue-dark rounded-xl p-4 flex flex-col">
                                    <div className="flex items-center text-white/80 font-bold text-sm mb-1 uppercase tracking-wide">
                                        <Link to="/journeys" className="hover:text-white mr-2 flex items-center">
                                            Chapter {chapterIndex + 1}
                                        </Link>
                                    </div>
                                    <h2 className="text-white text-xl font-bold">{chapter.title}</h2>
                                </div>
                            </div>

                            <div className="relative flex flex-col items-center w-full z-20">
                                {mainLessons.map((lesson, mainIndex) => {
                                    const state = lessonStates[lesson.id] || 'locked';
                                    const isActive = activeNode === lesson.id;

                                    const isLast = mainIndex === mainLessons.length - 1;
                                    const nextMainLesson = isLast ? null : mainLessons[mainIndex + 1];

                                    const originalIndex = chapter.lessons.findIndex(l => l.id === lesson.id);
                                    const possibleMastery = chapter.lessons[originalIndex + 1];
                                    const masteryLesson = possibleMastery?.type === 'lesson-mastery' ? possibleMastery : null;

                                    const getNodePosition = (index: number) => {
                                        if (index === 0 || index === mainLessons.length - 1 || index === mainLessons.length - 2) return 0;
                                        return index % 2 === 1 ? 1 : 2;
                                    };

                                    const currentPos = getNodePosition(mainIndex);
                                    const nextPos = nextMainLesson ? getNodePosition(mainIndex + 1) : 0;

                                    const nodeTransformClass =
                                        currentPos === 0 ? 'translate-x-0' :
                                            currentPos === 1 ? '-translate-x-[50px]' : 'translate-x-[50px]';

                                    let pathSrc = '/path-center.svg';
                                    let pathTransformClass = 'translate-x-0';

                                    let pathWidthClass = 'w-24';

                                    if (nextMainLesson?.type === 'lesson-trophy') {
                                        pathSrc = '/path-trophy.svg';
                                        pathTransformClass = 'translate-x-0';
                                    } else if (nextMainLesson) {
                                        if (currentPos === 0 && nextPos === 1) {
                                            pathSrc = '/path-left.svg';
                                            pathTransformClass = '-translate-x-[25px]';
                                        }
                                        else if (currentPos === 0 && nextPos === 2) {
                                            pathSrc = '/path-right.svg';
                                            pathTransformClass = 'translate-x-[25px]';
                                        }
                                        else if (currentPos === 1 && nextPos === 0) {
                                            pathSrc = '/path-right.svg';
                                            pathTransformClass = '-translate-x-[25px]';
                                        }
                                        else if (currentPos === 2 && nextPos === 0) {
                                            pathSrc = '/path-left.svg';
                                            pathTransformClass = 'translate-x-[25px]';
                                        }

                                        else if (currentPos === 1 && nextPos === 2) {
                                            pathSrc = '/path-right.svg';
                                            pathTransformClass = 'translate-x-0';
                                            pathWidthClass = 'w-[140px]';
                                        }

                                        else if (currentPos === 2 && nextPos === 1) {
                                            pathSrc = '/path-left.svg';
                                            pathTransformClass = 'translate-x-0';
                                            pathWidthClass = 'w-[140px]';
                                        }
                                    }

                                    const isBranchRight = currentPos === 2;
                                    const isCurrentNodeActive = activeNode === lesson.id || (masteryLesson && activeNode === masteryLesson.id);

                                    return (
                                        <div
                                            key={lesson.id}
                                            className="relative flex flex-col items-center w-full -mb-2"
                                            style={{ zIndex: isCurrentNodeActive ? 40 : 10 }}
                                        >

                                            <div className={`relative z-30 ${nodeTransformClass}`}>
                                                <button
                                                    className="relative focus:outline-none group z-30 block"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (state !== 'locked' && state !== 'passed') {
                                                            setActiveNode(isActive ? null : lesson.id);
                                                        }
                                                    }}
                                                >
                                                    {getLessonNode(lesson, state)}
                                                </button>

                                                {isActive && (
                                                    <div className="absolute top-[calc(100%+15px)] left-1/2 -translate-x-1/2 bg-grey border-3 border-grey-light rounded-2xl p-5 shadow-2xl z-50 w-[300px]">
                                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-grey rotate-45 border-l-3 border-t-3 border-grey-light"></div>
                                                        <div className="relative z-10">
                                                            <h3 className="font-bold text-xl mb-2">{lesson.title}</h3>
                                                            <p className="text-text-secondary font-medium text-[15px] mb-5 leading-snug">{lesson.description}</p>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleStartLesson(lesson);
                                                                }}
                                                                className="w-full bg-grey hover:bg-primary-hover text-blue font-bold py-3 px-4 rounded-xl text-center uppercase tracking-wider border-2 border-grey-light shadow-[0_4px_0_0_#494D50] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#494D50] transition-all"
                                                            >
                                                                START +10 XP
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {masteryLesson && (() => {
                                                    const mState = lessonStates[masteryLesson.id] || 'locked';
                                                    const isMasteryActive = activeNode === masteryLesson.id;

                                                    return (
                                                        <div className={`absolute top-1/2 -translate-y-1/2 flex items-center z-20 mt-5 ${isBranchRight ? 'right-full mr-[-2px] flex-row-reverse' : 'left-full ml-[-2px]'}`}>
                                                            <div className="w-16 h-16 flex items-center justify-center z-10 mb-10">
                                                                <img src="/path-mastery.svg" alt="" className="w-16 h-16 object-contain" />
                                                            </div>
                                                            <div className="relative z-20 mb-10">
                                                                {isMasteryActive}
                                                                <button
                                                                    className="relative focus:outline-none group block"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (mState !== 'locked' && mState !== 'passed') {
                                                                            setActiveNode(isMasteryActive ? null : masteryLesson.id);
                                                                        }
                                                                    }}
                                                                >
                                                                    {getLessonNode(masteryLesson, mState)}
                                                                </button>

                                                                {isMasteryActive && (
                                                                    <div className={`absolute top-[calc(100%+15px)] ${isBranchRight ? 'right-0' : 'left-0'} bg-grey border-3 border-grey-light rounded-2xl p-5 shadow-2xl z-50 w-[300px]`}>
                                                                        <div className={`absolute -top-2 ${isBranchRight ? 'right-6' : 'left-6'} w-4 h-4 bg-grey rotate-45 border-l-3 border-t-3 border-grey-light`}></div>
                                                                        <div className="relative z-10">
                                                                            <h3 className="font-bold text-xl mb-2">{masteryLesson.title}</h3>
                                                                            <p className="text-text-secondary font-medium text-[15px] mb-5 leading-snug">{masteryLesson.description}</p>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleStartLesson(masteryLesson);
                                                                                }}
                                                                                className="w-full bg-grey hover:bg-primary-hover text-blue font-bold py-3 px-4 rounded-xl text-center uppercase tracking-wider border-2 border-grey-light shadow-[0_4px_0_0_#494D50] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#494D50] transition-all"
                                                                            >
                                                                                START +20 XP
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {
                                                !isLast && (
                                                    <div className={`flex items-center justify-center h-[45px] -mt-1 -mb-1 z-10 relative pointer-events-none ${pathTransformClass}`}>
                                                        <img
                                                            src={pathSrc}
                                                            alt="Path"
                                                            className={`${pathWidthClass} h-16 object-fill max-w-none drop-shadow-lg`}
                                                            style={{

                                                                transform: pathSrc.includes('path-left')
                                                                    ? 'scale(1.3) rotate(45deg)'
                                                                    : pathSrc.includes('path-right')
                                                                        ? 'scale(1.25) rotate(-45deg)'
                                                                        : 'none'
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
};

function getLessonNode(lesson: Lesson, state: 'passed' | 'unlocked' | 'locked') {
    const isLocked = state === 'locked';
    const isPassed = state === 'passed';

    const getIconSrc = () => {
        if (lesson.type === 'lesson-theory') return '/lesson-theory.svg';
        if (lesson.type === 'lesson-mastery') return '/lesson-mastery.svg';
        if (lesson.type === 'lesson-challenge') return '/lesson-challenge.svg';
        if (lesson.type === 'lesson-project') return '/lesson-project.svg';
        if (lesson.type === 'lesson-trophy') return '/lesson-trophy.svg';
        return '/lesson-all.svg';
    };

    return (
        <div className="relative w-[75px] h-[75px] flex items-center justify-center filter drop-shadow-lg select-none group">
            {isPassed ? (
                <img src="/hex-closed-base.svg" alt="Outer Base" className="absolute inset-0 w-full h-full hue-rotate-[100deg] brightness-125" />
            ) : !isLocked ? (
                <img src="/hex-closed-base.svg" alt="Outer Base" className="absolute inset-0 w-full h-full" />
            ) : (
                <img src="/hex-locked-base.svg" alt="Outer Base" className="absolute inset-0 w-full h-full" />
            )}

            <div className={`absolute inset-0 flex flex-col items-center justify-start pt-[1px] transition-transform duration-200 ${!isLocked ? 'group-hover:translate-y-[2px] group-active:translate-y-[5px]' : ''}`}>
                <div className="relative w-[75%] h-[75%] flex items-center justify-center">
                    {isPassed ? (
                        <img src="/hex-closed-base.svg" alt="Inner Base" className="absolute inset-0 w-full h-full hue-rotate-[100deg] brightness-125" />
                    ) : !isLocked ? (
                        <img src="/hex-closed-base.svg" alt="Inner Base" className="absolute inset-0 w-full h-full" />
                    ) : (
                        <img src="/hex-locked-base.svg" alt="Inner Base" className="absolute inset-0 w-full h-full" />
                    )}

                    <div className="relative z-10 w-10 h-10 flex items-center justify-center mt-[-8px]">
                        <img
                            src={getIconSrc()}
                            alt={lesson.title}
                            className={`w-7 h-7 object-contain ${isLocked ? 'opacity-50 filter grayscale' : 'brightness-110'}`}
                        />
                        {isPassed && (
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#58A700] rounded-full border-[3px] border-grey-dark flex items-center justify-center shadow-sm">
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}