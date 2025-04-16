import CarouselItem from "./CarouselItem.jsx";

export default function Carousel() {
  return (
    <div>
      <h2 className="Carousel-header">From my watchlist</h2>
      <div className="carousel rounded-box">
        <div className="carousel-item">
          <CarouselItem filmId="1" />
        </div>
        <div className="carousel-item">
          <CarouselItem filmId="2" />
        </div>
        <div className="carousel-item">
          <CarouselItem filmId="1" />
        </div>
        <div className="carousel-item">
          <CarouselItem filmId="1" />
        </div>
        <div className="carousel-item">
          <CarouselItem filmId="1" />
        </div>
        <div className="carousel-item">
          <CarouselItem filmId="1" />
        </div>
        <div className="carousel-item">
          <CarouselItem filmId="1" />
        </div>
      </div>
    </div>
  );
}