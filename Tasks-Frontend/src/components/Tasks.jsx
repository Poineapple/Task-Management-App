import React, {useState, useEffect, useRef} from 'react'
import "../styling.css"
import Popup from './Popup';
import MouseListener from './MouseListener';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const posRef = useRef(null);
  const [sortCriterion, setSortCriterion] = useState("id");

  // Sorting functions
  const sortByDate = (a, b) => {
    // Parse the due_date of both tasks to Date objects
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);

    // Compare the dates to sort in descending order
    return dateB - dateA;
  };
  const sortById = (a, b) => a.id - b.id; // Assuming tasks have an 'id' field

  // Function to get sorted tasks based on the current criterion
  const getSortedTasks = () => {
    const tasksCopy = [...tasks]; // Create a shallow copy to avoid mutating the original array
    
    switch (sortCriterion) {
      case "due_date":
        return tasksCopy.sort(sortByDate).slice().reverse();
      case "id":
        return tasksCopy.sort(sortById).slice().reverse();
      default:

        return tasksCopy.sort(sortById).slice().reverse(); // Default case sorts by latest added
    }
  };

  useEffect(() => {
    fetch("http://192.168.0.104:5000/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data); // Set the tasks state with the data fetched from the server
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [isPopupVisible]); // Updates the UI every time a popup is closed to display the updated tasks

  const [lastId, setLastId] = useState(0);
  useEffect(() => {
    if (tasks.length > 0) {
      setLastId(tasks.length);
    }
  }, [tasks]); // Updates the lastId state every time the tasks state (number of tasks) changes

  return (
    <div className="bg-black min-h-[100vh]  md:rounded-xl p-4 md:px-16 md:py-8">
      <div className="flex justify-between items-center ">
        <h2 className=" text-4xl md:text-6xl text-slate-100 heading md:p-8">
          Your Due Tasks
        </h2>
        <button
          className="btn btn-style  px-4 py-2 md:mr-16 
        rounded-lg hover:bg-black text-black hover:text-white"
          // Set the popup content to "Add" to display the form for adding a task
          onClick={() => {
            setPopupContent("Add");
            setIsPopupVisible(true);
          }}
          ref={posRef}
        >
          <MouseListener posRef={posRef} />
          Add Task
        </button>
      </div>
      <div className="">
        <select className='m-2'
          value={sortCriterion}
          onChange={(e) => setSortCriterion(e.target.value)}
        >
          <option value="id">Sort by latest added</option>
          <option value="due_date">Sort by earliest due date</option>
        </select>

        {getSortedTasks().map(
          (
            task // Map through the tasks array to display each task in a list
          ) => (
            <div
              className="task btn w-full bg-white hover:bg-black text-black hover:text-white rounded-lg my-4 p-4 
          flex justify-between
          transition duration-100 ease-in-out transform hover:-translate-y-2 hover:scale-101"
              key={task.id}
              onClick={() => {
                setPopupContent(task);
                setIsPopupVisible(true);
              }}
            >
              <div className="Title font-bold overflow-x-auto gap-2 max-w-[50%] md:max-w-[75%]">
                {task.title}
              </div>
              <div className="text-sm">
                <b>{"Due Date: "}</b>
                {task.due_date}
              </div>
            </div>
          )
        )}
      </div>
      {isPopupVisible && ( // Display a popup for detailed view or adding a task
        <Popup
          lastId={lastId}
          task={popupContent}
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </div>
  );
}

export default Tasks
