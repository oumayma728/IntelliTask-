import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useEffect, useState ,useCallback} from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventPopup from "./EventPopup";
import { UpdateEvent } from "../api/EventApi";
import useEvents from "../hooks/useEvents";
import useGoogleCalendar from "../hooks/useGoogleCalendar";
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export default function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isOpenEvent, setIsOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const {
    events,
    setEvents,
    fetchAllEvents,
    handleSave,
    handleDeleteEvent,
    updateEventLocally,
    refreshAllEvents
  } = useEvents();

const {
    isGoogleConnected,
    loadingGoogle,
    setLoadingGoogle,
    fetchGoogleEvents,
    checkGoogleConnection,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    setIsGoogleConnected
  } = useGoogleCalendar();


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
      } 
    }
  }, [fetchGoogleEvents, setEvents, setIsGoogleConnected]);

  // runs once 
useEffect(() => {
  const init = async () => {
    checkGoogleConnection();
    await handleOAuthCallback();
    await fetchAllEvents();
  };
  init();
}, [checkGoogleConnection, handleOAuthCallback, fetchAllEvents]); // Add dependencies

  // Refresh Google events only
  const refreshGoogleEvents = async () => {
    if (!isGoogleConnected) {
      alert("Please connect Google Calendar first");
      return;
    }

    try {
      //get latest google events
      const formattedGoogleEvents = await fetchGoogleEvents();

      setEvents(prev => [
        //filter only google events
        ...prev.filter(e => !e.isGoogleEvent),
        ...formattedGoogleEvents
      ]);
    } catch (error) {
      console.error("Error refreshing Google events", error);
    }
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
        selectable //Allows clicking on empty dates to create an event
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