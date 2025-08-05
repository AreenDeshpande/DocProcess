import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled.a`
  color: #1e293b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: #3b82f6;
  }
`;

const LoginButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 6rem 2rem 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: url("/path-to-your-pattern.svg");
    opacity: 0.05;
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  text-align: center;
  animation: ${fadeIn} 1s ease-in;
  position: relative;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: #3b82f6;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #1e293b;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const UploadSection = styled.section`
  padding: 6rem 2rem;
  background: white;
`;

const UploadContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const UploadArea = styled.div`
  border: 2px dashed #3b82f6;
  border-radius: 12px;
  padding: 3rem;
  margin-top: 2rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f0f9ff;
  }
`;

const UploadText = styled.p`
  color: #64748b;
  margin-top: 1rem;
`;

const Footer = styled.footer`
  background: #1e293b;
  color: white;
  padding: 4rem 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const UserIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background: #2563eb;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 150px;
  z-index: 1000;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  background: none;
  border: none;
  border-radius: 0.25rem;
  color: #1e293b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #f1f5f9;
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check auth status on mount and after any storage changes
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    };

    checkAuth();

    // Listen for storage changes (in case of logout in another tab)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = async () => {
    try {
      setShowDropdown(false);
      authService.logout();
      setUser(null);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if there's an error
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
      navigate("/", { replace: true });
    }
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "?"
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
  };

  const handleNavLinkClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Container>
      <Navbar>
        <Logo>DocProcess</Logo>
        <NavLinks>
          <NavLink onClick={(e) => handleNavLinkClick(e, "features")}>
            Features
          </NavLink>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#contact">Contact</NavLink>
          {user ? (
            <UserMenu ref={dropdownRef}>
              <UserIcon onClick={() => setShowDropdown(!showDropdown)}>
                {getInitials(user.name)}
              </UserIcon>
              {showDropdown && (
                <DropdownMenu>
                  <MenuItem
                    onClick={() => {
                      navigate("/dashboard");
                      setShowDropdown(false);
                    }}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/upload");
                      setShowDropdown(false);
                    }}
                  >
                    Upload Document
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </DropdownMenu>
              )}
            </UserMenu>
          ) : (
            <Link to="/login">
              <LoginButton>Login</LoginButton>
            </Link>
          )}
        </NavLinks>
      </Navbar>
      <HeroSection>
        <HeroContent>
          <Title>Transform Your Documents Into Actionable Data</Title>
          <Subtitle>
            Powerful document processing solution powered by cutting-edge OCR
            technology
          </Subtitle>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <LoginButton
              as={Link}
              to={user ? "/upload" : "/login"}
              style={{ padding: "1rem 2rem", fontSize: "1.2rem" }}
            >
              {user ? "Upload your documents" : "Get Started"}
            </LoginButton>
          </motion.div>
        </HeroContent>
      </HeroSection>
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Powerful Document Processing Features
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Transform your document management with our advanced OCR
              technology
            </p>
          </div>

          {/* First row with 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Government ID Processing Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white ring-1 ring-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Government ID Processing
                </h3>
                <p className="text-gray-600">
                  Instantly extract information from Aadhar cards, PAN cards,
                  and other government IDs with high accuracy.
                </p>
              </div>
            </div>

            {/* Smart Data Extraction Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white ring-1 ring-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Smart Data Extraction
                </h3>
                <p className="text-gray-600">
                  Advanced AI algorithms automatically detect and extract key
                  information fields with high precision.
                </p>
              </div>
            </div>

            {/* Secure Processing Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white ring-1 ring-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Secure Processing
                </h3>
                <p className="text-gray-600">
                  Bank-grade security ensures your sensitive documents are
                  processed with complete confidentiality.
                </p>
              </div>
            </div>
          </div>

          {/* Second row with 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Instant Results Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white ring-1 ring-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Instant Results
                </h3>
                <p className="text-gray-600">
                  Get processed results in seconds with our high-performance OCR
                  engine and real-time processing.
                </p>
              </div>
            </div>

            {/* Multiple Format Support Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white ring-1 ring-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-4">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Multiple Format Support
                </h3>
                <p className="text-gray-600">
                  Process documents in various formats including JPEG, PNG, and
                  PDF with consistent accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer>
        <FooterContent>
          <FooterColumn>
            <FooterTitle>Company</FooterTitle>
            <FooterLink href="#about">About Us</FooterLink>
            <FooterLink href="#careers">Careers</FooterLink>
            <FooterLink href="#contact">Contact</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Product</FooterTitle>
            <FooterLink href="#features">Features</FooterLink>
            <FooterLink href="#pricing">Pricing</FooterLink>
            <FooterLink href="#security">Security</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Resources</FooterTitle>
            <FooterLink href="#docs">Documentation</FooterLink>
            <FooterLink href="#api">API Reference</FooterLink>
            <FooterLink href="#support">Support</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Legal</FooterTitle>
            <FooterLink href="#privacy">Privacy Policy</FooterLink>
            <FooterLink href="#terms">Terms of Service</FooterLink>
            <FooterLink href="#security">Security</FooterLink>
          </FooterColumn>
        </FooterContent>
      </Footer>
    </Container>
  );
};

export default LandingPage;
