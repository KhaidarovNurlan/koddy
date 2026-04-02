import { useEffect } from 'react';

export function About() {
    useEffect(() => {
        document.title = "About Us - Koddy";
    }, []);

    return (
        <div className="min-h-screen font-sans">
            <section className="py-24 md:py-40">
                <div className="max-w-7xl mx-auto px-6 lg:ml-[19vw]">
                    <h3 className="text-koddy-blue-light text-2xl mb-4 font-medium">Our Mission</h3>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white font-medium auto-leading max-w-4xl" style={{ lineHeight: '1.2' }}>
                        Elevating code learning <br className="hidden md:block" />
                        to a <span className="font-extrabold pb-2">daily hobby</span>
                    </h1>
                </div>
            </section>

            <section className="py-24 md:py-32 bg-koddy-blue-dark flex items-center">
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-white text-2xl mb-16 font-medium">Our Vision</h3>

                    <div className="flex flex-col gap-16 max-w-4xl">
                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                            <div className="flex-shrink-0">
                                <img src="/practice-driven-dark.svg" alt="Practice-Driven" className="w-16 h-16 sm:w-20 sm:h-20" />
                            </div>
                            <div>
                                <h2 className="text-3xl lg:text-[48px] text-white font-bold mb-4">Practice-Driven</h2>
                                <p className="text-white/80 text-lg md:text-[20px] leading-relaxed">
                                    We believe in learning to code through practice. Our method includes practical exercises in everything we teach. With our integrated compiler, you can practice coding online without any downloads.
                                </p>
                            </div>
                        </div>

                        <div className="h-[1px] border-1 border-white"></div>

                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                            <div className="flex-shrink-0">
                                <img src="/unlimited-content-dark.svg" alt="Unlimited Content" className="w-16 h-16 sm:w-20 sm:h-20" />
                            </div>
                            <div>
                                <h2 className="text-3xl lg:text-[48px] text-white font-bold mb-4">Unlimited Content</h2>
                                <p className="text-white/80 text-lg md:text-[20px] leading-relaxed">
                                    Coddy delivers boundless content through collaboration with 3rd party creators and cutting edge Generative AI technology.
                                </p>
                            </div>
                        </div>

                        <div className="h-[1px] border-1 border-white"></div>

                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                            <div className="flex-shrink-0">
                                <img src="/fun-dark.svg" alt="Fun" className="w-16 h-16 sm:w-20 sm:h-20" />
                            </div>
                            <div>
                                <h2 className="text-3xl lg:text-[48px] text-white font-bold mb-4">Fun</h2>
                                <p className="text-white/80 text-lg md:text-[20px] leading-relaxed">
                                    We turn coding into a fun game-like experience. Our method breaks down complex concepts into easy-to-learn lessons. We add excitement with scoring, streak tracking, leaderboards, and more interactive features.
                                </p>
                            </div>
                        </div>

                        <div className="h-[1px] border-1 border-white"></div>

                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                            <div className="flex-shrink-0">
                                <img src="/personalized-dark.svg" alt="Personalized" className="w-16 h-16 sm:w-20 sm:h-20" />
                            </div>
                            <div>
                                <h2 className="text-3xl lg:text-[48px] text-white font-bold mb-4">Personalized</h2>
                                <p className="text-white/80 text-lg md:text-[20px] leading-relaxed">
                                    We tailor the learning journey by understanding your existing knowledge. Our platform suggests courses and creates custom content to meet your unique learning needs.
                                </p>
                            </div>
                        </div>

                        <div className="h-[1px] border-1 border-white"></div>

                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                            <div className="flex-shrink-0">
                                <img src="/ai-enhanced-dark.svg" alt="AI Enhanced" className="w-16 h-16 sm:w-20 sm:h-20" />
                            </div>
                            <div>
                                <h2 className="text-3xl lg:text-[48px] text-white font-bold mb-4">AI Enhanced</h2>
                                <p className="text-white/80 text-lg md:text-[20px] leading-relaxed">
                                    We're leading code learning innovation with the industry's first personal AI assistant. Our platform uses AI to create endless customized content. This marks a new era in code learning, making it simpler and more effective.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
