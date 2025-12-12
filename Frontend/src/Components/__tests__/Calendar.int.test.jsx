import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MyCalendar from "../Calendar.jsx";
import { useAuth } from "../../Context/AuthContext";

jest.mock("axios", () => {
  const mockAxios = {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: [] }),
    put: jest.fn().mockResolvedValue({ data: [] }),
    delete: jest.fn().mockResolvedValue({ data: [] }),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };
  return {
    create: jest.fn(() => mockAxios)};
});

Object.defineProperty(window, "alert", {
  writable: true,
  value: jest.fn(),
});

const mockSetEvents = jest.fn();
const mockFetchAllEvents = jest.fn();
const mockHandleSave = jest.fn();
const mockHandleDeleteEvent = jest.fn();
const mockUpdateEventLocally = jest.fn();
const mockRefreshAllEvents = jest.fn();

jest.mock("../../hooks/useEvents", () => () => ({
  events: [],
  setEvents: mockSetEvents,
  fetchAllEvents: mockFetchAllEvents,
  handleSave: mockHandleSave,
  handleDeleteEvent: mockHandleDeleteEvent,
  updateEventLocally: mockUpdateEventLocally,
  refreshAllEvents: mockRefreshAllEvents
}));


const mockCheckConnection = jest.fn().mockResolvedValue([]);;
const mockFetchGoogleEvents = jest.fn();
const mockConnectGoogleCalendar = jest.fn();
const mockSetIsGoogleConnected = jest.fn();
const mockDisconnectGoogleCalendar = jest.fn();


jest.mock("../../hooks/useGoogleCalendar", () => () => ({
  fetchGoogleEvents: mockFetchGoogleEvents,
  checkGoogleConnection: mockCheckConnection,
  connectGoogleCalendar: mockConnectGoogleCalendar,
  disconnectGoogleCalendar: mockDisconnectGoogleCalendar,
  setIsGoogleConnected: mockSetIsGoogleConnected
}));

describe("Google Calendar Integration", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        delete window.location;
        window.location = { search: "" };

        let store = {};
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value;
        }),
        removeItem: jest.fn((key) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
      },
    });
  });
      test("renders calendar and buttons", () => {
    render(<MyCalendar />);
    
    // Check for Refresh All button
    expect(screen.getByText("Refresh All")).toBeInTheDocument();
    
    // Check for Connect Google Calendar button
    expect(screen.getByText("Connect Google Calendar")).toBeInTheDocument();
  });
test("clicking connect Google Calendar button calls connectGoogleCalendar()", async () => {
    render(< MyCalendar />);
    
    const connectBtn = await screen.findByText("Connect Google Calendar");
    fireEvent.click(connectBtn);

    expect(mockConnectGoogleCalendar).toHaveBeenCalledTimes(1);
  });

  test("handles OAuth callback with success", async() =>{
    window.location.search = "?accessToken=test-token&refreshToken=refresh-token&expiresIn=3600";

    render(<MyCalendar />);
     // Check that localStorage was called with tokens
        await waitFor(() => {
            const tokens = JSON.parse(localStorage.getItem('googleCalendarTokens'));
            expect(tokens).toEqual({
                accessToken: 'test-token',
                refreshToken: 'refresh-token',
                expiresAt: expect.any(Number)
            });
        });
        // Check that fetchGoogleEvents was called
        expect(mockFetchGoogleEvents).toHaveBeenCalled();
  });

  test("Refresh Google Events button", async () => {
    window.location.search = "?accessToken=test-token&refreshToken=refresh-token&expiresIn=3600";
        render(<MyCalendar />);
const RefreshBtn = await screen.findByRole("button", { name: /Refresh Google/i });
    fireEvent.click(RefreshBtn);
    expect(mockFetchGoogleEvents).toHaveBeenCalled();
  });


  test("disconnects Google Calendar on button click", async () => {
    window.location.search = "?accessToken=test-token&refreshToken=refresh-token&expiresIn=3600";

        render(<MyCalendar />);

    const disconnectBtn = await screen.findByText("Disconnect Google");
    fireEvent.click(disconnectBtn);
            expect(mockDisconnectGoogleCalendar).toHaveBeenCalled();


  });
});
