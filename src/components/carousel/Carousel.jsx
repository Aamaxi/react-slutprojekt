import CarouselItem from "./CarouselItem.jsx";
import { useRef } from "react";

export default function Carousel() {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -300, // Adjust scroll distance as needed
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 300, // Adjust scroll distance as needed
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      <h2 className="Carousel-header text-4xl mb-4">Featured films</h2>
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 z-10 btn btn-circle"
        >
          ❮
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="carousel rounded-box gap-5 w-full overflow-x-scroll scroll-smooth"
        >
          <div className="carousel-item">
            <CarouselItem filmId="1" />
          </div>
          <div className="carousel-item">
            <CarouselItem filmId="2" />
          </div>
          <div className="carousel-item">
            <CarouselItem filmId="3" />
          </div>
          <div className="carousel-item">
            <CarouselItem filmId="4" />
          </div>
          <div className="carousel-item">
            <CarouselItem filmId="5" />
          </div>
          <div className="carousel-item">
            <CarouselItem filmId="6" />
          </div>
          <div className="carousel-item">
            <CarouselItem filmId="7" />
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 z-10 btn btn-circle"
        >
          ❯
        </button>
      </div>
    </div>
  );
}