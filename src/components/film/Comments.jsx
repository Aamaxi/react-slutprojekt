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

  const localDate = new Date(reviews.created_at).toLocaleDateString();


  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-2xl">Reviews</h2>
      {reviews && reviews.length > 0 ? (
        reviews
          .filter((review) => review.film_id === parseInt(filmId)) // Filter reviews by film_id
          .map((review) => {
            const localDate = new Date(review.created_at).toLocaleDateString(); // Extract only the date
            return (
              <div className="card card-border" key={review.review_id}>
                <div className="card-body">
                  <div className="gap-0">
                    <div className="flex flex-row place-content-between items-center">
                      <h3 className="card-title mr-auto">{review.header}</h3>
                      <p className="ml-auto flex-grow-0">Rating: {review.number_rating}/5</p>
                    </div>
                    <p>By: {getUsername(review.user_id)}</p>
                  </div>
                  <p>{review.description}</p>
                  <p>{localDate}</p> {/* Display only the date */}
                </div>
              </div>
            );
          })
      ) : (
        <p>No reviews available for this film.</p>
      )}
    </div>
  );  
}