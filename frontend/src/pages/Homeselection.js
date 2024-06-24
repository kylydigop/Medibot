import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import styles from "./Homeselection.module.css";

const Homeselection = ({ className = "" }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [nextPath, setNextPath] = useState("");

  // Function to handle speech synthesis
  const speak = (text) => {
    const speechSynthesis = window.speechSynthesis;
    // Stop any ongoing speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  // Voice over for the Homescreen
  useEffect(() => {
    const utteranceText = "Welcome to MediSation. Press one for temperature measurement... press two for questioning... press three for pulse measurement";
    speak(utteranceText);

    // Event listener for keydown event
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

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    // Cancel speech synthesis when navigating away
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleNavigation = (path) => {
    setNextPath(path);
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      speak("Are you sure you want to proceed?.. Press one to confirm... press two to cancel...");
    }
  }, [showModal]);
  
  const onTempContainerClick = useCallback(() => {
    handleNavigation("/selectionone");
  }, []);

  const onO2SatContainerClick = useCallback(() => {
    handleNavigation("/selectiontwo");
  }, []);

  const onCircleImageClick = useCallback(() => {
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
    <div className={[styles.homeselection, className].join(" ")}>
      <section className={styles.rectangleParent}>
        <header className={styles.frameChild} />
        <div className={styles.logonew1Parent}>
          <img className={styles.logonew1Icon} alt="" src="/logonew.png" />
          <div className={styles.healthKioskWrapper}>
            <h1 className={styles.healthKiosk}>MediSation</h1>
          </div>
        </div>
      </section>
      <section className={styles.homeselectionInner}>
        <div className={styles.frameParent}>
          <div className={styles.frameGroup}>
            <div className={styles.frameWrapper}>
              <div className={styles.frameContainer}>
                <div className={styles.vitalSignsWrapper}>
                  <h1 className={styles.vitalSigns}>Vital Signs</h1>
                </div>
                <div
                  className={styles.note}
                >{`Measure your vital signs by selecting options below `}</div>
              </div>
            </div>
            <div className={styles.frameDiv}>
              <div className={styles.tempWrapper}>
                <div className={styles.temp} onClick={onTempContainerClick}>
                  <div className={styles.circleParent}>
                    <div className={styles.circle} />
                    <img
                      className={styles.thermometerIcon}
                      loading="lazy"
                      alt=""
                      src="/thermometer.svg"
                    />
                  </div>
                  <b className={styles.temperature}>Temperature</b>
                </div>
              </div>
              <div className={styles.frameWrapper1}>
                <div className={styles.circleGroup}>
                  <img
                    className={styles.circleIcon}
                    loading="lazy"
                    alt=""
                    src="/2circle@2x.png"
                    onClick={onCircleImageClick}
                  />
                  <b className={styles.ask}>ASK?</b>
                </div>
              </div>
              <div className={styles.o2Sat} onClick={onO2SatContainerClick}>
                <img className={styles.frameIcon} alt="" src="/frame.svg" />
                <div className={styles.o2Parent}>
                  <div className={styles.o2}>Pulse Oximeter</div>
                  <img
                    className={styles.lungsIcon}
                    loading="lazy"
                    alt=""
                    src="/lungs@2x.png"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.noteTemperatureAndOxygenSWrapper}>
            <p className={styles.noteTemperatureAnd}>
              NOTE: Temperature and Oxygen Saturation have their own individual
              sensors.
            </p>
          </div>
        </div>
      </section>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>Are you sure you want to proceed?</p>
            <button onClick={handleConfirm}>Yes</button>
            <button onClick={handleCancel}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

Homeselection.propTypes = {
  className: PropTypes.string,
};

export default Homeselection;
