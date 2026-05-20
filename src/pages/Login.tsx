import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
    useEffect(() => {
        document.title = "Login & Register - Koddy";
    }, []);

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            
            if (!response.ok) {
                setError(data.error || 'An error occurred');
            } else {
                localStorage.setItem('token', data.token);
                navigate('/journeys');
            }
        } catch (err) {
            setError('Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#166085] flex flex-col font-sans">
            <header className="p-8 pb-0">
                <Link to="/" className="inline-flex items-center text-white space-x-2 text-[18px] font-medium hover:opacity-80 transition-opacity">
                    <img src="/left-white.svg" alt="" className="w-8 h-8" />
                    <span>Back</span>
                </Link>
            </header>

            <main className="flex-1 flex w-full max-w-5xl mx-auto items-center justify-center lg:gap-56 gap-24 px-6 flex-col lg:flex-row pb-12">
                <div className="w-full max-w-[400px] bg-grey rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 pb-8 border-none mt-8 lg:mt-0">
                    <div className="flex border-b border-[#3e4249] mb-6">
                        <button
                            className={`flex-1 pb-3 text-center text-[22px] font-bold transition-colors ${activeTab === 'login' ? 'text-blue-light border-b-2 border-blue-light' : 'cursor-pointer'}`}
                            onClick={() => setActiveTab('login')}
                        >
                            Log in
                        </button>
                        <button
                            className={`flex-1 pb-3 text-center text-[22px] font-bold transition-colors ${activeTab === 'register' ? 'text-blue-light border-b-2 border-blue-light' : 'cursor-pointer'}`}
                            onClick={() => setActiveTab('register')}
                        >
                            Register
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <img src="/email.svg" alt="Email" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 opacity-80 w-6 h-6" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="w-full bg-grey-dark border-2 border-grey-lighter rounded-xl px-12 py-3.5 text-base text-white placeholder-text-muted focus:outline-none focus:border-[#3dbae8] transition-colors shadow-inner"
                            />
                        </div>
                        <div className="relative">
                            <img src="/password.svg" alt="Password" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 opacity-80 w-6 h-6" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full bg-grey-dark border-2 border-grey-lighter rounded-xl px-12 py-3.5 text-base text-white placeholder-text-muted focus:outline-none focus:border-[#3dbae8] transition-colors shadow-inner"
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 mt-3 text-sm text-center font-medium">{error}</div>}
                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full mt-5 inline-flex items-center justify-center px-10 py-2.5 cursor-pointer bg-blue text-white font-semibold rounded-xl transition-all border-blue-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'LOADING...' : (activeTab === 'login' ? 'LOG IN' : 'CREATE ACCOUNT')}
                    </button>

                    {activeTab === 'login' && (
                        <div className="mt-5 text-center">
                            <a href="#" className="flex justify-center items-center text-blue-light text-[16px] hover:text-blue">
                                Forgot password
                            </a>
                        </div>
                    )}

                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-[#3e4249]"></div>
                        <span className="px-4 text-[16px] uppercase text-text-secondary tracking-wider">OR</span>
                        <div className="flex-1 border-t border-[#3e4249]"></div>
                    </div>

                    <div className="flex items-center justify-center">
                        <button className="inline-flex items-center justify-center px-10 py-3 gap-2 bg-grey text-blue-light rounded-xl transition-all border-grey-light border-[2px] border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
                            <img src="/google.svg" alt="Google" className="w-6 h-6" />
                            <span className="text-[18px] font-bold">GOOGLE</span>
                        </button>
                    </div>
                </div>

                <div className="text-white flex flex-col justify-center min-w-[300px]">
                    <h1 className="text-[44px] font-bold mb-10 leading-[1.1] tracking-tight">
                        Unlock your<br />Coding Journey
                    </h1>

                    <ul className="space-y-4 text-[16px] font-medium text-[#edf0f2]">
                        <li className="flex items-center space-x-4 text-[20px]">
                            <img src="/practice-driven-dark.svg" alt="Practice-Driven" className="w-8 h-8" />
                            <span>Practice-Driven</span>
                        </li>
                        <li className="flex items-center space-x-4 text-[20px]">
                            <img src="/unlimited-content-dark.svg" alt="Unlimited" className="w-8 h-8" />
                            <span>Unlimited</span>
                        </li>
                        <li className="flex items-center space-x-4 text-[20px]">
                            <img src="/fun-dark.svg" alt="Fun" className="w-8 h-8" />
                            <span>Fun</span>
                        </li>
                        <li className="flex items-center space-x-4 text-[20px]">
                            <img src="/personalized-dark.svg" alt="Personalized" className="w-8 h-8" />
                            <span>Personalized</span>
                        </li>
                        <li className="flex items-center space-x-4 text-[20px]">
                            <img src="/ai-enhanced-dark.svg" alt="AI Enhanced" className="w-8 h-8" />
                            <span>AI Enhanced</span>
                        </li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
