import { isLoggedIn } from "../../utils/authUtils";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function GiveRating() {
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [hasReview, setHasReview] = useState(false); // Track if the user has a review
  const [userReviewId, setUserReviewId] = useState(null); // Store the review ID of the user's review
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(""); // State for the success message
  const [showMessage, setShowMessage] = useState(false); // State to control message visibility

  const filmId = searchParams.get("film_id"); // Extract film_id from query string
  const token = localStorage.getItem("token");

  const fetchUserReview = async () => {
    try {
      const response = await fetch(`http://localhost:5000/film?film_id=${filmId}`);
      const data = await response.json();

      if (data.reviews) {
        const userId = JSON.parse(atob(token.split(".")[1])).id; // Decode user ID from JWT
        const userReview = data.reviews.find((review) => review.user_id === userId);

        if (userReview) {
          setHasReview(true);
          setUserReviewId(userReview.review_id);
        } else {
          setHasReview(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user review:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      fetchUserReview();
    }
  }, [filmId]);

  const handleSubmit = async () => {
    if (!header || !description || !rating) {
      setMessage("Please fill out all fields and select a rating.");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
      return;
    }

    const reviewData = {
      film_id: filmId,
      header,
      description,
      rating,
    };

    try {
      const response = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setMessage("Review submitted successfully!");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
        setHeader("");
        setDescription("");
        setRating(0);
        document.getElementById("my_modal_3").close(); // Close the modal
        fetchUserReview(); // Refresh the review state
      } else {
        setMessage("Failed to submit review.");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("An error occurred while submitting the review.");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
    }
  };

  const handleDeleteReview = async () => {
    try {
      const response = await fetch(`http://localhost:5000/reviews/${userReviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        setMessage("Review deleted successfully!");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
        setHasReview(false);
        setUserReviewId(null);
      } else {
        setMessage("Failed to delete review.");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setMessage("An error occurred while deleting the review.");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
    }
  };

  if (!isLoggedIn()) {
    return (
      <div className="tooltip tooltip-bottom flex justify-end" data-tip="You must be logged in">
        <button className="btn">Review film</button>
      </div>
    );
  }

  return (
    <div className="flex justify-end relative">
      {hasReview ? (
        <button className="btn" onClick={handleDeleteReview}>
          Delete Review
        </button>
      ) : (
        <button
          className="btn"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          Rate film
        </button>
      )}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Submit Your Review</h3>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Header</span>
            </label>
            <input
              type="text"
              placeholder="Enter a header for your review"
              className="input input-bordered w-full max-w-xs"
              value={header}
              onChange={(e) => setHeader(e.target.value)}
            />
          </div>
          <div className="form-control w-full max-w-xs mt-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              placeholder="Write your review here"
              className="textarea textarea-bordered w-full max-w-xs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="rating mt-4">
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              aria-label="1 star"
              onClick={() => setRating(1)}
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              aria-label="2 stars"
              onClick={() => setRating(2)}
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              aria-label="3 stars"
              onClick={() => setRating(3)}
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              aria-label="4 stars"
              onClick={() => setRating(4)}
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              aria-label="5 stars"
              onClick={() => setRating(5)}
            />
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit Review
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}