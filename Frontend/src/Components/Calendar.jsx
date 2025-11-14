import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventPopup from "./EventPopup";
import { CreateEvent, DeleteEvent, GetAllevents, UpdateEvent } from "../api/EventApi";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function MyCalendar() {
  const [events, setEvents] = useState([]); //stores all events shown on the calendar, Starts empty
  const [selectedDate, setSelectedDate] = useState(null); //stores the date when user clicks on a free slot
  const [isOpenEvent, setIsOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  /*Fetch events from backend*/
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await GetAllevents(); // fetch events from backend
        const formatted = data //Format events in a way the calendar understands
          .filter(ev => ev.StartDate && ev.EndDate) //Only take events that have a start and end date
          .map(ev => ({
            id: ev.Id,
            title: ev.Title || 'Untitled Event',
            Title: ev.Title || 'Untitled Event',
            description: ev.Description || '',
            Description: ev.Description || '',
            start: new Date(ev.StartDate),
            end: new Date(ev.EndDate),
            userId: ev.UserId,
            UserId: ev.UserId
          }));

        setEvents(formatted); //Saves formatted events into state
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };
    fetchEvents();
  }, []);

  // Open popup for editing
  const handleSelectEvent = (event) => {
    setSelectedEvent({ ...event });
    setSelectedDate(null);
    setIsOpenEvent(true);
  };

  // Open popup for creating new event
  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setSelectedEvent(null);
    setIsOpenEvent(true);
  };

  // Handle drag & drop
  const handleEventDrop = async ({ start, end, event }) => {
    // Create updated event preserving ALL original data
    const updatedEvent = {
      ...event, // Start with the complete original event
      start: new Date(start),
      end: new Date(end),
    };
    // Update local state immediately
    setEvents(prev =>
      prev.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev)
    );

    // send updated payload backend
    try {
      const payload = {
        Id: updatedEvent.Id,
        title: updatedEvent.title,
        Title: updatedEvent.Title,

        Description: updatedEvent.Description,
        StartDate: new Date(start).toISOString(),
        EndDate: new Date(end).toISOString(),
        UserId: updatedEvent.UserId,
      };


      const saved = await UpdateEvent(updatedEvent.id, payload);
      // Update local state only after backend success
      setEvents(prev => prev.map(ev => ev.id === saved.id ? saved : ev));
    } catch (error) {
      console.error("❌ Backend update failed:", error);
      console.error("Error details:", error.response?.data);

      // Keep the local update even if backend fails
      alert("Warning: Event updated locally but failed to save to server. Changes will persist in browser.");
    }
  };

  // Handle save from popup
  const handleSave = async (eventData) => { //eventData is the data coming from the popup

    const formattedEvent = {
      id: eventData.id || eventData.Id || Date.now(),
      title: eventData.title || eventData.Title || 'Untitled',
      description: eventData.Description || eventData.description || '',
      Description: eventData.Description || eventData.description || '',
      start: new Date(eventData.StartDate),
      end: new Date(eventData.EndDate),
      userId: eventData.UserId || eventData.userId,
      UserId: eventData.UserId || eventData.userId,
    };

    try {
      if (eventData.id || eventData.Id) {

        const payload = {
          Id: formattedEvent.id,
          Title: formattedEvent.title,
          Description: formattedEvent.Description,
          StartDate: formattedEvent.start.toISOString(),
          EndDate: formattedEvent.end.toISOString(),
          UserId: formattedEvent.UserId,
        };

        await UpdateEvent(formattedEvent.id, payload);
        //.map() goes through all events
        setEvents(prev => prev.map(ev => ev.id === formattedEvent.id ? formattedEvent : ev));
      } else {
        // Create new
        const payload = {
          Title: formattedEvent.title,
          Description: formattedEvent.Description,
          StartDate: formattedEvent.start.toISOString(),
          EndDate: formattedEvent.end.toISOString(),
          UserId: formattedEvent.UserId,
        };

        const response = await CreateEvent(payload);
        const newEvent = {
          ...formattedEvent,
          id: response.Id,
          Id: response.Id,
        };
        setEvents(prev => [...prev, newEvent]);
      }
    } catch (error) {
      console.error("❌ Save failed:", error);
      console.error("Error details:", error.response?.data);
      alert("Failed to save event to server. Please try again.");
    }
  };


  // delete event
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await DeleteEvent(eventId);
      setEvents(prev => prev.filter(ev => ev.id !== eventId))
    } catch (error) {
      console.error("Delete failed:", error);

    }
  }





  return (
    <div style={{ margin: "100px" }}>
      <DnDCalendar
        selectable
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onDelete={handleDeleteEvent}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventDrop}
        style={{ height: "77vh" }}
      />
      {isOpenEvent && (
        <EventPopup
          isOpen={isOpenEvent}
          onClose={() => setIsOpenEvent(false)}
          onSave={handleSave}
          date={selectedDate}
          onDelete={handleDeleteEvent} 
          event={selectedEvent}
        />
      )}
    </div>
  );
}