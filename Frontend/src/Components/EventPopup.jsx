import React, { useEffect, useState } from "react";
import { CreateEvent, UpdateEvent } from '../api/EventApi';

export default function EventPopup({ isOpen, onClose, onSave, date, event }) {
    const [Title, setTitle] = useState("");
    const [StartDate, setStart] = useState("");
    const [EndDate, setEnd] = useState("");

    // Update form state whenever `event` or `date` changes
   useEffect(() => {
  if (date) {
    // User clicked on a slot → create new event
    const defaultStart = new Date(date);
    const defaultEnd = new Date(defaultStart.getTime() + 60*60*1000); // +1 hour
    setStart(defaultStart.toISOString().slice(0,16));
    setEnd(defaultEnd.toISOString().slice(0,16));
    setTitle(""); // empty title for new event
  } else if (event) {
    // User clicked an existing event → edit
    setTitle(event.Title);
    setStart(event.StartDate ? new Date(event.StartDate).toISOString().slice(0,16) : "");
    setEnd(event.EndDate ? new Date(event.EndDate).toISOString().slice(0,16) : "");
  }
}, [date, event]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Determine if this is a new event
        const isNew = !event?.id;

        // Prepare DTO for API
        const dto = {
            Title: Title,
            StartDate: StartDate ? new Date(StartDate).toISOString() : null,
            EndDate: EndDate ? new Date(EndDate).toISOString() : null
        };

        if (!isNew) {
            dto.id = event.id; // include id only for editing
        }

        try {
            let savedEvent;
            if (isNew) {
                savedEvent = await CreateEvent(dto);
            } else {
                savedEvent = await UpdateEvent(dto);
            }

            if (savedEvent && savedEvent.id) {
                // Pass the saved event back to parent calendar
                onSave({
                    ...savedEvent,
                    StartDate: new Date(savedEvent.StartDate),
                    EndDate: new Date(savedEvent.EndDate)
                });
            }

            onClose();
        } catch (error) {
            console.error("Error saving event:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-10">
            <div className="bg-white p-10 rounded-xl w-[400px] text-gray-800 shadow-lg">
                <h2 className="text-2xl font-semibold text-[#2e4d9c] mb-4">{event ? "Edit Event" : "Add Event"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div  style={{color:"black"}}>
                        <label className="block text-gray-700 font-medium mb-1">Title:</label>
                        <input
                            type="text"
                            value={Title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-non focus:ring focus:ring-[#53bab4] "
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Start:</label>
                        <input
                            type="datetime-local"
                            value={StartDate}
                            onChange={(e) => setStart(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-non focus:ring focus:ring-[#53bab4] "
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">End:</label>
                        <input
                            type="datetime-local"
                            value={EndDate}
                            onChange={(e) => setEnd(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-non focus:ring focus:ring-[#53bab4] "
                        />
                    </div>
                    <button type="submit" className="bg-[#2e4d9c] text-white px-4 py-2 rounded-lg hover:bg-[#24407]">Save</button>
                    <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">Cancel</button>
                </form>
            </div>
        </div>
    );
}
