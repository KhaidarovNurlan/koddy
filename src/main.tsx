import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import ScrollToTop from './components/ScrollToTop';
import { MainLayout } from './components/MainLayout';
import { CompanyLayout } from './components/CompanyLayout';
import { GameLayout } from './components/GameLayout';
import { Landing } from './pages/Landing';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQs } from './pages/FAQs';
import { AIAssistant } from './pages/AIAssistant';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';
import { ResetPassword } from './pages/ResetPassword';
import { Journeys } from './pages/Journeys';
import { JourneyView } from './pages/JourneyView';
import { LessonView } from './pages/LessonView';
import { Profile } from './pages/Profile';
import { User } from './pages/User';
import { Notifications } from './pages/Notifications';
import { Leaderboard } from './pages/Leaderboard';
import { Goals } from './pages/Goals';
import { Projects } from './pages/Projects';
import { ProjectPage } from './pages/ProjectPage';
import { Courses } from './pages/Courses';
import { CreateCourse } from './pages/CreateCourse';
import Avatar from './pages/Avatar';
import { CourseLessonView } from './pages/CourseLessonView';
import { Store } from './pages/Store';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import { Toaster } from 'react-hot-toast';

const originalFetch = window.fetch;
window.fetch = async (input, init) => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const localDate = `${yyyy}-${mm}-${dd}`;

    init = init || {};
    init.headers = init.headers || {};

    if (init.headers instanceof Headers) {
        init.headers.set('x-local-date', localDate);
    } else if (Array.isArray(init.headers)) {
        init.headers.push(['x-local-date', localDate]);
    } else {
        (init.headers as Record<string, string>)['x-local-date'] = localDate;
    }

    let targetInput = input;
    const apiBase = import.meta.env.VITE_API_URL || '';
    if (apiBase) {
        if (typeof targetInput === 'string' && targetInput.startsWith('/api/')) {
            targetInput = `${apiBase}${targetInput}`;
        } else if (targetInput instanceof URL && targetInput.pathname.startsWith('/api/')) {
            targetInput = new URL(`${apiBase}${targetInput.pathname}${targetInput.search}${targetInput.hash}`);
        }
    }

    return originalFetch(targetInput, init);
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ScrollToTop />
                <Toaster position="bottom-right" />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<GameLayout />}>
                            <Route path="/journeys" element={<Journeys />} />
                            <Route path="/journeys/:journeyId" element={<JourneyView />} />
                            <Route path="/courses" element={<Courses />} />
                            <Route path="/courses/create" element={<CreateCourse />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/leaderboard" element={<Leaderboard />} />
                            <Route path="/goals" element={<Goals />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/store" element={<Store />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/avatar" element={<Avatar />} />
                        </Route>
                        <Route path="/journeys/:journeyId/lessons/:lessonId" element={<LessonView />} />
                        <Route path="/courses/:courseId" element={<CourseLessonView />} />
                        <Route path="/projects/:projectId" element={<ProjectPage />} />
                    </Route>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Landing />} />
                        <Route element={<CompanyLayout />}>
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/faqs" element={<FAQs />} />
                            <Route path="/ai_assistant" element={<AIAssistant />} />
                            <Route path="/user/:username" element={<User />} />
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
