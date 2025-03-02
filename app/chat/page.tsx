"use client";
import { useEffect, useState } from "react";

export default function Page() {
    const [messages, setMessages] = useState("");
    const [input, setInput] = useState("");

    useEffect(() => {
        const fetchMessage = async () => {
            const response = await fetch('/api/q');
            const data = await response.json();
            setMessages(data.message || "");
        };

        fetchMessage();
    
    }, []);

    console.log(messages);
    
    return (
        <div>
            <h1>Chatroom</h1>
            <div className="border p-1 h-96 overflow-y-scroll">
                {messages}
            </div>
        </div>
    )
}
