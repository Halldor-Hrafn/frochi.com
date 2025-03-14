'use client'
import React, {useEffect, useState} from "react";
import {Event} from '@/lib/types'
import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/client";
import EventEntry from "@/components/event-entry";
import Map from "@/components/map";

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
        <div className="min-w-screen-lg mx-auto">
            <div className="">
                <div className={'flex items-center justify-center'}>
                    <h1 className="text-5xl pt-10 pb-4 text-center border-b border-b-primary px-4 ">Events</h1>
                </div>
                <ul className='min-w-[70px] min-h-[200px] grid grid-cols-1 md:grid-cols-3 gap-2 pt-8'>
                    {events.map(event => (
                        <div key={event.id} className="m-2 rounded-sm hover:bg-gray-200 h-full">
                            <EventEntry key={event.id} event={event} />
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    )
}
