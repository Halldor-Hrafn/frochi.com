"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useRef } from "react";
import { Message } from "@/lib/types";
import ChatMessage from "@/components/chat-message";
import { getUsernameFromId } from "@/utils/supabase/user";
import {SendHorizontal} from "lucide-react";

export type EventChatRoomProps = {
    eventId: string;
};

export default function EventChatRoom({ eventId }: EventChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [userInput, setUserInput] = useState<string>("");
    const supabase = createClient();
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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

    useEffect(() => {
        if (scrollContainerRef.current) {
        const wasAtBottom = scrollContainerRef.current.scrollTop == scrollContainerRef.current.scrollHeight - 328 || 
                            scrollContainerRef.current.scrollTop == scrollContainerRef.current.scrollHeight - 260;

        console.log(wasAtBottom, scrollContainerRef.current?.scrollTop, scrollContainerRef.current?.scrollHeight);

        // If the user was at the bottom, scroll to the bottom after the message is added
        if (wasAtBottom) {
        setTimeout(() => {
            scrollContainerRef.current?.scrollTo(0, scrollContainerRef.current.scrollHeight);
        }, 10);
        }
        }
    }, [messages]); 

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

    useEffect(() => {
        if (scrollContainerRef.current) {
            const wasAtBottom = scrollContainerRef.current.scrollTop == scrollContainerRef.current.scrollHeight - 328 || 
                                scrollContainerRef.current.scrollTop == scrollContainerRef.current.scrollHeight - 260;

            console.log(wasAtBottom, scrollContainerRef.current?.scrollTop, scrollContainerRef.current?.scrollHeight);

            // If the user was at the bottom, scroll to the bottom after the message is added
            if (wasAtBottom) {
                setTimeout(() => {
                    scrollContainerRef.current?.scrollTo(0, scrollContainerRef.current.scrollHeight);
                }, 10);
            }
        }
    }, [messages]); 

    return (
        <div className="flex flex-col border-2 border-gray-600 border-t-0 p-4 max-h-[500px]">
            <div ref={scrollContainerRef} className="overflow-y-scroll">
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

            <div className={'flex items-center border border-border rounded-sm w-full'}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type to send a message"
                    onKeyDown={(e) => (e.key === "Enter" ? onMessageSend() : undefined)}
                    className="w-full bg-background placeholder-primary justify-end !border-0"
                />
                <SendHorizontal className={'mr-2 hover:cursor-pointer'} />
            </div>

        </div>
    );
}
