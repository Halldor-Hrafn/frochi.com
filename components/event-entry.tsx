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
                    <div className="min-h-[20px]">
                        <span className={'text-sm color-foreground pr-2'}>
                            {event.start_date.toLocaleDateString()} to {event.end_date.toLocaleDateString()}
                        </span>
                        <span className={'text-sm color-foreground px-2'}>
                            {event.participants.length} þáttakendur
                        </span>
                    </div>
                </h2>
                <p>{event.description}</p>
            </a>

        </li>
    )

}