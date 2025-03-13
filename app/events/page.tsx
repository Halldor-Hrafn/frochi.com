'use client'
import React, {useEffect, useState} from "react";
import {Event} from '@/lib/types'
import {redirect} from "next/navigation";

export default function Page() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        setEvents([
            {
                id: "id1",
                title: "this is an event",
                description: "help thepoor",
                start_date: new Date(),
                end_date: new Date(Date.now() + (1000 * 60 * 60 * 24 * 4)),
                created_at: new Date(),
                lat: -64.1029,
                lon: -20.3010,
                owner_id: "ownerid"
            }
        ]);
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
