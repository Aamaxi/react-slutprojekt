export default function CarouselItem() {
  return(
    <div className="Carousel-item-container">
      <img src="/film_posters/1.png" alt="" className="Carousel-item-img" />
      
      <span className="Carousel-item-span-container"> 
        <img src="/icons/star.svg" alt="Star" />
        <p>9.2/10 (fix)</p>
      </span>
      <p>Night of the Living Dead (fix)</p>
    </div>
  );
}