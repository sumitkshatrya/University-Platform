import { useState } from "react";
import { motion } from "framer-motion";
import ApplyForm from "./ApplyForm";

const UniversityCard = ({ uni, user, onCompare }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const eligible = user.gpa >= uni.minGPA && user.ielts >= uni.minIELTS;

  const cardVariants = {
    hover: {
      y: -5,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
    }
  };

  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: "auto", opacity: 1 }
  };

  return (
    <motion.div
      className="bg-white p-5 rounded-lg shadow-md overflow-hidden"
      variants={cardVariants}
      whileHover="hover"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-xl font-bold text-blue-800">{uni.name}</h3>
        <p className="text-gray-600">📍 {uni.country}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="font-semibold">${uni.tuitionFee.toLocaleString()}</span>
          {!eligible && (
            <motion.span 
              className="text-red-500 font-semibold text-sm bg-red-50 px-2 py-1 rounded"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              ❌ Not Eligible
            </motion.span>
          )}
          {eligible && (
            <motion.span 
              className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              ✅ Eligible
            </motion.span>
          )}
        </div>
      </div>

      <motion.div
        variants={expandVariants}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-blue-50 p-2 rounded">
              <p className="text-xs text-gray-500">Min GPA</p>
              <p className="font-bold">{uni.minGPA}</p>
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <p className="text-xs text-gray-500">Min IELTS</p>
              <p className="font-bold">{uni.minIELTS}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                onChange={e => onCompare(uni, e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm">Add to Compare</span>
            </label>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-600 text-sm font-semibold"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </motion.button>
          </div>

          {eligible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ApplyForm universityId={uni._id} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UniversityCard;