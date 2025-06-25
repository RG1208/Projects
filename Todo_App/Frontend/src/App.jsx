import "./App.css";
import React, { useState } from "react";

function TodoList({ value, indexNumber, todlist, setTodolist }) {
  const [status, setStatus] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const deleteTodo = () => {
    const newList = todlist.filter((_, index) => index !== indexNumber);
    setTodolist(newList);
  };

  const checkStatus = () => {
    setStatus(!status);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editValue.trim() === "") return alert("Todo cannot be empty");
    if (todlist.includes(editValue) && editValue !== value) {
      return alert("Todo already exists!");
    }

    const newList = [...todlist];
    newList[indexNumber] = editValue;
    setTodolist(newList);
    setIsEditing(false);
  };

  return (
    <li className={status ? "completeTodo" : ""}>
      <span onClick={checkStatus}>{indexNumber + 1}. </span>

      {isEditing ? (
        <>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          {value}
          <button onClick={handleEdit} style={{ marginLeft: "10px" }}>
            Edit
          </button>
        </>
      )}

      <span
        onClick={deleteTodo}
        style={{ marginLeft: "10px", color: "red", cursor: "pointer" }}
      >
        &times;
      </span>
    </li>
  );
}

function App() {
  const [todolist, setTodolist] = useState([]);

  const submitTodo = (e) => {
    e.preventDefault();
    const toname = e.target.toname.value.trim();

    if (!toname) return;

    if (!todolist.includes(toname)) {
      setTodolist([...todolist, toname]);
    } else {
      alert("Todo already exists!");
    }

    e.target.toname.value = "";
  };

  return (
    <div className="app-wrapper">
      <h1>My Todo App</h1>
      <form onSubmit={submitTodo}>
        <input type="text" name="toname" />
        <button>Save</button>
      </form>
      <div className="outerdiv">
        <ul>
          {todolist.map((value, index) => (
            <TodoList
              key={index}
              value={value}
              indexNumber={index}
              todlist={todolist}
              setTodolist={setTodolist}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
