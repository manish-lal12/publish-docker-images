import { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";

function App() {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    interest: "",
    image:
      "https://content-management-files.canva.com/cdn-cgi/image/f=auto,q=70/55b8da28-414c-47eb-b58f-5c055e77660c/magic-photo_resources_Freeonlineimageconverter_2x.png",
  });
  const [data, setData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setIsEdited(true);
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/createProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success: ", result);
        setData(result.profile);
        setDetails({ ...details, name: "", email: "", interest: "" });
        setIsSubmitted(true);
      } else {
        console.log("failed to submit the form", response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!isEdited) {
      return;
    }
    setDetails(data);
    try {
      if (isEdited) {
        const response = await fetch(
          `http://localhost:3000/updateProfile/${data._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(details),
          }
        );
        if (response.ok) {
          const result = await response.json();
          console.log("Success: ", result);
          setData(details);
          setIsSubmitted(true);
        } else {
          console.log("Failed to perform the operation", response.statusText);
        }
      }
    } catch (error) {
      console.log(error);
    }
    setDetails({ ...details, name: "", email: "", interest: "" });
    setIsEditing(false);
  };

  const handleDelete = async (e) => {
    try {
      const response = await fetch(
        `http://localhost:3000/deleteProfile/${data._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      console.log("Success: ", result);
      setData({});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <section className="form-container">
        <form>
          <img src={details.image} alt="Image" className="image" />
          <div>
            {/* Label attribute [id] */}
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="form-input"
              value={details.name}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              className="form-input"
              value={details.email}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div>
            <label htmlFor="interest">Interest</label>
            <input
              type="text"
              name="interest"
              placeholder="Enter your interest"
              className="form-input"
              value={details.interest}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <button
            type="submit"
            onClick={(e) => {
              isEditing ? handleEdit(e) : handleSubmit(e);
            }}
          >
            {isEditing ? `Save Changes` : `submit`}
          </button>
        </form>
        {isSubmitted && (
          <div className="user-container">
            <h3>Name: {data.name}</h3>
            <h3>Email: {data.email}</h3>
            <h3>Interest: {data.interest}</h3>
            <h3>
              <MdEdit
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  setIsEditing(true);
                  setDetails(data);
                }}
              />
            </h3>
            <h3>
              <MdDelete
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  handleDelete(e);
                }}
              />
            </h3>
          </div>
        )}
      </section>
    </main>
  );
}
export default App;
