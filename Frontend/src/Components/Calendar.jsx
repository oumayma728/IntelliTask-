import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"; 
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventPopup from "./EventPopup";
import { CreateEvent, GetAllevents, UpdateEvent } from "../api/EventApi";

const localizer = momentLocalizer(moment);

export default function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpenEvent, setIsOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const DnDCalendar = withDragAndDrop(Calendar);

  /*Fetch events from backend*/
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await GetAllevents();
        console.log("Raw data from API:", data);
        
          const formatted = data
        .map(ev => {
          if (!ev.StartDate || !ev.EndDate) return null;
          const startDate = new Date(ev.StartDate);
          const endDate = new Date(ev.EndDate);
          if (isNaN(startDate) || isNaN(endDate)) return null;
          return {
            id: ev.Id,            // Must exist and be unique
            title: ev.Title || "Untitled Event",
            description: ev.Description || "",
            start: startDate,
            end: endDate,
            userId: ev.UserId,
            resource: ev          // Optional: keep original object
          };
        })
        .filter(ev => ev !== null);

      console.log("Final formatted events:", formatted);
      setEvents(formatted);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };
  fetchEvents();
}, []);

  // Debug events state changes
  useEffect(() => {
    console.log("Current events state:", events);
  }, [events]);

  // Open popup for editing
  const handleSelectEvent = (event) => {
    console.log("Selected event:", event);
    setSelectedEvent({ ...event });
    setSelectedDate(null);
    setIsOpenEvent(true);
  };

  // Open popup for creating new event
  const handleSelectSlot = (slotInfo) => {
    console.log("Selected slot:", slotInfo);
    setSelectedDate(slotInfo.start);
    setSelectedEvent(null);
    setIsOpenEvent(true);
  };

  // Enhanced drag & drop handler
  const handleEventDrop = async (dropData) => {
    console.log("=== DRAG DROP STARTED ===");
    console.log("Full drop data:", dropData);
    
    const { event, start, end } = dropData;
    
    // Debug the event object structure
    console.log("🔍 Event object from drag:", event);
    console.log("🔍 Event object keys:", Object.keys(event));
    console.log("🔍 Event ID:", event.id);
    
    // Find the original event
    const eventId = event.id;
    const originalEvent = events.find(ev => String(ev.id) === String(eventId));
    
    console.log("✅ Found original event:", originalEvent);
    
    if (!originalEvent) {
      console.error("❌ CANNOT FIND EVENT!");
      console.error("Available event IDs:", events.map(ev => ev.id));
      alert("Cannot find event! Check console for details.");
      return;
    }

    // Create updated event
   const updatedEvent = {
    ...originalEvent.resource, // <-- use resource to keep all fields
    start: new Date(start),
    end: new Date(end)
  };

    console.log("🔄 Updated event:", updatedEvent);

    // Update local state IMMEDIATELY
    setEvents(prevEvents => 
      prevEvents.map(ev => 
        String(ev.id) === String(originalEvent.id) ? updatedEvent : ev
      )
    );

    // Update backend
    try {
      const backendData = {
        Id: parseInt(originalEvent.id),
        Title: updatedEvent.title,
        Description: updatedEvent.description,
        StartDate: new Date(start).toISOString(),
        EndDate: new Date(end).toISOString(),
        UserId: updatedEvent.userId,
      };
      
      console.log("📤 Sending to backend:", backendData);
      
      const response = await UpdateEvent(originalEvent.id, backendData);
      console.log("✅ Backend update response:", response);
      
    } catch (error) {
      console.error("❌ Backend update failed:", error);
      console.error("Error details:", error.response?.data || error.message);
      
      // Revert to original on error
      setEvents(prevEvents => 
        prevEvents.map(ev => 
          String(ev.id) === String(originalEvent.id) ? originalEvent : ev
        )
      );
      
      alert("Failed to update event in database. Changes reverted.");
    }
    
    console.log("=== DRAG DROP FINISHED ===");
  };

  // Add event resize handler
  const handleEventResize = async (resizeData) => {
    console.log("=== EVENT RESIZE STARTED ===");
    const { event, start, end } = resizeData;
    
    const eventId = event.id;
    const originalEvent = events.find(ev => String(ev.id) === String(eventId));
    
    if (!originalEvent) {
      console.error("Cannot find event for resizing");
      return;
    }

    const updatedEvent = {
      ...originalEvent,
      start: new Date(start),
      end: new Date(end)
    };

    // Update local state
    setEvents(prevEvents => 
      prevEvents.map(ev => 
        String(ev.id) === String(originalEvent.id) ? updatedEvent : ev
      )
    );

    // Update backend
    try {
      await UpdateEvent(originalEvent.id, {
        Id: parseInt(originalEvent.id),
        Title: updatedEvent.title,
        Description: updatedEvent.description,
        StartDate: new Date(start).toISOString(),
        EndDate: new Date(end).toISOString(),
        UserId: updatedEvent.userId,
      });
      console.log("✅ Event resize saved to backend");
    } catch (error) {
      console.error("❌ Backend update failed on resize:", error);
      // Revert on error
      setEvents(prevEvents => 
        prevEvents.map(ev => 
          String(ev.id) === String(originalEvent.id) ? originalEvent : ev
        )
      );
    }
    
    console.log("=== EVENT RESIZE FINISHED ===");
  };

  // Handle save from popup
  const handleSave = async (eventData) => {
    console.log("Saving event:", eventData);
    
    const formattedEvent = {
      id: eventData.id,
      title: eventData.Title || "Untitled Event",
      description: eventData.Description || "",
      start: new Date(eventData.StartDate),
      end: new Date(eventData.EndDate),
      userId: eventData.UserId
    };

    if (eventData.id) {
      // Update existing event
      setEvents(prev => prev.map(ev => 
        String(ev.id) === String(formattedEvent.id) ? formattedEvent : ev
      ));
    } else {
      // Add new event
      try {
        const newEvent = await CreateEvent(eventData);
        const formatted = {
          id: newEvent.Id,
          title: newEvent.Title || "Untitled Event",
          description: newEvent.Description || "",
          start: new Date(newEvent.StartDate),
          end: new Date(newEvent.EndDate),
          userId: newEvent.UserId
        };
        setEvents(prev => [...prev, formatted]);
      } catch (error) {
        console.error("Failed to create event:", error);
      }
    }
    
    setIsOpenEvent(false);
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
        onEventResize={handleEventResize}
        resizable
        style={{ height: "77vh" }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: '#3174ad',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
          }
        })}
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