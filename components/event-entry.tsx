import {Event} from "@/lib/types";
import Image from "next/image";

const DEFAULT_EVENT_IMAGE_URL = 'https://mgrvjblhrrdqenzoigif.supabase.co/storage/v1/object/public/event-images/default_event_cover.png';

export default function EventEntry({event}: { event: Event }) {
    return (
        <li
            key={event.id}
            className={'p-4 h-full rounded'}
        >
            <div>
                <Image src={(event as any).image_url || DEFAULT_EVENT_IMAGE_URL} alt={"event cover photo"} width={200} height={100}/>
                <div className="flex items-center justify-between">
                    <div>
                        <a href={`/events/${event.id}`}>
                            <h2 className={'text-2xl'}>{event.title}</h2>
                        </a>
                        <p className="text-foreground/70">{event.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={'text-sm color-foreground px-2'}>
                            {event.end_date.getTime() < new Date().getTime() ? (
                                <p className={'text-red-400'}>Búið</p>
                            ) : (
                                <p>{event.start_date.toLocaleDateString()} til {event.end_date.toLocaleDateString()}</p>
                            )}
                        </span>
                        <span className={'text-sm color-foreground px-2'}>
                            {event.participants.length} þáttakendur
                        </span>
                    </div>
                </div>
            </div>
            

        </li>
    )

}