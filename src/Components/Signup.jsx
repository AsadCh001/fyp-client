import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
   
    if(confirmPassword !== password)
    {setCPasswordError('Password does not match');}
  };


  const handleSubmit = async () => {
    // Validate inputs
    validateName();
    validateEmail();
    validatePassword();

    // If any validation errors, return
    if (nameError || emailError || passwordError) return;

    try {
      // Send POST request to backend server
      const response = await axios.post('http://127.0.0.1:5000/api/signup', {
        name,
        email,
        password
      });

      // Check if response status is 200
      if (response.status === 200) {
        // Show toaster notification
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

    } 
    catch (error) {
      toast.error(error.response.data.message || 'An error occurred.', {
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

  return (
    <div className='sig-container1' style={{ backgroundColor: '#fff' }}>
      <div className="sig-container">
        <div className="sig-header">
          <div className="text">Sign Up</div>
        </div>
        <div className="inputs">
          <div className="input">
            <img style={{ marginRight: "10px" }} src="/name.png" alt="Hatlab" className="input"/>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} onBlur={validateName} />
            <div className="error">{nameError}</div>
          </div>
          <div className="input">
            <img style={{ marginRight: "20px" }} src="/email.png" alt="Hatlab" className="input" />
            <input type="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} />
            <div className="error">{emailError}</div>
          </div>
          <div className="input">
            <img style={{ marginRight: "20px" }}src="/pass.png" alt="Hatlab" className="input" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={validatePassword} />
            <div className="error">{passwordError}</div>
          </div>
          <div className="input">
            <img style={{ marginRight: "20px" }}src="/pass.png" alt="Hatlab" className="input" />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)} onBlur={validateConfirmPassword} />
            <div className="error">{CpasswordError}</div>
          </div>
        </div>

        
        <div className="signup-container">
          <button className="submit orange" onClick={handleSubmit}>Sign Up</button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
