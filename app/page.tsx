"use client"

import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import type {MarkerData} from "@/lib/types";
import {LatLng, LeafletMouseEvent} from "leaflet";
import NewEventForm from "@/components/new-event-form";
const Map = dynamic(() => import('@/components/map'), {ssr: false});

export default function Home() {
    const [data, setData] = useState<MarkerData[]>([]);
    const [currPos, setCurrPos] = useState<LatLng | null>(null);
    const [showEventForm, setShowEventForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('/api/events');
            const json = await data.json();
            setData(json);
        }
        fetchData();
    }, []);


    function onMapClick(evt: LeafletMouseEvent) {
        const pos = evt.latlng;
        setCurrPos(pos);
        data.pop(); // removes the last marker

        setData(old => [
            ...old,
            {
                lng: pos.lng,
                lat: pos.lat,
                icon: "icon2",
                description: "Event location",
                title: "New event",
            }
        ]);

        setShowEventForm(true);
    }

    return (
        <>
            <main className="flex-1 flex flex-col px-4">
                <h2 className="font-medium text-xl mt-2">Allir viðburðir</h2>
                <p className={'text-gray-800'}>Ýttu á kortið til að búa til viðburð.</p>
                <div className="flex flex-col w-3/4 md:flex-row">
                    <Map width={'70vw'} height={'40vh'} data={data} className={'pt-2'} onClick={onMapClick}/>
                    <NewEventForm visible={showEventForm} pos={currPos}/>
                </div>
            </main>
        </>
    );
}
