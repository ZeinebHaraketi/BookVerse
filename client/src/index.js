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
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";

// styles
import "bootstrap/scss/bootstrap.scss";
import "assets/scss/paper-kit.scss?v=1.3.0";
import "assets/demo/demo.css?v=1.3.0";
// pages
import Index from "views/Index.js";
import NucleoIcons from "views/NucleoIcons.js";
import LandingPage from "views/examples/LandingPage.js";
import ProfilePage from "views/examples/ProfilePage.js";
import RegisterPage from "views/examples/RegisterPage.js";
import LoginPage from "views/examples/LoginPage";
import ResetPasswordPage from "views/examples/ResetPassword";

import '@fortawesome/fontawesome-free/css/all.min.css';
import ProfilePageAdmin from "views/examples/ProfilePageAdmin";
import ProfilePageModerateur from "views/examples/ProfilePageModerateur";
import AfficherLivres from "views/examples/Livres/AfficherLivres";
import DetailsLivres from "views/examples/Livres/DetailsLivres";
import LectureLivre from "views/examples/Livres/LectureLivre";
import BookList from "views/examples/Livres/BookListUser";
import AfficherProduits from "views/examples/Produits/AfficherProduits";


// others

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/index" element={<Index />} />
      <Route path="/nucleo-icons" element={<NucleoIcons />} />
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/admin/profile/:id" element={<ProfilePageAdmin />} />
      <Route path="/moderateur/profile/:id" element={<ProfilePageModerateur />} />


      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/resetPassword/:token" element={<ResetPasswordPage />} />


      <Route path="/livres" element={<AfficherLivres />} />
      <Route path="/detailsLivre/:id" element={<DetailsLivres />} />
      <Route path="/lecture-livre/:livreId/chapitre/:chapitreId"  element={<LectureLivre />}/>
      <Route path="/books/:id" element={<BookList />} />


      <Route path="/produits" element={<AfficherProduits />} />



      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);
