"use client";
import { useEffect, useState } from "react";

export default function Page() {
    const [messages, setMessages] = useState("");
    const [input, setInput] = useState("");

    // useEffect(() => {
    //     const fetchMessage = async () => {
    //         const response = await fetch('/api/q');
    //         const data = await response.json();
    //         setMessages(data.message || "");
    //     };

    //     fetchMessage();
    
    // }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/question?question=${encodeURIComponent(input)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch message");
            }

            const data = await response.json();
            setMessages(data.message || "");
        } catch (err) {
            console.error(err);
        }
    }

    console.log(messages);
    
    return (
        <div>
            <h1>Chatroom</h1>
            <div className="border p-1 h-96 overflow-y-scroll">
                {messages}
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={input} onChange={handleInputChange} />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}
