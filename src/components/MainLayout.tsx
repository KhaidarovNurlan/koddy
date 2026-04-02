import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';

export function MainLayout() {
    return (
        <>
            <Outlet />
            <Footer />
        </>
    );
}