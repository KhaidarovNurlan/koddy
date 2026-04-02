import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinkStyles = ({ isActive }: { isActive: boolean }) =>
    isActive
        ? "text-koddy-blue-light border-b-2 border-koddy-blue-light pb-1"
        : "hover:border-b-2 transition-colors";

const navMobileLinkStyles = ({ isActive }: { isActive: boolean }) =>
    isActive
        ? "px-6 py-4 text-[15px] font-bold bg-[#373a3c] transition-colors"
        : "px-6 py-4 text-[15px] font-medium bg-[#373a3c] transition-colors";

export function CompanyHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-50 bg-bg-darker border-b border-border-default/50">
                <div className="max-w-7xl mx-auto px-4 h-15 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-5 group">
                        <img src="/logo-text.svg" alt="Koddy" className="h-8 w-auto block" />
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-[18px] font-base opacity-90">
                        <NavLink to="/about" className={navLinkStyles}>About</NavLink>
                        <NavLink to="/contact" className={navLinkStyles}>Contact</NavLink>
                        <NavLink to="/faqs" className={navLinkStyles}>FAQs</NavLink>
                        <NavLink to="/ai_assistant" className={navLinkStyles}>AI Assistant</NavLink>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/" className="hover:text-koddy-blue transition-colors text-[18px] font-base hidden md:block opacity-90">Login</Link>
                        <Link to="/" className="hidden md:block btn-shimmer items-center justify-center px-6 text-[14px] cursor-pointer transition-all bg-koddy-blue font-semibold py-1.5 rounded-xl border-koddy-blue-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
                            GET STARTED
                        </Link>
                        <button className="md:hidden block p-2 -mr-2 text-text-muted hover:text-white transition-colors" onClick={() => setIsMenuOpen(true)}>
                            <img src="/menu-light.svg" alt="Menu" className="w-8 h-8 opacity-80 hover:opacity-100" />
                        </button>
                    </div>
                </div>
            </nav>
            <div className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)} />

            <div className={`fixed inset-y-0 left-0 z-[70] w-[280px] bg-bg-dark border-r border-border-default transform transition-transform duration-300 md:hidden flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-border-default/50 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/logo.svg" alt="Koddy" className="h-8 w-auto" />
                        <img src="/logo-text.svg" alt="Koddy" className="h-6 w-auto mt-3" />
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto py-4 flex flex-col">
                    <NavLink to="/about" className={navMobileLinkStyles}>About</NavLink>
                    <NavLink to="/contact" className={navMobileLinkStyles}>Contact</NavLink>
                    <NavLink to="/faqs" className={navMobileLinkStyles}>FAQs</NavLink>
                    <NavLink to="/ai_assistant" className={navMobileLinkStyles}>AI Assistant</NavLink>
                </div>
                <div className="p-6">
                    <Link to="/" className="block w-full text-center px-4 py-3 bg-koddy-blue font-semibold rounded-lg hover:brightness-110 transition-all shadow-lg hover:shadow-koddy-blue/20">
                        Register
                    </Link>
                </div>
            </div>
        </>
    )
}