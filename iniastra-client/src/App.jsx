import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import Apply from "./pages/Apply";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/apply/:id" element={<Apply />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
