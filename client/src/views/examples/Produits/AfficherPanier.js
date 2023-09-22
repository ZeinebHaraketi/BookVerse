import React, { useEffect, useState } from "react";
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

import DemoFooter from "components/Footers/DemoFooter.js";
import { API } from "api_server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from "axios";
import ProduitHeader from "components/Headers/ProduitHeader";
import MembreNavbar from "components/Navbars/MembreNavbar";
import { Link } from "react-router-dom";
import { faBook, faMoneyCheckDollar, faShoppingCart, faTag, faTrash } from "@fortawesome/free-solid-svg-icons";

function AfficherPanier() {
    const [activeTab, setActiveTab] = React.useState("1");
    const [cart, setCart] = useState([]); // Initialisez avec un objet contenant un tableau produits vide

    //---------------------- UserId  ----------------------------------------//
const pathParts = window.location.pathname.split("/");
const userId = pathParts[pathParts.length - 1]; // Le dernier élément dans le chemin

console.log(userId);
useEffect(() => {
    // Fetch the user's cart using their ID
    axios.get(`${API}/getCart/${userId}`)
      .then(response => {
        setCart(response.data);
        console.log(response.data);
        console.log("Display Cart with success");
      })
      .catch(error => {
        console.error('Error fetching cart:', error);
      });

      axios
      .get(`${API}/getUserCartProducts/${userId}`)
      .then((response) => {
        setCart(response.data);
        console.log(response.data);
        console.log("Display User's Cart Products with success");
      })
      .catch((error) => {
        console.error('Error fetching user cart products:', error);
      });
  }, [userId]);

  

// useEffect(() => {
//     const fetchUserCartProducts = async () => {
//       try {
//         const response = await axios.get(`${API}/getUserCartProducts/${userId}`);
//         setCart(response.data);
//         console.log(response.data);
//         console.log("Display User's Cart Products with success");
//       } catch (error) {
//         console.error('Error fetching user cart products:', error);
//       }
//     };
  
//     fetchUserCartProducts();
//   }, [userId]);
  
    
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

  console.log(cart.produits);
  console.log(cart);


  

    return(
        <>
            <MembreNavbar />
            <ProduitHeader />

            <div className="cart-items">
  {/* {Array.isArray(cart.produits) && cart.produits.length > 0  &&
    
    cart.produits.map((product) => (
      <div key={product._id}>
        <img src={product.imageP} alt={product.nom} />
        <h3>{product.nom}</h3>
        <p>{product.description}</p>
        <p>Prix: {product.prix}</p>
      </div>
    ))
    
} */}
{/* {Array.isArray(cart.produits) && cart.produits.length > 0 ? (
  cart.produits.map((product) => (
    <div key={product._id}>
      <img src={product.imageP} alt={product.nom} />
      <h3>{product.nom}</h3>
      <p>{product.description}</p>
      <p>Prix: {product.prix}</p>
    </div>
  ))
) : (
  <p>Votre panier est vide.</p>
)} */}
<br></br>
<br></br>
<br></br>
<h2 style={{ 
        fontWeight: 'bold',
        fontSize: '2rem',
        color: '#3f51b5', 
        textTransform: 'uppercase', 
        letterSpacing: '1px', 
        fontFamily: 'Arial, sans-serif', 
        textAlign: 'center', 
      }}> Mon Panier
      </h2>
      <br></br>
<div className="cart-items">

        <Container className="mt-5">
        <Row>
        {Array.isArray(cart) &&
          cart.map((produit) => (
            // <div key={product._id} className="cart-item">
            //   <img src={product.imageP} alt={product.nom} className="product-image" />
            //   <div className="product-details">
            //     <h4>{product.nom}</h4>
            //     <p>Prix : {product.prix} $</p>
            //     <p>Catégorie : {product.categorie}</p>
            //     <p>Description : {product.description}</p>
            //     <Button className="remove-button">
            //       <FontAwesomeIcon icon={faTrash} className="remove-icon" />
            //       Retirer du Panier
            //     </Button>
            //   </div>
            // </div>
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
                  <FontAwesomeIcon icon={faMoneyCheckDollar} className="icon" />
                  {produit.prix} $
                </CardSubtitle>
                <CardText>
            <FontAwesomeIcon icon={faTag} className="icon" />
            {produit.categorie}
          </CardText>
          <CardFooter className="text-center">
          <Button
className="add-to-cart-button red-button"
>
<FontAwesomeIcon icon={faShoppingCart} className="icon" />
Acheter
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
      </div>

            </div>


        </>
    )
}

export default AfficherPanier;
