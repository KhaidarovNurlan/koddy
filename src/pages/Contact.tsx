import { useEffect } from 'react';

export function Contact() {
    useEffect(() => {
        document.title = "Contact Us - Koddy";
    }, []);

    return (
        <div className="w-full min-h-[calc(100vh-60px)] font-sans flex items-center justify-center relative bg-bg-darker overflow-hidden py-16">
            <div className="absolute right-0 top-0 bottom-0 w-[30%] xl:w-[35%] bg-koddy-blue hidden lg:block z-0"></div>

            <div className="max-w-6xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative z-10">
                <div className="flex flex-col justify-center text-white space-y-8 lg:py-10 lg:pl-8">
                    <h1 className="text-5xl sm:text-6xl lg:text-[4rem] font-bold tracking-wide">
                        Let's Talk!
                    </h1>

                    <div className="h-[2px] w-full max-w-[250px] bg-[#373a3c] my-2"></div>

                    <div>
                        <h3 className="text-koddy-blue-light text-sm tracking-wide font-medium mb-1">
                            For Support
                        </h3>
                        <p className="text-xl sm:text-[22px] font-medium tracking-wide">
                            support@koddy.tech
                        </p>
                    </div>

                    <div>
                        <h3 className="text-koddy-blue-light text-sm tracking-wide font-medium mb-1">
                            For Influencers/Affiliators
                        </h3>
                        <p className="text-xl sm:text-[22px] font-medium tracking-wide">
                            marketing@koddy.tech
                        </p>
                    </div>

                    <div>
                        <h3 className="text-koddy-blue-light text-sm tracking-wide font-medium mb-3">
                            Follow Us
                        </h3>
                        <div className="flex gap-4 items-center">
                            <a href="#" className="hover:opacity-80 transition-opacity flex items-center justify-center">
                                <img src="/github.svg" alt="GitHub" className="w-5 h-5 sm:w-6 sm:h-6" />
                            </a>
                            <a href="#" className="hover:opacity-80 transition-opacity flex items-center justify-center">
                                <img src="/linkedin.svg" alt="LinkedIn" className="w-5 h-5 sm:w-6 sm:h-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-dark rounded-xl p-8 sm:p-10 shadow-2xl border border-border-default w-full max-w-xl mx-auto flex flex-col justify-between">
                    <div className="space-y-5">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="w-full bg-transparent border border-border-default rounded-md py-3 pl-11 pr-4 text-white placeholder-text-secondary focus:outline-none focus:border-gray-500 transition-colors"
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </svg>
                            </div>
                            <input
                                type="email"
                                className="w-full bg-transparent border border-border-default rounded-md py-3 pl-11 pr-4 text-white placeholder-text-secondary focus:outline-none focus:border-gray-500 transition-colors"
                                placeholder="Email Address"
                            />
                        </div>

                        <div>
                            <textarea
                                className="w-full bg-transparent border border-border-default rounded-md py-3 px-4 text-white placeholder-text-secondary focus:outline-none focus:border-gray-500 min-h-[160px] resize-none transition-colors"
                                placeholder="Message"
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="text-white text-[15px] font-medium mb-4">By submitting this form, I acknowledge:</p>

                        <div className="space-y-4 mb-8">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="min-w-4 flex items-center justify-center mt-1">
                                    <input type="checkbox" className="w-[18px] h-[18px] rounded-[4px] border border-border-default bg-transparent text-koddy-blue focus:ring-0 cursor-pointer appearance-none checked:bg-koddy-blue-dark checked:border-koddy-blue-dark relative checked:after:content-[''] checked:after:absolute checked:after:top-[2px] checked:after:left-[5px] checked:after:w-1.5 checked:after:h-2.5 checked:after:border-r-2 checked:after:border-b-2 checked:after:border-white checked:after:rotate-45" />
                                </div>
                                <span className="text-[14px] leading-snug text-gray-200">
                                    For assistance with specific challenges, use the support tab within the challenge.
                                </span>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="min-w-4 flex items-center justify-center mt-1">
                                    <input type="checkbox" className="w-[18px] h-[18px] rounded-[4px] border border-border-default bg-transparent text-koddy-blue focus:ring-0 cursor-pointer appearance-none checked:bg-koddy-blue-dark checked:border-koddy-blue-dark relative checked:after:content-[''] checked:after:absolute checked:after:top-[2px] checked:after:left-[5px] checked:after:w-1.5 checked:after:h-2.5 checked:after:border-r-2 checked:after:border-b-2 checked:after:border-white checked:after:rotate-45" />
                                </div>
                                <span className="text-[14px] leading-snug text-gray-200">
                                    Subscription details and cancellation are in <span className="font-semibold text-white">billing settings</span> on your <a href="#" className="underline text-gray-200 hover:text-white transition-colors">profile page</a>..
                                </span>
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button className="bg-koddy-blue-dark hover:brightness-110 transition-all text-gray-300 hover:text-white text-sm font-semibold rounded-lg py-3 px-6 uppercase tracking-wider shadow-md">
                                SEND MESSAGE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
