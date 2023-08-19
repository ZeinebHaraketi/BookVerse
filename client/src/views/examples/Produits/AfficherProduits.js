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
import { faBook, faEye, faGamepad, faInfoCircle, faMoneyBill, faSearch, faTag } from "@fortawesome/free-solid-svg-icons";

// import "./AfficherLivres.css";
import "../Livres/AfficherLivres.css";
import { useNavigate } from "react-router-dom";
import ProduitHeader from "components/Headers/ProduitHeader";
import MembreNavbar from "components/Navbars/MembreNavbar";


function AfficherProduits() {
  const [activeTab, setActiveTab] = React.useState("1");
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 3; // Define the number of books per page
  const [totalPages, setTotalPages] = useState(1);


  const [produits, setProduits] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();




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
    // Fetch the list of books from your backend API
    const fetchProduits = async () => {
      try {
        const response = await axios.get(`${API}/produit/aff`); 
        const data = response.data;

        setProduits(data); 

        // Calculate the total number of pages based on the number of books and booksPerPage
      const totalPagesCount = Math.ceil(data.length / booksPerPage);
      setTotalPages(totalPagesCount);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };



    fetchProduits();
  }, [booksPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationItems = () => {
    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <PaginationItem className="pagination-item" key={i} active={i === currentPage}>
          <PaginationLink className="pagination-link" onClick={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return paginationItems;
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = produits.slice(indexOfFirstBook, indexOfLastBook);

  
  const handleSearch = async () => {
    try {
      const response = await axios.get(`${API}/produit/produits/recherche`, {
        params: {
          nom: searchTerm,
          categorie: searchTerm,
        },
      });
      setProduits(response.data);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  const resetSearch = async () => {
    try {
      const response = await axios.get(`${API}/produit/aff`);
      setProduits(response.data);
      setSearchTerm("");
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };


  return (
    <>
      <MembreNavbar />
      <ProduitHeader />
      <br />

    
 <Container>
      <div className="content">
        <div className="search-bar-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <InputGroup>
            <Input
              className="search-input"
              placeholder="Rechercher des Produits..."
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
          {currentBooks.map((produit) => (
            <Col md="6" lg="4" key={produit._id} className="book-card ">
              <Card className="h-100">
                <div className="book-image-container">
                  {/* Display book image */}
                  <img
                    src={produit.imageP}
                    alt={produit.nom}
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

                    {produit.nom.length > 30
                      ? `${produit.nom.substring(0, 30)}...`
                      : produit.nom}
                  </h5>
                  </CardTitle>

                  <CardSubtitle className="card-subtitle">
                    <FontAwesomeIcon icon={faMoneyBill} className="icon" />
                    {produit.prix}
                  </CardSubtitle>
                  <CardText>
              <FontAwesomeIcon icon={faTag} className="icon" />
              {produit.categorie}
            </CardText>
            <CardFooter className="text-center">
            {/* <Button
                    // color="primary"
                    onClick={() => navigate(`/detailsLivre/${livre._id}`)}
                    className="details-button"
                  >
                    <FontAwesomeIcon icon={faGamepad} /> Details
                  </Button> */}
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

   <div className="pagination-container">
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
      </div>

   
      <DemoFooter />
    </>
  );
}

export default AfficherProduits;
