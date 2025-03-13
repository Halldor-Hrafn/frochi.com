'use client'
import React, {useEffect, useState} from "react";
import {Event} from '@/lib/types'
import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/client";

export default function Page() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchAllEvents = async () => {
            const supabase = createClient();
            const {data, error} = await supabase.from("events").select('*');
            if (error || !data) {
                console.error(error);
                return;
            }

            setEvents(data.map((e: any) => {
                return {
                    ...e,
                    start_date: new Date(e.start_date),
                    end_date: new Date(e.end_date),
                    created_at: new Date(e.created_at)
                }
            }));
        }
        fetchAllEvents();
    }, []);


    return (
        <div className="w-full min-w-screen-lg mx-auto">
            events
            <ul className={'min-w-[700px]'}>
                {events.map(event => (
                    <li
                        key={event.id}
                        className={'border-gray-200 border-2 p-4 w-full rounded hover:cursor-pointer'}
                        onClick={(_) => redirect(`/events/${event.id}`)}
                    >
                        <h2 className={'border-b-2 border-b-gray-700 text-2xl'}>
                            {event.title}
                            <span className={'text-sm text-gray-600'}>
                                {event.start_date.toLocaleDateString()} to {event.end_date.toLocaleDateString()}
                            </span>
                        </h2>
                        <p>{event.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
