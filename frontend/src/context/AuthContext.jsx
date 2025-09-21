import { createContext, useContext, useState, useEffect, useRef } from "react";
import { authService } from "../services/api"; // Assuming this handles authentication
import { useNavigate } from "react-router-dom";

// Create Context
const AuthContext = createContext();

// Custom Hook for accessing AuthContext
export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    // Click outside dropdown to close
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout function
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  // Get user initials
  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <AuthContext.Provider
      value={{ user, setUser, showDropdown, setShowDropdown, dropdownRef, handleLogout, getInitials }}
    >
      {children}
    </AuthContext.Provider>
  );
};
