'use client';
import { createClient } from "@/utils/supabase/client";
import {useEffect, useState} from "react";
import {Message} from "@/lib/types";
import ChatMessage from "@/components/chat-message";

export type EventChatRoomProps = {
    eventId: string;
};

export default function EventChatRoom({ eventId }: EventChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<Error>();

    useEffect(() => {
        const supabase = createClient();

        const loadPrevMessages = async () => {
            const {error, data} = await supabase
                .from("messages")
                .select("*")
                .eq("event_id", eventId)
                .order("created_at", {ascending: false});

            if (error) {
                console.error(error);
                setError(new Error("Something went wrong"));
                return;
            }

            const idToName: any = {}; // cache for userid to user name, used when fetching usernames from user ids

            setMessages(await Promise.all(data.map(async (msg) => {
                let ownerName: any = idToName[msg.owner_id];
                if (!ownerName) {

                }
                return {
                    ...msg,
                    created_at: new Date(msg.created_at)
                }
            })));
        }

        const addChannelListener = () => {
            return supabase
                .channel('comments')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'comments' },
                    (payload) => {
                        console.log("New comment:", payload);
                    }
                )
                .subscribe();
        }

        const channel = addChannelListener();

        loadPrevMessages();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    return (
        <div>
            <p >
                Chatroom content
            </p>
            <ul className={'border-2 border-gray-600 p-4'}>
                {messages.map((message) => (
                    <ChatMessage className={'mt-4'} created_at={message.created_at} message={message.message} owner_name={message.owner_id}></ChatMessage>
                ))}
            </ul>
        </div>

    );
}
