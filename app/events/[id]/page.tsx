"use client";

import React, { useEffect, useState } from "react";
import { Event } from '@/lib/types';
import EventChatRoom from "@/components/event-chatroom";
import {Button, buttonVariants} from "@/components/ui/button";
import { AuthUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import {CalendarDays, Crown, Hourglass, MapPin, Pencil, PersonStanding} from "lucide-react";
import { cn } from "@/utils/utils";

type PageProps = {
    params: Promise<{ id: string }>;
};


function PageSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-screen p-6 bg-white text-black w-screen">
            <section className="flex-1 p-6 border border-gray-300 rounded-lg shadow-sm space-y-4">
                <div className="bg-gray-300 animate-pulse h-8 w-1/3 rounded"></div>
                <div className="bg-gray-300 animate-pulse h-4 w-2/3 rounded"></div>
                <div className="bg-gray-300 animate-pulse h-24 w-full rounded"></div>
                <div className="bg-gray-300 animate-pulse h-10 w-1/2 rounded"></div>
            </section>

            <section className="w-full lg:w-1/3 p-6 border border-gray-300 rounded-lg shadow-sm space-y-4">
                <div className="bg-gray-300 animate-pulse h-6 w-1/4 rounded"></div>
                <div className="space-y-2">
                    <div className="bg-gray-300 animate-pulse h-4 w-2/3 rounded"></div>
                    <div className="bg-gray-300 animate-pulse h-4 w-3/4 rounded"></div>
                    <div className="bg-gray-300 animate-pulse h-4 w-1/2 rounded"></div>
                    <div className="bg-gray-300 animate-pulse h-4 w-full rounded"></div>
                </div>
            </section>
        </div>
    );
}

export default function Page({ params }: PageProps) {
    const [eventData, setEventData] = useState<Event | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
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
            try {
                const res = await fetch(`/api/events/?eventId=${eventId}`);
                if (!res.ok) {
                    throw new Error("Event not found");
                }

                const data = await res.json();
                setEventData(data);
                setFormData(data);
            } catch {
                setEventData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [eventId]);

    useEffect(() => {
        setIsUserInThisEvent(isInThisEvent());
    }, [eventData]);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = await createClient();
            const { data, error } = await supabase.auth.getUser();
            if (!error) {
                setUser(data.user);
            }
        };

        fetchUser();
    }, []);

    const isInThisEvent = () => {
        return eventData?.participants.some(u => u.user_id === user?.id) || false;
    };

    const leaveOrJoinEvent = async () => {
        await fetch(`/api/events/${isInThisEvent() ? "leave" : "join"}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event_id: eventId }),
        });
        setIsUserInThisEvent(prev => !prev);
    };

    if (loading) {
        return <PageSkeleton/>
    }

    if (!eventData) {
        return (
            <div className="flex flex-col lg:flex-row gap-6 min-h-screen p-6 bg-white text-black w-screen">
                <h1>Þessi viðburður fannst ekki</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-screen p-6 bg-white text-black w-screen">
            {/* left section */}
            <section className="flex-1 p-6 border border-gray-300 rounded-lg shadow-sm">
                <div className="mb-4">
                    {isEditing ? (
                        <form className="space-y-3">
                            <input
                                type="text"
                                name="title"
                                value={formData.title || ''}
                                className="w-full p-2 border rounded-md"
                            />
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                className="w-full p-2 border rounded-md"
                                rows={4}
                            />
                            <input
                                type="datetime-local"
                                name="start_date"
                                value={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
                                className="w-full p-2 border rounded-md"
                            />
                            <input
                                type="datetime-local"
                                name="end_date"
                                value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
                                className="w-full p-2 border rounded-md"
                            />
                            <button type="submit" className="w-full bg-black text-white py-2 rounded-md">
                                Save Changes
                            </button>
                        </form>
                    ) : (
                        <div>
                            <h1 className="text-3xl font-bold border-b pb-2">{eventData.title}</h1>
                            <p className="text-gray-700 mt-2">{eventData.description}</p>
                            {eventData.owner_id === user?.id && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 mt-4 px-3 py-2 text-sm font-semibold border rounded-md"
                                >
                                    <Pencil size={16} />
                                    Edit Event
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <Button
                    variant="default"
                    onClick={leaveOrJoinEvent}
                    className=""
                >
                    {isUserInThisEvent ? "Yfirgefa atburð" : "Taka þátt"}
                </Button>
                <EventChatRoom user={user} eventId={eventData.id} />
            </section>

            {/* right section */}
            <section className="w-full lg:w-1/3 p-6 border border-gray-300 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold border-b pb-2">Event Information</h2>
                <div className="mt-4 space-y-2">
                    <p className={'flex flex-row items-center'}>
                        <CalendarDays/>
                        <strong>Byrjar: </strong>
                        &nbsp;{new Date(eventData.start_date).toLocaleString()}
                    </p>
                    <p className={'flex flex-row items-center'}>
                        <Hourglass/>
                        <strong>Endar: </strong>
                        &nbsp;{new Date(eventData.end_date).toLocaleString()}
                    </p>
                    <p className={'flex flex-row items-center'}>
                        <PersonStanding/>
                        <strong> Þáttakendur: </strong>
                        &nbsp;{eventData.participants.length}
                    </p>
                    <p className={'flex flex-row items-center'}>
                        <MapPin/>
                        <strong>Staðsetning:</strong>
                        &nbsp;[Implement Location]
                    </p>
                    <p className={'flex flex-row items-center'}>
                        <Crown/>
                        <strong>Skipuleggjandi: </strong>
                        &nbsp;[Implement Organizer Name]
                    </p>
                </div>
            </section>
        </div>
    );
}
