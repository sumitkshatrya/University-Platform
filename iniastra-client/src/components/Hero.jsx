import { motion } from "framer-motion";
import SearchBar from "./SearchBar";

const Hero = ({ setFilters }) => {
  return (
    <div className="bg-blue-700 text-white p-12 text-center">
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold"
      >
        Find Your Perfect University
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <SearchBar setFilters={setFilters} />
      </motion.div>
    </div>
  );
};

export default Hero;
