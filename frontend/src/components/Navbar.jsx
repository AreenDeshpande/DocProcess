import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AuthProvider } from "../context/AuthContext.jsx"; // Import the context

const NavbarContainer = styled.nav`
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

const Navbar = () => {
  const {
    user,
    showDropdown,
    setShowDropdown,
    dropdownRef,
    handleLogout,
    getInitials,
  } = AuthProvider();
  const navigate = useNavigate();

  return (
    <NavbarContainer>
      <Logo>DocProcess</Logo>
      <NavLinks>
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#about">About</NavLink>
        <NavLink href="#contact">Contact</NavLink>

        {user ? (
          <UserMenu ref={dropdownRef}>
            <UserIcon onClick={() => setShowDropdown(!showDropdown)}>
              {getInitials(user.name)}
            </UserIcon>
            {showDropdown && (
              <DropdownMenu>
                <MenuItem onClick={() => navigate("/dashboard")}>
                  Dashboard
                </MenuItem>
                <MenuItem onClick={() => navigate("/profile")}>
                  Profile
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
    </NavbarContainer>
  );
};

export default Navbar;