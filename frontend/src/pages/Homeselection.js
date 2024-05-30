import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import styles from "./Homeselection.module.css";

const Homeselection = ({ className = "" }) => {
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

  // Voice over for the Homescreen.
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
    <div className={[styles.homeselection, className].join(" ")}>
      <section className={styles.rectangleParent}>
        <header className={styles.frameChild} />
        <div className={styles.logonew1Parent}>
          <img className={styles.logonew1Icon} alt="" src="/logonew.png" />
          <div className={styles.healthKioskWrapper}>
            <h1 className={styles.healthKiosk}>MediSation</h1>
          </div>
        </div>
        <div className={styles.aboutParent}>
          <img
            className={styles.aboutIcon}
            loading="lazy"
            alt=""
            src="/about.svg"
          />
          <div className={styles.aboutWrapper}>
            <a className={styles.about}>ABOUT</a>
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
    </div>
  );
};

Homeselection.propTypes = {
  className: PropTypes.string,
};

export default Homeselection;
