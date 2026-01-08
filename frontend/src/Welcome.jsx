import React from 'react';
import { Link } from 'react-router-dom';

function Welcome() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8 pb-32" style={{ background: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)' }}>
            <div className="text-center">
                {/* Logos */}
                <div className="flex justify-center items-center gap-8 mb-8">
                    <img
                        src="/photos/logo1.png"
                        alt="Logo Insan Muda"
                        className="h-32 w-auto object-contain"
                    />
                    <img
                        src="/photos/logo2.png"
                        alt="Logo Pemilihan"
                        className="h-32 w-auto object-contain"
                    />
                </div>

                {/* Title */}
                <h1
                    className="font-bold mb-8 leading-tight"
                    style={{ fontSize: '48px', color: '#1e3a5a' }}
                >
                    Pemilihan Ketua Insan Muda Banyakan<br />
                    Periode 2026-2029
                </h1>

                {/* Button */}
                <Link
                    to="/voting"
                    className="inline-block bg-red-600 text-white px-12 py-4 rounded-xl text-xl font-bold hover:bg-red-700 transition shadow-lg hover:shadow-xl"
                >
                    🗳️ Mulai Voting
                </Link>
            </div>
        </div>
    );
}

export default Welcome;
