import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./Modal.css";

const Modal = ({ message, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "7") {
        onConfirm();
      } else if (event.key === "8") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [onConfirm, onCancel]);

  return (
    <div className="modal">
      <div className="modalContent">
        <p>{message}</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  );
};

Modal.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Modal;
