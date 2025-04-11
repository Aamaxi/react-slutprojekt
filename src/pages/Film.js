import FilmInfo from "../components/film/FilmInfo.jsx"
import Credits from "../components/film/Credits.jsx"
import Comment from "../components/film/Comment.jsx"

export default function Flim() {
  return(
    <div>
      <main>
        <FilmInfo />
        <Credits />
        <Comment />
      </main>
    </div>
  );
}