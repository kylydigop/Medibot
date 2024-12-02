import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./Modal.css";

const Modal = ({ message, onConfirm, onCancel, speak, cancelSpeech }) => {
  useEffect(() => {
    // Speak the message when the modal is displayed
    speak("Are you sure you want to proceed?.. Press seven to confirm... press eight to cancel...");

    const handleKeyPress = (event) => {
      if (event.key === "7") {
        cancelSpeech(); // Stop speaking immediately
        onConfirm();
      } else if (event.key === "8") {
        cancelSpeech(); // Stop speaking immediately
        onCancel();
      }
    };

    // Add event listener for keypresses
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener and stop speaking
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      cancelSpeech(); // Stop speaking if modal is closed
    };
  }, [onConfirm, onCancel, speak, cancelSpeech]);

  return (
    <div className="modal">
      <div className="modalContent">
        <p>{message}</p>
        <button
          onClick={() => {
            cancelSpeech();
            onConfirm();
          }}
        >
          Yes
        </button>
        <button
          onClick={() => {
            cancelSpeech();
            onCancel();
          }}
        >
          No
        </button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  speak: PropTypes.func.isRequired,
  cancelSpeech: PropTypes.func.isRequired,
};

export default Modal;
