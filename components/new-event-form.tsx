import {FormEvent, useEffect, useState} from "react";
import {LatLng} from "leaflet";

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

    function onFormSubmit(e: FormEvent) {
        e.preventDefault();
    }

    return (
        <div className={`p-2 border-2 h-fit max-w-7xl border-gray-950 rounded mt-4 lg:mt-16 ${visible ? '' : 'hidden'}`}>
            <h3 className={'text-center text-lg'}>Stofna viðburð</h3>
            <form className={'flex flex-row flex-wrap justify-center lg:flex-col'} onSubmit={onFormSubmit}>
                <div className="flex flex-col">
                    <label htmlFor="title-inp">Nafn viðburðs</label>
                    <input type="text" id={'title-inp'} required/>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="desc-inp">Lýsing</label>
                    <input type="text" id={'desc-inp'} required/>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="location-inp">Staðsetning</label>
                    <input className={'text-gray-700 !bg-gray-300'} type="text" id={'location-inp'} value={locationName} readOnly/>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="startdate-inp">Byrjar</label>
                    <input type="datetime-local" id={'startdate-inp'} required/>
                </div>


                <div className="flex flex-col">
                    <label htmlFor="enddate-inp">Endar</label>
                    <input type="datetime-local" id={'enddate-inp'} required/>
                </div>

                <button className={'my-4'} type={'submit'} value="">Stofna viðburð</button>
            </form>
        </div>
    )
}