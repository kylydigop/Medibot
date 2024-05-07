import { useCallback, useEffect } from "react";
import FRAMEParent from "../components/FRAMEParent";
import { useNavigate } from "react-router-dom";
import "./Homeselection.css";

const Homeselection = () => {
  const navigate = useNavigate();

  // Function to speak the given text
  const speak = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  // Voice over sa Homescreen.
  useEffect(() => {
    const utteranceText = "Welcome to Medi Sation, your companion on the journey to well-being... Press 1 if you want to measure Temperature... Press 2 if you want to measure Oxygen and Pulse rate... Press 3 to Ask Question...";
    speak(utteranceText);

    // Add event listener for keydown event to listen for number pad keys
    const handleKeyPress = (event) => {
      if (event.key === "1") {
        navigate("/selectionone");
      } else if (event.key === "2") {
        navigate("/selectiontwo");
      } else if (event.key === "3") {
        navigate("/selectionthree");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [navigate]);

  useEffect(() => {
    // Cancel speech synthesis when navigating away
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const onTempContainerClick = useCallback(() => {
    navigate("/selectionone");
  }, [navigate]);

  const onO2SatContainerClick = useCallback(() => {
    navigate("/selectiontwo");
  }, [navigate]);

  const onCircleImageClick = useCallback(() => {
    navigate("/selectionthree");
  }, [navigate]);

  return (
    <div className="homeselection">
      <FRAMEParent />
      <section className="homeselection-inner">
        <div className="a-s-k-thermometer-parent">
          <div className="a-s-k-thermometer">
            <div className="frame-parent">
              <div className="vital-signs-wrapper">
                <h1 className="vital-signs">Vital Signs</h1>
              </div>
              <div className="note">{`Measure your vital signs by selecting options below `}</div>
            </div>
          </div>
          <div className="temp-parent-container-parent">
            <div className="temp-parent-container">
              <div className="temp" onClick={onTempContainerClick}>
                <div className="circle-symbol">
                  <div className="circle" />
                  <img
                    className="thermometer-icon"
                    loading="lazy"
                    alt=""
                    src="/thermometer.svg"
                  />
                </div>
                <b className="temperature">Temperature</b>
              </div>
              <div className="o2-sat" onClick={onO2SatContainerClick}>
                <img className="frame-icon" alt="" src="/frame.svg" />
                <div className="heart-label">
                  <div className="o2">Pulse Oximeter</div>
                  <img
                    className="lungs-icon"
                    loading="lazy"
                    alt=""
                    src="/lungs@2x.png"
                  />
                </div>
              </div>
            </div>
            <div className="ask-question-symbol">
              <img
                className="circle-icon"
                loading="lazy"
                alt=""
                src="/2circle@2x.png"
                onClick={onCircleImageClick}
              />
              <b className="ask">ASK?</b>
            </div>
          </div>
          <footer className="note-temperature-and-oxygen-s-wrapper">
            <div className="note-temperature-and">
              NOTE: Temperature and Oxygen Saturation have their own individual
              sensors.
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default Homeselection;
