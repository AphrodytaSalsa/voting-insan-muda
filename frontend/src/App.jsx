import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [votedFor, setVotedFor] = useState(null);

  // Get or create voter token
  const getVoterToken = () => {
    let token = localStorage.getItem('voterToken');
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem('voterToken', token);
    }
    return token;
  };

  // Fetch candidates from backend
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`${API_URL}/candidates`);
        const data = await response.json();
        if (data.success) {
          setCandidates(data.data);
        } else {
          setError('Gagal memuat data kandidat');
        }
      } catch (err) {
        setError('Tidak dapat terhubung ke server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Check if already voted
    const checkVoteStatus = async () => {
      const token = getVoterToken();
      try {
        const response = await fetch(`${API_URL}/vote/check/${token}`);
        const data = await response.json();
        if (data.success && data.hasVoted) {
          setVoted(true);
          setVotedFor(data.vote.candidate_name);
        }
      } catch (err) {
        console.error('Error checking vote status:', err);
      }
    };

    fetchCandidates();
    checkVoteStatus();
  }, []);

  const handleVote = async (id, name) => {
    if (voted || voting) return;

    const confirmVote = window.confirm(`Apakah Anda yakin memilih ${name}?`);
    if (!confirmVote) return;

    setVoting(true);
    try {
      const response = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId: id,
          voterToken: getVoterToken(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVoted(true);
        setVotedFor(name);
        alert('✅ ' + data.message);
      } else {
        alert('❌ ' + data.message);
        if (data.alreadyVoted) {
          setVoted(true);
        }
      }
    } catch (err) {
      alert('❌ Gagal mengirim vote. Coba lagi nanti.');
      console.error(err);
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Memuat data...</div>
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600">Voting Ketua Insan Muda</h1>
        <p className="text-gray-600 mt-2">Gunakan suaramu untuk masa depan yang lebih baik</p>
        {voted && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-xl inline-block">
            ✅ Anda sudah memilih: <strong>{votedFor}</strong>
          </div>
        )}
      </header>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {candidates.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
            <div className="w-full h-40 bg-blue-100 rounded-xl mb-4 flex items-center justify-center">
              {item.photo_url ? (
                <img src={item.photo_url} alt={item.name} className="h-full object-cover rounded-xl" />
              ) : (
                <span className="text-5xl">👤</span>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-4">{item.name}</h2>
            <button
              onClick={() => handleVote(item.id, item.name)}
              disabled={voted || voting}
              className={`w-full py-3 rounded-xl font-semibold transition ${voted
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : voting
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              {voting ? 'Memproses...' : voted ? 'Sudah Memilih' : 'Pilih Sekarang'}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/results"
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          📊 Lihat Hasil Voting
        </Link>
      </div>
    </div>
  );
}

export default App;