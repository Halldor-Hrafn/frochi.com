import { Event } from "@/lib/types"
import Image from "next/image"

const DEFAULT_EVENT_IMAGE_URL =
    "https://mgrvjblhrrdqenzoigif.supabase.co/storage/v1/object/public/event-images/default_event_cover.png"

export default function EventEntry({ event }: { event: Event }) {
    return (
        <li
            key={event.id}
            className="p-4 h-full rounded border border-border bg-card shadow-sm flex flex-col gap-3"
        >
            <div className="relative w-full h-48 rounded-md overflow-hidden">
                <Image
                    src={(event as any).image_url || DEFAULT_EVENT_IMAGE_URL}
                    alt="event cover photo"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex flex-col flex-1 gap-2">
                <a href={`/events/${event.id}`}>
                    <h2 className="text-xl font-semibold text-foreground break-words leading-tight line-clamp-2">
                        {event.title}
                    </h2>
                </a>
                <p className="text-sm text-foreground/70 line-clamp-2">
                    {event.description}
                </p>
            </div>

            <div className="flex items-start justify-between mt-auto">
                <div className="flex flex-col text-sm text-foreground/80">
                    {event.end_date.getTime() < new Date().getTime() ? (
                        <span className="text-red-400 font-medium">Búið</span>
                    ) : (
                        <span>
                            {event.start_date.toLocaleDateString()} –{" "}
                            {event.end_date.toLocaleDateString()}
                        </span>
                    )}
                </div>
                <div className="flex flex-col items-end text-sm text-foreground/70 shrink-0">
                    <span>{event.participants.length} þáttakendur</span>
                </div>
            </div>
        </li>
    )
}
