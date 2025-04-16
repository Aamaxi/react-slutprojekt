import CarouselItem from "./CarouselItem.jsx";

export default function Carousel() {
  return (
    <div>
      <h2 className="Carousel-header text-4xl">From my watchlist</h2>
      <div className="carousel rounded-box gap-5 w-full">
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
    </div>
  );
}