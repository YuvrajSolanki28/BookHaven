import "./index.css";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useLocation, } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import App from "./App";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Bookdetails from "./pages/bookdetails";
import Booklist from "./pages/booklist";
import BookCart from "./pages/Cart";
import AdminPage from "./pages/admin/admin_page";
import Login from "./pages/login";
import Signup from "./pages/signup";
import EmailVerification from "./pages/EmailVerification";
import ProfilePage from "./pages/Profile";
import Loader from "./components/Loader";
import AdminRoute from "./components/AdmineRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import OauthCallback from "./components/OauthCallback";

// Wrapper for Booklist to simulate API call
const BooklistWrapper = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Simulating an API call
    setTimeout(() => {
      setBooks([
        { id: 1, title: "Book 1" },
        { id: 2, title: "Book 2" },
      ]);
    }, 1000);
  }, []);

  return <Booklist books={books} />;
};

// Layout with Navbar & Footer control
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarFooter =
    location.pathname === "/admin_page" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/verify";


  const hideFooter = location.pathname === "/cart" || location.pathname === "/profile";; // lowercase to match route

  return (
    <>
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && !hideFooter && <Footer />}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route index element={<App />} />
              <Route path="/booklist" element={<BooklistWrapper />} />
              <Route path="/bookdetails" element={<Bookdetails />} />
              <Route path="/cart" element={<BookCart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify" element={<EmailVerification />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/loader" element={<Loader />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              } />
               <Route path="/oauth/callback" element={<OauthCallback />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
