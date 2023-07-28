
import React, { useEffect, useState } from "react";

// reactstrap components
import {
  Button,
  Label,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Collapse,
  Form,
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import DemoFooter from "components/Footers/DemoFooter.js";
import { API } from "api_server";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ProfilePage.css"; // Import the custom CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function ProfilePageAdmin() {
  // const [user, setUser] = useState(null);
  const { userId } = useParams();
  const [user, setUser] = useState({});
  // State to track whether the edit form is visible or not
  const [isOpen, setIsOpen] = useState(false);

  // State to track form input values
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");


  document.documentElement.classList.remove("nav-open");
  React.useEffect(() => {
    document.body.classList.add("landing-page");
    return function cleanup() {
      document.body.classList.remove("landing-page");
    };
  });

  useEffect(() => {
    // Fetch user profile data after successful login
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${API}/profile`, {
            headers: { "x-auth-token": token },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProfile = {
      prenom,
      nom,
      email,
    };

    try {
      const response = await axios.put(`${API}/mod/profile/${user._id}`, updatedProfile);
      const updatedUserData = response.data;
      console.log(updatedUserData);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = async (e) => {
    setIsOpen(false);

  };

  return (
    <>
      <ExamplesNavbar />
      <ProfilePageAdmin />
      <br />

      <Container className="profile-page">
        <Row>
          <Col md="8" className="mx-auto">
            <Card className="gamer-card">

              <div className="settings-button-container">
                <Button
                  color="primary"
                  className="settings-button"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <FontAwesomeIcon icon={faCog} className="settings-icon" />
                  Settings
                </Button>
              </div>

              

              <CardBody>
                <div className="avatar">
                 
                  <img src={user.avatar || "placeholder.jpg"} alt="Avatar" />
                </div>
                <h3>
                  <FontAwesomeIcon icon={faUser} className="user-icon" />
                  {user.nom} {user.prenom}
                </h3>
               
                <hr />
                <h5>
                  <FontAwesomeIcon icon={faEnvelope} className="email-icon" />
                  Email: {user.email}
                </h5>
                
              </CardBody>

      <Collapse isOpen={isOpen}>
        <Card>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="prenom">Prenom</Label>
                <Input
                  type="text"
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="nom">Nom</Label>
                <Input
                  type="text"
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
              

              <Button type="submit" color="primary">
                Save
              </Button>
              <Button type="button" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Collapse>
            </Card>
          </Col>
        </Row>
      </Container>
    
      <DemoFooter />
    </>
  );
}

export default ProfilePageAdmin;
