import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        document.title = "Reset Password - Koddy";
        if (!token || !email) {
            navigate('/login');
        }
    }, [token, email, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, newPassword })
            });
            const data = await response.json();
            
            if (response.ok) {
                toast.success('Password reset successful! You can now log in.');
                navigate('/login');
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#166085] flex flex-col font-sans items-center justify-center">
            <div className="w-full max-w-[400px] bg-grey rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 pb-8 border-none">
                <h1 className="text-white text-2xl font-bold mb-6 text-center">Reset Password</h1>
                <p className="text-text-secondary text-sm mb-6 text-center">Enter your new password for {email}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <img src="/password.svg" alt="Password" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 opacity-80 w-6 h-6" />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            required
                            className="w-full bg-grey-dark border-2 border-grey-lighter rounded-xl px-12 py-3.5 text-base text-white placeholder-text-muted focus:outline-none focus:border-[#3dbae8] transition-colors shadow-inner"
                        />
                    </div>
                    <div className="relative">
                        <img src="/password.svg" alt="Confirm Password" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 opacity-80 w-6 h-6" />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm New Password"
                            required
                            className="w-full bg-grey-dark border-2 border-grey-lighter rounded-xl px-12 py-3.5 text-base text-white placeholder-text-muted focus:outline-none focus:border-[#3dbae8] transition-colors shadow-inner"
                        />
                    </div>
                    {error && <div className="text-red-500 mt-3 text-sm text-center font-medium">{error}</div>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-5 inline-flex items-center justify-center px-10 py-2.5 cursor-pointer bg-blue text-white font-semibold rounded-xl transition-all border-blue-dark border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                    </button>
                </form>
            </div>
        </div>
    );
}
