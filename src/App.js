import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

const App = () => {

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)

    const [task, setTask] = useState('');
    const [deadline, setDeadline] = useState(tomorrow);
    const [todoList, setTodoList] = useState([]);

    useEffect(() => {
        const storedTodoList = JSON.parse(localStorage.getItem('todoList')) || [];
        setTodoList(storedTodoList);

        const interval = setInterval(() => {
            handleDeleteExpiredTasks();
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        localStorage.setItem('todoList', JSON.stringify(todoList.map(todo => ({
            ...todo,
            deadline: todo.deadline instanceof Date ? todo.deadline.toISOString() : todo.deadline
        }))));
    }, [todoList]);

    const handleAddTask = () => {
        if (!task.trim() || !deadline) return;
        setTodoList([...todoList, { task, deadline }]);
        setTask('');
        setDeadline(null);
    };

    const handleDeleteTask = (index) => {
        const newTodoList = [...todoList];
        newTodoList.splice(index, 1);
        setTodoList(newTodoList);
    };

    const handleDeleteExpiredTasks = () => {
        const currentTime = new Date().toISOString();
        const newTodoList = todoList.filter(todo => (!todo.deadline || todo.deadline > currentTime));
        setTodoList(newTodoList);
    };

    return (
        <div className="app">
            <h1>Todo List</h1>
            <div className="task-input">
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Enter task..."
                />
                <DatePicker
                    selected={deadline}
                    onChange={(date) => setDeadline(date)}
                    placeholderText="Select deadline"
                    minDate={new Date()}
                />
                <button onClick={handleAddTask}>Add Task</button>
            </div>
            <div className="task-list">
                {todoList.map((todo, index) => (
                    <div className="task-item" key={index}>
                        <div>
                            <span>{todo.task}</span>
                            <span>{todo.deadline && ` - Deadline: ${new Date(todo.deadline).toDateString()}`}</span>
                        </div>
                        <button onClick={() => handleDeleteTask(index)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
