import { useState, useCallback } from "react";
import googleCalendarApi from "../api/GoogleCalendarApi";

export default function useGoogleCalendar() {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const isTokenExpired = (tokens) => Date.now() >= tokens.expiresAt;

  const fetchGoogleEvents = useCallback(async () => {
    const savedTokens = localStorage.getItem("googleCalendarTokens");
    if (!savedTokens) return [];

    try {
      setLoadingGoogle(true);
      let tokens = JSON.parse(savedTokens);

      if (isTokenExpired(tokens) || (tokens.expiresAt - Date.now()) < 300000) {
        const newTokens = await googleCalendarApi.refreshAccessToken(tokens.refreshToken);
        tokens = {
          ...tokens,
          accessToken: newTokens.accessToken,
          expiresAt: Date.now() + (newTokens.expiresIn * 1000),
        };
        localStorage.setItem("googleCalendarTokens", JSON.stringify(tokens));
      }

      const googleEvents = await googleCalendarApi.getGoogleEvents(tokens.accessToken);
      return googleEvents
        .filter(ev => ev.Start && ev.End)
        .map((ev, index) => ({
          id: `google-${ev.Id || index}`,
          title: ev.Summary || "Google Event",
          description: ev.Description || "",
          start: new Date(ev.Start),
          end: new Date(ev.End),
          isGoogleEvent: true,
          source: "google",
          googleEventId: ev.Id,
        }));
    } catch (error) {
      console.error("Error fetching Google events", error);
      if (error.response?.status === 401) disconnectGoogleCalendar();
      return [];
    } finally {
      setLoadingGoogle(false);
    }
  }, []);



 

  const checkGoogleConnection = useCallback(() => {
    const savedTokens = localStorage.getItem("googleCalendarTokens");
    if (!savedTokens) {
      setIsGoogleConnected(false);
      return false;
    }
    try {
      const tokens = JSON.parse(savedTokens);
      const connected = !isTokenExpired(tokens);
      setIsGoogleConnected(connected);
      return connected;
    } catch {
      setIsGoogleConnected(false);
      return false;
    }
  }, []);

    
  const connectGoogleCalendar = () => googleCalendarApi.initiateGoogleLogin();

  const disconnectGoogleCalendar = () => {
    localStorage.removeItem("googleCalendarTokens");
    setIsGoogleConnected(false);
  };

  return {
    isGoogleConnected,
    loadingGoogle,
    fetchGoogleEvents,
    checkGoogleConnection,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    setIsGoogleConnected
  };
}
