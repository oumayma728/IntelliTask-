import { useEffect, useState } from "react"

export default function Tasks(){
    const[data,setData]=useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [task , SetTasks] =useState([]);
    const [searchTerm , SetSearchTerm]= useState("");

    
    const filteredTasks = task.filter((task)=>{
        if(!searchTerm) return true;
        const searchLower=searchTerm.toLowerCase();
        return(task.name.toLowerCase().includes(searchLower))
    })
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/task');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      SetTasks(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData(); 
}, []);
    return(
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <h2 className="text-2xl p-8">Tasks</h2>
            <div className="w-full border-b border-gray-600  ">
                <div className="w-full border-b border-gray-600 mb-7 ">
                <button className="flex-1 hover:bg-gray-500 py-3 w-full">Table</button>
                <button className="flex-1 hover:bg-gray-500 py-3 w-full">Kanban </button>
</div>
            <div className="flex w-full gap-2">
                <button className="flex-1 bg-gray-700 hover:bg-gray-500 py-2 rounded">New Task</button>
                <button className="flex-1 bg-gray-700 hover:bg-gray-500 py-2 rounded">Search </button>
                <button className="flex-1 bg-gray-700 hover:bg-gray-500 py-2 rounded">Filter </button>
                <button className="flex-1 bg-gray-700 hover:bg-gray-500 py-2 rounded">Sort </button>


            </div>
            <table>
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">DueDate</th>
                  <th className="px-4 py-2 text-left">Project Name</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
            {filteredTasks.map((task, index) => (
              <tr key={index} className="border-b border-gray-600">
                <td className="px-4 py-2">{task.name}</td>
                <td className="px-4 py-2">{task.description}</td>
                <td className="px-4 py-2">{task.dueDate}</td>
                <td className="px-4 py-2">{task.projectName}</td>
                <td className="px-4 py-2">{task.status}</td>
              </tr>
            ))}
          </tbody>
            </table>
            </div>
        </div>
    )
}