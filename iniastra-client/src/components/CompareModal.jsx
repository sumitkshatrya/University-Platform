import { motion } from "framer-motion";

const CompareModal = ({ universities, onClose }) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white p-6 w-full max-w-5xl rounded-2xl shadow-2xl"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">University Comparison</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-4 text-left font-semibold text-blue-700 border-b">Criteria</th>
                {universities.map((u, index) => (
                  <motion.th 
                    key={u._id}
                    className="p-4 text-left font-semibold text-blue-700 border-b"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">{index + 1}</span>
                      </div>
                      <span>{u.name}</span>
                    </div>
                  </motion.th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Country", key: "country" },
                { label: "GPA Requirement", key: "minGPA" },
                { label: "IELTS Requirement", key: "minIELTS" },
                { label: "Tuition Fee", key: "tuitionFee", format: (val) => `$${val.toLocaleString()}` },
                { label: "Degree Level", key: "degreeLevel" }
              ].map((row, rowIndex) => (
                <motion.tr 
                  key={row.label}
                  custom={rowIndex}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 font-medium border-b">{row.label}</td>
                  {universities.map(u => (
                    <td key={u._id} className="p-4 border-b">
                      {row.format ? row.format(u[row.key]) : u[row.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <motion.button
          onClick={onClose}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Close Comparison
        </motion.button>

        <div className="mt-4 text-center text-sm text-gray-500">
          Comparing {universities.length} universities
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CompareModal;