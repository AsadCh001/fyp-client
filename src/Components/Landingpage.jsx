import { useNavigate } from 'react-router-dom';
import './landingpage.css';

function Landingpage() {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="bg-dark">
      <div className="logo-container">
        <button onClick={handleLogoClick} className="logo-button">
          <img className="logo-image" src="/logo.png" alt="logo" />
          <div className="logo-text">HATLAB</div>
        </button>
      </div>
      <div className="main-content">
        <img src="/hatlab.png" alt="Hatlab" className="hatlab-image" />
        <div className="info-container">
          <div className="title">HATLAB</div>
          <div className="description">
            🚀 Our research project revolutionizes user interaction with Large Language Models (LLMs) by seamlessly integrating Quantum Machine Learning techniques and advanced data acquisition methods. #QuantumML #AIResearch 🔍🧠
          </div>
          <div className="button-container">
            <button onClick={handleSignUpClick} className="button">
              Sign Up
            </button>
            <button onClick={handleLoginClick} className="button">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landingpage;
