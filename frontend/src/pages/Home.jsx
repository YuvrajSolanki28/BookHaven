import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import FeaturedBooks from "../components/FeaturedBooks";
import Newsletter from "../components/Newsletter";
import Loader from "../components/Loader";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for components to load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Hero />
      <FeaturedBooks />
      <Newsletter />
    </div>
  );
}

export default Home;
