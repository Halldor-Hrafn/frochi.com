import {useEffect, useState} from "react";
import {Search} from "lucide-react";
import {cn} from "@/utils/utils";
import {buttonVariants} from "@/components/ui/button";


export type SearchBarProps = {
    onQueryChange: (query: string) => void;
}

export default function SearchBar(props: SearchBarProps) {
    const [query, setQuery] = useState("");

    useEffect(() => {
        props.onQueryChange(query);
    }, [query]);

    return (
        <div className={cn(buttonVariants({variant: 'default'}), '!pl-2 flex items-center border border-gray-900 max-w-sm')}>
            <Search/>
            <input
                className={cn('!border-0 focus:border-0 focus:ring-0 focus:outline-none px-2 py-1')}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={'Leita...'}
            />
        </div>
    );
}