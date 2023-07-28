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
import React, { useEffect, useState } from "react";

// reactstrap components
import { Button, Card, Form, Input, Container, Row, Col } from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import axios from "axios";
import { API } from "api_server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function RegisterPage() {
  document.documentElement.classList.remove("nav-open");
  React.useEffect(() => {
    document.body.classList.add("register-page");
    return function cleanup() {
      document.body.classList.remove("register-page");
    };
  });



  const [nom, setNom] = useState("");

  const [prenom, setPrenom] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  // const { role } = useParams();


  // const role = localStorage.getItem("userRole");

  // useEffect(() => {
  //   // Set the role from the URL parameter to the state
  //   setUserRole(role);
  // }, [role]);


  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle show/hide password


  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const role = searchParams.get('role');
  // const [userRole, setUserRole] = useState('');

  // useEffect(() => {
  //   const storedUserRole = localStorage.getItem('userRole');
  //   setUserRole(storedUserRole || role);
  // }, [role]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar); // Assuming 'avatar' is the File object selected by the user
    // formData.append("role", userRole);

    // console.log(role);

    try {
      const response = await axios.post(`${API}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important to specify 'multipart/form-data' for file uploads
        },
      });

      // Handle successful registration response here (e.g., show a success message)
      console.log(response.data);
      setShowAlert(true);
      setAlertMessage(response.data.message);
    } catch (error) {
      // Handle registration errors here (e.g., show error message)
      console.error(error);
      setShowAlert(true);
      setAlertMessage(
        error.response?.data?.message ||
          "Une erreur est survenue lors de l'enregistrement de l'utilisateur."
      );
    }
  };

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
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
                <h3 className="title mx-auto">Welcome to the world of Bookverse</h3>
                
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

                <Form className="register-form" onSubmit={handleSubmit}>
                  <label>Nom</label>
                  <Input
                    placeholder="Entrer votre Nom"
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />

                  <label>Prenom</label>
                  <Input
                    placeholder="Entrer votre Prenom"
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                  />

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

                  {/* <label>Role</label>
                  <Input placeholder="Entrer votre Prenom" type="text" /> */}
                  <label>Avatar</label>
                  <Input  
                  type="file" 
                  onChange={(e) => setAvatar(e.target.files[0])}
                  />

{/* <p>Selected Role: {userRole}</p> */}

                 

                  <Button block className="btn-round" color="danger">
                    Register
                  </Button>
                </Form>

                <div className="forgot">
                  <Button
                    className="btn-link"
                    color="danger"
                    onClick={handleLoginClick}
                  >
                    do You have An Account? {' '}
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

export default RegisterPage;
