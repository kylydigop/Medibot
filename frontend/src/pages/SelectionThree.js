import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IoMicCircleOutline } from "react-icons/io5";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import "./SelectionThree.css";

const SelectionThree = () => {
  const navigate = useNavigate();
  const [recognizedText, setRecognizedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello there! Ask me any of your medical queries!" },
  ]);
  const [recognition, setRecognition] = useState(null);

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
    const initialMessage = "Hello there! Ask me any of your medical queries. Press 1 to start asking questions. Press 0 to go back.";
    speak(initialMessage);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === "Digit1") {
        stopSpeaking();
        startListening();
      } else if (event.code === "Digit0") {
        stopSpeaking();
        handleHomeClick(); // Go back home when '0' is pressed
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleHomeClick]);

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
      const speechToText = event.results[0][0].transcript;
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
    if (recognition && !isListening) {
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
      startListening();
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

  // Send message to API and handle bot response
  const sendMessageToAPI = async (msg) => {
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender: "user", msg: msg }),
      }).then((res) => res.json());

      const botMessage = { type: "bot", text: response.answer || "No response from server" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      speak(botMessage.text);
    } catch (error) {
      console.error("Error fetching from API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-to-Speech function
  const speak = (text) => {
    stopSpeaking();
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  return (
    <Container>
      <div className="selectionthree">
        {/* Header Section */}
        <Row style={{ height: "15%", width: "100%" }}>
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
        <Row style={{ height: "75%", width: "100%", overflowY: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
        <Row className="justify-content-center align-items-center" style={{ height: "10%" }}>
          <Col xs={12} className="text-center">
            {isLoading ? (
              <Spinner animation="border" style={{ color: "black", width: "3rem", height: "3rem" }}/>
            ) : (
              <div className="micbtn" onClick={toggleListening}>
                <IoMicCircleOutline size={50} color={isListening ? "red" : "black"} />
                {isListening && <div className="listening-text">Listening...</div>}
              </div>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default SelectionThree;
