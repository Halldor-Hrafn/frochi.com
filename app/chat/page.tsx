"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
    const [messages, setMessages] = useState("");
    const [input, setInput] = useState("");

    const [userId, setUserId] = useState("");

    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error(error);
                return;
            } else {
                setUserId(user?.id || "");
            }
        };
        fetchUser();
    }, []);

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
            const response = await fetch(`/api/question`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: input,
                    userId: userId || ""
                })
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
            {userId && <p>User ID: {userId}</p>}
        </div>
    )
}
