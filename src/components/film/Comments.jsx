import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom"; // To access URL query parameters

export default function Comments() {
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

  const { reviews, users } = filmData; // Destructure reviews and users from filmData

  // Function to get the username for a given user_id
  const getUsername = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    return user ? user.username : "Unknown User";
  };

  return (
    <div className="comments-container">
      <h2>Reviews</h2>
      {reviews && reviews.length > 0 ? (
        reviews
          .filter((review) => review.film_id === parseInt(filmId)) // Filter reviews by film_id
          .map((review) => (
            <div key={review.review_id} className="comment-box">
              <h3>{review.header}</h3>
              <p><strong>Rating:</strong> {review.number_rating}/10</p>
              <p>{review.description}</p>
              <p><strong>By:</strong> {getUsername(review.user_id)}</p>
              <p>{review.created_at}</p>
            </div>
          ))
      ) : (
        <p>No reviews available for this film.</p>
      )}
    </div>
  );
}