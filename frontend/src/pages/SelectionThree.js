import React, { useState, useEffect, useRef, useCallback } from "react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IoMicCircleOutline } from "react-icons/io5";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "./SelectionThree.css";

const SelectionThree = () => {
  const navigate = useNavigate();
  const [recognizedText, setRecognizedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello there! Ask me any of your medical queries!" },
  ]);
  const [recognition, setRecognition] = useState(null);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Function to handle going back home
  const handleHomeClick = useCallback(async () => {
    try {
      await fetch("http://localhost:5000/chat", {
        method: "DELETE",
      });
      setMessages([
        { type: "bot", text: "Hello there! Ask me any of your medical queries!" },
      ]);
      navigate("/");
    } catch (error) {
      console.error("Error clearing chat history:", error);
      navigate("/"); // Navigate even if there's an error clearing the chat history
    }
  }, [navigate]);

  // Handle Text-to-Speech on page load
  useEffect(() => {
    const initialMessage = "Hello there! Ask me any of your medical queries. Press 8 to start asking questions. Press 9 to go back.";
    speak(initialMessage);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (showModal) return;
  
      if (event.key === "8") {
        stopSpeaking();
        startListening();
      } else if (event.key === "9") {
        stopSpeaking();
        handleHomeClick();
      }
    };
  
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showModal, handleHomeClick, recognition]); // Added recognition
  

  // Initialize speech recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const newRecognition = new SpeechRecognition();

    newRecognition.continuous = false;
    newRecognition.interimResults = false;
    newRecognition.lang = "en-US";

    newRecognition.onstart = () => {
      setIsListening(true);
      speak("Listening");
    };

    newRecognition.onresult = (event) => {
      let speechToText = event.results[0][0].transcript.trim();

      // Remove "Listening" if it appears at the beginning
      if (speechToText.startsWith("Listening")) {
        speechToText = speechToText.replace(/^Listening\s*/i, ""); // Removes "Listening" and any trailing space
      }

      setRecognizedText(speechToText);
      handleSendMessage(speechToText);
      stopListening();
    };

    newRecognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      stopListening();
    };

    newRecognition.onend = () => {
      setIsListening(false);
    };

    setRecognition(newRecognition);
  }, []);

  // Start listening for speech input
  const startListening = () => {
    if (!recognition) {
      console.warn("Speech recognition not initialized yet.");
      return;
    }
    if (!isListening) {
      setIsListening(true);
      recognition.start();
    }
  };
  
  // Stop listening for speech input
  const stopListening = () => {
    if (recognition && isListening) {
      setIsListening(false);
      recognition.stop();
    }
  };

  // Stop ongoing speech synthesis
  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
    }
  };

  // Toggle speech recognition
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setTimeout(() => {
        startListening();
      }, 1000);
      setTimeout(() => {
        startListening();
      }, 1000);
    }
  };

  // Handle message sending
  const handleSendMessage = (text) => {
    if (text.trim()) {
      const userMessage = { type: "user", text: text };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setIsLoading(true);
      sendMessageToAPI(text);
    }
  };

  const truncateToNearestPeriod = (text) => {
    const lastPeriodIndex = text.lastIndexOf(".");
    if (lastPeriodIndex !== -1 && lastPeriodIndex !== text.length - 1) {
      return text.substring(0, lastPeriodIndex + 1);
    }
    return text;
  };

  const truncateToNearestPeriod = (text) => {
    const lastPeriodIndex = text.lastIndexOf(".");
    if (lastPeriodIndex !== -1 && lastPeriodIndex !== text.length - 1) {
      return text.substring(0, lastPeriodIndex + 1);
    }
    return text;
  };

  // Send message to API and handle bot response
  const sendMessageToAPI = async (msg) => {
    try {
      setIsLoading(true);
      setShowModal(true); // Show modal while processing
      setIsLoading(true);
      setShowModal(true); // Show modal while processing
      setIsLoading(true);
      setShowModal(true); // Show modal while processing
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender: "user", msg: msg }),
      }).then((res) => res.json());

      const botResponse = truncateToNearestPeriod(response.answer || "No response from server");
      const botMessage = { type: "bot", text: botResponse };
      const botResponse = truncateToNearestPeriod(response.answer || "No response from server");
      const botMessage = { type: "bot", text: botResponse };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      
      // Add a follow-up message after bot message has finished speaking
      const followUpMessage = "Do you have further inquiry? Press 8 to ask questions, press 9 to go back.";
      speak(botMessage.text, () => {
        speak(followUpMessage);
      });
    } catch (error) {
      console.error("Error fetching from API:", error);
    } finally {
      setIsLoading(false);
      setShowModal(false); 
      setShowModal(false); 
    }
  };

  // Text-to-Speech function
  const speak = (text, callback=null) => {
    stopSpeaking();
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.onend = () => {
      if (callback) callback();
    };
  
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let intervalId;
  
    if (showModal) {
      speak("Processing, please wait for a few seconds.");
      intervalId = setInterval(() => {
        speak("Please wait for a few seconds.");
      }, 30000); // Retrigger every 30 seconds
    }
  
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Clear interval when modal is hidden or component unmounts
      }
    };
  }, [showModal]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Container fluid className="selectionthree">
        {/* Modal Section */}
        {showModal && (
          <div className="processing-modal">
            <p>{isListening ? "Listening..." : "Processing..."}</p>
            <div className="custom-spinner"></div>
          </div>
        )}

    <Container fluid className="selectionthree">
        {/* Modal Section */}
        {showModal && (
          <div className="processing-modal">
            <p>{isListening ? "Listening..." : "Processing..."}</p>
            <div className="custom-spinner"></div>
          </div>
        )}

        {/* Header Section */}
        <Row className="header-section">
        <Row className="header-section">
          <section className="rectangle-parent">
            <div className="rectangle-div" />
            <div className="speech-language-therapy-parent">
              <button className="speech-language-therapy">
                <img
                  className="logonew"
                  alt="logo"
                  src="/logo2.png"
                  onClick={handleHomeClick}
                />
              </button>
              <div className="health-kiosk-wrapper">
                <h1 className="health-kiosk" onClick={handleHomeClick}>
                  MediSation
                </h1>
              </div>
            </div>
          </section>
        </Row>

        {/* Chat Display Section */}
        <Row className="body-section">
          <div
            ref={chatContainerRef} // Attach the ref to the container
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxHeight: "400px", // Add a max height for scrolling
              overflowY: "auto",  // Enable scrolling
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                  margin: "5px 0",
                }}
              >
                <div
                  className={`message-bubble ${msg.type === "user" ? "right" : "left"}`}
                  style={{
                    maxWidth: "70%",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </Row>

        {/* Microphone and Loading Spinner Section */}
        <Row className="footer-section justify-content-center align-items-center">
          <Col xs={12} className="text-center">
            <div className="micbtn" onClick={toggleListening}>
              <IoMicCircleOutline size={100} color={isListening ? "red" : "black"} />
              {isListening && <div className="listening-text">Listening...</div>}
            </div>
          </Col>
        </Row>
    </Container>
  );
};

export default SelectionThree;