import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function Results() {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resetting, setResetting] = useState(false);

    // Check authentication
    useEffect(() => {
        const isAuth = sessionStorage.getItem('resultsAuth');
        if (!isAuth) {
            navigate('/login-results');
        }
    }, [navigate]);

    const fetchResults = async () => {
        try {
            const response = await fetch(`${API_URL}/vote/results`);
            const data = await response.json();
            if (data.success) {
                setResults(data.data);
                setTotalVotes(data.totalVotes);
            } else {
                setError('Gagal memuat hasil voting');
            }
        } catch (err) {
            setError('Tidak dapat terhubung ke server');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
        // Auto refresh setiap 10 detik
        const interval = setInterval(fetchResults, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleReset = async () => {
        const confirmReset = window.confirm('⚠️ Apakah Anda yakin ingin mereset SEMUA data voting? Tindakan ini tidak dapat dibatalkan!');
        if (!confirmReset) return;

        setResetting(true);
        try {
            const response = await fetch(`${API_URL}/vote/reset`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.success) {
                alert('✅ ' + data.message);
                fetchResults(); // Refresh data
            } else {
                alert('❌ ' + data.message);
            }
        } catch (err) {
            alert('❌ Gagal mereset voting');
            console.error(err);
        } finally {
            setResetting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)' }}>
                <div className="text-xl" style={{ color: '#1e3a5a' }}>Memuat hasil voting...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)' }}>
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    // Cari vote terbanyak untuk highlight pemenang
    const maxVotes = Math.max(...results.map(r => r.vote_count));

    return (
        <div className="min-h-screen p-8" style={{ background: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)' }}>
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold" style={{ color: '#1e3a5a' }}>Hasil Voting</h1>
                <p className="text-gray-600 mt-2">Pemilihan Ketua Insan Muda</p>
                <div className="mt-4 p-4 bg-white rounded-xl inline-block shadow border border-gray-200">
                    <span className="text-gray-600">Total Suara: </span>
                    <span className="text-2xl font-bold" style={{ color: '#1e3a5a' }}>{totalVotes}</span>
                </div>
            </header>

            <div className="max-w-4xl mx-auto space-y-4">
                {results.map((item, index) => {
                    const percentage = totalVotes > 0 ? ((item.vote_count / totalVotes) * 100).toFixed(1) : 0;
                    const isWinner = item.vote_count === maxVotes && maxVotes > 0;

                    return (
                        <div
                            key={item.id}
                            className={`bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl border border-gray-200 ${isWinner ? 'ring-2 ring-yellow-400' : ''
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl overflow-hidden ${isWinner ? 'ring-2 ring-yellow-400' : ''}`}>
                                    {item.photo_url ? (
                                        <img src={item.photo_url} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center ${isWinner ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                                            {isWinner ? '👑' : '👤'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-xl font-bold" style={{ color: '#1e3a5a' }}>
                                            0{item.id} {item.name}
                                            {isWinner && <span className="ml-2 text-yellow-500 text-sm">🏆 Unggul</span>}
                                        </h2>
                                        <span className="text-2xl font-bold" style={{ color: '#1e3a5a' }}>{item.vote_count} suara</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isWinner ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-red-500 to-red-600'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1">{percentage}% dari total suara</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-center mt-12 space-y-4">
                <div>
                    <Link
                        to="/voting"
                        className="inline-block w-64 text-center text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition" style={{ backgroundColor: '#1e3a5a' }}
                    >
                        ← Kembali ke Voting
                    </Link>
                </div>
                <div>
                    <button
                        onClick={handleReset}
                        disabled={resetting}
                        className={`w-64 px-8 py-3 rounded-xl font-semibold transition ${resetting
                            ? 'bg-gray-400 text-white cursor-wait'
                            : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                    >
                        {resetting ? '⏳ Mereset...' : '🗑️ Reset Semua Voting'}
                    </button>
                </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-8">
                Data diperbarui otomatis setiap 10 detik
            </p>
        </div>
    );
}

export default Results;

