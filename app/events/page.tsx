'use client'
import React, {useEffect, useState} from "react";
import {Event} from '@/lib/types'
import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/client";
import EventEntry from "@/components/event-entry";

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
            <div className="">
                <h1 className="text-5xl py-10">Events</h1>
                <ul className='min-w-[700px] grid grid-cols-3 border-t border-t-primary'>
                    {events.map(event => (
                        <div className="m-2 rounded-sm hover:bg-accent">
                            <EventEntry key={event.id} event={event} />
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    )
}
