import FilmInfo from "../components/film/FilmInfo";
import Credits from "../components/film/Credits";
import Comments from "../components/film/Comments";
import Footer from "../components/Footer";

export default function Film() {
  return (
      <main className="flex flex-col items-center max-w-screen-lg mx-auto px-4">
        <FilmInfo />
        <Credits />
        <Comments />
      </main>
  );
}