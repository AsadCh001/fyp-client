import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
        <motion.img
          src="/hatlab.png"
          alt="Hatlab"
          className="hatlab-image"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        />
        <div className="info-container">
          <motion.div
            className="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Revolutionize Your Searching with HATLAB
          </motion.div>
          <div className="description-part1">
            Access the latest information and insights with LLM Boosted 
          </div>
          <div className="description-part2">
          Responses through a seamless and captivating Chatbot experience.
          </div>
          <motion.div
            className="button-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <button onClick={handleSignUpClick} className="button">
              Sign Up
            </button>
            <button onClick={handleLoginClick} className="button">
              Login
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Landingpage;
