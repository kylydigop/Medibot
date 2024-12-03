import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DotLoader } from "react-spinners";
import NavBar from "../components/NavBar";
import Modal from "../components/Modal";
import ReplayIcon from "@mui/icons-material/Replay";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./SatData.css";

const SaturationData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ spo2: null, pulse: null });
  const [showModal, setShowModal] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const maxRetries = 3; // Maximum number of retry attempts

  const speak = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  const cancelSpeech = () => {
    const speechSynthesis = window.speechSynthesis;
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel(); // Stop speaking
    }
  };

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);

      // Fetch the data from the specified IP
      fetch("http://192.168.6.150/poxdata")
        .then((response) => response.json())
        .then((data) => {
          const spo2 = data.SpO2; // Oxygen saturation
          const pulse = data.BPM; // Pulse rate

          if (spo2 <= 0 || spo2 < 60) {
            // If SpO2 is invalid, retry fetching
            if (retryCount < maxRetries) {
              speak("Invalid reading. Retrying...");
              setRetryCount((prev) => prev + 1);
            } else {
              speak(
                "Unable to get a valid reading after multiple attempts. Please try again."
              );
              setLoading(false);
            }
          } else {
            // If data is valid, update state
            setData({ spo2, pulse });
            setLoading(false);

            // Announce the results via text-to-speech
            speak(
              `Your Vital Sign Result is SpO2 ${spo2}% and Pulse Rate is ${pulse} beats per minute.`
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching the data:", error);
          speak("Error fetching data. Please try again.");
          setLoading(false);
        });
    };

    // Initial voice message
    speak(
      "Processing.... Please do not remove your finger while getting the result."
    );
    fetchData();
  }, [retryCount]);

  const handleConfirm = () => {
    setShowModal(false); // Hide modal
    window.location.reload(); // Reload page to restart the process
  };

  const handleCancel = () => {
    setShowModal(false); // Hide modal
  };

  const handleGoBack = () => {
    setShowModal(false); // Hide modal
    speak("Thank you for using MediSation. Have a great day...");
    navigate("/"); // Navigate to home screen
  };

  // useEffect for handling keypresses
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "6") {
        setShowModal(true); // Show modal when "6" is pressed
      } else if (event.key === "9") {
        cancelSpeech();
        speak("Returning to the home screen.");
        navigate("/");
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate]);

  return (
    <div className="oxidata-container">
      {loading ? (
        <div className="loader-container">
          <DotLoader size={350} color={"#eee518"} loading={loading} />
          <span className="loading-text">PROCESSING</span>
        </div>
      ) : (
        <div className="result-container">
          <div className="navbar-container">
            <NavBar />
          </div>
          <h1 className="result-title">VITAL SIGN RESULT</h1>
          <div className="main-content"> 
            {/* First Column */}
            <div className="first-column">
              <div className="replay-container" onClick={() => setShowModal(true)}>
                <ReplayIcon className="replay-icon" style={{ fontSize: "5rem" }}/>
                <span className="replay-text">Retake Temperature</span>
              </div>
            </div>

            {/* Second Column */}
            <div className="second-column"> 
              <img
                className="spo2-image"
                alt="spo2"
                src="/spo2.png"
              />
              <div className="oxygen-text">
                <p style={{ margin: "0" }}>Oxygen Saturation</p>
                {data.spo2 !== null ? <p>{data.spo2}%</p> : <p> Loading</p>}
              </div>
            </div>

            {/* Third Column */}
            <div className="third-column">
              <img
                className="pulse-image"
                alt="pulse"
                src="/pulso.png"
              />
              <div className="pulse-text">
                <p style={{ margin: "0" }}>Pulse Rate</p>
                {data.pulse !== null ? <p>{data.pulse} BPM</p> : <p> Loading</p>}
              </div>
            </div>

            {/* Fourth Column */}
            <div className="fourth-column">
              <div className="arrow-container" onClick={handleGoBack}>
                <ArrowForwardIcon
                  className="arrow-icon"
                  style={{ fontSize: "5rem", fontWeight: "900" }}
                />
                <span className="arrow-text">DONE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <Modal
          message="Are you sure you want to proceed?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          speak={speak}
          cancelSpeech={cancelSpeech}
        />
      )}
    </div>
  );
};

export default SaturationData;
