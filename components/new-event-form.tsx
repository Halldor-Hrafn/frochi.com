import {FormEvent, useEffect, useState} from "react";
import {LatLng} from "leaflet";


export default function NewEventForm({visible, pos}: {visible: boolean, pos?: LatLng}) {
    const [locationName, setLocationName] = useState("---");

    useEffect(() => {
        const fetchLocationName = async () => {
            if (!pos) return;

            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`)

            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setLocationName(`${data.address.road || ""} ${data.address.house_number || ""}, ${data.address.postcode || ""} ${data.address.city || ""}`);
            } else {
                console.error("Failed to fetch location data: ", res.status);
            }
        }

        fetchLocationName();
    }, [pos]);

    function onFormSubmit(e: FormEvent) {
        e.preventDefault();
    }

    return (
        <div className={`m-4 p-2 border-2 h-fit border-gray-950 rounded ${visible ? '' : 'hidden'}`}>
            <p>Stofna viðburð</p>
            <form className={'flex flex-col'} onSubmit={onFormSubmit}>
                <label htmlFor="title-inp">Nafn viðburðs</label>
                <input type="text" id={'title-inp'} required/>

                <label htmlFor="desc-inp">Lýsing</label>
                <input type="text" id={'desc-inp'} required/>

                <label htmlFor="location-inp">Staðsetning</label>
                <input type="text" id={'location-inp'} value={locationName} readOnly/>

                <label htmlFor="startdate-inp">Byrjar</label>
                <input type="datetime-local" id={'startdate-inp'} required/>


                <label htmlFor="enddate-inp">Endar</label>
                <input type="datetime-local" id={'enddate-inp'} required/>

                <button className={'my-4'} type={'submit'} value="">Stofna viðburð</button>
            </form>
        </div>
    )
}