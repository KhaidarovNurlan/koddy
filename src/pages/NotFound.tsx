import { useEffect } from 'react';

export function NotFound() {
    useEffect(() => {
        document.title = "404 - Koddy";
    }, []);

    return (
        <section className="min-h-[calc(100vh-15px)] flex flex-col items-center justify-center p-6 text-center">
            <img
                src="/bit-computer.png"
                alt="404 - Not Found"
                className="w-48 sm:w-64 md:w-80 h-auto mb-6 drop-shadow-2xl animate-float"
            />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                404 - Page not found
            </h1>
            <p className="text-text-secondary text-lg sm:text-xl">
                Follow the links to return to safe place...
            </p>
        </section>
    );
}
