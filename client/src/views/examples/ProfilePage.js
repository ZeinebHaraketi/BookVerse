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
  CardImg,
  CardTitle,
  CardText,
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import ProfilePageHeader from "components/Headers/ProfilePageHeader.js";
import DemoFooter from "components/Footers/DemoFooter.js";
import { API } from "api_server";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ProfilePage.css"; // Import the custom CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBookOpen,
  faBoxOpen,
  faCoffee,
  faCog,
  faComment,
  faEnvelope,
  faEye,
  faEyeSlash,
  faGamepad,
  faInfoCircle,
  faPlus,
  faShoppingBasket,
  faStar,
  faTag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarSolid, faStar as faStarRegular } from '@fortawesome/free-solid-svg-icons';
import MembreNavbar from "components/Navbars/MembreNavbar";

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
  const [chapitres, setChapitres] = useState([]);
  const { id, chapitreId } = useParams(); // Get the book ID from the URL params

  //--------------------- Critique ------------------------------------//
  const [isCritiqueFormOpen, setIsCritiqueFormOpen] = useState(false);
  const [livre, setLivre] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userCritiques, setUserCritiques] = useState([]);
  const [showCritiques, setShowCritiques] = useState(false); // État pour afficher/masquer les critiques
  const [isCritiquesDisplayed, setIsCritiquesDisplayed] = useState(false);


  const [critiqueD, setCritiqueD] = useState({
    rating: 1,
    comment: "",
  });

  useEffect(() => {
   

    
    // const fetchUserCritiques = async () => {
    //   try {
    //     const userId = localStorage.getItem('userId');
    //     const token = localStorage.getItem('token');
    //     const response = await axios.get(`http://localhost:5000/librairieCritique/${user._id}`, {
    //       headers: { 'x-auth-token': token }
    //     });
    //     setUserCritiques(response.data);
    //     console.log(response.data);
    //   } catch (error) {
    //     console.error('Error fetching user critiques:', error);
    //   }
    // };

    // fetchUserCritiques();
  }, [user._id]);

  const fetchCritiquesForLivre = async (livreId) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/librairie/${user._id}/critiques/${livreId}`, {
        headers: { 'x-auth-token': token }
      });
      setUserCritiques(response.data);
    } catch (error) {
      console.error('Error fetching critiques:', error);
    }
  };
  const handleShowCritiques = () => {
    setShowCritiques(!showCritiques);
  };
  
  const handleAddCritique = async (livreId, e) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire
    
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
  
      const critiqueData = {
        user: user._id,
        rating: rating, 
        comment: comment, 
        livre: livreId
      };
  
      console.log("Critique Data:", critiqueData); // Vérifiez les données envoyées
  
      const response = await axios.post(
        `http://localhost:5000/livre/${livreId}/critiques/${user._id}`, // Utilisez la route modifiée
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


  
//Ca marche
  // const handleAddCritique = async (livreId) => {

  //   try {
  //     const userId = localStorage.getItem("userId");
  //     const token = localStorage.getItem("token");
  
  //     const critiqueData = {
  //       user: user._id,
  //       rating: rating, 
  //       comment: comment, 
  //       livre: livreId
  //     };
  
  //     console.log("Critique Data:", critiqueData); // Vérifiez les données envoyées
  
  //     const response = await axios.post(
  //       `http://localhost:5000/livre/${livreId}/critiques/${user._id}`, // Utilisez la route modifiée
  //       critiqueData,
  //       {
  //         headers: { "x-auth-token": token }
  //       }
  //     );
  
  //     if (response.status === 201) {
  //       console.log("Critique ajoutée avec succès");
  //       // Vous pouvez ajouter ici une notification ou un autre feedback utilisateur
  //     }
  //   } catch (error) {
  //     console.error("Erreur lors de l'ajout de la critique :", error);
  //     // Gérez l'erreur ici (par exemple, affichez un message d'erreur à l'utilisateur)
  //   }
  // };
  
 
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

  const handleViewBooks = () => {
    const token = localStorage.getItem("token");
    

    if (token) {
      navigate(`/books/${user._id}`);

    }
  };

  const handleViewProducts = () => {
    const token = localStorage.getItem("token");
    

    if (token) {
      navigate(`/produits/${user._id}`);

    }
  };

  const handleViewPanier = () => {
    const token = localStorage.getItem("token");
    

    if (token) {
      navigate(`/panier/${user._id}`);

    }
  };


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

  console.log(user._id);


  useEffect(() => {
    // Fetch the user's read books from the backend API
    const fetchReadBooks = async () => {
      try {
        const response = await axios.get(`${API}/ReadBooks/${user._id}`);
        setReadBooks(response.data);
      } catch (error) {
        console.error("Error fetching read books:", error);
      }
    };

    // Assuming you have the user ID available, you can use it here.
    // Replace 'userId' with the actual user ID.
    fetchReadBooks();
  }, [user._id]);

  //--------------------------------- Lire ------------------------------------------//
  
  const handleReadBook = () => {
    if (chapitres.length > 0) {
      const firstChapitreId = chapitres[0]._id;
      navigate(`/lecture-livre/${id}/chapitre/${firstChapitreId}`);
    }
  };

  const firstChapitreId = chapitres.length > 0 ? chapitres[0]._id : null;

  const generateStars = (rating) => {
    const stars = [];
    for (let i = 0; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= rating ? faStar : faStarRegular}
          className="star-icon"
        />
      );
    }
    return stars;
  };


  
  return (
    <>
      <MembreNavbar />
      <ProfilePageHeader />
    
      <br />
<br></br>
<br></br>
<br></br>
<br></br>

      <div className="cart-button">
      <Button
        style={{ backgroundColor: '#3f51b5'}}
        className="view-books-button" 
          onClick={handleViewPanier}
        >
          <FontAwesomeIcon icon={faShoppingBasket} className="icon" />
        </Button>
      </div>


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
    
<hr></hr>
    <div>
      <h2 style={{ 
        fontWeight: 'bold',
        fontSize: '2rem',
        color: '#3f51b5', 
        textTransform: 'uppercase', 
        letterSpacing: '1px', 
        fontFamily: 'Arial, sans-serif', 
        textAlign: 'center', 
      }}> Ma Librairie
      </h2>
      <br></br>
      <div className="view-books-button-container">
        <Button
        style={{ backgroundColor: '#3f51b5'}}
        className="view-books-button" 
          onClick={handleViewBooks}
        >
          <FontAwesomeIcon icon={faBook} className="icon" /> Afficher tous les Livres
        </Button>
      </div>


      <br></br>
      <Container>
    <Row>
      {readBooks.map((book) => (
        <Col key={book._id} md="4">
          <Card className="library-card">
            {/* You can customize this section to display book images, titles, etc. */}
            <CardImg top width="100%" src={book.image} alt={book.titre} />
            <CardBody>
              <CardTitle tag="h5">
              <FontAwesomeIcon icon={faBook} className="mr-2" />
                {book.titre}
              </CardTitle>
              <br></br>
              <CardText>
              <FontAwesomeIcon icon={faInfoCircle} className="mr-2" /> 
                {book.resume}
              </CardText>
              <CardText>
              <FontAwesomeIcon icon={faTag} className="mr-2" /> 
                {book.genre}
              </CardText>
              <CardText>
              <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
                {book.categorie}
              </CardText>

              <Button
                    // color="primary"
                    onClick={() => navigate(`/detailsLivre/${book._id}`)}
                    className="details-button"
                  >
                    <FontAwesomeIcon icon={faGamepad} /> Details
              </Button>
              <br></br>
              {/* <Button onClick={() => fetchCritiquesForLivre(book._id)}>
            Afficher les critiques
          </Button> */}
          <Button 
          className="display-critique-button"
          onClick={() => setIsCritiquesDisplayed(!isCritiquesDisplayed)}
              style={{ marginRight: '10px',
              backgroundColor: '#6963ec',
              color: 'white',
            }} 
          >
  {isCritiquesDisplayed ? (
      <>
      <FontAwesomeIcon icon={faEyeSlash} />  
    </>
  ) : (
    <>
      <FontAwesomeIcon icon={faEye} />  
    </>
  ) } Critiques
          </Button>

{isCritiquesDisplayed && (
  <>
    {userCritiques.map((critique) => (
      <div key={critique._id} className="critique">
        <div className="rating">
          {Array.from({ length: critique.rating }).map((_, index) => (
            <FontAwesomeIcon key={index} icon={faStarSolid} className="star" />
          ))}
          {Array.from({ length: 5 - critique.rating }).map((_, index) => (
            <FontAwesomeIcon key={index} icon={faStarRegular} className="star" />
          ))}
        </div>
        <p> {critique.comment} </p>
      </div>
    ))}
  </>
)}

          
          {/* {userCritiques.map((critique) => (
          <div key={critique._id} className="critique">
            <div className="rating-container">
              {generateStars(critique.rating)}
            </div>
            <p>{critique.comment}</p>
          </div>
        ))} */}
              <Button
  onClick={() => setIsCritiqueFormOpen(true)} 

  className="add-critique-button"
      >
        <FontAwesomeIcon icon={faComment} className="icon" />  Critiquer
              </Button>
              

            </CardBody>
            
          
          </Card>

          <Collapse isOpen={isCritiqueFormOpen}>
  <Card>
    <CardBody>
    {/* <Form onSubmit={handleAddCritique(book._id)}> */}
    <Form onSubmit={(e) => handleAddCritique(book._id, e)}>

        <FormGroup>
          <Label for="rating">Note</Label>

          <Input
            type="number"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="0"
            max="5"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="comment">Commentaire</Label>
          <Input
            type="textarea"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}    
            
          />
        </FormGroup>
        <div className="critique-container">

        <Button 
        type="submit" 
        color="primary"
        className="add-critique-button"
        >
                <FontAwesomeIcon icon={faPlus} className="icon" />  Critique

        </Button>
        <Button
          type="button"
          color="secondary"
          onClick={() => setIsCritiqueFormOpen(false)} // Ferme le formulaire
          className="cancel-button"
        >
          Annuler
        </Button>
        </div>
      </Form>
    </CardBody>
  </Card>
</Collapse>

        </Col>
      ))}
    </Row>
   
  </Container>
    </div>

<hr></hr>

<div>
<div className="view-books-button-container">
        <Button
        style={{ backgroundColor: '#3f51b5'}}
        className="view-books-button" 
          onClick={handleViewProducts}
        >
          <FontAwesomeIcon icon={faBoxOpen} className="icon" /> Afficher Tout les Produits
        </Button>
      </div>
</div>
      <DemoFooter />
    </>
  );
}

export default ProfilePage;
