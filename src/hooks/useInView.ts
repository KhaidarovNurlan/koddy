import { useEffect, useRef, useState } from 'react';

export function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold }
        );

        const current = ref.current;
        if (current) observer.observe(current);

        return () => {
            if (current) observer.disconnect();
        };
    }, [threshold]);

    return { ref, isVisible };
}