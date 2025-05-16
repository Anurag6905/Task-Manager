import { useState, useEffect } from 'react';

type TaskType = { id: number; text: string; completed: boolean };

const Task = () => {
  const [taskText, setTaskText] = useState("");
  const [editText, setEditText] = useState("");
  const [taskList, setTaskList] = useState<TaskType[]>(() => {
    try {
      const saved = localStorage.getItem("my_tasks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("dark_mode") === "true");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("my_tasks", JSON.stringify(taskList));
  }, [taskList]);

  useEffect(() => {
    localStorage.setItem("dark_mode", String(darkMode));
  }, [darkMode]);

  const handleAddTask = () => {
    if (!taskText.trim()) return;
    const newTask: TaskType = { id: Date.now(), text: taskText, completed: false };
    setTaskList([...taskList, newTask]);
    setTaskText("");
  };

  //this is a comment

  const handleEditTask = (id: number) => {
    const task = taskList.find(t => t.id === id);
    if (task) {
      setEditingId(id);
      setEditText(task.text);
    }
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    setTaskList(taskList.map(t => t.id === editingId ? { ...t, text: editText } : t));
    setEditingId(null);
    setEditText("");
  };

  const styles = {

    page: {
      backgroundColor: darkMode ? "#121212" : "#f2f6ff",
      color: darkMode ? "#f9f9f9" : "#1a1a1a",
      minHeight: "100vh",
      padding: "2rem",
      transition: "0.3s"
    },

    card: {
      maxWidth: "600px",
      margin: "auto",
      padding: "2rem",
      background: darkMode ? "#1f1f1f" : "#fff",
      borderRadius: "16px",
      boxShadow: darkMode ? "0 0 10px rgba(255,255,255,0.05)" : "0 4px 20px rgba(0,0,0,0.1)"
    },

    input: {
      flex: 1,
      padding: "12px",
      borderRadius: "10px",
      border: darkMode ? "1px solid #444" : "1px solid #ccc",
      background: darkMode ? "#2a2a2a" : "#f9f9f9",
      color: darkMode ? "#fff" : "#000"
    },

    btn: (bg = "#007bff") => ({
      padding: "12px 16px",
      backgroundColor: bg,
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      fontWeight: 700,
      cursor: "pointer"
    }),

    taskItem: {
      background: darkMode ? "#2a2a2a" : "#eef3ff",
      padding: "12px 16px",
      borderRadius: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px"
    }
    
  };

  return (
    <div style={styles.page}>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <label style={{ fontWeight: 700 }}>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            style={{ marginRight: "8px" }}
          />
          Toggle Dark Mode
        </label>
      </div>

      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" , fontWeight: "800" }}>📝 Task Manager</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
          <input
            style={styles.input}
            placeholder="Enter a task..."
            value={taskText}
            onChange={e => setTaskText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddTask()}
          />
          <button style={styles.btn()} onClick={handleAddTask}>Add</button>
        </div>

        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {taskList.map(task => (
            <li key={task.id} style={styles.taskItem}>
              {editingId === task.id ? (
                <>
                  <input
                    style={{ ...styles.input, marginRight: "8px" }}
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSaveEdit()}
                  />
                  <button style={styles.btn("#28a745")} onClick={handleSaveEdit}>Save</button>
                </>
              ) : (
                <>
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#888" : (darkMode ? "#fff" : "#000"),
                      cursor: "pointer"
                    }}
                    onClick={() => setTaskList(taskList.map(t =>
                      t.id === task.id ? { ...t, completed: !t.completed } : t))}
                  >
                    {task.text}
                  </span>
                  <div>
                    <button
                      onClick={() => handleEditTask(task.id)}
                      style={{ ...styles.btn("#17a2b8"), marginRight: "8px" }}
                    >Edit</button>
                    <button
                      onClick={() => setTaskList(taskList.filter(t => t.id !== task.id))}
                      style={styles.btn("#dc3545")}
                    >Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {taskList.length > 0 && (
          <button
            onClick={() => { setTaskList([]); localStorage.removeItem("my_tasks"); }}
            style={{ ...styles.btn("#dc3545"), marginTop: "1rem" }}
          >
            Clear All Tasks
          </button>
        )}
      </div>
    </div>
  );
};

export default Task;

