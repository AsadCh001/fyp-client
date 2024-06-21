import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    // Check if email or password is empty
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      // Send POST request to backend server
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response status is 200
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

        // Set the access and refresh tokens in cookies
        Cookies.set('access_token', data.access_token, { expires: 1, path: '/' });
        Cookies.set('refresh_token', data.refresh_token, { expires: 30, path: '/' });

        // Redirect to the dashboard or appropriate page after login
        setTimeout(() => {
          navigate('/chatbox');
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.', {
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

  return (
    <div className="bg-white flex flex-col justify-center items-center min-h-screen">
      <div
        className="bg-[#EAEAEA] p-6 rounded-lg shadow-lg w-full max-w-md md:max-w-lg"
        style={{ borderRadius: '40px', boxShadow: '1px 1px 4px 4px rgba(0, 0, 0, 0.3)' }}
      >
        <h1 className="text-4xl font-bold text-center mb-8">Login</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-white-100 rounded-md shadow-sm focus:outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div className="mt-6 flex justify-center items-center">
          <button onKeyPress={handleKeyPress} onClick={handleSubmit} className="bg-[#FF5E36] font-bold text-white py-2 px-6 rounded-md">
            Login
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
