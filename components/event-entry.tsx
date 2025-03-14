import { Event } from "@/lib/types";
import { redirect } from "next/navigation";

export default function EventEntry({event}:{event:Event}) {
return(    
    <li
    key={event.id}
    className={'p-4 h-full rounded hover:cursor-pointer'}
    onClick={(_) => redirect(`/events/${event.id}`)}
    >
        <h2 className={'border-b-2 border-b-gray-700 text-2xl'}>
            {event.title}
            <span className={'text-sm color-foreground px-2'}>
                {event.start_date.toLocaleDateString()} to {event.end_date.toLocaleDateString()}
            </span>
        </h2>
        <p>{event.description}</p>
    </li>
    )
    
}