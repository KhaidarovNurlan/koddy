import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Journey, Lesson, Chapter } from '../data/journeys';
import { allJourneys } from '../data/journeys';
import { useAuth } from '../context/AuthContext';

const QuizView = ({ quiz, onComplete, onSkip }: { quiz: any; onComplete: (xp: number, tokens: number, noMistakes: boolean) => void; onSkip: () => void }) => {
    const [state, setState] = useState<'intro' | 'playing'>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [failedQuestions, setFailedQuestions] = useState<any[]>([]);
    const [questionQueue, setQuestionQueue] = useState<any[]>([]);
    const [mistakes, setMistakes] = useState(0);

    const handleStart = () => {
        setQuestionQueue([...quiz.questions]);
        setState('playing');
        setCurrentQuestionIndex(0);
        setFailedQuestions([]);
    };

    const currentQuestion = questionQueue[currentQuestionIndex];

    const handleSubmit = () => {
        if (selectedOptionIndex === null) return;
        setIsSubmitted(true);
    };

    const handleContinue = () => {
        const option = currentQuestion.options[selectedOptionIndex!];
        let newFailedQuestions = [...failedQuestions];

        if (!option.isCorrect) {
            setMistakes(m => m + 1);
            if (!newFailedQuestions.find(q => q.id === currentQuestion.id)) {
                newFailedQuestions.push(currentQuestion);
                setFailedQuestions(newFailedQuestions);
            }
        }

        if (currentQuestionIndex < questionQueue.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOptionIndex(null);
            setIsSubmitted(false);
        } else {
            if (newFailedQuestions.length > 0) {
                setQuestionQueue([...newFailedQuestions]);
                setFailedQuestions([]);
                setCurrentQuestionIndex(0);
                setSelectedOptionIndex(null);
                setIsSubmitted(false);
            } else {
                onComplete(quiz.xp, quiz.tokens, mistakes === 0);
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                if (state === 'playing') {
                    if (!isSubmitted && selectedOptionIndex !== null) {
                        handleSubmit();
                    } else if (isSubmitted) {
                        handleContinue();
                    }
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [state, isSubmitted, selectedOptionIndex, currentQuestionIndex, failedQuestions, questionQueue]);

    if (state === 'intro') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-grey-dark">
                <h2 className="text-2xl font-bold mb-8 text-white">Ready To Start Quiz?</h2>
                <div className="flex flex-col gap-4 w-[280px]">
                    <button
                        onClick={handleStart}
                        className="w-full inline-flex items-center justify-center px-10 py-3.5 cursor-pointer bg-blue text-white font-bold rounded-xl transition-all border-blue-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    >
                        START QUIZ
                    </button>
                    <button
                        onClick={onSkip}
                        className="w-full inline-flex items-center justify-center px-10 py-3.5 bg-grey text-white font-bold rounded-xl transition-all border-grey-light border-[2px] border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
                    >
                        SKIP QUIZ
                    </button>
                </div>
                <div className="mt-8 text-center">
                    <a href="#" className="text-blue-light text-xs font-bold hover:underline">Always skip quizzes</a>
                    <div className="text-text-secondary text-[11px] mt-1">You can change this in settings</div>
                </div>
            </div>
        );
    }

    const progress = (currentQuestionIndex / questionQueue.length) * 100;
    const isCorrect = isSubmitted && selectedOptionIndex !== null && currentQuestion.options[selectedOptionIndex].isCorrect;

    const renderQuestionContent = () => {
        if (currentQuestion.type === 'mark-lines') {
            return (
                <div className="w-full max-w-[600px] mt-8">
                    <p className="text-sm font-semibold mb-6 text-white">{currentQuestion.question}</p>
                    <div className="flex flex-col gap-2 mb-6">
                        {currentQuestion.options.map((opt: any, idx: number) => (
                            <div
                                key={idx}
                                onClick={() => !isSubmitted && setSelectedOptionIndex(idx)}
                                className={`flex items-center bg-[#1c1c1c] border rounded-lg cursor-pointer transition-colors p-3 ${selectedOptionIndex === idx ? 'border-blue-light bg-blue-light/10' : 'border-grey-light hover:bg-grey'
                                    }`}
                            >
                                <div className="w-8 text-center text-text-secondary font-mono text-xs border-r border-grey-lighter pr-2 mr-3">{idx + 1}</div>
                                <div className="font-mono text-sm text-white/90">{opt.text}</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-text-secondary">Select the line(s) to mark</p>
                </div>
            );
        }

        if (currentQuestion.type === 'multiple-choice') {
            return (
                <div className="w-full max-w-[600px] mt-8">
                    <p className="text-sm font-semibold mb-6 text-white">{currentQuestion.question}</p>
                    {currentQuestion.codeSnippet && (
                        <div className="bg-[#1c1c1c] border border-grey-light rounded-lg p-4 font-mono text-sm text-white/90 mb-8">
                            {currentQuestion.codeSnippet}
                        </div>
                    )}
                    <div className="flex flex-col gap-3">
                        {currentQuestion.options.map((opt: any, idx: number) => (
                            <div
                                key={idx}
                                onClick={() => !isSubmitted && setSelectedOptionIndex(idx)}
                                className={`flex items-center bg-grey border rounded-xl cursor-pointer transition-colors p-4 ${selectedOptionIndex === idx ? 'border-blue-light bg-blue-light/10' : 'border-grey-light hover:border-grey-lighter'
                                    }`}
                            >
                                <div className="w-6 h-6 rounded flex items-center justify-center bg-[#1c1c1c] text-text-secondary font-bold text-xs mr-4">{idx + 1}</div>
                                <div className="font-semibold text-sm text-white/90">{opt.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (currentQuestion.type === 'fill-in-blank') {
            const parts = currentQuestion.codeSnippet?.split('___') || [];

            return (
                <div className="w-full max-w-[600px] mt-8">
                    <p className="text-sm font-semibold mb-6 text-white">{currentQuestion.question}</p>
                    <div className="bg-[#1c1c1c] border border-grey-light rounded-lg p-4 font-mono text-sm text-white/90 mb-8 flex items-center">
                        <span className="text-text-secondary w-8 border-r border-grey-lighter mr-4 text-center">1</span>
                        <div className="flex items-center">
                            {parts[0]}
                            <span className={`inline-block px-4 py-1 mx-1 border-b-2 font-bold ${selectedOptionIndex !== null ? 'text-white border-white' : 'text-text-secondary border-text-secondary'}`}>
                                {selectedOptionIndex !== null ? currentQuestion.options[selectedOptionIndex].text : '   '}
                            </span>
                            {parts[1]}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        {currentQuestion.options.map((opt: any, idx: number) => (
                            <div
                                key={idx}
                                onClick={() => !isSubmitted && setSelectedOptionIndex(idx)}
                                className={`flex items-center bg-grey border rounded-xl cursor-pointer transition-colors p-4 ${selectedOptionIndex === idx ? 'border-blue-light bg-blue-light/10' : 'border-grey-light hover:border-grey-lighter'
                                    }`}
                            >
                                <div className="w-6 h-6 rounded flex items-center justify-center bg-[#1c1c1c] text-text-secondary font-bold text-xs mr-4">{idx + 1}</div>
                                <div className="font-semibold text-sm text-white/90">{opt.text}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="flex-1 flex flex-col bg-grey-dark relative overflow-hidden">
            <div className="h-[60px] flex items-center px-6 shrink-0 relative z-10 pt-4">
                <button onClick={onSkip} className="p-2 hover:bg-grey-lighter rounded-lg transition-colors mr-4">
                    <svg className="w-5 h-5 text-text-secondary hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div className="flex-1 max-w-[800px] mx-auto h-2.5 bg-grey rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-light transition-all duration-300 rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="ml-4 flex items-center gap-1 font-bold text-sm">
                    <img src="/energy.svg" className="w-4 h-4" alt="energy" />
                    <span className="text-white">4</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto flex justify-center px-6 pb-[250px]">
                {renderQuestionContent()}
            </div>

            {!isSubmitted ? (
                <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center border-t border-grey-lighter bg-grey-dark">
                    <div className="w-full max-w-[600px]">
                        <button
                            onClick={handleSubmit}
                            disabled={selectedOptionIndex === null}
                            className={`w-full py-3.5 rounded-xl font-bold uppercase transition-all border-b-4 flex items-center justify-center ${selectedOptionIndex !== null
                                ? 'bg-blue text-white border-blue-dark hover:brightness-110 active:border-b-2 active:translate-y-[2px]'
                                : 'bg-grey text-text-secondary border-grey-light cursor-not-allowed'
                                }`}
                        >
                            Submit <span className="text-xs bg-black/20 px-2 py-1 rounded ml-2 normal-case">Enter ↵</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center border-t border-grey-lighter bg-grey">
                    <div className="w-full max-w-[600px]">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0 ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                    }`}>
                                    {isCorrect ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    )}
                                </div>
                                <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                    {isCorrect ? 'Correct answer!' : 'Wrong answer!'}
                                </h3>
                            </div>
                            <svg className="w-5 h-5 text-text-secondary cursor-pointer hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg>
                        </div>
                        <div className="text-white/90 text-sm font-medium mb-6">
                            {currentQuestion.options[selectedOptionIndex!].explanation}
                        </div>
                        <button
                            onClick={handleContinue}
                            className={`w-full flex items-center justify-center py-3.5 rounded-xl font-bold uppercase transition-all border-b-4 text-white hover:brightness-110 active:border-b-2 active:translate-y-[2px] bg-blue border-blue-dark`}
                        >
                            Continue <span className="text-xs bg-black/20 px-2 py-1 rounded ml-2 normal-case">Enter ↵</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const HintItem = ({ hint, index, onReveal }: { hint: string; index: number; onReveal: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-grey-lighter rounded-xl bg-[#1c1c1c] overflow-hidden mb-2">
            <div
                className="p-3 flex justify-between items-center cursor-pointer hover:bg-grey-dark transition-colors"
                onClick={() => {
                    if (!isOpen) onReveal();
                    setIsOpen(!isOpen);
                }}
            >
                <div>
                    <div className="text-blue-light font-bold text-sm mb-0.5">Hint {index + 1}</div>
                    <div className="text-xs text-text-secondary">{isOpen ? 'Revealed' : 'Reveal hint'}</div>
                </div>
                <svg className={`w-5 h-5 text-text-secondary transform transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
            {isOpen && (
                <div className="p-3 border-t border-grey-lighter text-sm text-white/90">
                    {hint}
                </div>
            )}
        </div>
    );
};

const LessonCompletedModal = ({
    xp,
    tokens,
    energy = 1,
    firstTry,
    noMistakes,
    isQuiz,
    onContinue
}: {
    xp: number,
    tokens: number,
    energy?: number,
    firstTry?: boolean,
    noMistakes?: boolean,
    isQuiz?: boolean,
    onContinue: () => void
}) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80">
            <div className="bg-[#2B2D2E] rounded-3xl p-8 w-[400px] shadow-2xl flex flex-col items-center border border-grey-light relative animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Lesson Completed!</h2>

                <div className="flex gap-4 w-full my-6">
                    <div className="flex-1 bg-[#1c1c1c] border border-grey-light rounded-2xl p-4 flex flex-col items-center justify-center">
                        <span className="text-blue-light font-bold text-2xl mb-1">+{xp}</span>
                        <span className="text-text-secondary text-xs uppercase tracking-wider font-bold">XP</span>
                    </div>
                    <div className="flex-1 bg-[#1c1c1c] border border-grey-light rounded-2xl p-4 flex flex-col items-center justify-center">
                        <span className="text-orange font-bold text-2xl mb-1">+{tokens}</span>
                        <span className="text-text-secondary text-xs uppercase tracking-wider font-bold">Tokens</span>
                    </div>
                    <div className="flex-1 bg-[#1c1c1c] border border-grey-light rounded-2xl p-4 flex flex-col items-center justify-center">
                        <span className="text-red-500 font-bold text-2xl mb-1">-{energy}</span>
                        <span className="text-text-secondary text-xs uppercase tracking-wider font-bold">Energy</span>
                    </div>
                </div>

                {isQuiz ? (
                    noMistakes && (
                        <div className="w-full bg-[#1c1c1c] border border-grey-light rounded-xl p-3 mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-yellow-500/20 p-2 rounded-lg">
                                    <span className="text-xl">🎯</span>
                                </div>
                                <span className="font-bold text-white text-sm">No Mistakes!</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-orange font-bold text-sm">+1</span>
                                <img src="/token.svg" className="w-4 h-4" alt="tokens" />
                            </div>
                        </div>
                    )
                ) : (
                    firstTry && (
                        <div className="w-full bg-[#1c1c1c] border border-grey-light rounded-xl p-3 mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-yellow-500/20 p-2 rounded-lg">
                                    <span className="text-xl">🎯</span>
                                </div>
                                <span className="font-bold text-white text-sm">First Try!</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-orange font-bold text-sm">+1</span>
                                <img src="/token.svg" className="w-4 h-4" alt="tokens" />
                            </div>
                        </div>
                    )
                )}

                <button
                    onClick={onContinue}
                    className="w-full py-3.5 rounded-xl bg-blue border-b-4 border-blue-dark hover:brightness-110 active:border-b-2 active:translate-y-[2px] transition-all font-bold text-white uppercase tracking-wider"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export const LessonView = () => {
    const { journeyId, lessonId } = useParams();
    const navigate = useNavigate();
    const { user, completeLesson, consumeEnergy, submitTask } = useAuth();

    const journey = (journeyId ? allJourneys[journeyId] : null) as Journey | null;

    let lesson: Lesson | null = null;
    let chapter: Chapter | null = null;

    if (journey) {
        for (const c of journey.chapters) {
            const l = c.lessons.find(l => l.id === lessonId);
            if (l) {
                lesson = l;
                chapter = c;
                break;
            }
        }
    }

    const quiz = lesson?.quiz;

    const [isSolutionOpen, setIsSolutionOpen] = useState(false);
    const [showSolutionModal, setShowSolutionModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [isTheoryHidden, setIsTheoryHidden] = useState(false);
    const [activeTab, setActiveTab] = useState<'lesson' | 'submissions' | 'support' | 'feedback'>('lesson');

    const [code, setCode] = useState(lesson?.codingChallenge?.starterCode || '');
    const [output, setOutput] = useState<string>('');
    const [hintsUsed, setHintsUsed] = useState(false);

    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [completedData, setCompletedData] = useState<{ xp: number, tokens: number, energy?: number, firstTry?: boolean, noMistakes?: boolean, isQuiz?: boolean } | null>(null);

    const [isRunning, setIsRunning] = useState(false);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);

    const fetchSubmissions = async () => {
        if (!lesson) return;
        setLoadingSubmissions(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/user/lessons/submissions/${lesson.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data.submissions || []);
            }
        } catch (err) {
            console.error('Failed to fetch submissions:', err);
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const handleLoadSubmission = (subCode: string) => {
        setCode(subCode);
    };

    useEffect(() => {
        if (lesson?.codingChallenge) {
            setCode(lesson.codingChallenge.starterCode);
            setIsSolutionOpen(false);
            setIsTheoryHidden(false);
        }

        if (user && user.energy <= 0) {
            navigate(`/journeys/${journeyId}`);
        }
    }, [lesson, user?.energy, navigate, journeyId]);

    useEffect(() => {
        if (activeTab === 'submissions') {
            fetchSubmissions();
        }
    }, [activeTab, lesson?.id]);

    if (!lesson) {
        return <div className="p-10 text-center text-white">Lesson not found</div>;
    }

    const handleReveal = () => {
        setIsSolutionOpen(true);
        setHintsUsed(true);
        setShowSolutionModal(false);
    };

    const handleCopyToEditor = () => {
        if (lesson?.codingChallenge) {
            setCode(lesson.codingChallenge.solution);
        }
    };

    const handleResetCode = () => {
        if (lesson?.codingChallenge) {
            setCode(lesson.codingChallenge.starterCode);
        }
    };

    const numLines = code.split('\n').length;
    const linesArray = Array.from({ length: Math.max(1, numLines) }, (_, i) => i + 1);

    const finishLesson = async () => {
        if (!completedData || !lesson || !chapter) return;
        await completeLesson({
            journeyId,
            chapterId: chapter.id,
            lessonId: lesson.id,
            xp: completedData.xp,
            tokens: completedData.tokens
        });
        await consumeEnergy(completedData.energy);
        navigate(`/journeys/${journeyId}`);
    };

    const handleRunCode = async () => {
        if (!lesson?.codingChallenge || isRunning) return;

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
                    language: journey?.language || 'python',
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
                setOutput(finalOutput);
            } else {
                finalOutput = data.stdout;
                if (!finalOutput || finalOutput.trim() === '') {
                    finalOutput = 'Program executed with no output';
                }
                setOutput(finalOutput);
            }

            const reqOutput = lesson.codingChallenge.requiredOutput;
            const trimmedStdout = data.stdout ? data.stdout.trim() : '';
            const trimmedExpected = reqOutput ? reqOutput.trim() : '';
            const isPassed = !data.stderr && trimmedStdout === trimmedExpected;

            await submitTask({
                journeyId,
                lessonId: lesson.id,
                taskId: 'challenge',
                code,
                passed: isPassed
            });

            fetchSubmissions();

            if (isPassed) {
                const firstTry = !hintsUsed;
                const challengeXp = lesson.codingChallenge.xp;
                const challengeEnergy = lesson.codingChallenge.energy !== undefined ? lesson.codingChallenge.energy : 1;
                const challengeTokens = isSolutionOpen ? 0 : (lesson.codingChallenge.tokens + (firstTry ? 1 : 0));

                setCompletedData({
                    xp: challengeXp,
                    tokens: challengeTokens,
                    energy: challengeEnergy,
                    firstTry,
                    isQuiz: false
                });
                setShowCompletionModal(true);
            }
        } catch (err: any) {
            console.error(err);
            setOutput(`Execution failed: ${err.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-grey-dark text-white overflow-hidden relative">
            {showCompletionModal && completedData && (
                <LessonCompletedModal
                    {...completedData}
                    onContinue={finishLesson}
                />
            )}

            {showSolutionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-[#2B2D2E] rounded-2xl p-6 w-[400px] shadow-2xl flex flex-col items-center border border-grey-light">
                        <h2 className="text-xl font-bold mb-3">Reveal solution?</h2>
                        <p className="text-center text-sm text-white/80 mb-6 font-semibold px-4">
                            After revealing the solution, you won't achieve any tokens on a completion of this challenge.
                        </p>
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => setShowSolutionModal(false)}
                                className="flex-1 py-2.5 rounded-xl bg-[#3B3E41] border-b-4 border-[#252627] hover:brightness-110 active:border-b-2 active:translate-y-[2px] transition-all font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReveal}
                                className="flex-1 py-2.5 rounded-xl bg-blue border-b-4 border-blue-dark hover:brightness-110 active:border-b-2 active:translate-y-[2px] transition-all font-bold"
                            >
                                Reveal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowResetModal(false)}>
                    <div className="bg-[#2B2D2E] rounded-2xl p-6 w-[400px] shadow-2xl flex flex-col items-center border border-grey-light" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-3">Reset to default code?</h2>
                        <p className="text-center text-sm text-white/80 mb-6 font-semibold px-4">
                            Your current code won't be saved!
                        </p>
                        <button
                            onClick={() => {
                                handleResetCode();
                                setShowResetModal(false);
                            }}
                            className="w-full py-2.5 rounded-xl bg-blue border-b-4 border-blue-dark hover:brightness-110 active:border-b-2 active:translate-y-[2px] transition-all font-bold"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}

            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowSaveModal(false)}>
                    <div className="bg-[#2B2D2E] rounded-2xl p-6 w-[400px] shadow-2xl flex flex-col border border-grey-light" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Save as Project</h2>
                            <svg className="w-5 h-5 text-text-secondary cursor-pointer hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={() => setShowSaveModal(false)}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-bold text-white mb-2">Project Name</label>
                            <input
                                type="text"
                                className="w-full bg-transparent border border-blue-light rounded-lg p-2.5 text-sm text-white focus:outline-none"
                                defaultValue={lesson?.title || ''}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-white mb-2">
                                Description <span className="text-text-secondary font-normal">— optional</span>
                            </label>
                            <textarea
                                className="w-full bg-[#1c1c1c] border border-grey-light rounded-lg p-3 text-sm text-white h-24 resize-none placeholder-text-secondary focus:outline-none focus:border-blue-light"
                                placeholder="What does this code do?"
                            ></textarea>
                        </div>

                        <div className="text-[11px] text-text-secondary mb-6">
                            Language: <span className="font-bold text-white/80">{journey?.language || 'python'}</span> - main.{journey?.language === 'python' ? 'py' : 'js'}
                        </div>

                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="flex-1 py-2.5 rounded-xl bg-transparent border border-grey-light hover:brightness-110 active:translate-y-[2px] transition-all font-bold text-sm text-blue-light uppercase"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert('Project saved!');
                                    setShowSaveModal(false);
                                }}
                                className="flex-1 py-2.5 rounded-xl bg-blue border-b-4 border-blue-dark hover:brightness-110 active:border-b-2 active:translate-y-[2px] transition-all font-bold text-sm text-white uppercase"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-[60px] bg-grey-dark border-r border-grey-lighter shrink-0 flex flex-col items-center py-4 z-20">
                <div className="flex-1 flex flex-col items-center pt-1">
                    <img
                        src="/lesson-white.svg"
                        className={`w-5 h-5 cursor-pointer transition-opacity ${activeTab === 'lesson' ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                        alt="lesson"
                        onClick={() => setActiveTab('lesson')}
                    />
                </div>
                <div className="flex flex-col gap-6 items-center text-text-secondary pb-2">
                    <img
                        src="/submissions-white.svg"
                        className={`w-5 h-5 cursor-pointer transition-opacity ${activeTab === 'submissions' ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                        alt="history"
                        onClick={() => setActiveTab('submissions')}
                    />
                    <img
                        src="/support-white.svg"
                        className={`w-5 h-5 cursor-pointer transition-opacity ${activeTab === 'support' ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                        alt="support"
                        onClick={() => setActiveTab('support')}
                    />
                    <img
                        src="/feedback-white.svg"
                        className={`w-5 h-5 cursor-pointer transition-opacity ${activeTab === 'feedback' ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                        alt="feedback"
                        onClick={() => setActiveTab('feedback')}
                    />
                </div>
            </div>

            <div className="w-[350px] flex flex-col border-r border-grey-lighter shrink-0 bg-grey-dark z-10 shadow-xl">
                <div className="flex items-center p-4 border-b border-grey-lighter">
                    <Link to={`/journeys/${journeyId}`} className="text-text-secondary hover:text-white mr-4 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Link>
                    <span className="font-semibold text-lg">{chapter?.title}</span>
                </div>

                <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
                    {activeTab === 'lesson' && (
                        <>
                            <div className="flex items-start justify-between mb-3">
                                <h2 className="text-xl font-bold pr-2">{lesson.title}</h2>
                                <div className="flex gap-1 shrink-0 mt-1">
                                    <button
                                        onClick={() => setIsTheoryHidden(!isTheoryHidden)}
                                        className="text-[10px] uppercase font-bold px-2 py-1 border border-grey-light text-text-secondary rounded hover:brightness-110 transition-all"
                                    >
                                        {isTheoryHidden ? 'Show Theory' : 'Hide'}
                                    </button>
                                </div>
                            </div>

                            {!isTheoryHidden && (
                                <div className="text-text-secondary text-sm mb-8 leading-relaxed whitespace-pre-wrap">
                                    {lesson.description}
                                </div>
                            )}

                            {lesson.codingChallenge && (
                                <>
                                    <div className="mb-6">
                                        <h3 className="flex items-center font-bold text-white mb-3 gap-2 text-sm">
                                            <img src="/challenge-white.svg" className="w-4 h-4 mb-1" />
                                            Challenge
                                        </h3>
                                        <p className="text-sm text-text-secondary mb-4">{lesson.codingChallenge.challengeDescription}</p>
                                        <p className="text-sm font-bold text-white mb-2">What to do:</p>
                                        <ol className="list-decimal pl-4 text-sm text-text-secondary mb-4 space-y-1">
                                            <li>Look at the code</li>
                                            <li>Press the "Run Code" button to execute it</li>
                                            <li>You should see {lesson.codingChallenge.requiredOutput} appear in the output</li>
                                        </ol>
                                        <button className="flex flex-row items-center text-blue-light border border-blue-light/30 rounded-lg px-2 gap-2 py-1.5 text-xs font-semibold hover:bg-blue-light/10 transition-colors">
                                            <img src="/ai-main.svg" className="w-4 h-4" />Explain challenge
                                        </button>
                                    </div>

                                    {lesson.codingChallenge.hints && lesson.codingChallenge.hints.length > 0 && (
                                        <div className="mb-6 pt-4 border-t border-grey-lighter">
                                            <h3 className="flex items-center font-bold text-white mb-3 gap-2 text-sm">
                                                <img src="/hint-white.svg" className="w-4 h-4 mb-0.25" />
                                                Hints
                                            </h3>
                                            <div className="flex flex-col">
                                                {lesson.codingChallenge.hints.map((hint, idx) => (
                                                    <HintItem key={idx} index={idx} hint={hint} onReveal={() => setHintsUsed(true)} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mb-4 pt-4">
                                        <h3
                                            className="flex items-center font-bold text-white mb-3 gap-2 cursor-pointer text-sm"
                                            onClick={() => !isSolutionOpen && setShowSolutionModal(true)}
                                        >
                                            <img src="/solution-white.svg" className="w-4 h-4 mb-0.25" />
                                            Solution
                                        </h3>

                                        {isSolutionOpen ? (
                                            <div className="border border-grey-lighter rounded-xl p-4 bg-grey-dark">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="text-sm">
                                                        Solution<br />
                                                        <span className="text-text-secondary text-xs">Revealed</span>
                                                    </div>
                                                    <svg className="w-5 h-5 text-text-secondary cursor-pointer hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" onClick={() => setIsSolutionOpen(false)}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                </div>
                                                <div className="bg-grey border border-grey-light p-3 rounded-lg font-mono text-sm mb-4 text-white/90 whitespace-pre-wrap">
                                                    {lesson.codingChallenge.solution}
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <button
                                                        onClick={handleCopyToEditor}
                                                        className="flex items-center text-blue-light hover:brightness-125 text-sm transition-colors w-fit"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        Copy to code editor
                                                    </button>
                                                    <button className="flex items-center text-blue-light hover:brightness-125 text-sm transition-colors w-fit">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Explain solution
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => setShowSolutionModal(true)}
                                                className="border border-grey-lighter rounded-xl p-3 bg-[#1c1c1c] flex justify-between items-center cursor-pointer hover:bg-grey-dark transition-colors"
                                            >
                                                <span className="text-sm text-white/80">Solution</span>
                                                <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {activeTab === 'submissions' && (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Last submissions</h2>
                                <img src="/reload-white.svg" className="w-4 h-4 opacity-70 hover:opacity-100 cursor-pointer" alt="reload" onClick={fetchSubmissions} />
                            </div>
                            {loadingSubmissions ? (
                                <div className="text-sm text-text-secondary">Loading submissions...</div>
                            ) : submissions.length === 0 ? (
                                <div className="text-sm text-text-secondary">No submissions yet for this lesson.</div>
                            ) : (
                                <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto">
                                    {submissions.map((sub: any) => (
                                        <div
                                            key={sub.id}
                                            onClick={() => handleLoadSubmission(sub.code)}
                                            className="border-t border-grey-lighter pt-3 flex justify-between items-center text-sm cursor-pointer hover:bg-grey p-2 rounded-lg -mx-2 transition-colors"
                                            title="Click to load this code into editor"
                                        >
                                            <div className="flex items-center gap-3">
                                                {sub.passed ? (
                                                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                <span className="text-white/90 font-medium">
                                                    {new Date(sub.submittedAt).toLocaleString()}
                                                </span>
                                                <span className="text-text-secondary">&bull;</span>
                                                <span className="text-text-secondary">
                                                    {journey?.language ? journey.language.charAt(0).toUpperCase() + journey.language.slice(1) : 'Python'}
                                                </span>
                                            </div>
                                            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                    {activeTab === 'support' && (
                        <>
                            <h2 className="text-xl font-bold mb-2">Support</h2>
                            <p className="text-[11px] text-text-secondary mb-6">
                                Context: <span className="font-bold text-white/80">{chapter?.title} - {lesson.title}</span>
                            </p>
                            <textarea
                                className="w-full bg-transparent border border-grey-light rounded p-3 text-sm text-white/90 mb-4 h-32 resize-none placeholder-text-secondary focus:outline-none focus:border-blue-light"
                                placeholder="I am missing/need help with..."
                            ></textarea>
                            <button className="bg-[#247B9E] text-white px-6 py-1.5 rounded-[10px] font-bold text-sm mb-4 hover:brightness-110 active:scale-95 transition-all w-fit">
                                SEND
                            </button>
                            <p className="text-[11px] text-text-secondary leading-relaxed pr-2">
                                We make every effort to respond to all support requests, but <span className="text-[#247B9E] cursor-pointer font-bold">PRO</span> learners receive priority..
                            </p>
                        </>
                    )}
                    {activeTab === 'feedback' && (
                        <>
                            <h2 className="text-xl font-bold mb-2">Provide Feedback</h2>
                            <p className="text-[11px] text-text-secondary mb-6">
                                Context: <span className="font-bold text-white/80">{chapter?.title} - {lesson.title}</span>
                            </p>
                            <p className="text-[11px] text-text-secondary mb-2">Feedback type</p>
                            <select className="w-full bg-transparent border border-grey-light rounded p-2 text-sm text-white/90 mb-6 focus:outline-none focus:border-blue-light cursor-pointer">
                                <option value="" disabled selected>Select type of feedback...</option>
                                <option value="1">My answer is correct, but it is not accepted</option>
                                <option value="2">There is a typo in the lesson/challenge</option>
                                <option value="3">Some topics are not explained or missing</option>
                                <option value="4">Coddy solution does not match the challenge</option>
                                <option value="5">I found a bug or unexpected behaviour</option>
                                <option value="6">The challenge is too hard</option>
                                <option value="7">Other</option>
                            </select>
                            <button className="bg-[#247B9E] text-white/50 px-6 py-1.5 rounded-[10px] font-bold text-sm hover:brightness-110 active:scale-95 transition-all w-fit cursor-not-allowed">
                                SEND
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#1c1c1c] relative z-0">
                <div className="h-[61px] bg-grey-dark border-b border-grey-lighter flex justify-end items-center px-6 gap-5 text-sm font-bold shadow-sm z-10">
                    <div className="flex items-center">
                        <span className="text-white mr-1.5">0</span>
                        <img src="/fire-filled.svg" className="w-4 h-4" alt="streak" />
                    </div>
                    <div className="flex items-center">
                        <span className="text-white mr-1.5">0</span>
                        <img src="/token.svg" className="w-4 h-4" alt="tokens" />
                    </div>
                    <div className="flex items-center">
                        <span className="text-white mr-1.5">{user?.energy ?? 5}</span>
                        <img src="/energy.svg" className="w-4 h-4" alt="energy" />
                    </div>
                    <img src="/avatar_placeholder.png" className="w-7 h-7 rounded-full border border-grey-light" alt="user" />
                </div>

                {quiz ? (
                    <QuizView
                        quiz={quiz}
                        onComplete={(xp, tokens, noMistakes) => {
                            const tokensEarned = tokens + (noMistakes ? 1 : 0);
                            const quizEnergy = quiz.energy !== undefined ? quiz.energy : 1;

                            setCompletedData({
                                xp,
                                tokens: tokensEarned,
                                energy: quizEnergy,
                                noMistakes,
                                isQuiz: true
                            });
                            setShowCompletionModal(true);
                        }}
                        onSkip={() => {
                            const quizEnergy = quiz.energy !== undefined ? quiz.energy : 1;

                            setCompletedData({
                                xp: 0,
                                tokens: 0,
                                energy: quizEnergy,
                                noMistakes: false,
                                isQuiz: true
                            });
                            setShowCompletionModal(true);
                        }}
                    />
                ) : lesson.codingChallenge ? (
                    <div className="flex-1 flex flex-col">
                        <div className="h-[40px] bg-grey-dark border-b border-grey-lighter flex justify-between items-center px-4 shrink-0 select-none">
                            <div className="bg-[#1c1c1c] text-xs text-white/90 px-4 ml-6 py-2 border-t-2 border-blue-light font-semibold rounded-t-lg mt-[6px]">
                                {journey?.language ? journey.language.charAt(0).toUpperCase() + journey.language.slice(1) : 'Python'}
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowSaveModal(true)}
                                    className="p-1 hover:bg-grey-lighter rounded transition-colors"
                                    title="Save Code"
                                >
                                    <svg className="w-4 h-4 text-white opacity-85 hover:opacity-100" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setShowResetModal(true)}
                                    className="p-1 hover:bg-grey-lighter rounded transition-colors"
                                    title="Reset Code"
                                >
                                    <img src="/reload-white.svg" className="w-4 h-4 opacity-85 hover:opacity-100" alt="reset" />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#1c1c1c] relative font-mono text-sm flex overflow-hidden">
                            <div className="flex flex-col items-end pr-4 pl-4 pt-4 text-xs text-grey-light border-r border-grey-lighter select-none h-full bg-[#1c1c1c] overflow-hidden">
                                {linesArray.map(line => (
                                    <span key={line} className="mb-0.5 leading-6">{line}</span>
                                ))}
                            </div>
                            <div className="flex-1 relative h-full">
                                <textarea
                                    className="absolute inset-0 w-full h-full bg-transparent text-white/90 resize-none outline-none border-none p-4 leading-6 font-mono"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>

                            <div className="absolute bottom-4 right-4 flex gap-3 z-10">
                                <button className="bg-blue text-white px-2 pr-4 gap-2 py-2 rounded-lg flex items-center text-sm font-bold hover:brightness-110 transition-all">
                                    <img src="/ai-assistant.svg" className="w-6 h-6" />
                                    Ask AI
                                </button>
                                <button
                                    onClick={handleRunCode}
                                    disabled={isRunning}
                                    className={`bg-blue text-white px-2 pr-4 gap-2 py-2 rounded-lg flex items-center text-sm font-bold hover:brightness-110 transition-all ${isRunning ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                                            <img src="/play-white.svg" className="w-6 h-6" alt="run" />
                                            Run Code
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="h-[280px] bg-grey-dark border-t border-grey-lighter flex flex-col shadow-inner z-10">
                            <div className="flex-1 flex p-5 text-sm font-mono">
                                <div className="flex-1 border-r border-grey-lighter pr-6">
                                    <div className="text-text-secondary text-xs mb-3 font-sans uppercase tracking-wider">Output</div>
                                    <div className={`text-white/90 p-3 rounded-lg border font-mono whitespace-pre-wrap min-h-[40px] ${output.includes('Error') ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-grey border-grey-light text-white/90'}`}>
                                        {output}
                                    </div>
                                </div>
                                <div className="flex-1 pl-6">
                                    <div className="flex justify-between items-center text-text-secondary text-xs mb-3 font-sans">
                                        <span className="uppercase tracking-wider">Expected Output</span>
                                    </div>
                                    <div className="text-white/90 bg-grey p-3 rounded-lg border border-grey-light">
                                        {lesson.codingChallenge.requiredOutput}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-text-secondary bg-grey-dark">
                        No content for this lesson yet.
                    </div>
                )}
            </div>
        </div>
    );
};
