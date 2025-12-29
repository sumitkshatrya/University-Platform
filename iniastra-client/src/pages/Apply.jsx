import { useParams } from "react-router-dom";

const Apply = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-xl">Apply to University</h1>
      <p>University ID: {id}</p>
    </div>
  );
};

export default Apply;
