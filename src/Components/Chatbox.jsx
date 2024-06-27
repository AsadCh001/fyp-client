import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import './Chatbox.css';
import Sidebar from './Sidebar';

const Chatbox = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState('');
  const [chats, setChats] = useState([]);
  const [initialPrompt, setInitialPrompt] = useState('');
  const [activeChatId, setActiveChatId] = useState('');
  const [loadingDots, setLoadingDots] = useState(false);
  const [currentChatTitle, setCurrentChatTitle] = useState('New Chat');
  const [promptStatus, setPromptStatus] = useState(['', '', '']); // ['', '', ''] -> [red, yellow, green]
  const navigate = useNavigate();
  const { chat_id } = useParams();

  useEffect(() => {
    fetchChatList();
    if (chat_id) {
      setChatId(chat_id);
      setActiveChatId(chat_id);
      fetchChatHistory(chat_id);
    }
  }, [chat_id]);

  const fetchChatList = async () => {
    try {
      const response = await fetchWithAuth("http://127.0.0.1:5000/api/chats", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('response:', response);
      if (response.ok) {
        const data = await response.json();
        console.log('chat list:', data);
        setChats(data.chats);
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching chat list:', error);
      toast.error('An error occurred while fetching the chat list.', {
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

  const fetchChatHistory = async (chatId) => {
    try {
      const response = await fetchWithAuth(`http://127.0.0.1:5000/api/getchat/${chatId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('chat history:', data);
        const formattedMessages = data.chat_history.map(item => ({
          prompt: item.prompt,
          response: item.response
        }));
        setMessages(formattedMessages);

        // Only set the chat title if it's the initial load of the chat
        if (!currentChatTitle || currentChatTitle === 'New Chat') {
          setCurrentChatTitle(data.prompt);
        }
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('An error occurred while fetching the chat history.', {
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

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;
  
    const newMessage = { prompt: inputValue, response: '' };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInitialPrompt(inputValue); // Store the initial prompt
    const currentInput = inputValue;
    setInputValue('');
    setLoading(true);
    setLoadingDots(true); // Show loading dots
    setPromptStatus(['red', '', '']); // Set first circle to red
  
    try {
      let newChatId = chatId;
      if (!chatId) {
        // If no chatId, start a new chat
        const startChatResponse = await fetchWithAuth("http://127.0.0.1:5000/api/startchat", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (startChatResponse.ok) {
          const startChatData = await startChatResponse.json();
          newChatId = startChatData.chat_id;
          setChatId(newChatId);
          setActiveChatId(newChatId); 
         
          window.history.pushState({}, '', `/chatbox/${newChatId}`);
        } else {
          console.error('Error:', startChatResponse.status, startChatResponse.statusText);
          return;
        }
      }
  
      const response = await fetchWithAuth("http://127.0.0.1:5000/api/getfeatures", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentInput, chat_id: newChatId }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const features = data.result;
        setPromptStatus(['red', 'yellow', '']); // Set second circle to yellow
  
        if (features.length < 3) {
          const promptWithFeature = `${currentInput}`;
          const summarizeResponse = await fetchWithAuth(`http://127.0.0.1:5000/api/summarize/${newChatId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: promptWithFeature }),
          });
  
          if (summarizeResponse.ok) {
            const summaryData = await summarizeResponse.json();
            const summary = summaryData.result;
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages];
              updatedMessages[updatedMessages.length - 1].response = summary;
              return updatedMessages;
            });
            setPromptStatus(['red', 'yellow', 'green']); // Set third circle to green
  
            // Update the chats state with the response and title only if new chat
            if (!chats.find(chat => chat.chat_id === newChatId)) {
              setChats((prevChats) => [
                ...prevChats,
                { chat_id: newChatId, prompt: currentInput, response: summary }
              ]);
            }
  
            // Set the chat title for new chats only
            if (currentChatTitle === 'New Chat') {
              setCurrentChatTitle(currentInput);
            }
          } else {
            console.error('Error:', summarizeResponse.status, summarizeResponse.statusText);
            toast.error('An error occurred while summarizing the data.', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        } else {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1].response = 'Choose one of your required Domain:-';
            updatedMessages[updatedMessages.length - 1].features = features;
            setLoadingDots(false); // Hide loading dots
            return updatedMessages;
          });
        }
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('An error occurred while fetching the data.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setLoadingDots(false); // Ensure loading dots are hidden
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleFeatureClick = async (feature) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      updatedMessages[updatedMessages.length - 1].response = '';
      updatedMessages[updatedMessages.length - 1].features = null;
      return updatedMessages;
    });

    setLoading(true);
    setLoadingDots(true);

    try {
      const promptWithFeature = `${initialPrompt} in ${feature}`;
      const response = await fetchWithAuth(`http://127.0.0.1:5000/api/summarize/${chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: promptWithFeature }),
      });

      if (response.ok) {
        const summaryData = await response.json();
        const summary = summaryData.result;

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].response = summary;
          return updatedMessages;
        });

        // Update the chats state with the response and title only if new chat
        if (!chats.find(chat => chat.chat_id === chatId)) {
          setChats((prevChats) => [
            ...prevChats,
            { chat_id: chatId, prompt: initialPrompt, response: summary }
          ]);
        }

        setPromptStatus(['red', 'yellow', 'green']); 

        // Set the chat title for new chats only
        if (currentChatTitle === 'New Chat') {
          setCurrentChatTitle(initialPrompt);
        }
      } else {
        console.error('Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error summarizing feature:', error);
      toast.error('An error occurred while summarizing the feature.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
      setLoadingDots(false);
    }
  };

  const handleChatClick = (chatId) => {
    setActiveChatId(chatId);
  
    // Find the chat title and set it
    const chat = chats.find(chat => chat.chat_id === chatId);
    if (chat) {
      setCurrentChatTitle(chat.prompt);
    }
  
    navigate(`/chatbox/${chatId}`);
    fetchChatHistory(chatId); // Fetch chat history for the selected chat
  };

  const fetchWithAuth = async (url, options) => {
    let accessToken = getCookie('access_token');
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    };

    let response = await fetch(url, options);

    if (response.status === 401) {
      const refreshToken = getCookie('refresh_token');
      const refreshResponse = await fetch("http://127.0.0.1:5000/api/refresh", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        accessToken = refreshData.access_token;
        setCookie('access_token', accessToken, 1 / 24);

        options.headers['Authorization'] = `Bearer ${accessToken}`;
        response = await fetch(url, options);
      } else {
        navigate('/login');
      }
    }
    return response;
  };

  return (
    <div className="chat-app">
      <Sidebar />
      <div className="main-chat">
        <div className="chat-header">
          <div className="text">{currentChatTitle}</div>
          <div className="status-indicators">
            <span className={`status-circle ${promptStatus[0]}`}></span>
            <span className={`status-circle ${promptStatus[1]}`}></span>
            <span className={`status-circle ${promptStatus[2]}`}></span>
          </div>
        </div>
        <div className="chat-body">
          <div className="user-chat">
            {messages.map((message, index) => (
              <div key={index}>
                <div className="message-row right">
                  <div className="message">{message.prompt}</div>
                  <FontAwesomeIcon icon={faUser} className="icon" />
                </div>
                <div className="message-row left">
                  <FontAwesomeIcon icon={faRobot} className="icon" />
                  <div className="message">
                    {loadingDots && !message.response && (
                      <div className="loading-dots">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                    )}
                    {message.response}
                    {message.features && (
                      <div className="features-list">
                        {message.features.map((feature, idx) => (
                          <div key={idx} className="feature-item" onClick={() => handleFeatureClick(feature)}>
                            {feature}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            placeholder="Write your prompt here..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="chat-input"
            disabled={loading}
          />
          <button onClick={handleSend} className="send-button" style={{ fontSize: '24px' }} disabled={loading}>
            ➤
          </button>
          {/* {loading && <div>Loading...</div>} */}
        </div>
      </div>
      <div className="right-sidebar">
        <div className="sidebar-title">Chat History</div>
        <hr className="breakline" />
        <div className="chat-titles">
          {chats.map((chat) => (
            <div
              key={chat.chat_id}
              className={`menu-item ${chat.chat_id === activeChatId ? 'active' : ''}`}
              onClick={() => handleChatClick(chat.chat_id)}
            >
              <div>{chat.prompt}</div>
            </div>
          ))}
        </div>
        <button className="new-chat-button" onClick={() => { navigate('/chatbox'); window.location.reload(); }}>New Chat</button>
      </div>
      <ToastContainer />
    </div>

  );
};

export default Chatbox;
