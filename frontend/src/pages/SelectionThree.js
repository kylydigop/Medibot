import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectionThree.css";
import { IoMicCircleOutline } from "react-icons/io5";
import { Container, Row, Col } from "react-bootstrap";

const SelectionThree = () => {
  const navigate = useNavigate();
  const [recognizedText, setRecognizedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [chat, setChat] = useState([
    { type: "bot", text: "Hello there! Ask me any of your medical queries!" },
  ]);
  const recognition = new (window.webkitSpeechRecognition ||
    window.SpeechRecognition)();

  const onGroupClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onHome2StreamlineCoresvgClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onHOMETextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (recognition) {
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log(transcript);
        setRecognizedText(transcript);
        handleSendMessage(transcript);
        stopListening(); // Stop listening once the speech is recognized
      };

      recognition.onend = () => {
        console.log("Speech recognition service disconnected");
        setIsListening(false); // Update listening state when recognition stops
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopListening(); // Stop listening on error
      };
    }
  }, [recognition]); // Ensure dependencies are properly managed

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      setIsListening(false);
      recognition.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSendMessage = (text) => {
    if (text.trim()) {
      const message = { type: "user", text: text };
      setChat([...chat, message]); // Add user message to chat
      rasaAPI(text); // Call the function to send data to your API
    }
  };

  const rasaAPI = async (msg) => {
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sender: "user", msg: msg }),
      }).then((res) => res.json());

      console.log("Received response:", response); // Log full response

      const botMessage = {
        type: "bot",
        text: response.msg || "No response from server",
      };
      console.log("Bot response:", botMessage.text); // Logging the bot response
      setChat((prevChat) => [...prevChat, botMessage]); // Add bot response to chat
    } catch (error) {
      console.error("Error fetching from Rasa API:", error);
    }
  };

  return (
    <Container>
      <div className="selectionthree">
        <Row>
          <section className="rectangle-parent">
            <div className="rectangle-div" />
            <div className="speech-language-therapy-parent">
              <button className="speech-language-therapy">
                <img
                  className="logonew"
                  alt=""
                  src="/logonew.png"
                  onClick={onHome2StreamlineCoresvgClick}
                />
              </button>
              <div className="health-kiosk-wrapper">
                <h1
                  className="health-kiosk"
                  onClick={onHome2StreamlineCoresvgClick}
                >
                  MediSation
                </h1>
              </div>
            </div>
            <div className="frame-wrapper2">
              <div className="frame-parent3">
                <div className="home-2-streamline-coresvg-wrapper">
                  <img
                    className="home-2-streamline-coresvg-icon"
                    loading="lazy"
                    alt=""
                    src="/home2streamlinecoresvg.svg"
                    onClick={onHome2StreamlineCoresvgClick}
                  />
                </div>
                <div className="home-wrapper">
                  <b className="home" onClick={onHOMETextClick}>
                    HOME
                  </b>
                </div>
                <img
                  className="about-icon"
                  loading="lazy"
                  alt=""
                  src="/about.svg"
                />
                <div className="about-wrapper">
                  <b className="about">ABOUT</b>
                </div>
              </div>
            </div>
          </section>
        </Row>

        <Row style={{ height: "75%", width: "100%" }}>
          {chat.map((msg, index) => (
            <Row
              key={index}
              style={{
                justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                width: "100%",
              }}
            >
              <Col xs={12}>
                <div
                  className={`message-bubble ${
                    msg.type === "user" ? "right" : "left"
                  }`}
                >
                  {msg.text}
                </div>
              </Col>
            </Row>
          ))}
        </Row>

        <Row
          className="justify-content-center align-items-center"
          style={{ height: "10%" }}
        >
          <Col xs={12} className="text-center">
            <div className="micbtn" onClick={toggleListening}>
              <IoMicCircleOutline size={24} className="mic-icon" />
              {isListening ? (
                <div className="listening-text">Listening...</div>
              ) : null}
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default SelectionThree;
