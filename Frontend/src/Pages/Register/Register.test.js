import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register";
import { useAuth } from "../../Context/AuthContext";
import { register } from "../../api/AuthApi";

// Mock the AuthContext
const mockLoginUser = jest.fn();
jest.mock("../../Context/AuthContext", () => ({
    useAuth: () => ({
        loginUser: mockLoginUser
    })
}));

// Mock the register API
jest.mock("../../api/AuthApi", () => ({
    register: jest.fn()
}));

describe("Register Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("calls register API and loginUser on submit", async () => {
        // Mock the register API to return expected data
        register.mockResolvedValue({
            token: "fake-token",
            Mode: "Personal"
        });

        render(<Register />);

        // Fill email
        const emailInput = screen.getByPlaceholderText("email");
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });

        // Fill password
        const passwordInput = screen.getByPlaceholderText("password");
        fireEvent.change(passwordInput, { target: { value: "123456" } });

        // Select mode
        const modeSelect = screen.getByTestId("mode-select");
        fireEvent.change(modeSelect, { target: { value: "Personal" } });

        // Submit the form
        const submitButton = screen.getByRole("button", { name: /register/i });
        fireEvent.click(submitButton);

        // Wait for async effects
        await waitFor(() => {
            expect(register).toHaveBeenCalledWith(
                "test@example.com",
                "123456",
                "Personal"
            );

            expect(mockLoginUser).toHaveBeenCalledWith({
                token: "fake-token",
                Mode: "Personal"
            });
        });
    });
});
