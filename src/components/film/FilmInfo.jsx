import FilmPictures from "./FilmPictures.jsx";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // To access URL query parameters
import AddButton from "./AddButton";
import GiveRating from "./GiveRating";

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
    <div>
      <div className="flex place-content-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl">{film.name}</h1> {/* Use dynamic film data */}
          <p>{film.year} • {film.duration} • {film.age_restriction}</p>
        </div>
        <div className="flex flex-col">
          <span className="flex gap-2">
            <img src="/icons/star.svg" alt="Star" />
            <h2 className="text-4xl">{averageRating}/5</h2>
          </span>
          <GiveRating />
        </div>
      </div>
      <FilmPictures />
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <img
          className="w-80 sm:w-50"
          src={`/film_posters/${film.film_id}.png`} // Dynamic poster based on film_id
          alt="Poster"
        />
        <div className="flex flex-col gap-3">
          <p>{film.description}</p>
          <div className="flex gap-4">
            <AddButton />
            <span className="flex gap-1 items-center">
              <img src="/icons/metacritic.svg" alt="Metacritic logo"/>
              <p>{film.metacritic_rating}</p>
            </span>
            <span className="flex gap-1 items-center">
              <img src="/icons/imdb.svg" alt="IMDb logo"/>
              <p>{film.imdb_rating}/5</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}