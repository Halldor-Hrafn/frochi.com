
export type Event = {
    id: string;
    title: string;
    description: string;
    start_date: Date;
    end_date: Date;
    created_at: Date;
    lat: number;
    lon: number;
    owner_id: string;
}

export type Message = {
    id: string;
    owner_id: string;
    owner_name: string; // this is not actually in the schema
    event_id: string;
    message: string;
    created_at: Date;
}

export type MarkerData = {
    name: string;
    lat: number;
    lng: number;
    icon: string;
    description: string;
}
