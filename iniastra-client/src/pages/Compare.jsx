import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CompareModal from "../components/CompareModal";

const Compare = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

 
  useEffect(() => {
    if (!state?.universities || state.universities.length < 2) {
      navigate("/");
    }
  }, [state, navigate]);

  // Prevent render until valid data exists
  if (!state?.universities || state.universities.length < 2) {
    return null;
  }

  return (
    <CompareModal
      universities={state.universities}
      onClose={() => navigate("/")}
    />
  );
};

export default Compare;
