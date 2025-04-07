import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom"; // To access URL query parameters


export default function Credits() {
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

  const film = filmData[0]; // Assuming data is returned as an array and the film is the first item
  
  
  return(
    <div className="credits-container">
      <div>
        <p>Director</p>
      </div>
    </div>
  );
}