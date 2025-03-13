"use client";

import React, {useEffect, useState} from "react";
import {Event} from '@/lib/types';
import EventChatRoom from "@/components/event-chatroom";


export default function Page({params}: { params: { id: string } }) {
    const [eventData, setEventData] = useState<Event>();
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchEventData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/events/?eventId=${params.id}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        setError(new Error("This event does not exist"));
                        return;
                    }

                    setError(new Error(res.statusText));
                    return;
                }

                const data = await res.json();
                setEventData(data);
            } catch (e: any) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [])

    if (loading || !eventData) {
        return (
            <div className={'flex min-h-screen justify-between w-screen'}>
                <section className={'event-section w-2/3'}>
                    loading...
                </section>
                <section className={'event-section'}>
                    loading...
                </section>

            </div>
        )
    }

    return (
        <div className={'flex min-h-screen justify-between w-screen'}>
            <section className={'event-section w-2/3'}>
                <div className={'border-2 border-gray-700 p-4 rounded'}>
                    <h2 className={'text-4xl border-b-2 border-b-gray-700 m-2'}>
                        {eventData.title}
                    </h2>
                    <p className={'text-lg p-2'}>
                        {eventData.description}
                    </p>
                </div>

                <EventChatRoom eventId={eventData.id} />
            </section>
            <section className={'event-section border-l-0 p-2'}>
                <h2 className={'text-4xl border-b-2 border-b-gray-700 p-1'}>
                    Upplýsingar
                </h2>
                <div className={'ml-2 text-sm text-gray-300 mt-1'}>
                    <p>
                        Byrjar: {eventData.start_date.toLocaleString().replace('T', '@')}
                    </p>
                    <p>
                        Endar: {eventData.end_date.toLocaleString().replace('T', '@')}
                    </p>
                </div>
            </section>
        </div>
    )
}