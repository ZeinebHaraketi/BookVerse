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
import { useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function ResetPasswordPage() {
  document.documentElement.classList.remove("nav-open");
  React.useEffect(() => {
    document.body.classList.add("register-page");
    return function cleanup() {
      document.body.classList.remove("register-page");
    };
  });

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle show/hide password
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { token } = useParams(); // Access the token from URL parameters

  const handleResetPassword = async (event) => {
    event.preventDefault();

    // Replace 'token' with the actual token received from the URL

    try {
      const response = await axios.post(`${API}/resetPassword/${token}`, {
        password: password,
      });

      if (response.data.success) {
        // Password reset successful, show success message or redirect to login page
        console.log(response.data.msg);
      } else {
        // Show error message if the password reset fails
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

                <Form className="register-form" onSubmit={handleResetPassword}>
                  <label>Password</label>
                  <Input
                    placeholder="Entrer votrePassword"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  {/* Icon to toggle show/hide password */}
                  <span
                    className="password-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </span>

                  <Button block className="btn-round" color="danger">
                    Reset
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default ResetPasswordPage;
