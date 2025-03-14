"use client"

import dynamic from "next/dynamic";
import { useEffect, useState, Suspense } from "react";
import type { MarkerData } from "@/lib/types";
import { LatLng, LeafletMouseEvent } from "leaflet";
import NewEventForm from "@/components/new-event-form";
import {Button, buttonVariants} from "@/components/ui/button";
import {CirclePlus} from "lucide-react";
import {toast, Toaster} from "react-hot-toast";
import {AuthUser} from "@supabase/supabase-js";
import {createClient} from "@/utils/supabase/client";
import {useSearchParams} from "next/navigation";

const Map = dynamic(() => import('@/components/map'), { ssr: false });

const MOBILE_VIEW_MAX_WIDTH = 768;

function Fallback() {
    return <>loading...</>
}

const HomeComponent = () => {
    const [data, setData] = useState<MarkerData[]>([]);
    const [currPos, setCurrPos] = useState<LatLng | undefined>(undefined);
    const [showEventForm, setShowEventForm] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/events');
            if (!res.ok) {
                toast.error("Failed to fetch events.");
                return;
            }
            const json = await res.json();
            setData(json);
        };

        const fetchUser = async () => {
            const supabase = await createClient();
            const { error, data } = await supabase.auth.getUser();
            if (data && !error) {
                setUser(data.user);
            }
        };

        fetchData();
        fetchUser();

        const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_VIEW_MAX_WIDTH);
        handleResize();
        window.addEventListener("resize", handleResize);

        if (searchParams.get('toast')) {
            toast.success(searchParams.get('toast'), { duration: 10_000 });
        }

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function onMapClick(evt: LeafletMouseEvent) {
        if (!user) return;
        const pos = evt.latlng;
        setCurrPos(pos);

        if (data[data.length - 1].title === 'New Event') { // i know how shitty this is, but it works.
            data.pop(); // removes the previous marker
        }

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
            <Toaster position={'top-right'} />
            <main className="flex flex-col items-center w-full min-w-screen max-w-screen mx-auto px-4">
                {/*mobile only*/}
                {isMobile &&  <NewEventForm visible={showEventForm} pickedPos={currPos} />}

                <div className={`flex ${isMobile ? "flex-col" : "flex-row"} items-start w-full gap-4 mt-4`}>
                    <div className="flex flex-col w-full">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="font-medium text-xl">Allir viðburðir</h2>
                                <p>{user?.id ? 'Ýttu á kortið til að búa til viðburð.' : (
                                    <a href={'/sign-up'} className={'hover:cursor-pointer hover:underline hover:text-secondary-foreground'}>
                                        Skráðu þig inn til að búa til viðburð
                                    </a>
                                )}</p>
                            </div>
                            <Button onClick={() => setShowEventForm(!showEventForm)} className="mt-2">
                                {showEventForm ? "Loka viðburðaformi" :
                                    (
                                        <div className={'flex  gap-2'}>
                                            <CirclePlus />
                                            {!isMobile && (
                                                <p>Búa til viðburð</p>
                                            )}
                                        </div>
                                    )
                                }
                            </Button>
                        </div>


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
                </div>
            </main>
        </>
    );
};

export default function Home() {
    return (
        <Suspense fallback={<Fallback />}>
            <HomeComponent />
        </Suspense>
    );
}
