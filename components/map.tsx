import L, { LatLng } from 'leaflet';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MarkerData {
    name: string;
    lat: number;
    lng: number;
    icon: string;
    description: string;
}

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

// function LocationMarker() {
//     const [position, setPosition] = useState<LatLng | null>(null);
//     const map = useMapEvents({
//         click(e) {
//             setPosition(map.getCenter());
//             map.flyTo(map.getCenter(), map.getZoom());

//             console.log("Map clicked at:", )
//         }
//     })
// }

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
    const dummyData: MarkerData[] = [
        {
            "name": "blabla1",
            "lat": 51.505,
            "lng": -0.09,
            "icon": "icon1",
            "description": "description1"
        },
        {
            "name": "blabla2",
            "lat": 51.515,
            "lng": -0.19,
            "icon": "icon2",
            "description": "description2"
        }
    ]

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "50vh", width: "50vw" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {renderMarkers(dummyData)}
            <LocationMarker />
        </MapContainer>
    );
}
