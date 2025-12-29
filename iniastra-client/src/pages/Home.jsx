import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "../components/Hero";
import Filters from "../components/Filters";
import UniversityCard from "../components/UniversityCard";
import CompareModal from "../components/CompareModal";
import { fetchUniversities, fetchApplications } from "../services/api";

const Home = () => {
  const [universities, setUniversities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({});
  const [user, setUser] = useState({ gpa: 0, ielts: 0 });
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUniversities();
    loadApplications();
  }, [filters]);

  const loadUniversities = async () => {
    setLoading(true);
    try {
      const res = await fetchUniversities(filters);
      setUniversities(res.data.data);
    } catch (error) {
      console.error("Error loading universities:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const res = await fetchApplications();
      setApplications(res.data.data);
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

  const toggleCompare = (uni, checked) => {
    if (checked) {
      if (compareList.length < 3) {
        setCompareList([...compareList, uni]);
      } else {
        alert("You can compare up to 3 universities only");
      }
    } else {
      setCompareList(compareList.filter(u => u._id !== uni._id));
    }
  };

  return (
    <>
      <Hero setFilters={setFilters} />
      <Filters setFilters={setFilters} setUser={setUser} />

      {/* Universities */}
      {loading ? (
        <div className="text-center p-10">Loading universities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {universities.map(uni => (
            <UniversityCard
              key={uni._id}
              uni={uni}
              user={user}
              onCompare={toggleCompare}
            />
          ))}
        </div>
      )}

      {/* Applications (PUBLIC VIEW) */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">All Applications</h2>

        {applications.length === 0 && (
          <p className="text-gray-500">No applications yet</p>
        )}

        {applications.map(app => (
          <div
            key={app._id}
            className="border rounded p-4 mb-3 bg-white"
          >
            <p><b>Name:</b> {app.studentName}</p>
            <p><b>Email:</b> {app.email}</p>
            <p><b>Status:</b> {app.status}</p>
            <p><b>University:</b> {app.university?.name}</p>
          </div>
        ))}
      </div>

      {compareList.length >= 2 && (
        <div className="text-center mb-10">
          <button
            onClick={() => setShowCompare(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Compare {compareList.length} Universities
          </button>
        </div>
      )}

      <AnimatePresence>
        {showCompare && (
          <CompareModal
            universities={compareList}
            onClose={() => setShowCompare(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;
