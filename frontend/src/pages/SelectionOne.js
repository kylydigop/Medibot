import { useNavigate } from "react-router-dom";
import FrameComponent1 from "../components/FrameComponent1";
import TempComp from "../components/TempComp";
import { useCallback, useEffect } from "react";
import "./SelectionOne.css";

const SelectionOne = () => {
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
    const utteranceText = "Temperature Selected...... Here is the guide to starting the temperature measurement... First, you must put your right index finger on the temperature sensor in the middle.... Make sure you align your finger properly at the tip of the sensor... Do not remove your index finger from the sensor.. when the processing starts to avoid an error results.. and wait result patiently before removing your finger. Press 1 to start... and Press 2 to return to home screen.";
    speak(utteranceText);

    // Add event listener for keydown event to listen for number pad keys
    const handleKeyPress = (event) => {
      if (event.key === "1") {
        navigate("/temp-data");
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
    navigate("/temp-data");
  }, [navigate]);

  const onGroupImageClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

 
  return (
    <div className="selectionone">
      <div className="screen-1" />
      <img className="screen-2-icon" alt="" src="/screen-2.svg" />
      <FrameComponent1
        onHome2StreamlineCoresvgClick={onHome2StreamlineCoresvgClick}
        onHOMETextClick={onHOMETextClick}
      />
      <section className="result-temp-label-wrapper">
        <div className="result-temp-label">
          <div className="f-r-a-m-e-wrapper">
            <div className="f-r-a-m-e">
              <div className="circle-symbol-wrapper">
                <div className="circle-symbol1">
                  <div className="circle-parent">
                    <div className="circle1" />
                    <img
                      className="thermometer-icon1"
                      loading="lazy"
                      alt=""
                      src="/thermometer1.png"
                    />
                  </div>
                  <div className="temperature1">Temperature</div>
                </div>
              </div>
              <img
                className="f-r-a-m-e-child"
                loading="lazy"
                alt=""
                src="/returnbutton.png"
                onClick={onGroupImageClick}
              />
            </div>
          </div>
          <TempComp
            aNIMATIONONHOWTOUSETHETEM="ANIMATION ON HOW TO USE THE TEMPERATURE WITH VOICE "
            onGroupContainer1Click={onGroupContainer1Click}
          />
        </div>
      </section>
    </div>
  );
};

export default SelectionOne;
