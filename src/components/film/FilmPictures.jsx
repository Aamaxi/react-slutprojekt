import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function FilmPictures() {
  const [images, setImages] = useState([]);
  const location = useLocation();
  // Function to extract the `film_id` from the query parameters
  const getFilmIdFromQuery = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("film_id");
  };

  useEffect(() => {
    const filmId = getFilmIdFromQuery();
    if (filmId) {
      // Fetch the images for the given film_id
      fetch(`http://localhost:5000/film_images?film_id=${filmId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.images) {
            console.log(data)
            setImages(data.images); // Set the images in state
          }
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });
    }
  }, [location.search]);

  if (images.length === 0) {
    return <p>No images available for this film.</p>;
  }

  return (
    <div className="carousel w-full">
      {images.map((image, index) => (
        <div
          key={index}
          id={`slide${index + 1}`}
          className="carousel-item relative w-full"
        >
          <img src={image} alt={`Slide ${index + 1}`} className="w-full" />
          <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a
              href={`#slide${index === 0 ? images.length : index}`}
              className="btn btn-circle"
            >
              ❮
            </a>
            <a
              href={`#slide${(index + 2) > images.length ? 1 : index + 2}`}
              className="btn btn-circle"
            >
              ❯
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}