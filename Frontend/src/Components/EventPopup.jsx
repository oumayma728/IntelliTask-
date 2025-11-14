import React, { useEffect, useState } from "react";
import { CreateEvent, UpdateEvent } from '../api/EventApi';

export default function EventPopup({ isOpen, onClose,onDelete, onSave, date, event }) {
  const [Title, setTitle] = useState("");
  const [StartDate, setStart] = useState("");
  const [EndDate, setEnd] = useState("");
  const [Description, setDescription] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.Title || event.title || "");
      setDescription(event.Description || event.description || "");
      const start = event.StartDate || event.start || new Date();
      const end = event.EndDate || event.end || new Date(start.getTime() + 60*60*1000);
      setStart(new Date(start).toISOString().slice(0,16));
      setEnd(new Date(end).toISOString().slice(0,16));
    } else if (date) {
      const start = new Date(date);
      setStart(start.toISOString().slice(0,16));
      setEnd(new Date(start.getTime() + 60*60*1000).toISOString().slice(0,16));
      setTitle("");
      setDescription("");
    }
  }, [event, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isNew = !event?.id;
    const dto = {
      Title,
      StartDate: new Date(StartDate).toISOString(),
      EndDate: new Date(EndDate).toISOString(),
      Description,
      id: event?.id
    };

    try {
      let savedEvent;
      if (isNew) {
        savedEvent = await CreateEvent(dto);
      } else {
        savedEvent = await UpdateEvent(event.id ,dto);

      }

      if (savedEvent) {
        onSave({
          ...dto,
          id: savedEvent.id || dto.id
        });
      }
      onClose();
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  z-10">
      <div className="bg-white p-10 rounded-xl w-[400px] text-gray-800 shadow-lg">
        <h2 className="text-2xl font-semibold text-[#2e4d9c] mb-4">{event ? "Edit Event" : "Add Event"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={Title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="w-full p-2 border rounded-md"/>
          <input type="text" value={Description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required className="w-full p-2 border rounded-md"/>
          <input type="datetime-local" value={StartDate} onChange={(e) => setStart(e.target.value)} required className="w-full p-2 border rounded-md"/>
          <input type="datetime-local" value={EndDate} onChange={(e) => setEnd(e.target.value)} required className="w-full p-2 border rounded-md"/>
          <div className="flex space-x-2 mt-4">
          <button type="submit" className="bg-[#2e4d9c] text-white px-4 py-2 rounded-lg">Save</button>
          <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg">Cancel</button>
              {event && (
  <button
    type="button"
    onClick={() => {
      onDelete?.(event.id);
      onClose();
    }}
    className="bg-red-500 text-white px-4 py-2 rounded-lg"
  >
    Delete
  </button>
)}</div>


        </form>
      </div>
    </div>
  );
}
