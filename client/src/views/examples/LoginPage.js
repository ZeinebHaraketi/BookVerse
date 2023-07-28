
import React, { useEffect, useState } from "react";

import { Button, Card, Form, Input, Container, Row, Col, CustomInput, FormGroup, InputGroupAddon } from "reactstrap";

import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import axios from "axios";
import { API } from "api_server";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function LoginPage() {
  document.documentElement.classList.remove("nav-open");
  React.useEffect(() => {
    document.body.classList.add("register-page");
    return function cleanup() {
      document.body.classList.remove("register-page");
    };
  });

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");


  const [error, setError] = useState("");

  const [rememberMe, setRememberMe] = useState(false); // État pour le statut "Remember Me"

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
  
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
  
    try {
      const response = await axios.post(`${API}/login`, { email, password });
  
      const { token, userId, role } = response.data;
  
      if (!role) {
        // If the role is missing in the response, handle the error
        setError("Le rôle de l'utilisateur n'a pas été renvoyé par le serveur.");
        return;
      }
  
      setUserId(userId);
      console.log("Extracted role:", role);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
  
      if (role === "admin") {
        navigate(`/admin/profile/${userId}`);
      } else if (role === "moderateur") {
        navigate(`/moderateur/profile/${userId}`);
      } else {
        navigate(`/profile/${userId}`);
      }
  
      console.log("Login successful!");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la connexion."
      );
    }
  };
  
  // const handleLogin = async (event) => {
  //   event.preventDefault();

  //   if (rememberMe) {
  //     // Si "Remember Me" est coché, enregistrez le nom d'utilisateur / email dans le localStorage
  //     localStorage.setItem("rememberedEmail", email);
  //   } else {
  //     // Sinon, supprimez le nom d'utilisateur / email du localStorage s'il existe
  //     localStorage.removeItem("rememberedEmail");
  //   }

  //   try {
  //     const response = await axios.post(`${API}/login`, { email, password });

  //     const { token, userId, role } = response.data;
  //     setUserId(userId);

  //     console.log("Extracted role:", role); // Log the extracted role

  //     localStorage.setItem("token", token);
  //     localStorage.setItem("role", role);


  //   if (role === "admin") {
  //     navigate(`/admin/profile/${userId}`);
  //   } else if (role === "moderateur") {
  //     navigate(`/moderateur/profile/${userId}`);
  //   } else {
  //     navigate(`/profile/${userId}`);
  //   }
  //     // Redirect to the profile page
  //     // navigate(`/profile/${userId}`);
  //     // Redirect to the next page or perform other actions
  //     console.log("Login successful!");
  //   } catch (error) {
  //     setError(
  //       error.response?.data?.message ||
  //         "Une erreur est survenue lors de la connexion."
  //     );
  //   }
  // };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleForgetPassword = async () => {
    try {
      const response = await axios.post(`${API}/forgetPassword`, {
        email: email, // Replace 'email' with the user's email you want to reset the password for
      });

      if (response.data.success) {
        // Show success message or perform any other actions
        console.log(response.data.msg);
      } else {
        // Show error message or perform any other actions
        console.log(response.data.msg);
      }
    } catch (error) {
      // Handle error if the API request fails
      console.error("Error:", error);
    }
  };

  return (
    <>
      <ExamplesNavbar />
      <div
        className="page-header"
        style={{
          backgroundImage: "url(" + require("assets/img/games.jpg") + ")",
        }}
      >
        <div className="filter" />
        <Container>
          <Row>
            <Col className="ml-auto mr-auto" lg="4">
              <Card className="card-register ml-auto mr-auto">
                <h3 className="title mx-auto">
                  Welcome to the world of Bookverse
                </h3>

                <div className="social-line text-center">
                  <Button
                    className="btn-neutral btn-just-icon mr-1"
                    color="facebook"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fa fa-facebook-square" />
                  </Button>
                  <Button
                    className="btn-neutral btn-just-icon mr-1"
                    color="google"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fa fa-google-plus" />
                  </Button>
                  <Button
                    className="btn-neutral btn-just-icon"
                    color="twitter"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fa fa-twitter" />
                  </Button>
                </div>

                <Form className="register-form" onSubmit={handleLogin}>
                  <label>Email</label>
                  <Input
                    placeholder="Entrer votre Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <label>Password</label>
                  <Input
                    placeholder="Entrer votrePassword"
          type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                   <InputGroupAddon addonType="append">
          <Button
            color="link"
            onClick={() => setShowPassword((prevShowPassword) => !prevShowPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> Show Password
          </Button>
        </InputGroupAddon>

<FormGroup>
        <CustomInput
          type="checkbox"
          id="rememberMe"
          label="Remember Me"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
      </FormGroup>

                  <Button block className="btn-round" color="danger">
                    Login
                  </Button>
                </Form>

                <div className="forgot">
                  <Button
                    className="btn-link"
                    color="danger"
                    onClick={handleForgetPassword}
                  >
                    Forgot password?
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default LoginPage;
