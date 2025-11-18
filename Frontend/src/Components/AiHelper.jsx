import React, { useState, useRef, useEffect } from "react";
import { sendMessageToAI } from "../api/AiApi";

export default function ChatBot() {
  const [UserInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!UserInput.trim()) return; // ignore empty messages

    const newMessages = [...messages, { sender: "You", text: UserInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const data = await sendMessageToAI(UserInput); // call API
      setMessages((prev) => [...prev, { sender: "ChatBot", text: data.answer }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ChatBot", text: "Error communicating with the server." },
      ]);
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="chat-container flex flex-col h-full p-2">
      <div className="chat-messages flex-1 overflow-y-auto mb-2">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message my-1">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input flex gap-2">
        <input
          type="text"
          value={UserInput}
          onChange={handleUserInput}
          onKeyDown={handleKeyPress}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
