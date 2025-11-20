import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventPopup from "./EventPopup";
import { CreateEvent, DeleteEvent, GetAllevents, UpdateEvent, GetGoogleEvents } from "../api/EventApi";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpenEvent, setIsOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch DB events on mount
useEffect(() => {
  const fetchAllEvents = async () => {
    try {
      // 1️⃣ Fetch DB events
      const dbEvents = await GetAllevents();
      const formattedDbEvents = dbEvents
        .filter(ev => ev.StartDate && ev.EndDate)
        .map(ev => ({
          id: ev.Id,
          title: ev.Title || 'Untitled Event',
          description: ev.Description || '',
          start: new Date(ev.StartDate),
          end: new Date(ev.EndDate),
          userId: ev.UserId,
          isGoogleEvent: false,
        }));

      // 2️⃣ Fetch Google events
      const googleEvents = await GetGoogleEvents();
      const formattedGoogleEvents = googleEvents
        .filter(ev => ev.StartDate && ev.EndDate)
        .map((ev, index) => ({
          id: `google-${ev.Title}-${index}`,
          title: ev.Title || 'Untitled Google Event',
          description: ev.Description || '',
          start: new Date(ev.StartDate),
          end: new Date(ev.EndDate),
          userId: null,
          isGoogleEvent: true,
        }));

      // 3️⃣ Merge and set state
      setEvents([...formattedDbEvents, ...formattedGoogleEvents]);
      console.log("✅ Loaded DB + Google events");
    } catch (error) {
      console.error("Error fetching events", error);
      alert("Failed to fetch events from server or Google Calendar.");
    }
  };

  fetchAllEvents();
}, []);


  // Fetch Google events and merge
  const fetchGoogleEvents = async () => {
    try {
      const googleEvents = await GetGoogleEvents();
      
      const formattedGoogleEvents = googleEvents
        .filter(ev => ev.StartDate && ev.EndDate) // ✅ Filter out invalid events
        .map((ev, index) => ({
          id: `google-${ev.Title}-${index}`, // ✅ Unique ID for Google events
          title: ev.Title || 'Untitled Google Event',
          description: ev.Description || '',
          start: new Date(ev.StartDate), // ✅ Fixed property name
          end: new Date(ev.EndDate),     // ✅ Fixed property name
          userId: null,
          isGoogleEvent: true, // ✅ Mark as Google event
        }));

      // Merge without duplicating
      setEvents(prev => [
        ...prev.filter(e => !e.isGoogleEvent), // Keep only DB events
        ...formattedGoogleEvents                // Add Google events
      ]);
      
      console.log(`✅ Loaded ${formattedGoogleEvents.length} Google Calendar events`);
    } catch (error) {
      console.error("Error fetching Google events", error);
      alert("Failed to connect to Google Calendar. Please try again.");
    }
  };

  // Open popup for editing
  const handleSelectEvent = (event) => {
    if (event.isGoogleEvent) {
      alert("Google Calendar events are read-only");
      return;
    }
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
    if (event.isGoogleEvent) {
      alert("Cannot move Google Calendar events");
      return;
    }

    const updatedEvent = { 
      ...event, 
      start: new Date(start), 
      end: new Date(end) 
    };
    
    // Optimistic update
    setEvents(prev => prev.map(ev => 
      ev.id === updatedEvent.id ? updatedEvent : ev
    ));

    try {
      const payload = {
        Id: updatedEvent.id,
        Title: updatedEvent.title,
        Description: updatedEvent.description,
        StartDate: updatedEvent.start.toISOString(),
        EndDate: updatedEvent.end.toISOString(),
        UserId: updatedEvent.userId,
      };
      
      await UpdateEvent(updatedEvent.id, payload);
      console.log("✅ Event updated successfully");
    } catch (error) {
      console.error("❌ Backend update failed:", error);
      alert("Event updated locally but failed to save to server.");
      // Revert on failure
      setEvents(prev => prev.map(ev => 
        ev.id === event.id ? event : ev
      ));
    }
  };

  // Handle save from popup
  const handleSave = async (eventData) => {
    try {
      if (eventData.id) {
        // Update existing event
        const payload = {
          Id: eventData.id,
          Title: eventData.title || eventData.Title,
          Description: eventData.description || eventData.Description || '',
          StartDate: new Date(eventData.StartDate).toISOString(),
          EndDate: new Date(eventData.EndDate).toISOString(),
          UserId: eventData.userId || eventData.UserId,
        };
        
        await UpdateEvent(eventData.id, payload);
        
        const updatedEvent = {
          id: eventData.id,
          title: payload.Title,
          description: payload.Description,
          start: new Date(payload.StartDate),
          end: new Date(payload.EndDate),
          userId: payload.UserId,
          isGoogleEvent: false,
        };
        
        setEvents(prev => prev.map(ev => 
          ev.id === updatedEvent.id ? updatedEvent : ev
        ));
        
        console.log("✅ Event updated");
      } else {
        // Create new event
        const payload = {
          Title: eventData.title || eventData.Title || 'Untitled',
          Description: eventData.description || eventData.Description || '',
          StartDate: new Date(eventData.StartDate).toISOString(),
          EndDate: new Date(eventData.EndDate).toISOString(),
        };
        
        const response = await CreateEvent(payload);
        
        const newEvent = {
          id: response.Id,
          title: response.Title,
          description: response.Description,
          start: new Date(response.StartDate),
          end: new Date(response.EndDate),
          userId: response.UserId,
          isGoogleEvent: false,
        };
        
        setEvents(prev => [...prev, newEvent]);
        console.log("✅ Event created");
      }
      
      setIsOpenEvent(false);
    } catch (error) {
      console.error("❌ Save failed:", error);
      alert("Failed to save event. Please try again.");
    }
  };

  // Delete event
  const handleDeleteEvent = async (eventId) => {
    const eventToDelete = events.find(ev => ev.id === eventId);
    
    if (eventToDelete?.isGoogleEvent) {
      alert("Cannot delete Google Calendar events from here");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await DeleteEvent(eventId);
      setEvents(prev => prev.filter(ev => ev.id !== eventId));
      setIsOpenEvent(false);
      console.log("✅ Event deleted");
    } catch (error) {
      console.error("❌ Delete failed:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  return (
    <div style={{ margin: "100px" }}>
      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            Local Events
          </span>
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            Google Events (Read-only)
          </span>
        </div>
      </div>
      
      <DnDCalendar
        selectable
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventDrop}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.isGoogleEvent ? "#34a853" : "#3174ad",
            color: "white",
            cursor: event.isGoogleEvent ? "default" : "pointer",
          }
        })}
        draggableAccessor={event => !event.isGoogleEvent} // ✅ Only local events draggable
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