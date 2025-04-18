import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FilmPictures from "../film/FilmPictures";

export default function PersonInfo() {
  const [personData, setPersonData] = useState(null);
  const [personId, setPersonId] = useState(null);

  const location = useLocation();

  const getPersonIdFromQuery = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("person_id");
  };

  useEffect(() => {
    const personIdFromQuery = getPersonIdFromQuery();
    setPersonId(personIdFromQuery);

    if (personIdFromQuery) {
      fetch(`http://localhost:5000/person?person_id=${personIdFromQuery}`)
        .then((response) => response.json())
        .then((data) => {
          setPersonData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [location.search]);

  if (!personData) {
    return <p>Loading...</p>;
  }

  const { credits, person, films } = personData;

  const generateFilmList = () => {
    const filmList = [];
    for (let role in credits) {
      credits[role].forEach((credit) => {
        const film = films.find((f) => f.film_id === credit.film_id);
        if (film) {
          const existingFilm = filmList.find((f) => f.film_id === film.film_id);
          if (existingFilm) {
            existingFilm.roles.push(role.charAt(0).toUpperCase() + role.slice(1));
          } else {
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
        creditsArray.push(key.charAt(0).toUpperCase() + key.slice(1));
      }
    }
    return creditsArray;
  };

  const creditsArray = generateCreditsArray();


  return (
    <div>
      <div className="flex place-content-between items-center">
        <div>
          <h1 className="text-5xl">{person[0].name}</h1>
          <p>{creditsArray.join(" • ")}</p>
        </div>
        <div className="flex flex-col">
        </div>
      </div>
      <FilmPictures />
      <div className="flex items-center gap-6 mt-6">
        <img
          className="w-50"
          src={`/person_posters/${personId}.png`}
          alt="Poster"
        />
        <div className="flex flex-col gap-3">
          <p>{person[0].description}</p>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-2xl font-bold">Filmography</h3>
        <ul className="mt-4 space-y-2">
          {filmList.map((film) => (
            <li key={film.film_id} className="p-4 border rounded-lg bg-base-200">
              <strong>{film.name}</strong> ({film.year}) - Roles: {film.roles.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}