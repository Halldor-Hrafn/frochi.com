import {formatTime} from "@/utils/utils";


export type ChatMessageProps = {
    created_at: Date;
    owner_name: string;
    message: string;
    className?: string;
}

export default function ChatMessage(props: ChatMessageProps) {

    return (
        <div className={`hover:bg-accent max-w-full ${props.className || ''}`}>
            <p>{props.owner_name} {formatTime(props.created_at)}</p>
            <p className={'text-xl text-wrap break-all'}>{props.message}</p>
        </div>
    )
}