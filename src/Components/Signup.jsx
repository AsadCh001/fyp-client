import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [CpasswordError, setCPasswordError] = useState('');
  const navigate = useNavigate();

  const validateName = () => {
    setNameError(name ? '' : 'Name is required.');
  };

  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailPattern.test(email) ? '' : 'Invalid email format.');
  };

  const validatePassword = () => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    setPasswordError(passwordPattern.test(password) ? '' : 'Password must be at least 8 characters long and contain at least one symbol.');
  };

  const validateConfirmPassword = () => {
    setCPasswordError(confirmPassword !== password ? 'Password does not match' : '');
  };

  const handleSubmit = async () => {
    validateName();
    validateEmail();
    validatePassword();
    validateConfirmPassword();

    if (nameError || emailError || passwordError || CpasswordError) return;

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/signup", { name, email, password });

      if (response.status === 200) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } 
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.', {
        position: "top-right",
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
  
  return (
    <>
      <div className="log-cont">
        <button onClick={handleLogoClick} className="log-button">
          <img className="log-image" src="/logo.png" alt="logo" />
          <div className="log-text">HATLAB</div>
        </button>
      </div>
      
      <div className="sig-container">
        <div className="sig-header">
          <div className="text">Sign Up</div>
        </div>
        <div className="input-container">
          <div className="input">
            <img src="/name.png" alt="Name Icon" />
            <input type="text" placeholder="Enter Full Name" value={name} onChange={(e) => setName(e.target.value)} onBlur={validateName} />
          </div>
          {nameError && <div className="error">{nameError}</div>}
          <div className="input">
            <img src="/email.png" alt="Email Icon" />
            <input type="email" placeholder=" Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} />
          </div>
          {emailError && <div className="error">{emailError}</div>}
          <div className="input">
            <img src="/pass.png" alt="Password Icon" />
            <input type="password" placeholder="Password (At least 8 Characters & 1 Symbol)" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} />
          </div>
          {passwordError && <div className="error">{passwordError}</div>}
          <div className="input">
            <img src="/pass.png" alt="Confirm Password Icon" />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)} onBlur={validateConfirmPassword} />
          </div>
          {CpasswordError && <div className="error">{CpasswordError}</div>}
        </div>
        <div className="signup-container">
          <button className="submit orange" onClick={handleSubmit}>Sign Up</button>
        </div>
        <div className="login-link-container">
          <p>Already have an account? <Link to="/login" className="login-link">Login here</Link></p>
        </div>
      </div>
      <ToastContainer />

    </>
  );
};

export default Signup;
