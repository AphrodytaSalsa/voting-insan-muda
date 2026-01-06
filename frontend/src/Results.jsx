import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function Results() {
    const [results, setResults] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [resetting, setResetting] = useState(false);

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
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Memuat hasil voting...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    // Cari vote terbanyak untuk highlight pemenang
    const maxVotes = Math.max(...results.map(r => r.vote_count));

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-blue-600">Hasil Voting</h1>
                <p className="text-gray-600 mt-2">Pemilihan Ketua Insan Muda</p>
                <div className="mt-4 p-4 bg-white rounded-xl inline-block shadow">
                    <span className="text-gray-600">Total Suara: </span>
                    <span className="text-2xl font-bold text-blue-600">{totalVotes}</span>
                </div>
            </header>

            <div className="max-w-4xl mx-auto space-y-4">
                {results.map((item, index) => {
                    const percentage = totalVotes > 0 ? ((item.vote_count / totalVotes) * 100).toFixed(1) : 0;
                    const isWinner = item.vote_count === maxVotes && maxVotes > 0;

                    return (
                        <div
                            key={item.id}
                            className={`bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl ${isWinner ? 'ring-2 ring-yellow-400' : ''
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${isWinner ? 'bg-yellow-100' : 'bg-blue-100'
                                    }`}>
                                    {isWinner ? '👑' : '👤'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-xl font-bold">
                                            {item.name}
                                            {isWinner && <span className="ml-2 text-yellow-500 text-sm">🏆 Unggul</span>}
                                        </h2>
                                        <span className="text-2xl font-bold text-blue-600">{item.vote_count} suara</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${isWinner ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'
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
                        to="/"
                        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        ← Kembali ke Voting
                    </Link>
                </div>
                <div>
                    <button
                        onClick={handleReset}
                        disabled={resetting}
                        className={`px-8 py-3 rounded-xl font-semibold transition ${resetting
                                ? 'bg-gray-400 text-white cursor-wait'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                    >
                        {resetting ? '⏳ Mereset...' : '🗑️ Reset Semua Voting'}
                    </button>
                </div>
            </div>

            <p className="text-center text-gray-400 text-sm mt-8">
                Data diperbarui otomatis setiap 10 detik
            </p>
        </div>
    );
}

export default Results;

