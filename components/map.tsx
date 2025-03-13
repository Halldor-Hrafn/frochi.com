import L, { LatLng } from 'leaflet';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createClient } from '@/utils/supabase/client';
import { type MarkerData } from '@/lib/types';

function chooseIcon(icon: string) {
    switch (icon) {
        case "icon1":
            return new L.Icon({
                iconUrl: '/marker-icon_1.png',
                iconSize: [41, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
            });
            break;
        case "icon2":
            return new L.Icon({
                iconUrl: '/marker-icon_2.png',
                iconSize: [41, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
            });
            break;
    }
}

function renderMarkers(data: MarkerData[]) {
    return data.map((marker, index) => {
        const icon = chooseIcon(marker.icon);
        return (
            <Marker key={index} position={[marker.lat, marker.lng]} icon={icon}>
                <Popup>
                    <div>
                        <h3>{marker.name}</h3>
                        <p>{marker.description}</p>
                    </div>
                </Popup>
            </Marker>
        )
    })
}

function LocationMarker() {
    const [markers, setMarkers] = useState<LatLng[]>([]);
    const map = useMapEvents({
        click(e) {
            const newMarker = e.latlng;
            setMarkers([...markers, newMarker]);
            console.log('Map clicked at:', newMarker);
        },
    });

    return (
        <>
            {markers.map((position, index) => (
                <Marker key={index} position={position}>
                    <Popup>You clicked here</Popup>
                </Marker>
            ))}
        </>
    );
}

export default function Map() {
    const supabase = createClient();

    const [data, setData] = useState<MarkerData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetch('/api/events');
            const json = await data.json();
            setData(json);
        }
        fetchData();
    }, []);

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "50vh", width: "50vw" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {renderMarkers(data)}
            <LocationMarker />
        </MapContainer>
    );
}
