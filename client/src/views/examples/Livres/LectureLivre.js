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
import {
  faBook,
  faInfoCircle,
  faList,
  faSearch,
  faTag,
  faTags,
  faUser,
  faListUl,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";
import FlipPage from "react-pageflip";
import DarkModeToggle from './DarkMode'; // Add this line to import the DarkModeToggle component


import LivreHeader from "components/Headers/LivreHeader";
import { useParams, useNavigate } from "react-router-dom";
import "./LectureLivre.css";
import DictionaryModal from './DictionaryModal';



function LectureLivre() {
  const { livreId } = useParams();
  const [chapitres, setChapitres] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [darkMode, setDarkMode] = useState(false); // State for tracking dark mode


  useEffect(() => {
    // Fetch the chapitres of the livre
    const fetchChapitres = async () => {
      try {
        const response = await axios.get(`${API}/livre/${livreId}/chapitres`);
        setChapitres(response.data);
        console.log(chapitres);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching chapitres:", error);
      }
    };

    fetchChapitres();
  }, [livreId]);

  document.documentElement.classList.remove("nav-open");
  React.useEffect(() => {
    document.body.classList.add("landing-page");
    return function cleanup() {
      document.body.classList.remove("landing-page");
    };
  });

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const apiKey = '7e9ef21e-3722-4604-b86a-a49c5b5e6e4e';
  

  return (
    <>
      <ExamplesNavbar />
      <LivreHeader />
      <br></br>
      <br></br>

      
      <div className={`lecture-livre ${darkMode ? 'dark' : ''}`}>
        <br></br>
        <br></br>

        <DarkModeToggle darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />


      
        {/* Display the content of the specific chapitre using FlipPage */}
        <FlipPage
          width={800} // Replace with your desired width
          height={600} // Replace with your desired height
          orientation="horizontal"
          className="flip-page-container"
          uncutPages
          showSwipeHint
          currentPage={currentPage}
          onPageChange={(e) => setCurrentPage(e.data)}
        >
          {chapitres.map((chapitre, index) => (
            <article key={chapitre._id}>
              <br></br>
              <h2>Chapitre {chapitre.numero}</h2>
              <h3 style={{ fontWeight: 'bold' }}> <center>{chapitre.titre}</center> </h3>
              <br></br>
              <br></br>

              <div dangerouslySetInnerHTML={{ __html: chapitre.contenu }} />

              
            </article>
          ))}
        </FlipPage>

        <div className="pagination-container">
        <Pagination className="pagination justify-content-center">
          {chapitres.map((_, index) => (
            <PaginationItem key={index} active={currentPage === index}>
              <PaginationLink onClick={() => handlePageChange(index)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </Pagination>
      </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <DemoFooter />
    </>
  );
}

export default LectureLivre;
