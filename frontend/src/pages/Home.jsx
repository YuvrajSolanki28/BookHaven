import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import FeaturedBooks from "../components/FeaturedBooks";
import Newsletter from "../components/Newsletter";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirect if not logged in
    }
  }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Hero />
      <FeaturedBooks />
      <Newsletter />
    </div>
  );
}

export default Home;
