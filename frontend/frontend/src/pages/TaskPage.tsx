import { useEffect, useState } from "react";
import API from "../services/api";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

const TaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    console.log("Token in storage:", token); // ✅ See if token exists
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("❌ Fetch failed:", err);
    }
  };

  const addTask = async () => {
    await API.post("/tasks", { title: newTask });
    setNewTask("");
    fetchTasks();
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await API.put(`/tasks/${id}`, { completed: !completed });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>My Tasks</h2>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New Task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => toggleComplete(task._id, task.completed)}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task._id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskPage;
