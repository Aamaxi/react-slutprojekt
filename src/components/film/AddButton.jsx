import { isLoggedIn } from "../../utils/authUtils";
import { useEffect, useState } from "react";

export default function AddButton() {
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [lists, setLists] = useState(null);
  const [userLists, setUserLists] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found")
      return;
    }
    
    fetch("http://localhost:5000/addtolist", {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setLists(data.lists);
        setUserLists(data.userLists);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
      });
  }, []);

  console.log("sdfsdf", lists)
  console.log("khbjshrtoiwgoi hsodi", userLists)


  const handleButtonClick = () => {
    setShowCheckboxes(!showCheckboxes);
  }
  

  
  if (!isLoggedIn()) {
    return(
      <button>You must be logged in</button>
    );
  }
  
  return (
    <div>
      <button onClick={handleButtonClick}>
        {showCheckboxes ? "Hide Options" : "Add film to list"}
      </button>
      {showCheckboxes && (
        <div>
          <label>
            <input type="checkbox" name="option1" />
            Option 1
          </label>
          <br />
          <label>
            <input type="checkbox" name="option2" />
            Option 2
          </label>
          <br />
          <label>
            <input type="checkbox" name="option3" />
            Option 3
          </label>
          <br />
          <input type="submit" value="Submit"></input>
        </div>
      )}
    </div>
  );
}

/*


*/