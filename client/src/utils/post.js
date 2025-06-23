import axios from "axios";

export const sendMessage = (newMessage , activeFriend , user , socketRef) => {
   if (!newMessage.trim()) return;

   const timestamp = new Date().toISOString();
   socketRef.current?.emit("sendMessage", {
     username: user.username,
     userId : user._id,
     targetUserId: activeFriend._id,
     text: newMessage,
     timestamp,
   });
};
 

export const uploadFile = async (imgFile) => {
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