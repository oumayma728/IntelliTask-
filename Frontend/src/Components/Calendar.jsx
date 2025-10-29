import {Calendar , momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import { useEffect, useState } from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css"
import withDrapAndDrop from "react-big-calendar/lib/addons/dragAndDrop"
import EventPopup from './EventPopup';
import { CreateEvent, GetAllevents } from '../api/EventApi';
const localizer =momentLocalizer(moment);
export default function MyCalendar(){

    const [events,setEvents]=useState([]); //events and function to update events
    const [selectedDate , setSelectedDate]=useState(null);//state for keeping track of the date the user clicked on
    const [isOpenEvent , setIsOpenEvent]=useState(false); //for popup 
    const [selectedEvent,setSelectedEvent] =useState(null);//Keeps track of which event the user clicked on
    const DnDCalendar = withDrapAndDrop(Calendar);
    
    useEffect(()=>{
        const fetchEvents = async ()=>{
            try {
                const data = await GetAllevents();
                console.log("fetched data",data)
                const formatted = data.map(ev=>({
                    ...ev,
                    id: ev.id,                 // must exist
    title: ev.Title,    
    StartDate: ev.StartDate ? new Date(ev.StartDate) : new Date(),
    EndDate: ev.EndDate ? new Date(ev.EndDate) : new Date(Date.now() + 60*60*1000)
                }));
                setEvents(formatted);
            }catch(error){
                console.log("error fetching events",error);
            }
        };
        fetchEvents();
    },[]);
    
    //opens popup for editing an existing event
    const handleSelectEvent =(event) =>{
        console.log(event); 
        setSelectedEvent(event);//store clicked event
        setSelectedDate(null); 
        setIsOpenEvent(true);

    }
    //pens popup for creating a new event
    const handleSelectSlot =(slotInfo) =>{
        console.log(slotInfo);
        setSelectedDate(slotInfo.start);
        setSelectedEvent(null);
        setIsOpenEvent(true);

    }
    const handleEventDrop =({StartDate,event,EndDate})=>{
        console.log('handleEventDrop',StartDate,'',event,'',EndDate)
        //Creates a new event object called updatedEvent.
        //Uses the spread operator ...event to copy all existing properties of the original event.
        const updatedEvent={...event, StartDate,EndDate};
        //updates the events state in ur calendar
        setEvents((prev)=>
            prev.map((ev)=>(ev.id === event.id ?updatedEvent:ev))
        )
    }
    const handleSave = (eventData) => {
        if(eventData.id){
            //prev is just a name for the previous state (before updating)
            setEvents((prev)=>
            prev.map((ev)=>(ev.id=== eventData.id ? eventData : ev))
            )
        }
        else {
            const newEvent ={
                ...eventData,
                id: events.length + 1
            };
            setEvents((prev)=>[...prev,newEvent])
        }
    }
    return(
    <div style={{marginLeft:"100px", marginRight:'100px', marginTop:'100px',text:"white"}}>
        
        <DnDCalendar
        selectable //Makes the calendar clickable.
        localizer={localizer}
        events={events}
        startAccessor="StartDate"
        endAccessor="EndDate"
        onSelectSlot={handleSelectSlot}   // clicking empty space → create new event
        onSelectEvent={handleSelectEvent} // clicking existing event → view/edit
        onEventDrop={handleEventDrop}
  style={{height:'77vh'}}
        >

        </DnDCalendar>
        {isOpenEvent && (
        <EventPopup
        isOpen={isOpenEvent}
        onClose={()=>setIsOpenEvent(false)}
        onSave={handleSave}
        date={selectedEvent}
        event={selectedEvent}
        >

        </EventPopup>
    )}
    </div>
    
    ) 
}