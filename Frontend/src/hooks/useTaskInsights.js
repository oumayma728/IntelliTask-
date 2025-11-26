import { useState , useEffect } from "react";
import {GetSummary , GetUpcomingTasks , Productivity} from "../api/TaskApi";

export default function useTaskIansights() {
    const [summary, setSummary] = useState(null);
    const [upcoming,setUpcoming] = useState([]);
    const [productivity, setProductivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchInsights = async () => {
            setLoading(true);
            try{
                const summaryData = await GetSummary();
                const upcomingData = await GetUpcomingTasks();
                const productivity= await Productivity();

                setSummary(summaryData);
                setUpcoming(upcomingData);
                setProductivity(productivity);
            }catch(err)
            {
                setError(err);
            }finally{
                setLoading(false);
            }
    };
    fetchInsights();
    }   ,[]);

    return {summary, upcoming, productivity, loading, error};
}