'use client';
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export type EventChatRoomProps = {
    eventId: string;
};

export default function EventChatRoom({ eventId }: EventChatRoomProps) {
    useEffect(() => {
        const supabase = createClient();

        const channel = supabase
            .channel('comments')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'comments' },
                (payload) => {
                    console.log("New comment:", payload);
                }
            )
            .subscribe();

        console.log("Subbed")
        return () => {
            channel.unsubscribe();
        };
    }, []);

    return <div>Chatroom content</div>;
}
