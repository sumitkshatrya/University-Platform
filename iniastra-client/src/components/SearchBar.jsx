const SearchBar = ({ setFilters }) => {
  return (
    <div className="flex gap-4 justify-center">
      <select
        onChange={e => setFilters(prev => ({ ...prev, country: e.target.value }))}
        className="p-2 text-black"
      >
        <option value="">Country</option>
        <option value="USA">USA</option>
        <option value="UK">UK</option>
        <option value="Canada">Canada</option>
      </select>

      <select
        onChange={e => setFilters(prev => ({ ...prev, degree: e.target.value }))}
        className="p-2 text-black"
      >
        <option value="">Degree</option>
        <option value="Bachelors">Bachelors</option>
        <option value="Masters">Masters</option>
      </select>
    </div>
  );
};

export default SearchBar;
