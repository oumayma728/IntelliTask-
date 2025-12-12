import Login from "./Login.jsx";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { login } from "../../api/AuthApi";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

// Mocks
jest.mock("../../api/AuthApi", () => ({
    login: jest.fn(),
}));


jest.mock("../../Context/AuthContext", () => ({
    useAuth: jest.fn(),
}));

jest.mock("@react-oauth/google", () => ({
    useGoogleLogin: jest.fn(() => jest.fn()), // dummy function
    GoogleLogin: ({ onSuccess, onError }) => (
        <button onClick={() => onSuccess({ credential: "dummy" })}>GoogleLogin</button>
    ),
    googleLogout: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
    Link: ({ children }) => children,
}));

global.alert = jest.fn();

describe("Login Component", () => {
    let mockLoginUser;
    let mockNavigate;

    beforeEach(() => {
        jest.clearAllMocks();

        mockLoginUser = jest.fn();
        useAuth.mockReturnValue({
            loginUser: mockLoginUser,
            setUser: jest.fn(),
            setToken: jest.fn(),
            setMode: jest.fn(),
        });

        mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
        login.mockResolvedValue({ token: { Mode: "Personal", Token: "fake-token" } });

    });

    test("renders email and password inputs and login button", () => {
        render(<Login />);
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    });

    test("calls login API and loginUser on submit", async () => {
        login.mockResolvedValue({
            token: { Mode: "personal", Token: "fake-token" }
        });

        render(<Login />);

        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "123456" },
        });

        const form = screen.getByTestId("login-form");
        fireEvent.submit(form);


        // Wait for async state updates and effects
        await waitFor(() => {
            expect(login).toHaveBeenCalledWith("test@example.com", "123456");
            expect(mockLoginUser).toHaveBeenCalledWith({ Mode: "personal", Token: "fake-token" });
            expect(mockNavigate).toHaveBeenCalledWith("/PersonalDashboard");
        });
    });
});
