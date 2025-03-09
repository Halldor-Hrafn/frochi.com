import {Post as PostType} from "@/lib/types";


export function Post({post}: {post: PostType }) {
    const getPostTimeStr = () => {
        const date = new Date(post.created_at);

        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
    return (
        <div className={'border-green-400 border-2 flex flex-col p-4'}>
            <p className={'text-sm'}>{getPostTimeStr()} </p>
            <h2 className={'text-3xl border-b-gray-400 border-b-2'}>{post.heading}</h2>
            <p className={'text-gray-400'}>{post.contents}</p>
        </div>
    )
}