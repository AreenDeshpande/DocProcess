import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
  padding: 2rem;
`;

const LoginCard = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #64748b;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const RememberMeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
  cursor: pointer;
`;

const ForgotPassword = styled(Link)`
  color: #3b82f6;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }
`;

const LoginButton = styled(motion.button)`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const SignupPrompt = styled.p`
  text-align: center;
  color: #64748b;
  margin-top: 1.5rem;
  font-size: 0.9rem;

  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    margin-left: 0.25rem;

    &:hover {
      color: #2563eb;
    }
  }
`;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", formData);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      console.log("Login response:", response);

      if (response) {
        if (!formData.rememberMe) {
          sessionStorage.setItem("token", localStorage.getItem("token"));
          sessionStorage.setItem("user", localStorage.getItem("user"));
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message || "Failed to login. Please try again."
      );
    }
  };

  return (
    <Container>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Welcome Back</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </InputGroup>
          <RememberMeRow>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </CheckboxLabel>
            <ForgotPassword to="/forgot-password">
              Forgot Password?
            </ForgotPassword>
          </RememberMeRow>
          <LoginButton
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Log In
          </LoginButton>
        </Form>
        <SignupPrompt>
          Don't have an account?
          <Link to="/signup">Sign up</Link>
        </SignupPrompt>
      </LoginCard>
    </Container>
  );
};

export default LoginPage;
