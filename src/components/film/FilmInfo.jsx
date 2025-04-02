import FilmPictures from "./FilmPictures.jsx"

export default function FilmInfo() {
  return(
  <div className="film-container">
    <div className="film-top-container">
      <div>
        <h1>Night of the Living Dead</h1>
        <p>1968 • 1h 36m • 15y</p>
      </div>
      <div>
        <span>
          <img src="/icons/star.svg" alt="Star" />
          <p>9.2/10 (fix)</p>
        </span>
        <a>Give your rating</a>
      </div>
    </div>
    <FilmPictures />
    <div className="film-bottom-container">
      <img src="/film_posters/1.png" alt="Poster" className="film-poster-info" />
      <div>
        <p className="film-text">A ragtag group of Pennsylvanians barricade themselves in an old farmhouse to remain safe from a horde of flesh-eating ghouls that are ravaging the Northeast of the United States.</p>
        <div className="film-bottom-buttons-container rating-text">
          <button className="film-add-button">
            <img src="/icons/add.svg" alt="Add icon" className="button-add-icon" />
            <p>Add to button</p>
          </button>
          <span className="film-rating">
            <img src="/icons/metacritic.svg" alt="Metacritic logo" className="rating-icon" />
            <p>89</p>
          </span>
          <span className="film-rating">
            <img src="/icons/imdb.svg" alt="IMDb logo" className="rating-icon" />
            <p>7.8/10</p>
          </span>
        </div>
      </div>
    </div>
  </div>
  );
}