import {formatTime} from "@/utils/utils";


export type ChatMessageProps = {
    created_at: Date;
    owner_id: string;
    owner_name: string;
    owner_icon_url: string;
    message: string;
    className?: string;
}

export default function ChatMessage(props: ChatMessageProps) {

    return (
        <div className={`hover:bg-accent max-w-full ${props.className || ''}`}>
            <div className="flex items-center gap-2">

            <a href={"/user/" + props.owner_id}>
                <img className={'size-8 rounded-[50%]'} src={props.owner_icon_url} alt="pfp"/>
            </a>
            <a href={"/user/" + props.owner_id}>
                <p>{props.owner_name} <span className={'text-muted-foreground text-sm'}>{formatTime(props.created_at)}</span> </p>
            </a>
                
            </div>
            <p className={'text-xl text-wrap break-all'}>{props.message}</p>
        </div>
    )
}