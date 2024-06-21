import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landingpage from './Components/Landingpage';
import SignUp from './Components/Signup';
import Login from './Components/Login';
import Chatbox from './Components/Chatbox';

// Find the root element in your HTML
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create a root.
const root = ReactDOM.createRoot(rootElement);

// Render the router with routes defined
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatbox" element={<Chatbox />} />
        <Route path="/chatbox/:chat_id" element={<Chatbox />} />

      </Routes>
    </Router>
  </React.StrictMode>
);
