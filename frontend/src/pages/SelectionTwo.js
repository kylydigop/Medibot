import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FrameComponent1 from "../components/FrameComponent1";
import "./SelectionTwo.css";
import PulsComp from "../components/PulsComp";

const SelectionTwo = () => {
  const navigate = useNavigate();
  
  // Function to speak the given text
  const speak = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  // Voice over sa Homescreen.
  useEffect(() => {
    const utteranceText = "Pulse Oximeter Selected.. Here is the guide to starting the Pulse Oximeter measurement... First, you must put your right index finger on the Pulse Oximeter sensor in the middle, Make sure you align your finger properly at the tip of the sensor, Do not remove your index finger from the sensor, when the processing starts. To avoid an error results, and wait result patiently before removing your finger.. Press 1 to start... and Press 2 to return to home screen.";
    speak(utteranceText);

    // Add event listener for keydown event to listen for number pad keys
    const handleKeyPress = (event) => {
      if (event.key === "1") {
        navigate("/sat-data");
      } else if (event.key === "2") {
        navigate("/");
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

  const onHome2StreamlineCoresvgClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onHOMETextClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onGroupContainer1Click = useCallback(() => {
    navigate("/sat-data");
  }, [navigate]);

  const onGroupImage1Click = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="selectiontwo">
      <div className="screen-12" />
      <img className="screen-2-icon1" alt="" src="/screen-2.svg" />
      <FrameComponent1 
      onHome2StreamlineCoresvgClick={onHome2StreamlineCoresvgClick}
      onHOMETextClick={onHOMETextClick}
      />
      <section className="selectiontwo-inner">
        <div className="frame-container">
          <div className="oval-shape-wrapper">
            <div className="oval-shape">
              <div className="parent-circle-wrapper">
                <div className="parent-circle">
                  <div className="o21">Pulse Oximeter</div>
                  <div className="circle-shape">
                    <div className="circle4" />
                    <img
                      className="pulse-icon"
                      loading="lazy"
                      alt=""
                      src="/pulseox.png"
                    />
                  </div>
                </div>
              </div>
              <img
                className="oval-shape-child"
                loading="lazy"
                alt=""
                src="/returnbutton.png"
                onClick={onGroupImage1Click}
              />
            </div>
          </div>
          <PulsComp
            aNIMATIONONHOWTOUSETHETEM="ANIMATION ON HOW TO USE THE PULSE OXIMETER WITH VOICE "
            onGroupContainer1Click={onGroupContainer1Click}
          />
        </div>
      </section>
    </div>
  );
};

export default SelectionTwo;
