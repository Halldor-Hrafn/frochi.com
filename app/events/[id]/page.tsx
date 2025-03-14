"use client";

import React, { useEffect, useState } from "react";
import { Event } from '@/lib/types';
import EventChatRoom from "@/components/event-chatroom";
import {buttonVariants} from "@/components/ui/button";
import {AuthUser} from "@supabase/supabase-js";
import {createClient} from "@/utils/supabase/client";
import {Pencil} from "lucide-react";
import { cn } from "@/lib/utils";

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function Page({ params }: PageProps) {
    const [eventData, setEventData] = useState<Event | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<Event>>({});
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isUserInThisEvent, setIsUserInThisEvent] = useState<boolean>(false);

    useEffect(() => {
        const unwrapParams = async () => {
            const unwrappedParams = await params;
            setEventId(unwrappedParams.id);
        };

        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!eventId) return;

        const fetchEventData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/events/?eventId=${eventId}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        setError(new Error("This event does not exist"));
                        return;
                    }

                    setError(new Error(res.statusText));
                    return;
                }

                setIsUserInThisEvent(isInThisEvent());


                const data = await res.json();
                console.log('event id ', data.owner_id)

                setEventData(data);
                setFormData(data);
            } catch (e: any) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [eventId]);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = await createClient();
            const {error, data} = await supabase.auth.getUser();
            if (data && !error) {
                setUser(data.user);
                console.log('usr id:', data.user.id)
            }
        }

        fetchUser();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/events`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, id: eventId }),
            });

            if (!res.ok) {
                throw new Error('Failed to update event');
            }

            const updatedEvent = await res.json();
            console.log(updatedEvent.id);
            setEventData(updatedEvent);
            setIsEditing(false);
        } catch (e: any) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    const isInThisEvent = () => {
        if (!eventData) {
            return false;
        }

        return eventData.participants.map(u => u.user_id).includes(user?.id || "");
    }

    const joinEvent = async () => {
        const res = await fetch(`/api/events/join`, {
            method: 'POST',
            body: JSON.stringify({
                event_id: eventId,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        setIsUserInThisEvent(true);
    }

    const leaveEvent = async () => {
        const res = await fetch(`/api/events/leave`, {
            method: 'POST',
            body: JSON.stringify({
                event_id: eventId,
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        setIsUserInThisEvent(false);
    }

    const leaveOrJoinEvent = async () => {
        if (isInThisEvent()) {
            await leaveEvent();
        } else {
            await joinEvent();
        }
    }

    if (loading) {
        console.log('Loading:', loading);
        return (
            <div className={'flex min-h-screen justify-between w-screen'}>
                <section className={'event-section w-2/3'}>
                    loading...
                </section>
                <section className={'event-section'}>
                    loading...
                </section>
            </div>
        );
    }

    if (!eventData) {
        console.log('Event data not found:', eventData);
        return (
            <div className={'flex min-h-screen justify-between w-screen'}>
                <section className={'event-section w-2/3'}>
                    Event data not found...
                </section>
                <section className={'event-section'}>
                    Event data not found...
                </section>
            </div>
        );
    }

    return (
        <div className={'flex min-h-screen justify-between w-screen'}>
            <section className={'event-section w-2/3'}>
                <div className={'border-2 border-gray-700 p-4 rounded'}>
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="title"
                                value={formData.title || ''}
                                onChange={handleInputChange}
                                className="block w-full p-2 border border-gray-300 rounded mb-2"
                            />
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                className="block w-full p-2 border border-gray-300 rounded mb-2"
                            />
                            <input
                                type="datetime-local"
                                name="start_date"
                                value={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
                                onChange={handleInputChange}
                                className="block w-full p-2 border border-gray-300 rounded mb-2"
                            />
                            <input
                                type="datetime-local"
                                name="end_date"
                                value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
                                onChange={handleInputChange}
                                className="block w-full p-2 border border-gray-300 rounded mb-2"
                            />
                            <input type="hidden" name="eventId" value={eventData.id} />
                            <input type="hidden" name="owner_id" value={eventData.owner_id} />
                            <input type="hidden" name="lat" value={eventData.lat} />
                            <input type="hidden" name="lng" value={eventData.lng} />
                            <input type="hidden" name="icon" value="icon2" />

                            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</button>
                        </form>
                    ) : (
                        <div className={'flex justify-between'}>
                            <div>
                                <h2 className={'text-4xl border-b-2 border-b-gray-700 m-2'}>
                                    {eventData.title}
                                </h2>
                                <p className={'text-lg p-2'}>
                                    {eventData.description}
                                </p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={cn(buttonVariants({variant: "default"}), `${eventData.owner_id !== user?.id ? '!hidden' : ''} flex flex-row items-center gap-1 ml-2`)}
                                >
                                    <Pencil size={16}/>
                                    Breyta
                                </button>
                            </div>
                            <div className={'flex flex-col gap-2'}>
                                <button onClick={leaveOrJoinEvent}>
                                    {isUserInThisEvent ? "Fara úr viðburði" : "Taka þátt"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <EventChatRoom eventId={eventData.id} />
            </section>
            <section className={'event-section border-l-0 p-2'}>
                <h2 className={'text-4xl border-b-2 border-b-gray-700 p-1'}>
                    Upplýsingar
                </h2>
                <div className={'ml-2 text-sm color-foreground mt-1'}>
                    <p>
                        Byrjar: {new Date(eventData.start_date).toLocaleString().replace('T', '@')}
                    </p>
                    <p>
                        Endar: {new Date(eventData.end_date).toLocaleString().replace('T', '@')}
                    </p>
                    <br/>
                    <br/>
                    <p>
                        Þátttakendur {eventData.participants.length}
                    </p>
                </div>
            </section>
        </div>
    );
}