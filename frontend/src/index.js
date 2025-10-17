import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, useLocation, } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Bookdetails from "./pages/bookdetails";
import Booklist from "./pages/booklist";
import BookCart from "./pages/Cart";
import Login from "./pages/login";
import Signup from "./pages/signup";
import EmailVerification from "./pages/EmailVerification";
import ProfilePage from "./pages/Profile";
import Loader from "./components/Loader";
import AdminRoute from "./components/AdmineRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AuthSuccess from './pages/AuthSuccess';
import MyLibrary from "./pages/MyLibrary";
import AddBooks from "./pages/admin/add_books";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import NewReleases from "./pages/NewReleases";
import Categories from "./pages/Categories";


// Layout with Navbar & Footer control
const Layout = ({ children }) => {
  const location = useLocation();

  const hideNavbarFooter =
    location.pathname === "/admin/login" ||
    location.pathname === "/admin" ||
    location.pathname === "/admin/add-books" ||
    location.pathname === "/admin/users" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/verify";

  const hideFooter =
    location.pathname === "/cart" || location.pathname === "/profile" || location.pathname === "/mylibrary";

    const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className={isAdminPage ? "" : ""}>
      {!hideNavbarFooter && <Navbar />}
      {children}
      {!hideNavbarFooter && !hideFooter && <Footer />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
            <Layout>
              <Routes>
                <Route index element={<App />} />
                <Route path="/booklist" element={<Booklist />} />
                <Route path="/bookdetails" element={<Bookdetails />} />
                <Route path="/cart" element={<BookCart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify" element={<EmailVerification />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/loader" element={<Loader />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/auth/success" element={<AuthSuccess />} />
                <Route path="/mylibrary" element={<MyLibrary />} />
                <Route path="/new-releases" element={<NewReleases />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/admin/add-books" element={
                  <AdminRoute>
                    <AddBooks />
                  </AdminRoute>
                }
                />
                <Route path="/admin" element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
                />
                <Route path="/admin/users" element={
                  <AdminRoute>
                    <Users />
                  </AdminRoute>
                }
                />

              </Routes>
            </Layout>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
