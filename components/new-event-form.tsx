import {FormEvent, useEffect, useState} from "react";
import {LatLng} from "leaflet";
import {createClient} from "@/utils/supabase/client";

/**
 *
 * @param osmData - open streetmap api data from https://nominatim.openstreetmap.org/reverse?format=json&lat=64.10589550758499&lon=-21.817974854458868
 */
function getLocationNameStr(osmData: any) {
    if (!osmData || typeof osmData !== "object") {
        return "Eitthvað fór úrskeiðis";
    }

    const {
        road,            // Street name
        house_number,    // House number (if available)
        suburb,          // Neighborhood / district
        city,            // City
        town,            // Town (alternative to city)
        village,         // Village (alternative to city/town)
        county,          // County / region
        state,           // State / province
        country,         // Country
    } = osmData.address || {};

    const street = road ? `${road}${house_number ? ` ${house_number}` : ""}` : "";
    const locality = city || town || village || suburb || "";
    const region = county || state || "";

    const locationParts = [street, locality, region, country].filter(Boolean);

    return locationParts.length ? locationParts.join(", ") : "Ónákvæm mæling";
}

export default function NewEventForm({visible, pickedPos}: {visible: boolean, pickedPos?: LatLng}) {
    const [locationName, setLocationName] = useState("---");

    const supabase = createClient();

    useEffect(() => {
        const fetchLocationName = async () => {
            if (!pickedPos) return;

            setLocationName("---")

            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pickedPos.lat}&lon=${pickedPos.lng}`)

            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setLocationName(getLocationNameStr(data));
            } else {
                console.error("Failed to fetch location data: ", res.status);
            }
        }

        fetchLocationName();
    }, [pickedPos]);

    async function onFormSubmit(e: FormEvent) {
        e.preventDefault();

        const form = e.target;
        let body = Object.fromEntries(new FormData(form as any));

        const {data, error} = await supabase.auth.getUser();
        if (error || !data) {
            console.log("not logged in")
            return;
        }
        body = {
            ...body,
            owner_id: data.user?.id,
            lat: `${pickedPos?.lat}`,
            lng: `${pickedPos?.lng}`,
            icon: 'icon1'
        }

        const res = await fetch("/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

    }

    return (
        <div className={`p-2 border-2 h-fit max-w-7xl border-foreground rounded mt-4 lg:mt-16 ${visible ? '' : 'hidden'}`}>
            <h3 className={'text-center text-lg'}>Stofna viðburð</h3>
            <form className={'flex flex-row flex-wrap justify-center lg:flex-col'} onSubmit={onFormSubmit}>
                <div className="flex flex-col">
                    <label htmlFor="title-inp">Nafn viðburðs</label>
                    <div className="bg-input w-full">
                        <input className="w-full" name={'title'} type="text" id={'title-inp'} required/>
                    </div>  
                </div>

                <div className="flex flex-col">
                    <label htmlFor="desc-inp">Lýsing</label> 
                    <div className="bg-input w-full rounded">
                        <input className="w-full" name={'description'} type="text" id={'desc-inp'} required/>
                    </div>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="location-inp">Staðsetning</label>
                    <input className={'text-gray-400 !bg-gray-200 rounded'} type="text" id={'location-inp'} value={locationName} readOnly/>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="startdate-inp">Byrjar</label> 
                    <div className="bg-input w-full rounded">
                        <input className="w-full" name={'start_date'} type="datetime-local" id={'startdate-inp'} required/>
                    </div>
                </div>


                <div className="flex flex-col">
                    <label htmlFor="enddate-inp">Endar</label> 
                    <div className="bg-input w-full rounded">
                        <input className="w-full" name={'end_date'} type="datetime-local" id={'enddate-inp'} required/>
                    </div>
                </div>

                <button className={'my-4'} type={'submit'} value="">Stofna viðburð</button>
            </form>
        </div>
    )
}