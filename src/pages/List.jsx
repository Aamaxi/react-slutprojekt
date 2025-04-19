import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // To access URL query parameters
import { FaInfoCircle } from "react-icons/fa"; // Import Font Awesome Info Icon
import Footer from "../components/Footer";

export default function List() {
  const [listData, setListData] = useState(null);
  const [listId, setListId] = useState(null);
  const [sortedFilms, setSortedFilms] = useState([]); // State to store sorted films
  const [sortCriteria, setSortCriteria] = useState("name"); // Default sort by name
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order is ascending
  const [dropdownLabel, setDropdownLabel] = useState("Sort by: Name"); // Dropdown label

  const location = useLocation(); // Get the location of the current URL

  const getListIdFromQuery = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("list_id");
  };

  useEffect(() => {
    const listIdFromQuery = getListIdFromQuery();
    setListId(listIdFromQuery);

    if (listIdFromQuery) {
      fetch(`http://localhost:5000/list?list_id=${listIdFromQuery}`)
        .then((response) => response.json())
        .then((data) => {
          setListData(data);
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [location.search]);

  useEffect(() => {
    if (listData) {
      const { listFilms, films } = listData;

      const mappedFilms = listFilms
        .map((listFilm) => films.find((film) => film.film_id === listFilm.film_id))
        .filter((film) => film);

      const sorted = sortFilms(mappedFilms, sortCriteria, sortOrder);
      setSortedFilms(sorted);
    }
  }, [listData, sortCriteria, sortOrder]);

  const sortFilms = (films, criteria, order) => {
    return [...films].sort((a, b) => {
      if (criteria === "name") {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (criteria === "rating") {
        return order === "asc"
          ? a.imdb_rating - b.imdb_rating
          : b.imdb_rating - a.imdb_rating;
      }
      return 0;
    });
  };

  if (!listData) {
    return <p>Loading...</p>;
  }

  const { list } = listData;

  if (!list || list.length === 0) {
    return <p>No list found.</p>;
  }

  const currentList = list.find((item) => item.list_id === parseInt(listId));

  if (!currentList) {
    return <p>List not found.</p>;
  }

  const handleSortChange = (criteria, label) => {
    setSortCriteria(criteria);
    setDropdownLabel(label);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div>
      <div className="list-container max-w-6xl mx-auto p-4">
        <div className="text-center mb-8">
          <div className="w-80 h-80 mx-auto bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src={`/list_images/${currentList.list_id}.png`}
              alt="List image"
              className="object-cover w-full h-full"
            />
          </div>
          <h2 className="text-3xl font-bold mt-4">{currentList.name}</h2>
          <p className="text-gray-600">{currentList.description}</p>
        </div>
        <div className="mb-4 flex items-center gap-4">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-outline m-1">
              {dropdownLabel}
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button onClick={() => handleSortChange("name", "Sort by: Name")}>
                  Name
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    handleSortChange("rating", "Sort by: IMDb Rating")
                  }
                >
                  IMDb Rating
                </button>
              </li>
            </ul>
          </div>
          <button
            className="btn btn-outline"
            onClick={toggleSortOrder}
          >
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
        <div className="flex flex-col gap-6">
          {sortedFilms.map((film, index) => (
            <a
              href={`/film?film_id=${film.film_id}`}
              key={film.film_id}
              className="film-item flex shadow-md rounded-lg overflow-hidden relative hover:bg-base-200 transition-colors duration-300"
            >
              {/* Poster */}
              <div className="w-40 flex-shrink-0 bg-gray-200">
                <img
                  src={`/film_posters/${film.film_id}.png`}
                  alt={`${film.name} Poster`}
                  className="object-cover w-full h-full"
                />
              </div>
              {/* Details */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <h3 className="text-lg font-bold">
                  {index + 1}. {film.name}
                </h3>
                <p className="text-sm">
                  <strong>Year:</strong> {film.year}
                </p>
                <p className="text-sm">
                  <strong>Duration:</strong> {film.duration}
                </p>
                <p className="text-sm">
                  <strong>Age Restriction:</strong> {film.age_restriction}
                </p>
                <p className="text-sm">
                  <strong>IMDb Rating:</strong> {film.imdb_rating}/10
                </p>
              </div>
              {/* Info Icon */}
              <div className="absolute top-0 right-3 h-full flex items-center">
                <FaInfoCircle className="text-3xl cursor-pointer" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}