import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function FAQs() {
    useEffect(() => {
        document.title = "FAQs - Koddy";
    }, []);

    const faqs = [
        {
            question: "Why should I learn on Koddy?",
            answer: "At Koddy, we believe in a practice-driven approach to learning code. Our courses are designed to be hands-on and interactive, with plenty of opportunities to apply what you're learning to real-world scenarios. Our platform was founded by ex-Meta & ex-Intel engineers who understand the struggles of self-learning and are passionate about making coding accessible to everyone."
        },
        {
            question: "If I'm stuck on a challenge how can I get help?",
            answer: (
                <>
                    There are a few options for you:
                    <br />
                    1. Some challenges have a solution that you can reveal.
                    <br />
                    2. You can press the <span className="underline">"Explain"</span> button to gain insight into your code.
                    <br />
                    3. You can navigate to support in the left panel to ask for help.
                </>
            )
        },
        {
            question: "I don't have any coding knowledge, where should I start?",
            answer: (
                <>
                    In Koddy we offer individual courses and journeys.
                    <br />
                    Pick up a <span className="underline">journey</span> for an extensive roadmap
                    <br />
                    or search in the <span className="underline">courses</span> library. happy learning!
                </>
            )
        },
        {
            question: "How much time does it take to complete a course?",
            answer: "It depends on the course - some courses are longer than others but you can expect a couple of hours to complete a course."
        },
        {
            question: "Why do I have to make an account in order to practice challenges?",
            answer: (
                <>
                    Code-submissions are automatically saved to your account.
                    <br />
                    To submit a challenge, an account is required.
                </>
            )
        },
        {
            question: "How much does Koddy costs?",
            answer: (
                <>
                    Koddy is completely free to use without any limitations. (For now...)
                </>
            )
        },
        {
            question: "Can I access Koddy on my mobile device?",
            answer: "Yes, Koddy's website is fully responsive and can be accessed on any device, including mobile phones and tablets. However, we highly advise using our platform from a desktop computer for a better learning experience."
        },
    ];

    return (
        <div className="w-full min-h-screen font-sans flex flex-col bg-grey-dark">
            <div className="relative py-16 md:py-24 overflow-hidden bg-blue flex flex-col items-center justify-center text-center px-4">
                <div
                    className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/feature-background.svg)' }}
                ></div>
                <div className="relative z-10 max-w-4xl mx-auto space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wide">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200">
                        Explore most common questions answered by Koddy team, still missing something?<br /><Link to="/contact" className="underline hover:text-white transition-colors">Contact us</Link> for anything!
                    </p>
                </div>
            </div>

            <div className="max-w-4xl w-full mx-auto px-6 py-12 md:py-16">
                <div className="space-y-8">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-grey-lighter pb-8 last:border-0 last:pb-0">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                                {faq.question}
                            </h3>
                            <div className="text-gray-300 text-base md:text-lg leading-relaxed">
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
