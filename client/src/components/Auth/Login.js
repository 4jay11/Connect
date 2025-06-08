import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Auth.css";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/Slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { UilEye, UilEyeSlash } from "@iconscout/react-unicons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/feed");
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
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

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      dispatch(loginSuccess(response.data.user));
      showToast("Login successful! Welcome back!", "success");
      navigate("/feed");
    } catch (err) {
      const errorMessage = "Email or password is incorrect";
      setError(errorMessage);
      showToast(errorMessage, "error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    } else if (e.key === "ArrowDown") {
      if (document.activeElement === emailInputRef.current) {
        passwordInputRef.current.focus();
      }
    } else if (e.key === "ArrowUp") {
      if (document.activeElement === passwordInputRef.current) {
        emailInputRef.current.focus();
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
      <h1>Login</h1>
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
      <div className="login-input-box password-input">
        <input
          ref={passwordInputRef}
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
          className={passwordError ? "invalid" : ""}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <UilEyeSlash /> : <UilEye />}
        </button>
        {passwordError && (
          <div className="validation-message show">{passwordError}</div>
        )}
      </div>
      <div className="login-remember-forgot">
        <label className="show-password-label">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={togglePasswordVisibility}
          />
          Show Password
        </label>
        <a href="#">Forgot Password?</a>
      </div>
      <button onClick={handleSubmit} className="login-continue">
        Continue
      </button>

      <div className="login-register">
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
