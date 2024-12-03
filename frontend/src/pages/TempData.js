import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import NavBar from "../components/NavBar";
import Modal from "../components/Modal";
import ReplayIcon from "@mui/icons-material/Replay";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import "./TempData.css";

const TempData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [temperature, setTemperature] = useState(null);
  const [temperatureCategory, setTemperatureCategory] = useState(null);
  const [spoken, setSpoken] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const fetchTemperatureData = async () => {
    try {
      const response = await fetch("http://192.168.6.150/tempdata");
      if (!response.ok) {
        throw new Error("Failed to fetch temperature data");
      }

      const data = await response.json();
      const tempAvg = parseFloat(data.tempAvg).toFixed(1);
      const category = getTemperatureCategory(tempAvg);

      cancelSpeech();
      if (!spoken) {
        speak(
          `Your Vital Sign Result in Temperature is ${tempAvg} degree Celsius. ${category}`
        );
        setTimeout(() => {
          speak(
            "Do you wish to get your temperature again? Press 4. If you want to go back to the home screen, press 9."
          );
        }, 3000);
        setSpoken(true);
      }

      setTemperature(tempAvg);
      setTemperatureCategory(category);
      setLoading(false); // Hide loader and show results
    } catch (error) {
      console.error("Error fetching temperature data:", error);
      cancelSpeech();
      setLoading(false); // Proceed to hide loader even on error
    }
  };

  const getTemperatureCategory = (temp) => {
    const temperatureValue = parseFloat(temp);
    if (temperatureValue < 32.4) return "Below Normal";
    if (temperatureValue >= 32.5 && temperatureValue <= 37.4) return "Normal";
    if (temperatureValue >= 37.5 && temperatureValue <= 38.0)
      return "Higher than Normal";
    if (temperatureValue >= 38.1 && temperatureValue <= 38.5)
      return "Mild fever";
    if (temperatureValue >= 38.6 && temperatureValue <= 39.0)
      return "Moderate fever";
    if (temperatureValue >= 39.2) return "High Fever";
    return "Error Try Again.";
  };

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

  // useEffect for "Processing..." message
  useEffect(() => {
    speak(
      "Processing.... Please do not remove your finger while getting the result."
    );
  }, []);

  // useEffect for fetching temperature data
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTemperatureData();
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  // useEffect for handling keypresses
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "4") {
        setShowModal(true); // Show modal when "4" is pressed
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
    <div className="tempdata-container">
      {loading ? (
        <div className="loader-container">
          <PuffLoader size={350} color={"#150da9"} loading={loading} />
          <span className="loading-text">PROCESSING</span>
        </div>
      ) : (
        <div className="result-container">
          <div className="navbar-container">
            <NavBar />
          </div>
          {/* Left Column */}
          <div className="left-column">
            <div className="replay-container" onClick={() => setShowModal(true)}>
              <ReplayIcon
                className="replay-icon"
                style={{ fontSize: "5rem" }}
              />
              <span className="replay-text">Retake Temperature</span>
            </div>
          </div>
          {/* Middle Column */}
          <div className="middle-column">
            <h1 className="result-title">VITAL SIGN RESULT</h1>
            <img
              alt="temperature"
              src="/temperatura.png"
              style={{ width: "15vw" }}
            />
            <h2 className="temperature">{temperature} ℃</h2>
            <h2 className="category">{temperatureCategory}</h2>
          </div>
          {/* Right Column */}
          <div className="right-column">
            <div className="arrow-container" onClick={handleGoBack}>
              <ArrowForwardIcon
                className="arrow-icon"
                style={{ fontSize: "5rem", fontWeight: "900" }}
              />
              <span className="arrow-text">DONE</span>
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

export default TempData;
