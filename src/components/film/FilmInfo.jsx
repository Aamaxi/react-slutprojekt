import FilmPictures from "./FilmPictures.jsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // To access URL query parameters
import AddButton from "./AddButton.jsx";

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
          setFilmData(data); // Set film data from the backend
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

  const { reviews } = filmData; // Destructure reviews from filmData

  // Function to calculate the average rating
  const calculateAverageRating = () => {
    const filteredReviews = reviews.filter((review) => review.film_id === parseInt(filmId)); // Filter reviews by film_id
    if (filteredReviews.length === 0) return "No ratings available"; // Handle case with no reviews

    const totalRating = filteredReviews.reduce((sum, review) => sum + review.number_rating, 0); // Sum up all ratings
    return (totalRating / filteredReviews.length).toFixed(1); // Calculate and return the average
  };

  const averageRating = calculateAverageRating(); // Get the average rating

  const film = filmData.film; // Assuming data is returned as an object

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
            <p>{averageRating}/10</p>
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
            <AddButton />
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