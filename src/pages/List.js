import '../App.css';
import ListItem from "../components/list/ListItem";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // To access URL query parameters

export default function List() {
  const [listData, setListData] = useState(null);
  const [listId, setListId] = useState(null);

  const location = useLocation(); // Get the location of the current URL

  // Function to extract the query parameter 'list_id' from the URL
  const getListIdFromQuery = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("list_id");
  };

  useEffect(() => {
    const listIdFromQuery = getListIdFromQuery(); // Extract list_id from the URL
    setListId(listIdFromQuery); // Set the state for list_id

    if (listIdFromQuery) {
      fetch(`http://localhost:5000/list?list_id=${listIdFromQuery}`)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          setListData(data); // Set list data from the backend
          console.log(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [location.search]); // Re-run when URL changes (list_id in the query string)

  if (!listData) {
    return <p>Loading...</p>; // Prevent rendering before data is fetched
  }

  // Extract the list and listFilms from the response
  const { list, listFilms } = listData;

  if (!list || list.length === 0) {
    return <p>No list found.</p>; // Handle case where list is empty
  }

  // Find the list object that matches the listId
  const currentList = list.find((item) => item.list_id === parseInt(listId));

  if (!currentList) {
    return <p>List not found.</p>; // Handle case where the list_id does not match any list
  }

  return (
    <div className="list-container">
      <img
        src={`/list_images/${currentList.list_id}.png`}
        alt="List image"
        className="img-list"
      />
      <h2>{currentList.name}</h2> {/* Access the matching list object */}
      <p>{currentList.description}</p>
      <div>
        <p>Sort by</p>
        <button>Rank by</button>
        <button></button>
      </div>
      <div>
        {/* Render the films in the list */}
        {listFilms.map((film) => (
          <ListItem key={film.film_id} film={film} />
        ))}
      </div>
    </div>
  );
}