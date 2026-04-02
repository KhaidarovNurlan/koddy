import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import ScrollToTop from './components/ScrollToTop';
import { MainLayout } from './components/MainLayout';
import { CompanyLayout } from './components/CompanyLayout';
import { Landing } from './pages/Landing';
import { About } from './pages/About';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Landing />} />
                    <Route element={<CompanyLayout />}>
                        <Route path="/about" element={<About />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
