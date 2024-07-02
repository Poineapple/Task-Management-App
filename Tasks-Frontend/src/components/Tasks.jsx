import React, {useState, useEffect} from 'react'
import "../styling.css"
import Popup from './Popup';
function Tasks() {

  const [tasks, setTasks] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
 

  useEffect(() => {
    // Replace '{URL}/tasks' with your Flask API URL if different
    fetch("http://192.168.0.104:5000/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data); // Assuming the API returns an array of tasks
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []); // The empty array ensures this effect runs only once after initial render

  const [lastId, setLastId] = useState(0);
  useEffect(() => {
    if (tasks.length > 0) {
      setLastId(tasks.length);
    }
  }, [tasks]);

  console.log('last '+ lastId);

  return (
    <div className="bg-slate-500 p-4">
      <div className="flex justify-between items-center">
        <h2 className=" text-4xl text-slate-100">Your Due Tasks</h2>
        <button className="bg-slate-100 text-slate-500 px-4 py-2 
        rounded-lg hover:bg-slate-800 hover:text-slate-100" 
        onClick={() => {setPopupContent("Add"); setIsPopupVisible(true)}}>Add Task</button>
      </div>
      <div className="">
        {tasks.map((task) => (
          <div
            className="task w-full bg-white rounded-lg my-4 p-4 
          flex justify-between hover:bg-gradient-to-r from-slate-100 to-slate-400 
          transition duration-100 ease-in-out transform hover:-translate-y-2 hover:scale-101"
            key={task.id}
            onClick={() => {
              setPopupContent(task);
              setIsPopupVisible(true);
            }}
          >
            <div className="Title font-bold">
              {/* <b>{"Title: "}</b> */}
              {task.title}
            </div>
            <div className="text-sm">
              <b>{"Due Date: "}</b>
              {task.due_date}
            </div>
          </div>
        ))}
      </div>
      {isPopupVisible && (
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
