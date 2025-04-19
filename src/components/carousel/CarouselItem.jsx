import { useEffect, useState } from "react";

export default function CarouselItem({ filmId }) {
  const [filmData, setFilmData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/film?film_id=${filmId}`)
      .then((response) => response.json())
      .then((data) => {
        setFilmData(data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // Empty dependency array = only run once on component mount

  if (!filmData) {
    return <p>Loading...</p>;
  }

  const film = filmData.film; // Assuming data is returned as an object

  return (
    <a
      href={`/film?film_id=${film.film_id}`} // Link to the film's page
      className="card bg-base-200 w-60 shadow-sm hover:bg-base-300 transition-colors duration-300"
    >
      <figure>
        <img
          src={`/film_posters/${film.film_id}.png`}
          alt={film.name}
          className="w-full h-auto"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{film.name}</h2>
        <p className="text-sm line-clamp-3">{film.description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">View details</button>
        </div>
      </div>
    </a>
  );
}