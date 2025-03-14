'use client'
import React, {useEffect, useState} from "react";
import {Event} from '@/lib/types'
import EventEntry from "@/components/event-entry";
import {toast, Toaster} from "react-hot-toast";
import {Button} from "@/components/ui/button";
import {CirclePlus} from "lucide-react";
import SearchBar from "@/components/search-bar";


/**
 * Returns true if the query describes the event well
 */
function eventSearchFilter(e: Event, query: string): boolean {
    const searchElements: (keyof Event)[] = ['title', 'description'];

    if (!query.trim()) return true; // If the query is empty, return true

    const tokens = query.toLowerCase().trim().split(/\s+/);

    for (let el of searchElements) {
        if (!e[el]) continue;
        const eventText = (e[el] as string).toLowerCase();

        for (let token of tokens) {
            if (eventText.includes(token)) return true;

            if (levenshteinDistance(eventText, token) <= 2) return true; // allow small misspelling
        }
    }

    return false;
}

/**
 * computes levenshtein distance (edit distance) between two strings.
 */
function levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
    }

    return dp[a.length][b.length];
}


export default function Page() {
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchAllEvents = async () => {
            setLoading(true);
            const res = await fetch('/api/events');

            if (!res.ok) {
                toast.error("Náði ekki að sækja viðburði :/")
                return;
            }

            const data = (await res.json()).map((e: any) => {
                return {
                    ...e,
                    start_date: new Date(e.start_date),
                    end_date: new Date(e.end_date),
                    created_at: new Date(e.created_at)
                }
            });

            setAllEvents(data);
            setFilteredEvents(data);
            setLoading(false);
        }
        fetchAllEvents();
    }, []);


    function onQueryChange(query: string) {
        setFilteredEvents(
            allEvents.filter((e: Event) => eventSearchFilter(e, query))
        );
    }

    if (loading) {
        return (
            <div className="min-w-screen w-screen mx-auto">
                <div className={'flex items-center justify-center'}>
                    <h1 className="text-5xl pt-10 pb-4 text-center border-b border-b-primary px-4 ">Events</h1>
                </div>

                <div className="flex flex-col mt-4 ml-4 md:flex-row items-start gap-2 w-screen justify-start">
                    <Button variant={"default"} className="">
                        <CirclePlus className="mr-1" />
                        <a href="/?toast=ýttu á kortið til að velja staðsetningu fyrir viðburð">Búa til viðburð</a>
                    </Button>
                    <SearchBar onQueryChange={onQueryChange} />
                </div>

                <ul className='w-full min-w-[70px] min-h-[200px] grid grid-cols-1 md:grid-cols-3 gap-2 pt-8'>
                    {[...Array(9)].map((_, index) => (
                        <div key={index} className="m-2 rounded-sm bg-gray-300 animate-pulse h-40" />
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className="min-w-screen-lg mx-auto">
            <Toaster position="top-right"/>
            <div>
                <div className={'flex items-center justify-center'}>
                    <h1 className="text-5xl pt-10 pb-4 text-center border-b border-b-primary px-4 ">Events</h1>
                </div>
                <div className="flex flex-col mt-4 ml-4 md:flex-row items-start gap-2 w-screen justify-start">
                    <Button variant={"default"} className="">
                        <CirclePlus className="mr-1" />
                        <a href="/?toast=ýttu á kortið til að velja staðsetningu fyrir viðburð">Búa til viðburð</a>
                    </Button>
                    <SearchBar onQueryChange={onQueryChange} />
                </div>
                <ul className='min-w-[70px] min-h-[200px] grid grid-cols-1 md:grid-cols-3 gap-2 pt-8'>
                    {filteredEvents.map(event => (
                        <div key={event.id} className="m-2 rounded-sm hover:bg-gray-200 h-full">
                            <EventEntry key={event.id} event={event} />
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    )
}
