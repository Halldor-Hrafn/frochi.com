"use client"

import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import type {MarkerData} from "@/lib/types";
import {LatLng, LeafletMouseEvent} from "leaflet";
import NewEventForm from "@/components/new-event-form";
const Map = dynamic(() => import('@/components/map'), {ssr: false});

export default function Home() {
    const [data, setData] = useState<MarkerData[]>([]);
    const [currPos, setCurrPos] = useState<LatLng | undefined>(undefined);
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
            <main className="flex-1 flex flex-col mx-4">

                <div className="flex flex-col items-start w-3/4 lg:flex-row">
                    <NewEventForm visible={showEventForm} pos={currPos}/>
                    <div>
                        <h2 className="font-medium text-xl mt-2">Allir viðburðir</h2>
                        <p className={'text-gray-800'}>Ýttu á kortið til að búa til viðburð.</p>
                        <Map width={window.screen.width < 1000 ? '90vw' : '70vw'} height={'60vh'} data={data} className={'pt-2'} onClick={onMapClick}/>
                    </div>
                </div>
            </main>
        </>
    );
}
