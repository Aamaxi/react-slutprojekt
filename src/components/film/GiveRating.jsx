import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function GiveRating() {
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [searchParams] = useSearchParams();

  const filmId = searchParams.get("film_id"); // Extract film_id from query string
  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    if (!header || !description || !rating) {
      alert("Please fill out all fields and select a rating.");
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
        alert("Review submitted successfully!");
        setHeader("");
        setDescription("");
        setRating(0);
        document.getElementById("my_modal_3").close(); // Close the modal
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting the review.");
    }
  };

  return (
    <div>
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
        Give your rating
      </button>
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