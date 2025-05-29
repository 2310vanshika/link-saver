import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">Link Saver</h1>
      <button onClick={handleLogout} className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
