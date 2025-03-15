import {Event} from "@/lib/types";

export default function EventEntry({event}: { event: Event }) {
    return (
        <li
            key={event.id}
            className={'p-4 h-full rounded hover:cursor-pointer'}
        >
            <a href={`/events/${event.id}`}>
                <h2 className={'border-b-2 border-b-gray-700 text-2xl'}>
                    {event.title}
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
                </h2>
                <p>{event.description}</p>
            </a>

        </li>
    )

}