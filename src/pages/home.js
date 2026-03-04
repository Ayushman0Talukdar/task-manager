import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { IcOutlineLogOut } from "../icons/logoutBaseline";
import api from "../api/axios";
import { MdiPencil } from "../icons/pencilicon";
import { KiwiIcon } from "../icons/kiwiicon";
import { MaterialSymbolsDeleteRounded } from "../icons/deleteicons";
import { PieChart, Pie,Cell, Tooltip, DefaultLegendContent } from "recharts";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { MdiClipboardEditOutline } from "../icons/clipboardicon";
import { MdiProgressClock } from "../icons/clockicons";
import { IcBaselineViewSidebar } from "../icons/sidebaricon";
import { LsiconCheckCorrectFilled } from "../icons/tickicon";
// import nativeTooltip from "../components/nativeToolTip";


const Home = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium"); // Default state
    const [status, setStatus] = useState("todo");       // Default state
    const [date, setDate] = useState("");
    const [taskList, setTasklist] = useState([])
    const [StatsList, setStatslist] = useState([])
    const [FilterSelect, setFilterSelect] = useState("all")

    // Auth check

    const fetchTasks = async () => {
        try {
          const token = localStorage.getItem("token"); // or wherever you store it
    
          const res = await api.get("/tasks", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const stats = await api.get("/tasks/stats", {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

          
          setStatslist(stats.data)
          setTasklist(res.data)
        } catch (err) {
          alert(err.response?.data?.message || "Error fetching tasks");
        }
      };

    useEffect(() => {
        if (!localStorage.getItem("token")) navigate('/login');
    }, [navigate]);

    

    const logoutHandler = () => {
        localStorage.removeItem("token");
        navigate('/login');
    };

    const tasksInputHandler = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/tasks", {
                title,
                description,
                status,
                priority,
                dueDate: date, // 🔥 THIS IS THE KEY FIX
              });
              fetchTasks();
        } catch (err) {
            alert(err.response?.data?.message || "Error saving task, Please try again");
        }
    };
    
    useEffect(() => {
        fetchTasks();
      }, []);

      const handleComplete = async (id) => {
        try {
          const res = await api.put(`/tasks/${id}`, {
            status: "done",
          });
      
          // Update local state
          setTasklist((prevTasks) =>
            prevTasks.map((task) =>
              task._id === id ? res.data : task
            )
          );
          fetchTasks();
        } catch (err) {
          console.error(err);
        }
      };

      const handleDelete = async (id) => {
        try {
          const res = await api.delete(`/tasks/${id}`);
      
          // Update local state
          setTasklist((prevTasks) =>
            prevTasks.map((task) =>
              task._id === id ? res.data : task
            )
          );
          fetchTasks();
        } catch (err) {
          console.error(err);
        }
      };

      const data = [
        { name: "Todo", value: StatsList.todo },
        { name: "In Progress", value: StatsList.inProgress },
        { name: "Done", value: StatsList.done },
      ];
      
      const COLORS = ["#ef233c","#f18701", "#22c55e"];

      const isOverdue = (task) => {
        if (task.status === "done") return false;
      
        const today = new Date();
        const due = new Date(task.dueDate);
      
        // remove time from today
        today.setHours(0, 0, 0, 0);
      
        return due < today;
      };

      const handleFilter = (value) => {
        setFilterSelect(value)
      }

    return (
        <div className="Home">
            <div className="stats">
              <div className="leftSec">
              <div className="cards">
                <div className="card"><div className="cardTitle "><MdiClipboardEditOutline className="icons"/><div>Total:</div></div><div>{StatsList.total}</div></div>
                <div className="card"><div className="cardTitle"><MdiPencil className="icons" />To Do:</div><div>{StatsList.todo}</div></div>
                <div className="card"><div className="cardTitle"><MdiProgressClock className="icons" />In Progess:</div><div>{StatsList.inProgress}</div></div>
                <div className="card"><div className="cardTitle"><LsiconCheckCorrectFilled className="icons"/>Done:</div><div>{StatsList.done}</div></div>
              </div>
              <div className="filter roboto">
                <div>Filter :</div>
                <div className="filterBtnHolder">
                <button onClick={(e) => (handleFilter(e.target.value))} value={`todo`} className={`${FilterSelect == "todo" ? "activeFilterBtn" : ""}`}>To do</button>
                <button onClick={(e) => (handleFilter(e.target.value))} value={`progress`} className={`${FilterSelect == "progress" ? "activeFilterBtn" : ""}`}>In Progress</button>
                <button onClick={(e) => (handleFilter(e.target.value))} value={`done`} className={`${FilterSelect == "done" ? "activeFilterBtn" : ""}`}>Done</button>
                <button onClick={(e) => (handleFilter(e.target.value))} value={`all`} className={`${FilterSelect === "all" ? "activeFilterBtn" : ""}`}>All</button>
                </div>
              </div>
            </div>
            <div className="pieChart roboto">
            <PieChart width={200} height={200}>
            <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={30}      // donut look 🔥
                outerRadius={100}
                paddingAngle={10}
                stroke="none"      // spacing between slices
            >
                {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
                ))}
            </Pie>
            <Tooltip />
            
            </PieChart>
            <div className="ProgressBar" style={{width: 80 + "%"}}>
              <div className="completionPercent">{StatsList.completionPercent}% <div>Task completed</div></div>
            <div className="progress-container" style={{
              height: "5px",
              backgroundColor: "#eee", // Light grey for the empty background
              display: "flex",        // Aligns children side-by-side
              borderRadius: "5px",
              overflow: "hidden"      // Keeps the segments inside the rounded corners
            }}>
              <div style={{
                width: `${StatsList.completionPercent}%`,
                height: "100%",
                backgroundColor: "#22c55e",
                transition: "width 0.3s ease"
              }}></div>
            </div>
            </div>
            </div>
            </div>
            <div className="Details">
            <div className="inputCard roboto">
                <form className="formTasks" onSubmit={tasksInputHandler}>
                    <div className="inputTitle"><MdiPencil /> New task</div>
                    <div className="textarea">
                    <input placeholder="Title" onChange={e => setTitle(e.target.value)} required={true}/>
                    <input placeholder="Description" onChange={e => setDescription(e.target.value)} required={true} />
                    </div>
                    <div className="radiobtn">
                    <button 
                        type="button" 
                        className={`btn-high ${priority === 'high' ? 'active red' : ''}`} 
                        onClick={() => setPriority('high')}
                    >
                        High
                    </button>
                    <button 
                        type="button" 
                        className={`btn-medium ${priority === 'medium' ? 'active orange' : ''}`} 
                        onClick={() => setPriority('medium')}
                    >
                        Medium
                    </button>
                    <button 
                        type="button" 
                        className={`btn-low ${priority === 'low' ? 'active green' : ''}`} 
                        onClick={() => setPriority('low')}
                    >
                        Low
                    </button>
                </div>

                <div className="radiobtn">
                    <button 
                        type="button" 
                        className={`btn-todo ${status === 'todo' ? 'active red' : ''}`} 
                        onClick={() => setStatus('todo')}
                    >
                        To Do
                    </button>
                    <button 
                        type="button" 
                        className={`btn-progress ${status === 'progress' ? 'active orange' : ''}`} 
                        onClick={() => setStatus('progress')}
                    >
                        In Progress
                    </button>
                    <button 
                        type="button" 
                        className={`btn-done ${status === 'done' ? 'active green' : ''}`} 
                        onClick={() => setStatus('done')}
                    >
                        Done
                    </button>
                </div>

                    <input type="date" onChange={e => setDate(e.target.value)} required={true} />
                    <button type="submit" className="btnInput roboto">PIN UP!<KiwiIcon /></button>
                </form>
            </div>
            <div className="tasks roboto">
                        <div className="Label">
                        <div className="rowL">Title</div>
                        <div className="rowL">Desc</div>
                        <div className="rowL priority">Priority</div>
                        <div className="rowL">Status</div>
                        <div className="rowL">Due-Date</div>
                        <div className="rowL edit-btns">Edit</div>
                        </div>
                {taskList != [] ? taskList.map((task, index) => (
                    <div key={task.id || index} className={`${task._id} TaskTable ${FilterSelect == "all" ? "":  FilterSelect == task.status ? "" : "hide" }`}>
                        <div className={`${task.status === "done" ? 'done taskContainer' : 'activeTask taskContainer'} ${task.priority === "low" ? "lowPri" : task.priority === "medium" ? "midPri" : "highPri"}`}>
                        <div className="row"> {task.title}</div>
                        <div className="row desc"> {task.description}</div>
                        <div className="row priority"> {task.priority}</div>
                        <div className={`row ${isOverdue(task) ? "overdue" : ""}`}> {task.status}</div>
                        <div className={`row ${isOverdue(task) ? "overdue" : ""}`}> {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }).toLowerCase()}                        </div>
                        <div className="row edit-btns"> <button onClick={() => {handleComplete(task._id)}} className="ceditsBtn roboto" disabled={task.status === "done" ? true : false}>Done</button> 
                        <div className=""> <button onClick={() => {handleDelete(task._id)}} className="deditsBtn"><MaterialSymbolsDeleteRounded /></button></div>
                        </div>
                        </div>
                       
                    </div>
                )) : <div className="notasks">No tasks pinned yet!</div>}
            </div>
            </div>

            <button onClick={logoutHandler} className="btn"><IcOutlineLogOut /></button>
        </div>
    );
};

export default Home;
