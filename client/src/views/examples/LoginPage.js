/*!

=========================================================
* Paper Kit React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-kit-react

* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/paper-kit-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState } from "react";

// reactstrap components
import { Button, Card, Form, Input, Container, Row, Col } from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import axios from "axios";
import { API } from "api_server";
import { useNavigate } from 'react-router-dom';

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
  const [userId, setUserId] = useState('');


  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook



  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API}/login`, { email, password });

      // If login is successful, store the token in local storage
      const { token, userId } = response.data;
      setUserId(userId);

      localStorage.setItem('token', token);

       // Redirect to the profile page
       navigate(`/profile/${userId}`);
      // Redirect to the next page or perform other actions
      console.log('Login successful!');
    } catch (error) {
      // Handle login errors
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la connexion.');
    }
  };

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
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

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
