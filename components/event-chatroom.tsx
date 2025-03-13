"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Message } from "@/lib/types";
import ChatMessage from "@/components/chat-message";
import { getUsernameFromId } from "@/utils/supabase/user";

export type EventChatRoomProps = {
    eventId: string;
};

export default function EventChatRoom({ eventId }: EventChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [userInput, setUserInput] = useState<string>("");
    const supabase = createClient();

    const addMessageToFeed = async (message: Message) => {
        const ownerName = await getUsernameFromId(message.owner_id);

        setMessages((prev) => [
            ...prev,
            {
                ...message,
                created_at: new Date(message.created_at),
                owner_name: ownerName || "Unknown",
            },
        ]);
    }


    useEffect(() => {
        const loadPrevMessages = async () => {
            const { error, data } = await supabase
                .from("messages")
                .select("*")
                .eq("event_id", eventId)
                .order("created_at", { ascending: true });

            if (error) {
                console.error(error);
                setError(new Error("Something went wrong"));
                return;
            }

            const idToName: any = {}; // cache for userid to user name, used when fetching usernames from user ids

            setMessages(
                await Promise.all(
                    data.map(async (msg) => {
                        let ownerName: string | null = idToName[msg.owner_id];
                        if (!ownerName) {
                            ownerName = await getUsernameFromId(msg.owner_id);
                            idToName[msg.owner_id] = ownerName;
                        }

                        return {
                            ...msg,
                            created_at: new Date(msg.created_at),
                            owner_name: ownerName || "Unknown",
                        };
                    })
                )
            );
        };

        loadPrevMessages();

        const channel = supabase
            .channel(`messages:event_${eventId}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages", filter: `event_id=eq.${eventId}` },
                async (payload) => {
                    // console.log("New message received:", payload.new);

                    await addMessageToFeed(payload.new as Message);
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [eventId, supabase]);

    const onMessageSend = async () => {
        if (!userInput.trim()) return;

        setUserInput(""); // Clear input field after sending the message

        const res = await fetch("/api/events/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event_id: eventId,
                message: userInput,
            }),
        });

        if (!res.ok) {
            console.error(res.statusText);
            setError(new Error("Failed to send message"));
            return;
        }
    };

    return (
        <div className="border-2 border-gray-600 p-4">
            <div className="overflow-y-scroll h-48 ">
                <ul>
                    {messages.map((message, i) => (
                        <ChatMessage
                            key={i}
                            className={"mt-4"}
                            created_at={message.created_at}
                            message={message.message}
                            owner_name={message.owner_name}
                        />
                    ))}
                </ul>
            </div>

            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type to send a message"
                onKeyDown={(e) => (e.key === "Enter" ? onMessageSend() : undefined)}
                className="border border-border rounded-sm p-2 w-full mt-4 bg-background placeholder-primary"
            />
        </div>
    );
}
