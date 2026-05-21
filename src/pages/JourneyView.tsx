import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pythonJourney } from '../data/journeys';
import type { Lesson, Chapter } from '../data/journeys';

const getJourney = (id: string) => {
    if (id === 'python') return pythonJourney;
    return null;
};

export const JourneyView = () => {
    const { journeyId } = useParams();
    const journey = getJourney(journeyId || '');
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.title = `${journey?.title || 'Journey'} - Koddy`;
    }, [journey]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setActiveNode(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!journey) {
        return (
            <div className="p-6 md:p-10 flex flex-col items-center text-center max-w-[1200px] w-full mx-auto">
                <h1 className="text-2xl font-bold mb-4">Journey not found!</h1>
                <p className="text-text-secondary mb-6">We are currently building this journey.</p>
                <Link to="/journeys" className="bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-xl">
                    Back to Journeys
                </Link>
            </div>
        );
    }

    const getLessonState = (lesson: Lesson, chapter: Chapter, chapterIndex: number) => {
        const index = chapter.lessons.findIndex(l => l.id === lesson.id);
        const isUnlocked = chapterIndex === 0 && index === 0;
        return isUnlocked;
    };

    return (
        <div className="flex-1 p-8 w-full max-w-[700px]" onClick={() => setActiveNode(null)}>
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

                            <div className="relative flex flex-col items-center w-full z-20" ref={containerRef}>
                                {mainLessons.map((lesson, mainIndex) => {
                                    const isUnlocked = getLessonState(lesson, chapter, chapterIndex);
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

                                    return (
                                        <div key={lesson.id} className="relative flex flex-col items-center w-full -mb-2">

                                            <div className={`relative z-30 ${nodeTransformClass}`}>
                                                <button
                                                    className="relative focus:outline-none group z-30 block"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveNode(isActive ? null : lesson.id);
                                                    }}
                                                >
                                                    {getLessonNode(lesson, isUnlocked)}
                                                </button>

                                                {masteryLesson && (() => {
                                                    const mState = getLessonState(masteryLesson, chapter, chapterIndex);
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
                                                                        setActiveNode(isMasteryActive ? null : masteryLesson.id);
                                                                    }}
                                                                >
                                                                    {getLessonNode(masteryLesson, mState)}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {!isLast && (
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
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

function getLessonNode(lesson: Lesson, isUnlocked: boolean) {
    const isLocked = !isUnlocked;

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
            {isUnlocked ? (
                <img src="/hex-closed-base.svg" alt="Outer Base" className="absolute inset-0 w-full h-full" />
            ) : (
                <img src="/hex-locked-base.svg" alt="Outer Base" className="absolute inset-0 w-full h-full" />
            )}

            <div className={`absolute inset-0 flex flex-col items-center justify-start pt-[1px] transition-transform duration-200 ${!isLocked ? 'group-hover:translate-y-[2px] group-active:translate-y-[5px]' : ''}`}>
                <div className="relative w-[75%] h-[75%] flex items-center justify-center">
                    {isUnlocked ? (
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
                    </div>
                </div>
            </div>
        </div>
    );
}