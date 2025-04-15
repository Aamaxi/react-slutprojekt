import FilmInfo from "../components/film/FilmInfo"
import Credits from "../components/film/Credits"
import Comments from "../components/film/Comments"

export default function Flim() {
  return(
    <div>
      <main>
        <FilmInfo />
        <Credits />
        <Comments />
      </main>
    </div>
  );
}