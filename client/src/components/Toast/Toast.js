import React, { useEffect } from "react";
import { UilCheckCircle, UilTimesCircle } from "@iconscout/react-unicons";
import "./Toast.css";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <div className="toast-icon">
        {type === "success" ? <UilCheckCircle /> : <UilTimesCircle />}
      </div>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;
