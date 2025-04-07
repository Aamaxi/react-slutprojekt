import { useEffect, useState } from "react";

export default function CarouselItem() {
  const [filmData, setFilmData] = useState(null);
  const filmId = 1; // You can change this to any specific film ID

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

  const film = filmData[0]; // Assuming data is returned as an array

  return (
    <div className="Carousel-item-container">
      <img src={`/film_posters/${film.film_id}.png`} alt={film.title} className="Carousel-item-img" />
      
      <span className="Carousel-item-span-container"> 
        <img src="/icons/star.svg" alt="Star" />
        <p>{film.rating}/10</p>
      </span>
      <p>{film.name}</p>
    </div>
  );
}
