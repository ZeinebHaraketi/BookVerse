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


function BookList() {
  const [activeTab, setActiveTab] = React.useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 3; // Define the number of books per page
  const [totalPages, setTotalPages] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});


  const [livres, setLivres] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // const { userId } = useParams(); // Extract userId from the URL parameters
  // console.log(userId);
  //A la place de useParams()
  const pathParts = window.location.pathname.split("/");
const userId = pathParts[pathParts.length - 1]; // Le dernier élément dans le chemin


//--------------------- Critique ------------------------------------//
const [livre, setLivre] = useState({});
const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");



const handleAddCritique = async (livreId) => {
  try {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const critiqueData = {
      user: userId,
      rating: rating, // Assurez-vous que rating est défini
      comment: comment, // Assurez-vous que comment est défini
      livre: livreId
    };

    console.log(livreId);

    const response = await axios.post(
      `http://localhost:5000/livre/${userId}/critiques`, // Utilisez la route modifiée
      critiqueData,
      {
        headers: { "x-auth-token": token }
      }
    );

    if (response.status === 201) {
      console.log("Critique ajoutée avec succès");
      // Vous pouvez ajouter ici une notification ou un autre feedback utilisateur
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la critique :", error);
    // Gérez l'erreur ici (par exemple, affichez un message d'erreur à l'utilisateur)
  }
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
    // Check if the user is authenticated (you can use your own method here)
    const checkAuthentication = () => {
      // For example, check if a token is present in localStorage
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token); // Update the authentication state
    };

    checkAuthentication();

    if (isAuthenticated) {
      // Fetch the list of books from the API
      const fetchBooks = async () => {
        try {
            const token = localStorage.getItem("token");
          const response = await axios.get("http://localhost:5000/books",{
            headers: { "x-auth-token": token },
            params: { userId }, 

          }); // Update with your API endpoint
          setLivres(response.data);
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      };

      fetchBooks();
    }
  }, [isAuthenticated, userId]);

  if (!isAuthenticated) {
    return <div>Please log in to view the book list.</div>;
  }

  const handleAddToLibrary = async (livreId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:5000/user/addBookToLibrary/${userId}`, // Remplacez l'URL par votre endpoint
        { livreId },
        {
          headers: { "x-auth-token": token },
        }
      );

      if (response.status === 200) {
        console.log("Book added to library successfully");
      }
    } catch (error) {
      console.error("Error adding book to library:", error);
    }
  };


//   useEffect(() => {
//     // Fetch the list of books from your backend API
//     const fetchLivres = async () => {
//       try {
//         const response = await axios.get(`${API}/livre/aff`); 
//         const data = response.data;

//         setLivres(data); 

//         // Calculate the total number of pages based on the number of books and booksPerPage
//       const totalPagesCount = Math.ceil(data.length / booksPerPage);
//       setTotalPages(totalPagesCount);
//       } catch (error) {
//         console.error("Error fetching books:", error);
//       }
//     };



//     fetchLivres();
//   }, [booksPerPage]);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const renderPaginationItems = () => {
//     const paginationItems = [];
//     for (let i = 1; i <= totalPages; i++) {
//       paginationItems.push(
//         <PaginationItem className="pagination-item" key={i} active={i === currentPage}>
//           <PaginationLink className="pagination-link" onClick={() => handlePageChange(i)}>
//             {i}
//           </PaginationLink>
//         </PaginationItem>
//       );
//     }
//     return paginationItems;
//   };

//   const indexOfLastBook = currentPage * booksPerPage;
//   const indexOfFirstBook = indexOfLastBook - booksPerPage;
//   const currentBooks = livres.slice(indexOfFirstBook, indexOfLastBook);

  
  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API}/livre/livres/recherche`, {
        params: {
          titre: searchTerm,
          auteur: searchTerm, 
          categorie: searchTerm,
        },
      });
      setLivres(response.data);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  const resetSearch = async () => {
    try {
      const response = await axios.get(`${API}/livre/aff`);
      setLivres(response.data);
      setSearchTerm("");
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };


  return (
    <>
      <ExamplesNavbar />
      <LivreHeader />
      <br />

    
 <Container>
      <div className="content">
        <div className="search-bar-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <InputGroup>
            <Input
              className="search-input"
              placeholder="Rechercher des Livres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon addonType="append">
              <button className="search-button" onClick={handleSearch}>
                Search
              </button>
              <button className="reset-button" onClick={resetSearch}>
                Reset
              </button>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </Container>
    <br></br>
   <Container className="mt-5">
        <Row>
          {livres.map((livre) => (
            <Col md="6" lg="4" key={livre._id} className="book-card ">
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
                  onClick={() => handleAddToLibrary(livre._id)} // Appel de la fonction avec l'ID du livre
                  className="add-to-library-button"
                >
                    <FontAwesomeIcon icon={faPlus} className="add-icon" /> 

                  Livre
                </Button>

                  <Button
                    // color="primary"
                    onClick={() => navigate(`/detailsLivre/${livre._id}`)}
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

   {/* <div className="pagination-container">
        <Pagination className="pagination">
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink
              previous
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink
              next
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </PaginationItem>
        </Pagination>
      </div> */}

   
      <DemoFooter />
    </>
  );
}

export default BookList;
