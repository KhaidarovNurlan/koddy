import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: number;
    email: string;
    xp: number;
    tokens: number;
    energy: number;
    lastEnergyUpdate: string;
}

interface AuthContextType {
    user: User | null;
    journeys: string[];
    lessons: any[];
    loading: boolean;
    refreshUser: () => Promise<void>;
    addJourney: (journeyId: string) => Promise<void>;
    consumeEnergy: (amount?: number) => Promise<boolean>;
    completeLesson: (data: any) => Promise<void>;
    submitTask: (data: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [journeys, setJourneys] = useState<string[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/user/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                setJourneys(data.journeys);
                setLessons(data.lessons);
            } else if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        // Set up interval to refresh energy every 2 minutes
        const interval = setInterval(() => {
            if (user && user.energy < 5) {
                fetchUser();
            }
        }, 120000);
        return () => clearInterval(interval);
    }, [user?.energy]);

    const addJourney = async (journeyId: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        await fetch('/api/user/journeys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ journeyId })
        });
        await fetchUser();
    };

    const consumeEnergy = async (amount: number = 1) => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        const res = await fetch('/api/user/energy/consume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount })
        });
        if (res.ok) {
            await fetchUser();
            return true;
        }
        return false;
    };

    const completeLesson = async (data: any) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        await fetch('/api/user/lessons/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        await fetchUser();
    };

    const submitTask = async (data: any) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        await fetch('/api/user/lessons/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setJourneys([]);
        setLessons([]);
    };

    return (
        <AuthContext.Provider value={{ user, journeys, lessons, loading, refreshUser: fetchUser, addJourney, consumeEnergy, completeLesson, submitTask, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
