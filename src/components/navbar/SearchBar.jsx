import { useState, useEffect } from "react";

export default function SearchBar() {
  const [searchValue, setSearchValue] = useState("");
  const [searchables, setSearchables] = useState([]); // Initialize as an empty array
  const [filteredSearchables, setFilteredSearchables] = useState([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(false);

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
  };

  return (
    <div>
      <input
        type="text"
        onChange={handleSearch}
        value={searchValue}
        placeholder="Search films or people..."
      />
      {isLoading && <p>Loading...</p>}
      <ul>
        {filteredSearchables.map((item, index) => (
          <li key={index}>
            <strong>{item.name || item.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}