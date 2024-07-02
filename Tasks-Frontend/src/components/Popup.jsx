import React, { useRef, useEffect, useState } from "react";

//Reusable popup element used to display task details or add a new task
function Popup({ task, onClose, lastId }) {
  const popupRef = useRef();
  const [showEditPopup, setShowEditPopup] = useState(false);

  // Add event listener to close the popup when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if popup element is displayed AND if the click is outside of it
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        // Close the popup if conditions are met
        onClose();
      }
    }

    // Add click event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // If task is null, return null
  if (task === null) {
    return null;
  } else {
    return (
      // Popup container
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-b from-[rgb(0,0,0,0.2)] to-[rgb(0,0,0,0.8)]">
        {/* Popup content */}
        <div
          className="bg-white p-4 rounded-lg md:w-1/2 w-10/12 md:h-2/3 h-[60vh]"
          ref={task !== "Add" ? popupRef : null} // Set ref only if it's not an add task popup to prevent unintentional clicks closing the popup
        >
          {/* Check if it's 'detailed view' (description) popup or 'add task' popup */}
          {task !== "Add" ? (
            <Description
              task={task}
              close={onClose}
              lastId={lastId}
              showEditPopup={showEditPopup}
              setShowEditPopup={setShowEditPopup}
            />
          ) : (
            <AddTask 
            close={onClose} 
            lastId={lastId} />
          )}
        </div>
      </div>
    );
  }
}





// Description component to display task details
function Description({task, lastId, close, showEditPopup, setShowEditPopup}) {

  const deleteTask = async () => {
    try {
      const response = await fetch(`http://192.168.0.104:5000/tasks/${task.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete the task");
      }
      // Handle successful deletion here, e.g., redirect or update UI
      console.log("Task deleted successfully");
      close();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = async (event) => {
    // Implement edit task functionality here
    setShowEditPopup(true);

    event.preventDefault();
    // Get the values from the form inputs
    try {
      const response = await fetch(
        `http://192.168.0.104:5000/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: event.target.title.value,
            description: event.target.description.value,
            due_date: event.target.due_date.value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the task");
      }

      const data = await response.json();
      console.log("Task updated successfully:", data);
      close();

      // Optionally, update the UI or state here to reflect the changes
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className=" h-full flex flex-col">
      {!showEditPopup ? (
        <div>
          <p className="font-bold text-4xl m-2 md:m-4">{task.title}</p>
          <p className="text-base m-2 md:m-4">
            <b>Due by: </b>
            {task.due_date}
          </p>
          <p className="font-bold text-xl m-2 md:m-4">Description:</p>
          <p className="h-full overflow-y-auto text-base m-2 md:m-4 ">
            {task.description}
          </p>

          <div className="flex justify-center gap-8">
            <button
              className="w-[6rem] hover:bg-slate-200 hover:text-slate-800 px-4 py-2 
        rounded-lg bg-slate-800 text-slate-100"
              onClick={editTask}
            >
              Edit
            </button>

            <button
              className="w-[6rem] bg-slate-200 text-slate-800 px-4 py-2 
        rounded-lg hover:bg-slate-800 hover:text-slate-100"
              onClick={deleteTask}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <Form handleSubmit={editTask} close={close} title={task.title} 
        description={task.description} due_date={task.due_date}/>
      )}
    </div>
  );
}





// AddTask component to add a new task
function AddTask({ close, lastId }) {

  const handleSubmit = (event) => {
    event.preventDefault(); 
    // Get the values from the form inputs
    const id = lastId + 1;
    const title = event.target.title.value;
    const description = event.target.description.value;
    const due_date = event.target.due_date.value;

    const taskData = {
      id,
      title,
      description,
      due_date,
    };

    // Send the data to the server using HTTP POST method
    fetch("http://192.168.0.104:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        close();
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  };


  return (
    // Add Task form
    <Form handleSubmit={handleSubmit} close={close}/>
  );
}

function Form({handleSubmit, close, title, description, due_date}){
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-evenly gap-2 h-full"
    >
      <p className="font-bold text-2xl m-4">Add Task</p>

      <input
        type="text"
        name="title"
        defaultValue={title}
        required
        placeholder="Title"
        className="m-4 p-1 border-2 border-slate-400"
      />

      <textarea
        name="description"
        defaultValue={description}
        placeholder="Description (optional)"
        className="m-4 p-2 border-2 border-slate-400"
      />

      <div className="flex justify-left items-center gap-4 m-4">
        <label className="my-4"> Due Date: </label>
        <input
          type="date"
          defaultValue={due_date}
          name="due_date"
          required
          className=" p-2 border-2 border-slate-400"
        />
      </div>

      <div className="flex justify-center gap-8">
        <button
          className="w-[6rem] bg-slate-200 text-slate-800 px-4 py-2 
        rounded-lg hover:bg-slate-800 hover:text-slate-100"
          type="submit"
        >
          Save
        </button>

        <button
          className="w-[6rem] bg-slate-200 text-slate-800 px-4 py-2 
        rounded-lg hover:bg-slate-800 hover:text-slate-100"
          onClick={close}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}


export default Popup;
