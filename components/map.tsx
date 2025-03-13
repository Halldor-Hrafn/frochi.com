import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Define custom icon
const customIcon = new L.Icon({
    iconUrl: '/marker-icon_1.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const differentIcon = new L.Icon({
    iconUrl: '/marker-icon_2.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
})

export default function Map() {
    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "50vh", width: "50vw" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]} icon={customIcon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            <Marker position={[51.515, -0.19]} icon={differentIcon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
}
