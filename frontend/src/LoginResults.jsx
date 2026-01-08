import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PASSWORD = 'ketuaim2026';

function LoginResults() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        setTimeout(() => {
            if (password === PASSWORD) {
                sessionStorage.setItem('resultsAuth', 'true');
                navigate('/results');
            } else {
                setError('Password salah! Silakan coba lagi.');
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)' }}>
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-200">
                <h1 className="text-2xl font-bold text-center mb-2" style={{ color: '#1e3a5a' }}>
                    🔒 Akses Hasil Voting
                </h1>
                <p className="text-gray-500 text-center mb-6">
                    Masukkan password untuk melihat hasil voting
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-xl text-center border border-red-300">
                            ❌ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !password}
                        className={`w-full py-3 rounded-xl font-semibold transition ${loading || !password
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                    >
                        {loading ? '⏳ Memverifikasi...' : '🔓 Masuk'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a
                        href="/voting"
                        className="hover:underline" style={{ color: '#1e3a5a' }}
                    >
                        ← Kembali ke Voting
                    </a>
                </div>
            </div>
        </div>
    );
}

export default LoginResults;
