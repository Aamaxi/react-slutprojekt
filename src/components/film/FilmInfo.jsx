import FilmPictures from "./FilmPictures.jsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // To access URL query parameters

export default function FilmInfo() {
  const [filmData, setFilmData] = useState(null);
  const [filmId, setFilmId] = useState(null);

  const location = useLocation(); // Get the location of the current URL

  // Function to extract the query parameter 'film_id' from the URL
  const getFilmIdFromQuery = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("film_id");
  };

  useEffect(() => {
    const filmIdFromQuery = getFilmIdFromQuery(); // Extract film_id from the URL
    setFilmId(filmIdFromQuery); // Set the state for film_id

    if (filmIdFromQuery) {
      fetch(`http://localhost:5000/film?film_id=${filmIdFromQuery}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          setFilmData(data); // Set film ddata from the backend
          console.log(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [location.search]); // Re-run when URL changes (film_id in the query string)

  if (!filmData) {
    return <p>Loading...</p>; // Prevent rendering before data is fetched
  }

  const film = filmData[0]; // Assuming data is returned as an array and the film is the first item
  
  return (
    <div className="film-container">
      <div className="film-top-container">
        <div>
          <h1>{film.name}</h1> {/* Use dynamic film data */}
          <p>{film.year} • {film.duration} • {film.age_restriction}</p>
        </div>
        <div>
          <span>
            <img src="/icons/star.svg" alt="Star" />
            <p>{film.rating}/10</p>
          </span>
          <a>Give your rating</a>
        </div>
      </div>
      <FilmPictures />
      <div className="film-bottom-container">
        <img
          src={`/film_posters/${film.film_id}.png`} // Dynamic poster based on film_id
          alt="Poster"
          className="film-poster-info"
        />
        <div>
          <p className="film-text">{film.description}</p>
          <div className="film-bottom-buttons-container rating-text">
            <button className="film-add-button">
              <img src="/icons/add.svg" alt="Add icon" className="button-add-icon" />
              <p>Add to button</p>
            </button>
            <span className="film-rating">
              <img src="/icons/metacritic.svg" alt="Metacritic logo" className="rating-icon" />
              <p>{film.metacritic}</p>
            </span>
            <span className="film-rating">
              <img src="/icons/imdb.svg" alt="IMDb logo" className="rating-icon" />
              <p>{film.imdb_rating}/10</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
