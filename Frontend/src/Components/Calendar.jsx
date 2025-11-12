import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"; 
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventPopup from "./EventPopup";
import { CreateEvent, GetAllevents, UpdateEvent } from "../api/EventApi";

const localizer = momentLocalizer(moment);
const STORAGE_KEY = 'calendar_events_backup';

export default function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpenEvent, setIsOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const DnDCalendar = withDragAndDrop(Calendar);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      console.log("Events saved to localStorage:", events.length);
    }
  }, [events]);

  /*Fetch events from backend*/
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await GetAllevents();
        console.log("Raw data from API:", data);
        
        const formatted = data
          .filter(ev => ev.StartDate && ev.EndDate) // Only include valid events
          .map(ev => ({
            id: ev.Id,
            Id: ev.Id,
            title: ev.Title || 'Untitled Event',
            Title: ev.Title || 'Untitled Event',
            description: ev.Description || '',
            Description: ev.Description || '',
            start: new Date(ev.StartDate),
            end: new Date(ev.EndDate),
            userId: ev.UserId,
            UserId: ev.UserId
          }));
        
        console.log("Formatted events:", formatted);
        setEvents(formatted);
      } catch (error) {
        console.error("Error fetching events", error);
        
        // Fallback to localStorage if API fails
        const backup = localStorage.getItem(STORAGE_KEY);
        if (backup) {
          const parsed = JSON.parse(backup);
          const restoredEvents = parsed.map(ev => ({
            ...ev,
            start: new Date(ev.start),
            end: new Date(ev.end)
          }));
          setEvents(restoredEvents);
          console.log("Restored events from localStorage");
        }
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
    console.log("=== DRAG AND DROP ===");
    console.log("Event being dragged:", event);

    // Find the original event in state to get all properties
    const originalEvent = events.find(e => e.id === event.id || e.Id === event.id);
    console.log("Original event from state:", originalEvent);

    if (!originalEvent) {
      console.error("Could not find original event!");
      return;
    }

    // Create updated event preserving ALL original data
    const updatedEvent = {
      ...originalEvent, // Start with the complete original event
      start: new Date(start),
      end: new Date(end),
    };

    console.log("Updated event:", updatedEvent);

    // Update local state immediately
    setEvents(prev => 
      prev.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev)
    );

    // Update backend
    try {
      const payload = {
        Id: updatedEvent.Id,
        Title: updatedEvent.Title,
        Description: updatedEvent.Description,
        StartDate: new Date(start).toISOString(),
        EndDate: new Date(end).toISOString(),
        UserId: updatedEvent.UserId,
      };

      console.log("Sending payload to backend:", payload);
      
      const response = await UpdateEvent(updatedEvent.id, payload);
      console.log("Backend update response:", response);
      console.log("✅ Event updated successfully");
    } catch (error) {
      console.error("❌ Backend update failed:", error);
      console.error("Error details:", error.response?.data);
      
      // Keep the local update even if backend fails
      alert("Warning: Event updated locally but failed to save to server. Changes will persist in browser.");
    }
  };

  // Handle save from popup
  const handleSave = async (eventData) => {
    console.log("=== SAVE EVENT ===");
    console.log("Event data from popup:", eventData);

    const formattedEvent = {
      id: eventData.id || eventData.Id || Date.now(),
      Id: eventData.id || eventData.Id || Date.now(),
      title: eventData.Title || eventData.title || 'Untitled',
      Title: eventData.Title || eventData.title || 'Untitled',
      description: eventData.Description || eventData.description || '',
      Description: eventData.Description || eventData.description || '',
      start: new Date(eventData.StartDate),
      end: new Date(eventData.EndDate),
      userId: eventData.UserId || eventData.userId,
      UserId: eventData.UserId || eventData.userId,
    };

    try {
      if (eventData.id || eventData.Id) {
        // Update existing
        console.log("Updating existing event...");
        
        const payload = {
          Id: formattedEvent.Id,
          Title: formattedEvent.Title,
          Description: formattedEvent.Description,
          StartDate: formattedEvent.start.toISOString(),
          EndDate: formattedEvent.end.toISOString(),
          UserId: formattedEvent.UserId,
        };

        await UpdateEvent(formattedEvent.id, payload);
        setEvents(prev => prev.map(ev => ev.id === formattedEvent.id ? formattedEvent : ev));
        console.log("✅ Event updated");
      } else {
        // Create new
        console.log("Creating new event...");
        
        const payload = {
          Title: formattedEvent.Title,
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
        console.log("✅ Event created");
      }
    } catch (error) {
      console.error("❌ Save failed:", error);
      console.error("Error details:", error.response?.data);
      alert("Failed to save event to server. Please try again.");
    }
  };

  return (
    <div style={{ margin: "100px", color: "white" }}>
      <DnDCalendar
        selectable
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
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
          event={selectedEvent}
        />
      )}
    </div>
  );
}