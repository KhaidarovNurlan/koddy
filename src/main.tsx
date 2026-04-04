import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import ScrollToTop from './components/ScrollToTop';
import { MainLayout } from './components/MainLayout';
import { CompanyLayout } from './components/CompanyLayout';
import { Landing } from './pages/Landing';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQs } from './pages/FAQs';
import { AIAssistant } from './pages/AIAssistant';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';
import { GameLayout } from './components/GameLayout';
import { Journeys } from './pages/Journeys';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<GameLayout />}>
                    <Route path="/journeys" element={<Journeys />} />
                </Route>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Landing />} />
                    <Route element={<CompanyLayout />}>
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/faqs" element={<FAQs />} />
                        <Route path="/ai_assistant" element={<AIAssistant />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
