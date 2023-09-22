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
  CardTitle,
  CardSubtitle,
  CardText,
  InputGroup,
  InputGroupAddon,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardFooter,
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import DemoFooter from "components/Footers/DemoFooter.js";
import { API } from "api_server";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faEye, faGamepad, faInfoCircle, faPlus, faSearch, faStar, faTag, faUser } from "@fortawesome/free-solid-svg-icons";

import "./AfficherLivres.css";
import LivreHeader from "components/Headers/LivreHeader";
import { useNavigate, useParams } from "react-router-dom";

function EventList() {
    const [activeTab, setActiveTab] = React.useState("1");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [events, setEvents] = useState([]); 
    const navigate = useNavigate();



    const pathParts = window.location.pathname.split("/");
    const userId = pathParts[pathParts.length - 1]; // Le dernier élément dans le chemin


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
        // Check if the user is authenticated (you can use your own method here)
        const checkAuthentication = () => {
          // For example, check if a token is present in localStorage
          const token = localStorage.getItem("token");
          setIsAuthenticated(!!token); // Update the authentication state
        };
    
        checkAuthentication();
    
        if (isAuthenticated) {
          // Fetch the list of events from the API
          const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("token");
              const response = await axios.get("http://localhost:5000/events",{
                headers: { "x-auth-token": token },
                params: { userId }, 
    
              }); // Update with your API endpoint
              setEvents(response.data);
            } catch (error) {
              console.error("Error fetching events:", error);
            }
          };
    
          fetchEvents();
        }
      }, [isAuthenticated, userId]);

    return(
        <>
              <ExamplesNavbar />
              <LivreHeader />


              <Container className="mt-5">
        <Row>
          {events.map((event) => (
            <Col md="6" lg="4" key={event._id} className="book-card ">
              <Card className="h-100">
                <div className="book-image-container">
                  {/* Display book image */}
                  <img
                    src={livre.image}
                    alt={livre.titre}
                    className="book-image"
                    height={60}
                    width={120}
                  />
                </div>
                <div className="card-body">
                  {/* Display book details */}
                  <CardTitle className="card-title">

                  <h5 className="card-title font-weight-bold mb-3">
                  <FontAwesomeIcon icon={faBook} className="icon" />

                    {livre.titre.length > 30
                      ? `${livre.titre.substring(0, 30)}...`
                      : livre.titre}
                  </h5>
                  </CardTitle>

                  <CardSubtitle className="card-subtitle">
                    <FontAwesomeIcon icon={faUser} className="icon" />
                    {livre.auteur}
                  </CardSubtitle>
                  <CardText>
              <FontAwesomeIcon icon={faTag} className="icon" />
              {livre.categorie}
            </CardText>
            <CardFooter className="text-center">
            <Button
                //   onClick={() => handleAddToLibrary(livre._id)} // Appel de la fonction avec l'ID du livre
                  className="add-to-library-button"
                >
                    <FontAwesomeIcon icon={faPlus} className="add-icon" /> 

                  Event
                </Button>

                  <Button
                    // color="primary"
                    // onClick={() => navigate(`/detailsLivre/${livre._id}`)}
                    className="details-button"
                  >
                    <FontAwesomeIcon icon={faGamepad} /> Details
                  </Button>
                  <Button
        onClick={handleAddCritique(livre._id)}
        className="add-critique-button"
      >
        <FontAwesomeIcon icon={faStar} className="icon" />  Critiquer
      </Button>
            </CardFooter>
            {/* <CardText className="card-text">
                    <FontAwesomeIcon icon={faInfoCircle} className="icon" />
                    {livre.resume}
                  </CardText> */}
                  {/* Add other book details as needed */}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
   </Container>
        </>
    )
}