import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Modal from "../components/Modal";
import "./SelectionTwo.css";

const gifImage = process.env.PUBLIC_URL + "/pulseAnim.gif";

const SelectionOne = () => {
  const navigate = useNavigate();
  const gifRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const speak = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  const cancelSpeech = () => {
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    const utteranceText =
      "Pulse Oximeter Selected.. Here is the guide to starting the Pulse Oximeter measurement... First, you must put your right index finger on the Pulse Oximeter sensor in the middle, Make sure you align your finger properly at the tip of the sensor, Do not remove your index finger from the sensor, when the processing starts. To avoid an error results, and wait result patiently before removing your finger.. Press 6 to start... and Press 9 to return to home screen.";
    speak(utteranceText);

    const handleKeyPress = (event) => {
      if (event.key === "6") {
        handleStartClick();
      } else if (event.key === "9") {
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    let observer;

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loaded && gifRef.current) {
          gifRef.current.src = gifImage;
          setLoaded(true);
        } else if (!entry.isIntersecting && gifRef.current) {
          gifRef.current.src = "";
        }
      });
    };

    if (typeof IntersectionObserver !== "undefined" && gifRef.current) {
      observer = new IntersectionObserver(handleIntersection);
      observer.observe(gifRef.current);
    }

    return () => {
      if (observer && gifRef.current) {
        observer.unobserve(gifRef.current);
      }
    };
  }, [loaded]);

  const handleStartClick = () => {
    cancelSpeech();
    setShowModal(true);
  };

  const handleReturn = () => {
    navigate("/");
  };

  const handleConfirm = () => {
    setShowModal(false);
    navigate("/sat-data");
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="selection-one-container">
      <div className="navbar-container">
        <NavBar />
      </div>
      <div className="main-content">
        <div className="left-section">
          <div>
            <div className="red-circle">
              <img src="/pulseox.png" alt="Pulse Oximeter" className="circle-image" />
              <span className="circle-text">Pulse Oximeter</span>
            </div>
            <img
              className="return-button"
              alt="returnbutton"
              src="/returnbutton.png"
              onClick={handleReturn}
            />
          </div>
        </div>
        <div className="right-section">
          <div className="gif-container">
            <div className="gif-wrapper">
              <img ref={gifRef} alt="tempAnimation.gif" className="gif-image" />
            </div>
            <img alt="Rectangle" src="/rectangle-9.svg" className="background-image" />
          </div>
          <button className="start-button" onClick={handleStartClick}>
            START
          </button>
        </div>
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
    </div>
  );
};

export default SelectionOne;
