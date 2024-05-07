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
    utterance.pitch = 10
    utterance.volume = 25
    utterance.rate = 0.8
    speechSynthesis.speak(utterance);
  };

  // Voice over sa Homescreen.
  useEffect(() => {
    speak("Welcome to MediSation, your companion on the journey to well-being...... Use the options below to start  your measurement...");
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
