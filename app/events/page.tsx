'use client'
import React, {useEffect, useState} from "react";
import {Event} from '@/lib/types'
import EventEntry from "@/components/event-entry";
import {toast, Toaster} from "react-hot-toast";
import {Button} from "@/components/ui/button";
import {CirclePlus} from "lucide-react";

export default function Page() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchAllEvents = async () => {
            const res = await fetch('/api/events');

            if (!res.ok) {
                toast.error("Náði ekki að sækja viðburði :/")
                return;
            }

            const data = await res.json();
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
            <Toaster position="top-right"/>
            <div>
                <div className={'flex items-center justify-center'}>
                    <h1 className="text-5xl pt-10 pb-4 text-center border-b border-b-primary px-4 ">Events</h1>
                </div>
                <Button variant={"default"} className={'ml-6'}>
                    <CirclePlus className={'mr-1'}/>
                    <a href="/?toast=ýttu á kortið til að velja staðsetningu fyrir viðburð">Búa til viðburð</a>
                </Button>
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
