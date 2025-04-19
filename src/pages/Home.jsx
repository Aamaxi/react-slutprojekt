import Carousel from "../components/carousel/Carousel";
import CarouselLists from "../components/carousel/CarouselLists";

export default function Home() {
  return (
      <main className="flex flex-col max-w-screen-lg mx-auto px-4">
        <Carousel />
        <CarouselLists />
      </main>
  );
}