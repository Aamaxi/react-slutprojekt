import { isLoggedIn } from "../../utils/authUtils";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AddButton() {
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [lists, setLists] = useState(null);
  const [userLists, setUserLists] = useState(null);
  const [listFilms, setlistFilms] = useState(null);
  const [selectedLists, setSelectedLists] = useState([]); // Track selected list actions (add/delete)
  const [filmId, setFilmId] = useState(null); // Track the film_id from the query

  useEffect(() => {
    const token = localStorage.getItem("token");


    if (!token) {
      console.error("No token found");
      return;
    }

    // Extract film_id from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const filmIdFromQuery = urlParams.get("film_id");
    setFilmId(filmIdFromQuery);

    fetch("http://localhost:5000/addtolist", {
      method: "GET",
      headers: {
        Authorization: token, // DONT ADD BEARER, KEEP AS IS
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLists(data.lists); // Set the lists array
        setUserLists(data.userLists); // Set the userLists array
        setlistFilms(data.listFilms); // Set the listFilms array
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleButtonClick = () => {
    setShowCheckboxes(!showCheckboxes);
  };

  const handleCheckboxChange = (listId, isDelete) => {
    setSelectedLists((prevSelected) => {
      if (isDelete) {
        // If deleting, add { deleted: listId } to the selectedLists
        return [...prevSelected, { deleted: listId }];
      } else {
        // If adding, add { added: listId } to the selectedLists
        return [...prevSelected, { added: listId }];
      }
    });
  };

  const handleSubmit = () => {
    console.log("Selected Lists:", selectedLists); // Log the selected list actions
    setShowCheckboxes(false); // Hide the checkboxes after submission
    sendLists();
  };

  const sendLists = async () => {
    try {
      console.log()
      const response = await axios.post("http://localhost:5000/changelist", {
        selectedLists, 
        filmId,
      });
      console.log("Lists sent:", response.data);
    } catch (error) {
      console.log("Error sending lists:", error);
    }
  };

  if (!isLoggedIn()) {
    return <button>You must be logged in</button>;
  }

  return (
    <div>
      <button onClick={handleButtonClick}>
        {showCheckboxes ? "Hide Options" : "Add film to list"}
      </button>
      {showCheckboxes && (
        <div>
          {userLists &&
            userLists.map((userList) => {
              // Find the corresponding list in the `lists` array
              const list = lists?.find((listItem) => listItem.list_id === userList.list_id);
              if (!list) return null; // Skip if no matching list is found

              // Check if the current film_id is already in the list
              const isFilmInList = listFilms?.some(
                (listFilm) => listFilm.list_id === userList.list_id && listFilm.film_id === parseInt(filmId)
              );

              return (
                <label key={userList.list_id}>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(userList.list_id, isFilmInList)} // Handle checkbox toggle
                  />
                  {list.name} {/* Display the name of the list */}
                  {isFilmInList && <span style={{ color: "red", marginLeft: "10px" }}>Delete</span>}
                </label>
              );
            })}
          <br />
          <button onClick={handleSubmit}>Submit</button> {/* Submit button */}
        </div>
      )}
    </div>
  );
}