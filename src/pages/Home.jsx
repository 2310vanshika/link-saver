import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookmarkCard from '../components/BookmarkCard';
import Navbar from '../components/Navbar';

const Home = () => {
  const [url, setUrl] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
    const saved = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(saved);
  }, [navigate]);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const fetchTitle = async (url) => {
    try {
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      const text = await res.text();
      const match = text.match(/<title>(.*?)<\/title>/i);
      return match ? match[1] : 'No Title Found';
    } catch {
      return 'Title Unavailable';
    }
  };
const getSummary = async (url) => {
  try {
    const response = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`);
    const rawText = await response.text();


    let cleanText = rawText
      .replace(/!\[.*?\]\(.*?\)/g, '')  
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') 
      .replace(/#+\s*/g, '')            
      .replace(/-|\*|\`/g, '')          
      .replace(/\n{2,}/g, '\n')         
      .replace(/\s{2,}/g, ' ')          
      .trim();

    const firstParagraph = cleanText.match(/(.*?\.)\s*\n/s)?.[0] || cleanText;
    const sentences = firstParagraph.split(/[.!?]+/);
    const summary = sentences.slice(0, 3).join('. ') + '.';
    return summary.replace(/\[\d+\]/g, '').slice(0, 500);
  } catch (error) {
    return "Summary unavailable (API error).";
  }
};


  const handleToggleBookmark = (id) => {
    const updated = bookmarks.map((b) =>
      b.id === id ? { ...b, bookmarked: !b.bookmarked } : b
    );
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const handleAdd = async () => {
    setError('');
    if (!isValidUrl(url)) {
      setError('Enter a valid URL!');
      return;
    }

    setLoading(true);
    const title = await fetchTitle(url);
    const summary = await getSummary(url);

    const newBookmark = {
      id: Date.now(),
      url,
      title,
      summary,
      createdAt: new Date().toISOString(),
      bookmarked: true,
    };

    const updated = [newBookmark, ...bookmarks];
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
    setUrl('');
    setLoading(false);
  };

  const handleDelete = (id) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const displayedBookmarks = showBookmarkedOnly
    ? bookmarks.filter((b) => b.bookmarked)
    : bookmarks;

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border px-4 py-2 rounded"
            placeholder="Paste a link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save & Summarize'}
          </button>
        </div>

        {error && (
          <p className="text-red-600 mb-4 text-sm font-medium">{error}</p>
        )}

        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setShowBookmarkedOnly(false)}
            className={`px-4 py-2 rounded border ${
              !showBookmarkedOnly
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600'
            }`}
          >
            All Links
          </button>
          <button
            onClick={() => setShowBookmarkedOnly(true)}
            className={`px-4 py-2 rounded border ${
              showBookmarkedOnly
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600'
            }`}
          >
            Bookmarked Only
          </button>
        </div>

        <div className="grid gap-4">
          {displayedBookmarks.length === 0 ? (
            <p className="text-gray-500">
              {showBookmarkedOnly
                ? 'No bookmarked links yet.'
                : 'No bookmarks saved yet.'}
            </p>
          ) : (
            displayedBookmarks.map((b) => (
              <BookmarkCard
                key={b.id}
                data={b}
                onDelete={() => handleDelete(b.id)}
                onToggleBookmark={() => handleToggleBookmark(b.id)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
