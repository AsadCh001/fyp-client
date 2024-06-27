import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isAuthenticated = document.cookie.includes('access_token');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chatbox');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 200) {
        toast.success('Login successful!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const data = await response.json();

        Cookies.set('access_token', data.access_token, { expires: 1, path: '/' });
        Cookies.set('refresh_token', data.refresh_token, { expires: 30, path: '/' });

        setTimeout(() => {
          navigate('/chatbox');
        }, 2000);
      } else {
        const data = await response.json();
        toast.error(data.message || 'An error occurred.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error('An error occurred.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white flex flex-col justify-center items-center min-h-screen">
      <div className="logo1-container">
        <button onClick={handleLogoClick} className="logo1-button">
          <img className="logo1-image" src="/logo.png" alt="logo" />
          <div className="logo1-text">HATLAB</div>
        </button>
      </div>
      <div
        className="bg-[#EAEAEA] p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg"
        style={{ borderRadius: '40px', boxShadow: '1px 1px 4px 4px rgba(0, 0, 0, 0.3)' }}
        onKeyDown={handleKeyDown}
      >
        <h1 className="text-4xl font-bold text-center mb-8 text-black">Login</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="mt-6 flex justify-center items-center">
          <button onClick={handleSubmit} className="bg-[#FF5E36] font-bold text-white py-2 px-6 rounded-md hover:bg-[#ff8671]">
            Login
          </button>
        </div>
        <div className="signup-link-container mt-4 text-center text-black">
          <p>New here? <Link to="/signup" className="signup-link">Register Yourself</Link></p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
