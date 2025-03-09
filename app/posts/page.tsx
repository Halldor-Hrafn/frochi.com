"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {Post as PostType} from '../../lib/types'
import {Post} from "@/components/ui/post";

export default function Page() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [headingInput, setHeadingInput] = useState("");
    const [contentInput, setContentInput] = useState("");

    const [userId, setUserId] = useState("");

    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error(error);
                return;
            } else {
                setUserId(user?.id || "");
            }
        };

        const fetchAllPosts = async () => {
            const res = await fetch('/api/posts')
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            } else {
                throw new Error("Failed to fetch message");
            }
        }
        fetchUser();
        fetchAllPosts();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    heading: headingInput,
                    content: contentInput,
                    user_id: userId
                })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch message");
            }

            setPosts((old) => {
                return [...old, {
                    heading: headingInput,
                    contents: contentInput,
                    owner_id: userId,
                    created_at: new Date().toLocaleString()
                }]
            })

        } catch (err) {
            console.error(err);
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit} className={'flex flex-col'}>
                <label htmlFor="heading-inp">Title</label>
                <input type="text" id={'heading-inp'} value={headingInput} onChange={(e) => setHeadingInput(e.target.value)}/>

                <label htmlFor="content-inp">Content</label>
                <input type="text" id={'content-inp'} value={contentInput} onChange={(e) => setContentInput(e.target.value)}/>

                <button type="submit">Post</button>
            </form>
            {userId && <p>User ID: {userId}</p>}
            {posts.map((post: PostType, idx: number) => (
                <Post key={idx} post={post}></Post>
            ))}
        </div>
    )
}
