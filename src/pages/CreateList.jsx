import { useState } from "react";

export default function CreateList() {
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!header || !description || !image) {
      alert("Please fill out all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("header", header);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:5000/create_list", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        alert("List created successfully!");
        setHeader("");
        setDescription("");
        setImage(null);
      } else {
        alert("Failed to create list.");
      }
    } catch (error) {
      console.error("Error creating list:", error);
      alert("An error occurred while creating the list.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-100">
      <form
        onSubmit={handleSubmit}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
      >
        <legend className="fieldset-legend">Create List</legend>

        <label className="label">Header</label>
        <input
          type="text"
          className="input"
          placeholder="My list"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
        />

        <label className="label">Description</label>
        <textarea
          className="textarea textarea-bordered"
          placeholder="Enter a description for your list"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <fieldset className="fieldset">
          <legend className="label">Image for the list</legend>
          <input
            type="file"
            className="file-input"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label className="label">Must be a png</label>
        </fieldset>

        <button type="submit" className="btn btn-neutral mt-4">
          Create list
        </button>
      </form>
    </div>
  );
}