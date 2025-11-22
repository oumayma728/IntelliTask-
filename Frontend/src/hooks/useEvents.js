import { useState, useCallback } from "react";
import { CreateEvent, DeleteEvent, GetAllevents, UpdateEvent } from "../api/EventApi";

export default function useEvents() {
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    const fetchDbEvents = useCallback(async () => {
        try {
            const dbEvents = await GetAllevents();
            return dbEvents
                .filter(ev => ev.StartDate && ev.EndDate)
                .map(ev => ({
                    id: ev.Id,
                    title: ev.Title || "Untitled Event",
                    description: ev.Description || "",
                    start: new Date(ev.StartDate),
                    end: new Date(ev.EndDate),
                    userId: ev.UserId,
                    isGoogleEvent: false,
                    source: "local"
                }));
        } catch (error) {
            console.error("Error fetching DB events", error);
            return [];
        }
    }, []);

    const fetchAllEvents = useCallback(async (googleEvents = []) => {
        setLoadingEvents(true);
        try {
            const dbEvents = await fetchDbEvents();
            const allEvents = [...dbEvents, ...googleEvents];
            setEvents(allEvents);
        } catch (error) {
            console.error("❌ Failed to fetch all events", error);
            alert("Failed to fetch events from server.");
        } finally {
            setLoadingEvents(false);
        }
    }, [fetchDbEvents]);

  // Refresh all events
  const refreshAllEvents = async () => {
    await fetchAllEvents();
  };
  
    

    const handleSave = async (eventData) => {
        try {
            if (eventData.id) {
                // Update existing event
                const payload = {
                    Id: eventData.id,
                    Title: eventData.title || eventData.Title,
                    Description: eventData.description || eventData.Description || "",
                    StartDate: new Date(eventData.StartDate).toISOString(),
                    EndDate: new Date(eventData.EndDate).toISOString(),
                    UserId: eventData.userId || eventData.UserId,
                };

                await UpdateEvent(eventData.id, payload);

                const updatedEvent = {
                    ...eventData,
                    start: new Date(payload.StartDate),
                    end: new Date(payload.EndDate),
                    isGoogleEvent: false,
                };

                setEvents(prev => prev.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev));
            } else {
                // Create new event
                const payload = {
                    Title: eventData.title || eventData.Title || "Untitled",
                    Description: eventData.description || eventData.Description || "",
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
                    source: "local",
                };

                setEvents(prev => [...prev, newEvent]);
            }
        } catch (error) {
            console.error("❌ Save failed:", error);
            alert("Failed to save event. Please try again.");
        }
    };

    const handleDeleteEvent = async (eventId) => {
        const eventToDelete = events.find(ev => ev.id === eventId);

        if (eventToDelete?.isGoogleEvent) {
            alert("Cannot delete Google Calendar events from here. Please delete them directly in Google Calendar.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            await DeleteEvent(eventId);
            setEvents(prev => prev.filter(ev => ev.id !== eventId));
        } catch (error) {
            console.error("❌ Delete failed:", error);
            alert("Failed to delete event. Please try again.");
        }
    };

    const updateEventLocally = (updatedEvent) => {
        setEvents(prev => prev.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev));
    };

    return {
        events,
        setEvents,
        loadingEvents,
        fetchDbEvents,
        refreshAllEvents,
        fetchAllEvents,
        handleSave,
        handleDeleteEvent,
        updateEventLocally
    };
}
