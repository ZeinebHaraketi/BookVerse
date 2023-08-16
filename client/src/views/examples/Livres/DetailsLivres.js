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
  CardTitle,
  CardSubtitle,
  CardText,
  InputGroup,
  InputGroupAddon,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import DemoFooter from "components/Footers/DemoFooter.js";
import { API } from "api_server";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faList, faTags, faUser, faListUl, faBookOpen } from "@fortawesome/free-solid-svg-icons";

import "./DetailsLivres.css";
import LivreHeader from "components/Headers/LivreHeader";
import { useParams, useNavigate } from "react-router-dom";


function DetailsLivres() {
  const [activeTab, setActiveTab] = React.useState("1");
  const { id, chapitreId } = useParams(); // Get the book ID from the URL params
  const [livre, setLivre] = useState({});
  const [chapitres, setChapitres] = useState([]);
  const [chapitre, setChapitre] = useState({});
  const [isBookAdded, setIsBookAdded] = useState(false);

  const { idL } = useParams();



  const navigate = useNavigate();


  const [showTableOfContents, setShowTableOfContents] = useState(false); // État pour contrôler la visibilité de la table des matières

  const handleShowTableOfContents = () => {
    // Fonction pour afficher ou masquer la table des matières lorsque le bouton est cliqué
    setShowTableOfContents((prevState) => !prevState);
  };


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
    // Fetch the book details by its ID
    const fetchLivreDetails = async () => {
      try {
        const response = await axios.get(`${API}/livre/${id}`);
        const data = response.data;
        setLivre(data);

        //  // Fetch chapters by title
        //  const responseChapitres = await axios.get(`${API}/livre/${id}/chapitres/titre`);
        //  const dataChapitres = responseChapitres.data;
        //  setChapitres(dataChapitres);


        //  const chapitre = livre.chapitres.find(
        //     (chapitre) => chapitre._id.toString() === chapitreId
        //   );
  
        //   if (chapitre) {
        //     setChapitre(chapitre);
        //   }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchLivreDetails();
  }, [id]);

  useEffect(() => {
    // Fetch chapters by title after the livre state is updated
    const fetchChapitresByTitle = async () => {
      try {
        const responseChapitres = await axios.get(`${API}/livre/${id}/chapitres/titre`);
        const dataChapitres = responseChapitres.data;
        setChapitres(dataChapitres);
  
        // Access the chapitres property after it's set in the state
        const chapitre = livre.chapitres.find(
          (chapitre) => chapitre._id.toString() === chapitreId
        );
        console.log(chapitre._id);
  
        if (chapitre) {
          setChapitre(chapitre);
        }
      } catch (error) {
        console.error("Error fetching chapitres:", error);
      }
    };
  
    if (livre && livre.chapitres) {
      fetchChapitresByTitle();
    }
  }, [livre, chapitreId]);

  console.log(chapitreId);

  const handleReadBook = () => {
    if (chapitres.length > 0) {
      const firstChapitreId = chapitres[0]._id;
      navigate(`/lecture-livre/${id}/chapitre/${firstChapitreId}`);
    }
  };

  const handleChapterClick = (chapterId) => {
    // Navigate to the specific chapter's page using the chapterId
    navigate(`/lecture-livre/${livre._id}/chapitre/${chapterId}`);
  };

  const handleLecture = async () => {
    try {
      const response = await axios.post(`${API}/lecture/${id}`);
      console.log(response.data.message); // Affichez un message de succès ou mettez à jour l'état si nécessaire
    } catch (error) {
      console.error('Error reading book:', error);
      // Gérez les erreurs ici
    }
  };

  // const handleAddToLibrary = async () => {
  //   try {
  //     const response = await axios.post(`${API}/user/${userId}/add-book`, {
  //       livreId: livre._id,
  //     });
  //     setIsBookAdded(true);
  //     console.log(response.data.message);
  //   } catch (error) {
  //     console.error('Error adding book to library:', error);
  //   }
  // };



  return (
    <>
      <ExamplesNavbar />
      <LivreHeader />
      <br />


      <div className="book-details">
        <Container>
          <Card className="book-card">
            <div className="book-cover">
              <img src={livre.image} alt={livre.titre} className="book-image" />
            </div>
            <CardBody>
              <CardTitle tag="h2" className="book-title">
                {livre.titre}
              </CardTitle>
              <br></br>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                <FontAwesomeIcon icon={faUser} className="icon" /> {livre.auteur}
              </CardSubtitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                <FontAwesomeIcon icon={faTags} className="icon" /> {livre.genre}
              </CardSubtitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                <FontAwesomeIcon icon={faList} className="icon" />  {livre.categorie}
              </CardSubtitle>
              {/* Display other book details as needed */}
              
              <div className="book-description">
                <FontAwesomeIcon icon={faBook} className="icon" />
                {livre.resume}
              </div>

              <Button color="primary" style={{ backgroundColor: "#00a3cc", border: "none" }} 
              className="read-book-button"
        onClick={handleReadBook}

              >
              <FontAwesomeIcon icon={faBookOpen} className="mr-2" />

                Lire
              </Button>

              

              <div className="d-flex justify-content-center mt-3">
      <Button color="primary" style={{ backgroundColor: "#9500ff", border: "none" }} onClick={handleShowTableOfContents}>
      <FontAwesomeIcon icon={faListUl} className="mr-2" />

        {showTableOfContents ? " la table des matières" : " la table des matières"}
      </Button>
    </div>
            </CardBody>
          </Card>

          {showTableOfContents && (
        <>
         <div className="text-center">
          {chapitres.length > 0 ? (
            <Table striped bordered responsive className="mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Titre du Chapitre</th>
                </tr>
              </thead>
              <tbody>
                {chapitres.map((chapitre, index) => (
                  <tr key={chapitre._id} 
                    style={{ cursor: "pointer" }} 
                    onClick={() => handleChapterClick(chapitre._id)}

                    // onClick={() => navigate(`/livre/${id}/chapitre/${chapitre._id}`)}
                  >
                    <td style={{ padding: "0.5rem", textAlign: "center" }}>{index + 1}</td>
                    <td style={{ padding: "0.5rem 0.3rem", cursor: "pointer", fontWeight: 'normal' }}>
                      <span className="chapter-title">{chapitre.titre}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No chapters available.</p>
          )}
          </div>
          
        </>
      )}
        </Container>
      </div>

   
      <DemoFooter />
    </>
  );
}

export default DetailsLivres;
