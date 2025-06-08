import { createSlice } from "@reduxjs/toolkit";

const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null; // Ensures safe parsing
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null; // Fallback if JSON parsing fails
  }
};

const initialState = {
  user: getUserFromLocalStorage(),
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      // Persist in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("isAuthenticated", "true");
    },
    updateFollowing: (state, action) => {
      const followedUserId = action.payload;
      if (state.user && !state.user.following.includes(followedUserId)) {
        state.user.following.push(followedUserId);

        // Sync with localStorage
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    },
  },
});

export const { loginSuccess, logout, updateFollowing } = authSlice.actions;
export default authSlice.reducer;
