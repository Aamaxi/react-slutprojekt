import { useEffect, useState, useRef } from "react";
import CarouselItemLists from "./CarouselItemLists";
import { isLoggedIn } from "../../utils/authUtils";

export default function CarouselLists() {
  const [lists, setLists] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      console.error("User is not logged in.");
      return;
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/user_lists", {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLists(data.lists); // Assuming the API returns a `lists` array
      })
      .catch((error) => {
        console.error("Error fetching user lists:", error);
      });
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  if (lists.length === 0) {
    return <p>No lists available.</p>;
  }

  console.log("lkhsfd", lists)

  return (
    <div className="relative">
      <h2 className="text-4xl mb-4">My Lists</h2>
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 btn btn-circle"
        >
          ❮
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="carousel rounded-box gap-5 w-full overflow-x-scroll scroll-smooth"
        >
          {lists.map((list) => (
            <div key={list.list_id} className="carousel-item">
              <CarouselItemLists listId={list.list_id} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 btn btn-circle"
        >
          ❯
        </button>
      </div>
    </div>
  );
}