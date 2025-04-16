import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [searchables, setSearchables] = useState([]); // Initialize as an empty array
  const [filteredSearchables, setFilteredSearchables] = useState([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Track dropdown visibility
  const navigate = useNavigate(); // React Router's navigation hook

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5000/search")
      .then((response) => response.json())
      .then((data) => {
        // Combine films and people into a single array
        const combinedData = [...data.films, ...data.people];
        setSearchables(combinedData);
        setFilteredSearchables(combinedData); // Initialize filteredSearchables
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchValue(query);

    if (query) {
      const filteredData = searchables.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(query);
      });
      setFilteredSearchables(filteredData);
    } else {
      setFilteredSearchables(searchables); // Reset to all items when input is empty
    }

    // Show the dropdown when typing
    setIsDropdownVisible(true);
  };

  const handleInputClick = () => {
    // Show the dropdown when the input is clicked
    setIsDropdownVisible(true);
  };

  const handleBlur = () => {
    // Hide the dropdown when the input loses focus
    setTimeout(() => setIsDropdownVisible(false), 200); // Delay to allow clicking on dropdown items
  };

  const handleItemClick = (item) => {
    console.log(item);
    if (item.film_id) {
      navigate(`/film?film_id=${item.film_id}`); // Navigate to the film page
    } else if (item.person_id) {
      navigate(`/person?person_id=${item.person_id}`); // Navigate to the person page
    }
  };

  return (
    <div className="relative w-full">
      <label className="input w-full">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          className="grow w-full"
          type="text"
          onChange={handleSearch}
          onClick={handleInputClick}
          onBlur={handleBlur}
          value={searchValue}
          placeholder="Search"
        />
      </label>
      {isLoading && <p>Loading...</p>}

      {/* Dropdown menu */}
      {isDropdownVisible && (
        <ul className="menu dropdown-content bg-base-100 rounded-box w-full shadow mt-2 absolute z-10">
          {/* Limit the results to the top 5 */}
          {filteredSearchables.slice(0, 5).map((item, index) => (
            <li key={index}>
              <a
                onClick={() => handleItemClick(item)} // Handle navigation on click
                className="cursor-pointer"
              >
                {item.name || item.title}
              </a>
            </li>
          ))}
          {filteredSearchables.length === 0 && searchValue && (
            <li>
              <a>No results found</a>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}