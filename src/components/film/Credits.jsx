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
        .then((response) => response.json())
        .then((data) => {
          setFilmData(data); // Set film data from the backend
          console.log("Film data:", data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [location.search]); // Re-run when URL changes (film_id in the query string)

  if (!filmData) {
    return <p>Loading...</p>; // Prevent rendering before data is fetched
  }

  const { credits } = filmData; // Destructure credits from filmData
  console.log("Credits:", credits);

  const renderSection = (title, data) => {
    if (!data || data.length === 0) return null;

    return (
      <div>
        <h3>{title}</h3>
        <ul>
          {data.map((credit, index) => (
            <li key={index}>
              {credit.actor_name || credit.director_name || credit.producer_name || credit.writer_name}
              {credit.role ? ` as ${credit.role}` : ""}
            </li>
          ))}
        </ul>
      </div>
    );
  };  

  return (
    <div className="credits-container">
      {renderSection("Actors", credits.acted)}
      {renderSection("Directors", credits.directed)}
      {renderSection("Producers", credits.produced)}
      {renderSection("Writers", credits.written)}
    </div>
  );
}