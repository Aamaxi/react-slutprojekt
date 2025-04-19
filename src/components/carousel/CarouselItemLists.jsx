import { useEffect, useState } from "react";

export default function CarouselItemLists({ listId }) {
  const [listData, setListData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/list?list_id=${listId}`)
      .then((response) => response.json())
      .then((data) => {
        setListData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching list data:", error);
      });
  }, [listId]);

  if (!listData) {
    return <p>Loading...</p>;
  }

  const list = listData.list[0]; // Assuming the API returns a `list` object

  console.log("lists", list.name)
  return (
    <a
      href={`/list?list_id=${list.list_id}`} // Link to the list's page
      className="card bg-base-200 w-60 shadow-sm hover:bg-base-300 transition-colors duration-300"
    >
      <figure>
        <img
          src={`/list_images/${list.list_id}.png`}
          alt={list.name}
          className="w-full h-55 object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{list.name}</h2>
        <p className="text-sm line-clamp-3">{list.description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">View details</button>
        </div>
      </div>
    </a>
  );
}