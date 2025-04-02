import CarouselItem from "./CarouselItem.jsx"

export default function Carousel() {
  return(
    <div>
      <h2 className="Carousel-header">From my watchlist</h2>
      <div className="Carousel-container">
        <CarouselItem />
        <CarouselItem />
        <CarouselItem />
        <CarouselItem />
        <CarouselItem />
        <CarouselItem />
        <CarouselItem /> 
      </div>
      
    </div>
  );
}