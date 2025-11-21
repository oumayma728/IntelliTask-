import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEffect, useState, useCallback } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventPopup from "./EventPopup";
import { CreateEvent, DeleteEvent, GetAllevents, UpdateEvent } from "../api/EventApi";
import googleCalendarApi from "../api/GoogleCalendarApi";
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpenEvent, setIsOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Check if token is expired
  const isTokenExpired = (tokens) => {
    return Date.now() >= tokens.expiresAt;
  };

  // Fetch DB events
  const fetchDbEvents = async () => {
    try {
      const dbEvents = await GetAllevents();
      return dbEvents
        .filter(ev => ev.StartDate && ev.EndDate)
        .map(ev => ({
          id: ev.Id,
          title: ev.Title || 'Untitled Event',
          description: ev.Description || '',
          start: new Date(ev.StartDate),
          end: new Date(ev.EndDate),
          userId: ev.UserId,
          isGoogleEvent: false,
          source: 'local'
        }));
    } catch (error) {
      console.error("Error fetching DB events", error);
      return [];
    }
  };

 const fetchGoogleEvents = useCallback(async () => {
    const savedTokens = localStorage.getItem('googleCalendarTokens');
    if (!savedTokens) return [];

    try {
      setLoadingGoogle(true);
      let tokens = JSON.parse(savedTokens);
      
      // Refresh token if expired or about to expire (within 5 minutes)
      if (isTokenExpired(tokens) || (tokens.expiresAt - Date.now()) < 300000) {
        console.log("🔄 Refreshing Google token...");
        const newTokens = await googleCalendarApi.refreshAccessToken(tokens.refreshToken);
        tokens = {
          ...tokens,
          accessToken: newTokens.accessToken,
          expiresAt: Date.now() + (newTokens.expiresIn * 1000)
        };
        localStorage.setItem('googleCalendarTokens', JSON.stringify(tokens));
      }

      const googleEvents = await googleCalendarApi.getGoogleEvents(tokens.accessToken);
      
      return googleEvents
        .filter(ev => ev.Start && ev.End) 
        .map((ev, index) => {
   
          return {
            id: `google-${ev.Id || index}`, 
            title: ev.Summary || "Google Event", // ✅ Capital 'S'
            description: ev.Description || "", // ✅ Capital 'D'
            start: new Date(ev.Start), // ✅ Direct date parsing
            end: new Date(ev.End), // ✅ Direct date parsing
            isGoogleEvent: true,
            source: 'google',
            googleEventId: ev.Id // ✅ Capital 'I'
          };
        });
    } catch (error) {
      console.error("Error fetching Google events", error);
      
      // If token is invalid, disconnect Google
      if (error.response?.status === 401) {
        disconnectGoogleCalendar();
        alert("Google Calendar connection expired. Please reconnect.");
      }
      
      return [];
    } finally {
      setLoadingGoogle(false);
    }
  }, []);

  // Check Google connection status
  const checkGoogleConnection = useCallback(() => {
    const savedTokens = localStorage.getItem('googleCalendarTokens');
    if (!savedTokens) {
      setIsGoogleConnected(false);
      return false;
    }
    
    try {
      const tokens = JSON.parse(savedTokens);
      const isConnected = !isTokenExpired(tokens);
      setIsGoogleConnected(isConnected);
      return isConnected;
    } catch (error) {
      setIsGoogleConnected(false);
      return false;
    }
  }, []);

  // Handle OAuth callback
  const handleOAuthCallback = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get tokens directly from URL (your backend sends these)
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    const expiresIn = urlParams.get('expiresIn');
    const oauthError = urlParams.get('oauth');

    // Check for errors
    if (oauthError === 'error') {
      const message = urlParams.get('message');
      alert(`OAuth failed: ${message}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // If we have tokens, store them
    if (accessToken && refreshToken) {
      setLoadingGoogle(true);
      try {        
        // Store tokens with expiry
        const tokensWithExpiry = {
          accessToken: accessToken,
          refreshToken: refreshToken,
          expiresAt: Date.now() + (parseInt(expiresIn) * 1000)
        };
        
        localStorage.setItem('googleCalendarTokens', JSON.stringify(tokensWithExpiry));
        
        setIsGoogleConnected(true);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Fetch Google events after successful connection
        const googleEvents = await fetchGoogleEvents();
        
        // Merge with existing local events
        setEvents(prev => [
          ...prev.filter(e => !e.isGoogleEvent),
          ...googleEvents
        ]);
        
      } catch (error) {
        console.error("Failed to connect Google Calendar:", error);
        alert("Failed to connect Google Calendar. Please try again.");
      } finally {
        setLoadingGoogle(false);
      }
    }
  }, [fetchGoogleEvents]);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      checkGoogleConnection();
      await handleOAuthCallback();
      await fetchAllEvents();
    };
    init();
  }, []); // Empty dependency array - only run once on mount

  // Fetch all events
  const fetchAllEvents = async () => {
  setLoadingEvents(true);
  try {
    
    const [dbEvents, googleEvents] = await Promise.all([
      fetchDbEvents(),
      isGoogleConnected ? fetchGoogleEvents() : Promise.resolve([])
    ]);

    const allEvents = [...dbEvents, ...googleEvents];
    
    setEvents(allEvents);
  } catch (error) {
    console.error("❌ Failed to fetch all events", error);
    alert("Failed to fetch events from server.");
  } finally {
    setLoadingEvents(false);
  }
};

  // Connect to Google Calendar
  const connectGoogleCalendar = () => {
    googleCalendarApi.initiateGoogleLogin();
  };

  // Disconnect Google Calendar
  const disconnectGoogleCalendar = () => {
    localStorage.removeItem('googleCalendarTokens');
    setIsGoogleConnected(false);
    setEvents(prev => prev.filter(event => !event.isGoogleEvent));
  };

  // Refresh Google events only
  const refreshGoogleEvents = async () => {
    if (!isGoogleConnected) {
      alert("Please connect Google Calendar first");
      return;
    }

    try {
      const formattedGoogleEvents = await fetchGoogleEvents();
      
      setEvents(prev => [
        ...prev.filter(e => !e.isGoogleEvent),
        ...formattedGoogleEvents
      ]);
    } catch (error) {
      console.error("Error refreshing Google events", error);
    }
  };

  // Refresh all events
  const refreshAllEvents = async () => {
    await fetchAllEvents();
  };

  // Event handlers
  const handleSelectEvent = (event) => {
    if (event.isGoogleEvent) {
      alert("Google Calendar events are read-only. Please edit them directly in Google Calendar.");
      return;
    }
    setSelectedEvent({ ...event });
    setSelectedDate(null);
    setIsOpenEvent(true);
  };

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setSelectedEvent(null);
    setIsOpenEvent(true);
  };

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
          ...eventData,
          start: new Date(payload.StartDate),
          end: new Date(payload.EndDate),
          isGoogleEvent: false,
        };
        
        setEvents(prev => prev.map(ev => 
          ev.id === updatedEvent.id ? updatedEvent : ev
        ));
        
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
          source: 'local'
        };
        
        setEvents(prev => [...prev, newEvent]);
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
      alert("Cannot delete Google Calendar events from here. Please delete them directly in Google Calendar.");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await DeleteEvent(eventId);
      setEvents(prev => prev.filter(ev => ev.id !== eventId));
      setIsOpenEvent(false);
    } catch (error) {
      console.error("❌ Delete failed:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  return (
    <div style={{ margin: "100px" }}>
      {/* Calendar Controls */}
      <div className="mb-4 flex gap-4 items-center justify-between">
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
        
        <div className="flex gap-2">
          <button 
            onClick={refreshAllEvents}
            disabled={loadingEvents}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {loadingEvents ? "Refreshing..." : "Refresh All"}
          </button>
          
          {!isGoogleConnected ? (
            <button 
              onClick={connectGoogleCalendar}
              disabled={loadingGoogle}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loadingGoogle ? "Connecting..." : "Connect Google Calendar"}
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={refreshGoogleEvents}
                disabled={loadingGoogle}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loadingGoogle ? "Refreshing..." : "Refresh Google"}
              </button>
              <button 
                onClick={disconnectGoogleCalendar}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Disconnect Google
              </button>
            </div>
          )}
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
            opacity: event.isGoogleEvent ? 0.8 : 1,
            border: event.isGoogleEvent ? "1px solid #2e7d32" : "1px solid #1e5a8a",
          }
        })}
        draggableAccessor={event => !event.isGoogleEvent}
        style={{ height: "77vh" }}
        popup
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