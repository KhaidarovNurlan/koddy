import { Outlet } from 'react-router-dom';
import { CompanyHeader } from './CompanyHeader';

export function CompanyLayout() {
    return (
        <>
            <CompanyHeader />
            <Outlet />
        </>
    );
}