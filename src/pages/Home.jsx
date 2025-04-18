import Carousel from "../components/carousel/Carousel";
import CarouselLists from "../components/carousel/CarouselLists";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col max-w-screen-lg mx-auto px-4">
        <Carousel />
        <CarouselLists />
      </main>
      <Footer />
    </div>
  );
}