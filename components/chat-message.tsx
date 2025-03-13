

export type ChatMessageProps = {
    created_at: Date;
    owner_name: string;
    message: string;
    className?: string;
}

export default function ChatMessage(props: ChatMessageProps) {

    return (
        <div className={`hover:bg-gray-800 ${props.className || ''}`}>
            <p>{props.owner_name} {props.created_at.toLocaleTimeString()}</p>
            <p className={'text-xl'}>{props.message}</p>
        </div>
    )
}