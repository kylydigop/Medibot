import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Modal from "../components/Modal";
import PropTypes from "prop-types";

const Homeselection = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [distanceBelowThreshold, setDistanceBelowThreshold] = useState(false);

  // Fetch the list of available voices
  useEffect(() => {
    const fetchVoices = () => {
      const speechSynthesis = window.speechSynthesis;
      let voices = speechSynthesis.getVoices();

      const defaultVoice = voices.find(
        (voice) => voice.name === "en-us-nyc" && voice.lang === "en-US"
      );

      setSelectedVoice(defaultVoice || voices[0]);

      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();

        const defaultVoice = voices.find(
          (voice) => voice.name === "en-us-nyc" && voice.lang === "en-US"
        );

        setSelectedVoice(defaultVoice || voices[0]);
      };
    };

    fetchVoices();
  }, []);

  // Function to handle speech synthesis
  const speak = (text) => {
    const speechSynthesis = window.speechSynthesis;
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  // Poll the distance endpoint and handle response
  useEffect(() => {
    const fetchDistance = async () => {
      try {
        const response = await fetch("http://192.168.6.150/distance");
        const data = await response.json();
        console.log("Distance data:", data);

        if (data.Distance < 20) {
          setDistanceBelowThreshold(true);
        } else {
          setDistanceBelowThreshold(false);
        }
      } catch (error) {
        console.error("Error fetching distance data:", error);
      }
    };

    const interval = setInterval(fetchDistance, 1000);

    return () => clearInterval(interval);
  }, []);

  // Voice over for the Homescreen
  useEffect(() => {
    if (distanceBelowThreshold) {
      const utteranceText =
        "Welcome to MediSation. Press one for temperature measurement... press two to ask any medical inquiries... press three for pulse measurement";
      speak(utteranceText);

      const handleKeyPress = (event) => {
        if (event.key === "1") {
          handleNavigation("/selectionone");
        } else if (event.key === "2") {
          handleNavigation("/selectionthree");
        } else if (event.key === "3") {
          handleNavigation("/selectiontwo");
        }
      };

      window.addEventListener("keydown", handleKeyPress);

      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [distanceBelowThreshold]);

  const handleNavigation = (path) => {
    setNextPath(path);
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      speak(
        "Are you sure you want to proceed?.. Press one to confirm... press two to cancel..."
      );
    }
  }, [showModal, selectedVoice]);

  const onTempContainerClick = useCallback(() => {
    handleNavigation("/selectionone");
  }, []);

  const onO2SatContainerClick = useCallback(() => {
    handleNavigation("/selectiontwo");
  }, []);

  const onAskContainerClick = useCallback(() => {
    handleNavigation("/selectionthree");
  }, []);

  const handleConfirm = () => {
    setShowModal(false);
    navigate(nextPath);
  };

  const handleCancel = () => {
    setShowModal(false);
    setNextPath("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div style={{ height: "15vh", flexShrink: 0 }}>
        <NavBar />
      </div>

      <div
        style={{
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "4rem",
            marginTop: "1rem",
          }}
        >
          {/* Blue Circle */}
          <div
            onClick={onTempContainerClick}
            style={{
              cursor: "pointer",
              backgroundColor: "#007BFF",
              borderRadius: "50%",
              width: "20vw",
              height: "20vw",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "5px solid black",
              textAlign: "center",
              padding: "10px",
            }}
          >
            <img
              src="/thermometer1.png"
              alt="Temperature"
              style={{
                width: "12vw",
                height: "12vw",
              }}
            />
            <span
              style={{
                fontSize: "2rem",
                color: "black",
                fontWeight: "bold",
                marginTop: "0.5rem",
              }}
            >
              Temperature
            </span>
          </div>

          {/* Large Center Circle */}
          <div
            onClick={onAskContainerClick}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/ask-icon.png"
              alt="Ask"
              style={{
                width: "25vw",
                height: "25vw",
              }}
            />
          </div>

          {/* Red Circle */}
          <div
            onClick={onO2SatContainerClick}
            style={{
              cursor: "pointer",
              backgroundColor: "#FF0000",
              borderRadius: "50%",
              width: "20vw",
              height: "20vw",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "5px solid black",
              textAlign: "center",
              padding: "10px",
            }}
          >
            <img
              src="/pulseox.png"
              alt="Pulse Oximeter"
              style={{
                width: "15vw",
                height: "10vw",
              }}
            />
            <span
              style={{
                fontSize: "2rem",
                color: "black",
                fontWeight: "bold",
                marginTop: "0.5rem",
              }}
            >
              Pulse Oximeter
            </span>
          </div>
        </div>

        <p
          style={{
            marginTop: "1rem",
            fontSize: "1rem",
            color: "#555",
          }}
        >
          NOTE: Temperature Sensor and Pulse Oximeter have their own individual
          sensors.
        </p>
      </div>

      {showModal && (
        <Modal
          message="Are you sure you want to proceed?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

Homeselection.propTypes = {
  className: PropTypes.string,
};

export default Homeselection;
