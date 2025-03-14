import L, {LatLng, LeafletMouseEvent} from 'leaflet';
import {useState, useEffect} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {createClient} from '@/utils/supabase/client';
import {type MarkerData} from '@/lib/types';

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
            <Marker title={marker.title} key={index} position={[marker.lat, marker.lng]} icon={icon}>
                <Popup>
                    <div>
                        <h3>{marker.title}</h3>
                        <p>{marker.description}</p>
                    </div>
                </Popup>
            </Marker>
        )
    })
}

function MapEventHandler({onClick}: { onClick: (evt: LeafletMouseEvent) => void }) {
    const map = useMapEvents({
        click(e) {
            onClick(e)
        },
    });

    return (
        <>

        </>
    );
}

export type MapProps = {
    className?: string;
    data: MarkerData[];
    width: string;
    height: string;
    onClick: (evt: LeafletMouseEvent) => void;
}

export default function Map({className, data, width, height, onClick}: MapProps) {
    return (
        <div className={`${className || ""}`}>
            <MapContainer center={[64.10589550758499, -21.817974854458868]} zoom={12}
                          style={{height: height, width: width}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {renderMarkers(data)}
                <MapEventHandler onClick={onClick}/>
            </MapContainer>
        </div>
    );
}
