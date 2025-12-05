import Login from "./Login.jsx";
import { render, screen, fireEvent } from "@testing-library/react";
import { login } from "../../api/AuthApi";
import { useAuth } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

//mock 
jest.mock("../../api/AuthApi", () => ({
  login: jest.fn().mockResolvedValue({ token: { Mode: "personal" } })
}));
jest.mock("../../Context/AuthContext");
// At the top of Login.test.js
jest.mock("@react-oauth/google", () => ({
  useGoogleLogin: jest.fn(() => jest.fn()), // returns a dummy function
  GoogleLogin: ({ onSuccess, onError }) => (
    <button onClick={() => onSuccess({ credential: "dummy" })}>GoogleLogin</button>
  ),
  googleLogout: jest.fn()
}));

jest.mock("react-router-dom", () => ({ //mock navigation functions
    useNavigate: jest.fn(),
    Link: ({ children }) => children,
}));
global.alert = jest.fn();


describe("Login Component", () => {
    let mockLoginUser;
    let mockNavigate;
    //sets up fresh mocks before each test to avoid contamination between tests.
    beforeEach(() => {
        mockLoginUser = jest.fn();
        useAuth.mockReturnValue({
            loginUser: mockLoginUser,
            setUser: jest.fn(),
            setToken: jest.fn(),
            setMode: jest.fn(),
        });
        mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
    });

    test('renders email and password inputs and login button', () => {
        render(<Login />);

        //check inputs and button are present
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    });

    test("calls login api and loginUser on submit", async () => {
        login.mockResolvedValue({
            token: { Mode: "personal" }
        });
        render(<Login />);

        //fireEvent.click simulates user typing 
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "123456" },
        });

        //Click submit
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        // Wait for async actions to complete
        await screen.findByRole("button", { name: /login/i });

        expect(login).toHaveBeenCalledWith("test@example.com", "123456");
        expect(mockLoginUser).toHaveBeenCalledWith({ Mode: "personal" });
        expect(mockNavigate).toHaveBeenCalledWith("/PersonalDashboard");

    });
});