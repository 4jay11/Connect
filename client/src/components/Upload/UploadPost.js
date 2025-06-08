import React, { useState, useEffect } from "react";
import "./UploadPost.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

const UploadPost = () => {
  const [summary, setSummary] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  // Fetch user ID (replace with actual authentication logic)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    console.log(user._id);
    
    setUserId(user._id); // Example: Store userId in localStorage after login
  }, []);

  // Fetch User Location
  useEffect(() => {
    const fetchLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await axios.get(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
              );
              const { city, principalSubdivision, countryName } = res.data;
              setLocation(
                city && principalSubdivision && countryName
                  ? `${city}/${principalSubdivision}, ${countryName}`
                  : "Location not available"
              );
            } catch (error) {
              console.error("Error fetching location:", error);
              setLocation("Error fetching location");
            }
          },
          () => setLocation("Location access denied")
        );
      } else {
        setLocation("Geolocation not supported");
      }
    };
    fetchLocation();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  const uploadFile = async () => {
    if (!imgFile) return null; // Skip if no image selected

    const data = new FormData();
    data.append("file", imgFile);
    data.append("upload_preset", "images_preset");

    try {
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      const res = await axios.post(api, data);
      return res.data.secure_url; // Return full Cloudinary URL
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setMessage("User not authenticated.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const imageUrl = imgFile ? await uploadFile() : null;

      const res = await axios.post(
        "http://localhost:8000/post/addNewPost",
        {
          userId,
          content: summary,
          image: imageUrl,
          location,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Backend response:", res.data);
      setMessage("Post added successfully");

      setImgFile(null);
      setImgPreview(null);
      setSummary("");
      document.getElementById("imageInput").value = "";
      navigate("/feed");
    } catch (error) {
      console.error("Error posting data:", error);
      setMessage("Error during post creation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form-container">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="image-upload">
          <label htmlFor="imageInput" className="image-label">
            {imgPreview ? (
              <img src={imgPreview} alt="Preview" className="image-preview" />
            ) : (
              <span className="image-placeholder">Click to Upload Image</span>
            )}
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageChange}
            className="image-input"
          />
        </div>
        <div className="summary-input-container">
          <textarea
            placeholder="Write a summary..."
            value={summary}
            onChange={handleSummaryChange}
            className="summary-input"
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          Submit
        </button>
        {loading && (
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#4fa94d"
            ariaLabel="loading"
          />
        )}
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default UploadPost;