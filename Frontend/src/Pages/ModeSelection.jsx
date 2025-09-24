import { useState } from "react";

export default function Home(){
    const [mode,setMode]=useState("Personal");

return(

    <select value={mode} onChange={e=>setMode(e.target.value)} >
        <option value="Personal">Personal mode</option>
        <option value="Team">Team mode </option>
    </select>
);
}