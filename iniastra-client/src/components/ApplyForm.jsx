import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { applyUniversity } from "../services/api";

const ApplyForm = ({ universityId }) => {
  const [form, setForm] = useState({
    studentName: "",
    email: "",
    gpa: "",
    ielts: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const submit = async () => {
    if (!form.studentName || !form.email || !form.gpa || !form.ielts) {
      setMessage({ type: "error", text: "Please fill all fields" });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    
    try {
      await applyUniversity({ ...form, universityId });
      setMessage({ type: "success", text: "Application submitted successfully!" });
      setForm({ studentName: "", email: "", gpa: "", ielts: "" });
    } catch {
      setMessage({ type: "error", text: "Not eligible or application failed!" });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, borderColor: "#3b82f6" }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0 5px 15px rgba(22, 163, 74, 0.3)" },
    tap: { scale: 0.95 },
    loading: { scale: 0.98 }
  };

  return (
    <motion.div 
      className="mt-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-3 p-3 rounded ${
              message.type === "success" 
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {["studentName", "email", "gpa", "ielts"].map((field, index) => (
        <motion.div
          key={field}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="mb-2"
        >
          <input
            placeholder={
              field === "studentName" ? "Full Name" :
              field === "email" ? "Email Address" :
              field === "gpa" ? "GPA (e.g., 3.5)" : "IELTS Score (e.g., 7.0)"
            }
            type={field === "email" ? "email" : field === "gpa" || field === "ielts" ? "number" : "text"}
            step={field === "gpa" ? "0.1" : field === "ielts" ? "0.5" : undefined}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form[field]}
            onChange={e => setForm({ ...form, [field]: e.target.value })}
          />
        </motion.div>
      ))}

      <motion.button
        onClick={submit}
        disabled={submitting}
        variants={buttonVariants}
        initial="initial"
        whileHover={submitting ? "loading" : "hover"}
        whileTap="tap"
        animate={submitting ? "loading" : "initial"}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          submitting 
            ? "bg-green-700 cursor-not-allowed" 
            : "bg-green-600 hover:bg-green-700"
        } text-white mt-3`}
      >
        {submitting ? (
          <span className="flex items-center justify-center">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
            />
            Submitting...
          </span>
        ) : (
          "Apply Now"
        )}
      </motion.button>
    </motion.div>
  );
};

export default ApplyForm;