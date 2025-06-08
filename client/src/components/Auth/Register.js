import React, { useRef, useState } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const usernameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateUsername = (username) => {
    return username.length >= 3;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && !validatePassword(value)) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    if (value && !validateUsername(value)) {
      setUsernameError("Username must be at least 3 characters long");
    } else {
      setUsernameError("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    } else if (e.key === "ArrowDown") {
      if (document.activeElement === usernameInputRef.current) {
        emailInputRef.current.focus();
      } else if (document.activeElement === emailInputRef.current) {
        passwordInputRef.current.focus();
      }
    } else if (e.key === "ArrowUp") {
      if (document.activeElement === passwordInputRef.current) {
        emailInputRef.current.focus();
      } else if (document.activeElement === emailInputRef.current) {
        usernameInputRef.current.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    if (!validatePassword(password)) {
      showToast("Password must be at least 8 characters long", "error");
      return;
    }

    if (!validateUsername(username)) {
      showToast("Username must be at least 3 characters long", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/register `,
        { username, email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      showToast(
        "Registration successful! Please login to continue.",
        "success"
      );
      navigate("/login");
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";

      if (err.response?.data?.message?.includes("already registered")) {
        errorMessage =
          "This email is already registered. Please login instead.";
      }

      setError(errorMessage);
      showToast(errorMessage, "error");
    }
  };

  return (
    <div className="login-wrapper">
      <h1>Register</h1>
      <div className="login-input-box">
        <input
          ref={usernameInputRef}
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          onKeyDown={handleKeyDown}
          className={usernameError ? "invalid" : ""}
        />
        {usernameError && (
          <div className="validation-message show">{usernameError}</div>
        )}
      </div>
      <div className="login-input-box">
        <input
          ref={emailInputRef}
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          onKeyDown={handleKeyDown}
          className={emailError ? "invalid" : ""}
        />
        {emailError && (
          <div className="validation-message show">{emailError}</div>
        )}
      </div>
      <div className="login-input-box">
        <input
          ref={passwordInputRef}
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
          className={passwordError ? "invalid" : ""}
        />
        {passwordError && (
          <div className="validation-message show">{passwordError}</div>
        )}
      </div>
      <div className="login-remember-forgot">
        <label>
          <input type="checkbox" /> Remember me
        </label>
        <a href="#">Forgot Password?</a>
      </div>
      <button onClick={handleSubmit} className="login-continue">
        Continue
      </button>

      <div className="login-register">
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
