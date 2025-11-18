import {chatbotApi} from "./api";

export async function sendMessageToAI(UserInput) {
    try {
        const response = await chatbotApi.post("/ChatBot", {UserInput });
        return response.data;
    } catch (error) {
        
        console.error("API Error:", error);
        console.error("API Error:", error.response?.data);

        throw error;
    }
}