import Register from "./Register.jsx";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { register } from "../../api/AuthApi";
import { useAuth } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";   

//mock 
jest.mock("../../api/AuthApi.js",()=>({
    register: jest.fn()
}));
jest.mock("../../Context/AuthContext"); 
jest.mock("react-router-dom", () => ({ //mock navigation functions
    useNavigate: jest.fn(),
    Link: ({ children }) => children,
}));
global.alert = jest.fn();

describe("Register Component",()=>{
    let mockRegisterUser;
    let mockNavigate;
    beforeEach(() => {
        mockRegisterUser = jest.fn();
        useAuth.mockReturnValue({
            RegisterUser: mockRegisterUser,
            setUser: jest.fn(),
            setToken: jest.fn(),
            setMode: jest.fn(),
        });
        mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
    });

    test('renders email and password inputs and register button', () => {
        render(<Register />);

        expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
        expect(screen.getByTestId("mode-select")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
        });

    test("calls register api and RegisterUser on submit", async () => {
        register.mockResolvedValue({
            token: { Mode: "personal" }
        });
        render(<Register />);
        //fireEvent.click simulates user typing 
        fireEvent.change(screen.getByPlaceholderText("email"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("password"), {
            target: { value: "123456" },
        });

        fireEvent.change(screen.getByTestId("mode-select"), {
  target: { value: "Team" }
});


        //Click submit
        fireEvent.click(screen.getByRole("button", { name: /Register/i }));
    expect(register).toHaveBeenCalledWith("test@example.com", "123456", "Team");

    });
});
