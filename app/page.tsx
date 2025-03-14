"use client"

import dynamic from "next/dynamic";
<<<<<<< HEAD
import { useEffect, useState } from "react";
import type { MarkerData } from "@/lib/types";
import { LatLng, LeafletMouseEvent } from "leaflet";
import NewEventForm from "@/components/new-event-form";
import { Button } from "@/components/ui/button";
import {CirclePlus} from "lucide-react"; // Assuming you have a button component

const Map = dynamic(() => import('@/components/map'), { ssr: false });

const MOBILE_VIEW_MAX_WIDTH = 768;

export default function Home() {
    const [data, setData] = useState<MarkerData[]>([]);
    const [currPos, setCurrPos] = useState<LatLng | undefined>(undefined);
    const [showEventForm, setShowEventForm] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/events');
            const json = await res.json();
            setData(json);
        };
        fetchData();

        const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_VIEW_MAX_WIDTH);
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function onMapClick(evt: LeafletMouseEvent) {
        const pos = evt.latlng;
        setCurrPos(pos);
        data.pop(); // removes the previous marker
=======
import {useEffect, useState} from "react";
import type {MarkerData} from "@/lib/types";
import {LatLng, LeafletMouseEvent} from "leaflet";
import NewEventForm from "@/components/new-event-form";
const Map = dynamic(() => import('@/components/map'), {ssr: false});

export default function Home() {
    const [data, setData] = useState<MarkerData[]>([]);
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
        data.pop(); // removes the last marker
>>>>>>> 5cffac2 (resolve conflicts when merging with smth)

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
<<<<<<< HEAD
            <main className="flex flex-col items-center w-full min-w-screen max-w-screen mx-auto px-4">
                {/*mobile only*/}
                {isMobile && showEventForm && <NewEventForm visible={showEventForm} pickedPos={currPos} />}

                {isMobile && (
                    <Button onClick={() => setShowEventForm(!showEventForm)} className="mt-2">
                        {showEventForm ? "Loka viðburðaformi" :
                            (
                                <div className={'flex items-center gap-2'}>
                                    <CirclePlus/>
                                    <p>Búa til viðburð</p>
                                </div>
                            )
                        }
                    </Button>
                )}

                {/*desktop layout */}
                <div className={`flex ${isMobile ? "flex-col" : "flex-row"} items-start w-full gap-4 mt-4`}>
                    <div className="flex flex-col w-full">
                        <h2 className="font-medium text-xl">Allir viðburðir</h2>
                        <p className="text-gray-800">Ýttu á kortið til að búa til viðburð.</p>

                        <Map
                            width={isMobile ? "90vw" : "70vw"}
                            height={"60vh"}
                            data={data}
                            className={`pt-2`}
                            onClick={onMapClick}
                        />
                    </div>

                    {/*desktop only*/}
                    {!isMobile && <NewEventForm visible={showEventForm} pickedPos={currPos} />}
=======
            <main className="flex-1 flex flex-col px-4">
                <h2 className="font-medium text-xl mt-2">Allir viðburðir</h2>
                <p className={'text-gray-800'}>Ýttu á kortið til að búa til viðburð.</p>
                <div className="flex flex-col w-3/4 md:flex-row">
                    <Map width={'70vw'} height={'40vh'} data={data} className={'pt-2'} onClick={onMapClick}/>
                    <NewEventForm visible={showEventForm}/>
>>>>>>> 5cffac2 (resolve conflicts when merging with smth)
                </div>
            </main>
        </>
    );
}
