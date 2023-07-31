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
import {
  Button,
  Label,
  FormGroup,
  Input,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
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
import ProfilePageHeader from "components/Headers/ProfilePageHeader.js";
import DemoFooter from "components/Footers/DemoFooter.js";
import { API } from "api_server";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ProfilePage.css"; // Import the custom CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faCog,
  faEnvelope,
  faStar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState("1");
  // const [user, setUser] = useState(null);
  const { userId } = useParams();
  const [user, setUser] = useState({});
  // State to track whether the edit form is visible or not
  const [isOpen, setIsOpen] = useState(false);

  // State to track form input values
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  // State to track form input values
  const [interets, setInterets] = useState("");
  const [niveau, setNiveau] = useState("");
  const [readBooks, setReadBooks] = useState([]);


  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

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
      interets: interets.split(',').map((interest) => interest.trim()), // Convert interests to an array
      niveau,
    };

    try {
      const response = await axios.put(`${API}/mod/profile/${user._id}`, updatedProfile);
      const updatedUserData = response.data;
      console.log(updatedUserData);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle the error and display an error message to the user if needed
    }
  };

  const handleCancel = async (e) => {
    setIsOpen(false);

  };

  useEffect(() => {
    // Fetch the user's read books from the backend API
    const fetchReadBooks = async () => {
      try {
        const response = await axios.get(`${API}/user/${userId}/read-books`);
        setReadBooks(response.data);
      } catch (error) {
        console.error("Error fetching read books:", error);
      }
    };

    // Assuming you have the user ID available, you can use it here.
    // Replace 'userId' with the actual user ID.
    fetchReadBooks();
  }, []);

  return (
    <>
      <ExamplesNavbar />
      <ProfilePageHeader />
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
                  {/* Render the user's avatar here */}
                  {/* Replace the following line with the actual image */}
                  <img src={user.avatar || "placeholder.jpg"} alt="Avatar" />
                </div>
                <h3>
                  <FontAwesomeIcon icon={faUser} className="user-icon" />
                  {user.nom} {user.prenom}
                </h3>
                <h5 className="text-muted">
                  <FontAwesomeIcon icon={faStar} className="level-icon" />
                  Level {user.niveau}
                </h5>
                <hr />
                <h5>
                  <FontAwesomeIcon icon={faEnvelope} className="email-icon" />
                  Email: {user.email}
                </h5>
                {/* Add more user information here as needed */}
                <h5>
      <FontAwesomeIcon icon={faCoffee} className="interests-icon" />
      Interests: {user.interets ? user.interets.join(', ') : 'No interests found'}
    </h5>
              </CardBody>
               {/* Conditional rendering for the edit form */}

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
              <FormGroup>
                <Label for="interets">Interets</Label>
                <Input
                  type="text"
                  id="interets"
                  value={interets}
                  onChange={(e) => setInterets(e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label for="niveau">Niveau</Label>
                <Input
                  type="number"
                  id="niveau"
                  value={niveau}
                  onChange={(e) => setNiveau(e.target.value)}
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
      {/* <div className="section profile-content">
        <Container>
        {user ? (
          <div className="owner">
            <div className="avatar">
              <img
                alt="..."
                className="img-circle img-no-padding img-responsive"
                src={user.avatar}
                // src={require("assets/img/faces/joe-gardner-2.jpg")}
              />
            </div>

            <div className="name">
              <h4 className="title">
              {user.nom} {user.prenom}<br />
              </h4>
            </div>
            <p > <strong>{user.email} </strong> </p>
          </div>
        ): (
          <p>Loading...</p>
        )}
          <Row>
            <Col className="ml-auto mr-auto text-center" md="6">
              <p>
                An artist of considerable range, Jane Faker — the name taken by
                Melbourne-raised, Brooklyn-based Nick Murphy — writes, performs
                and records all of his own music, giving it a warm, intimate
                feel with a solid groove structure.
              </p>
              <br />
              <Button className="btn-round" color="default" outline>
                <i className="fa fa-cog" /> Settings
              </Button>
            </Col>
          </Row>
          <br />
          <div className="nav-tabs-navigation">
            <div className="nav-tabs-wrapper">
              <Nav role="tablist" tabs>
                <NavItem>
                  <NavLink
                    className={activeTab === "1" ? "active" : ""}
                    onClick={() => {
                      toggle("1");
                    }}
                  >
                    Follows
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={activeTab === "2" ? "active" : ""}
                    onClick={() => {
                      toggle("2");
                    }}
                  >
                    Following
                  </NavLink>
                </NavItem>
              </Nav>
            </div>
          </div>
       
        </Container>
      </div> */}

<div>
      <h2>Bibliothèque</h2>
      <ul>
        {readBooks.map((book) => (
          <li key={book._id}>{book.titre}</li>
        ))}
      </ul>
    </div>
      <DemoFooter />
    </>
  );
}

export default ProfilePage;
