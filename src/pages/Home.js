import '../App.css';
import Carousel from "../components/Carousel.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  return (
    <div className="App">
      <main>
        <Carousel />
        <Carousel />
      </main>
      <Footer />
    </div>
  );
}