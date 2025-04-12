import FilmInfo from "../components/film/FilmInfo.jsx"
import Credits from "../components/film/Credits.jsx"
import Comments from "../components/film/Comments.jsx"
import SearchBar from "../components/navbar/SearchBar.jsx"

export default function Flim() {
  return(
    <div>
      <main>
        <FilmInfo />
        <Credits />
        <Comments />
        <SearchBar />
      </main>
    </div>
  );
}