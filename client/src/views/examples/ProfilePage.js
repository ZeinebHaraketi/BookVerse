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
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import ProfilePageHeader from "components/Headers/ProfilePageHeader.js";
import DemoFooter from "components/Footers/DemoFooter.js";
import { API } from "api_server";
import axios from "axios";
import { useParams } from "react-router-dom";
import './ProfilePage.css'; // Import the custom CSS file


function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState("1");
  // const [user, setUser] = useState(null);
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [editedUser, setEditedUser] = useState({});



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
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${API}/profile`, {
            headers: { 'x-auth-token': token },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);


  return (
    <>
      <ExamplesNavbar />
      <ProfilePageHeader />
      <Container className="profile-page">
      <Row>
        <Col md="8" className="mx-auto mt-4">
          <Card className="gamer-card">
            <div className="avatar">
              {/* Render the user's avatar here */}
              {/* Replace the following line with the actual image */}
              <img src={user.avatar || 'placeholder.jpg'} alt="Avatar" />
            </div>
            <CardBody>
              <h3>{user.nom} {user.prenom}</h3>
              <h5 className="text-muted">Level {user.niveau}</h5>
              <hr />
              <h5>Email: {user.email}</h5>
              {/* Add more user information here as needed */}
            </CardBody>
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
      <DemoFooter />
    </>
  );
}

export default ProfilePage;
