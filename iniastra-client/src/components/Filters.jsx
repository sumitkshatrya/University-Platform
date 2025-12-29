import { motion } from "framer-motion";
import { useState } from "react";

const Filters = ({ setFilters, setUser }) => {
  const [maxFee, setMaxFee] = useState(50000);

  return (
    <motion.div
      className="p-6 bg-white shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-6xl mx-auto">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">
          Filter Universities
        </h3>

        <div className="flex flex-wrap gap-4 justify-center">

          {/* Tuition Fee */}
          <div className="flex-1 min-w-[200px] max-w-[300px]">
            <label className="block text-sm font-medium mb-2">
              Tuition Fee: Up to <b>${maxFee}</b>
            </label>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={maxFee}
              onChange={(e) => {
                const value = Number(e.target.value);
                setMaxFee(value);
                setFilters(prev => ({ ...prev, maxFee: value }));
              }}
              className="w-full h-2 bg-blue-100 rounded-lg cursor-pointer"
            />
          </div>

          {/* GPA */}
          <input
            placeholder="Your GPA"
            type="number"
            step="0.1"
            min="0"
            max="4.0"
            onChange={(e) => {
              const value = Number(e.target.value);
              setUser(prev => ({ ...prev, gpa: value }));
              setFilters(prev => ({ ...prev, minGPA: value }));
            }}
            className="border p-3 rounded-lg w-[160px]"
          />

          {/* IELTS */}
          <input
            placeholder="Your IELTS"
            type="number"
            step="0.5"
            min="0"
            max="9"
            onChange={(e) => {
              const value = Number(e.target.value);
              setUser(prev => ({ ...prev, ielts: value }));
              setFilters(prev => ({ ...prev, minIELTS: value }));
            }}
            className="border p-3 rounded-lg w-[160px]"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Filters;
