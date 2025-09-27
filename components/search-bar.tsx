import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/utils/utils"

export type SearchBarProps = {
    onQueryChange: (query: string) => void
}

export default function SearchBar(props: SearchBarProps) {
    const [query, setQuery] = useState("")

    useEffect(() => {
        props.onQueryChange(query)
    }, [query])

    return (
        <div
            className={cn(
                "flex items-center gap-2 w-full max-w-sm",
                "rounded-md border border-border bg-background px-2 ",
                "text-sm text-foreground shadow-sm"
            )}
        >
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
                className={cn(
                    "!border-0 flex-1 bg-transparent placeholder-muted-foreground",
                    "focus:outline-none focus:ring-0"
                )}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Leita..."
            />
        </div>
    )
}
