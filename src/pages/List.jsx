import '../App.css';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // To access URL query parameters

export default function List() {
  const [listData, setListData] = useState(null);
  const [listId, setListId] = useState(null);
  const [sortedFilms, setSortedFilms] = useState([]); // State to store sorted films
  const [sortCriteria, setSortCriteria] = useState("name"); // Default sort by name
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order is ascending

  const location = useLocation(); // Get the location of the current URL

  // Function to extract the query parameter 'list_id' from the URL
  const getListIdFromQuery = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("list_id");
  };

  useEffect(() => {
    const listIdFromQuery = getListIdFromQuery(); // Extract list_id from the URL
    setListId(listIdFromQuery); // Set the state for list_id

    if (listIdFromQuery) {
      fetch(`http://localhost:5000/list?list_id=${listIdFromQuery}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          setListData(data); // Set list data from the backend
          console.log(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [location.search]); // Re-run when URL changes (list_id in the query string)

  useEffect(() => {
    if (listData) {
      const { listFilms, films } = listData;

      // Map listFilms to their corresponding films
      const mappedFilms = listFilms
        .map((listFilm) => films.find((film) => film.film_id === listFilm.film_id))
        .filter((film) => film); // Remove undefined entries if no matching film is found

      // Sort the films based on the current sort criteria and order
      const sorted = sortFilms(mappedFilms, sortCriteria, sortOrder);
      setSortedFilms(sorted);
    }
  }, [listData, sortCriteria, sortOrder]); // Re-run when listData, sortCriteria, or sortOrder changes

  const sortFilms = (films, criteria, order) => {
    return [...films].sort((a, b) => {
      if (criteria === "name") {
        return order === "asc"
          ? a.name.localeCompare(b.name) // Sort alphabetically (ascending)
          : b.name.localeCompare(a.name); // Sort alphabetically (descending)
      } else if (criteria === "rating") {
        return order === "asc"
          ? a.imdb_rating - b.imdb_rating // Sort by IMDb rating (ascending)
          : b.imdb_rating - a.imdb_rating; // Sort by IMDb rating (descending)
      }
      return 0;
    });
  };

  if (!listData) {
    return <p>Loading...</p>; // Prevent rendering before data is fetched
  }

  // Extract the list from the response
  const { list } = listData;

  if (!list || list.length === 0) {
    return <p>No list found.</p>; // Handle case where list is empty
  }

  // Find the list object that matches the listId
  const currentList = list.find((item) => item.list_id === parseInt(listId));

  if (!currentList) {
    return <p>List not found.</p>; // Handle case where the list_id does not match any list
  }

  return (
    <div className="list-container">
      <img
        src={`/list_images/${currentList.list_id}.png`}
        alt="List image"
        className="img-list"
      />
      <h2>{currentList.name}</h2> {/* Access the matching list object */}
      <p>{currentList.description}</p>
      <div>
        <p>Sort by:</p>
        <button onClick={() => setSortCriteria("name")}>Name</button>
        <button onClick={() => setSortCriteria("rating")}>IMDb Rating</button>
        <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
          {sortOrder === "asc" ? "Descending" : "Ascending"}
        </button>
      </div>
      <div>
        {/* Render the sorted films */}
        {sortedFilms.map((film) => (
          <div key={film.film_id} className="film-item">
            <h3>{film.name}</h3>
            <img src={`/film_posters/${film.film_id}.png`} alt={`${film.name} Poster`} />            ¨
            <p><strong>Year:</strong> {film.year}</p>
            <p><strong>Duration:</strong> {film.duration}</p>
            <p><strong>IMDb Rating:</strong> {film.imdb_rating}/10</p>
          </div>
        ))}
      </div>
    </div>
  );
}