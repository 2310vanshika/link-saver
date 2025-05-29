
import { useState } from 'react';

const URLInput = ({ onNewBookmark }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getPageTitle = async (url) => {
    try {
      const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.querySelector('title')?.innerText || 'No title found';
    } catch {
      return 'No title available';
    }
  };

  const getSummary = async (url) => {
    try {
      const response = await fetch('https://r.jina.ai/' + encodeURIComponent(url));
      const summary = await response.text();
      return summary;
    } catch (error) {
      return 'Summary temporarily unavailable.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);

    const title = await getPageTitle(url);
    const summary = await getSummary(url);

    const newBookmark = {
      id: Date.now(),
      url,
      title,
      summary,
      createdAt: new Date().toISOString()
    };

    onNewBookmark(newBookmark);

    setUrl('');
    setLoading(false);
  };

  return (
    <div className="mb-6 w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Paste a link..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border border-gray-300 p-2 rounded-md flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save & Summarize'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default URLInput;
