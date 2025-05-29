import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const existingUser = localStorage.getItem('user');
    if (!existingUser) {
      const demoUser = {
        email: 'demo@test.com',
        password: 'password123',
      };
      localStorage.setItem('user', JSON.stringify(demoUser));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && email === storedUser.email && password === storedUser.password) {
      localStorage.setItem('token', 'demo_token');
      navigate('/home');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white shadow-lg p-8 rounded space-y-4 w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>
        <input
          className="w-full px-4 py-2 border rounded"
          type="email"
          placeholder="demo@test.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full px-4 py-2 border rounded"
          type="password"
          placeholder="password123"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
