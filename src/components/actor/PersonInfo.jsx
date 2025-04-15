import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // To access URL query parameters

export default function PersonInfo() {
  const [personData, setPersonData] = useState(null);
  const [personId, setPersonId] = useState(null);

  const location = useLocation(); // Get the location of the current URL

  // Function to extract the query parameter 'person_id' from the URL
  const getPersonIdFromQuery = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("person_id");
  };

  useEffect(() => {
    const personIdFromQuery = getPersonIdFromQuery(); // Extract person_id from the URL
    setPersonId(personIdFromQuery); // Set the state for person_id

    if (personIdFromQuery) {
      fetch(`http://localhost:5000/person?person_id=${personIdFromQuery}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          setPersonData(data); // Set person data from the backend
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [location.search]); // Re-run when URL changes (person_id in the query string)

  if (!personData) {
    return <p>Loading...</p>; // Prevent rendering before data is fetched
  }

  const { credits, person, films } = personData;

  const generateFilmList = () => {
    const filmList = [];

    // Iterate over each role category in credits (acted, directed, produced, written)
    for (let role in credits) {
      credits[role].forEach((credit) => {
        // Find the corresponding film in the films array
        const film = films.find((f) => f.film_id === credit.film_id);

        if (film) {
          // Check if the film is already in the list
          const existingFilm = filmList.find((f) => f.film_id === film.film_id);

          if (existingFilm) {
            // If the film is already in the list, add the role to its roles array
            existingFilm.roles.push(role.charAt(0).toUpperCase() + role.slice(1));
          } else {
            // If the film is not in the list, add it with the current role
            filmList.push({
              film_id: film.film_id,
              name: film.name,
              year: film.year,
              roles: [role.charAt(0).toUpperCase() + role.slice(1)],
            });
          }
        }
      });
    }

    return filmList;
  };

  const filmList = generateFilmList();


  const generateCreditsArray = () => {
    let creditsArray = [];

    for (let key in credits) {
      if (credits[key].length !== 0) {
        creditsArray.push(key.charAt(0).toUpperCase() + key.slice(1)); // Capitalize the first letter
      }
    }
    return creditsArray;
  };
  const creditsArray = generateCreditsArray();

  return (
    <div className="list-container">
      <h1>{person[0].name}</h1>
      <p>{creditsArray.join(" • ")}</p>
      <img src="" alt="" />
      <img src="" alt="" />
      <p>{person[0].description}</p>
      <ul>
        {filmList.map((film) => (
          <li key={film.film_id}>
            <strong>{film.name}</strong> ({film.year}) - Roles: {film.roles.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}