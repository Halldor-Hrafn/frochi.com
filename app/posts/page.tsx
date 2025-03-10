"use client";

import React, {useEffect, useState} from "react";
import {createClient} from "@/utils/supabase/client";
import {Post as PostType} from "@/lib/types";
import {Post} from "@/components/ui/post";

export default function Page() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [headingInput, setHeadingInput] = useState("");
    const [contentInput, setContentInput] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [userId, setUserId] = useState("");

    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            const {data: {user}, error} = await supabase.auth.getUser();
            if (error) {
                console.error(error);
                return;
            } else {
                setUserId(user?.id || "");
            }
        };

        const fetchAllPosts = async () => {
            const res = await fetch("/api/posts");
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            } else {
                console.error("Failed to fetch posts");
            }
        };

        fetchUser();
        fetchAllPosts();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const uploadFileToSupabase = async (file: File) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        setUploading(true);
        const {data, error} = await supabase.storage.from("post-images").upload(filePath, file);
        setUploading(false);

        if (error) {
            console.error("failed to upload file: ", error.message);
            return null;
        }

        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-images/${filePath}`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!userId) {
            alert("You must be logged in to post");
            return;
        }
        let imageUrl: string | null = "";
        if (file) {
            imageUrl = await uploadFileToSupabase(file);
            if (!imageUrl) return;
        }

        try {
            const response = await fetch("/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    heading: headingInput,
                    content: contentInput,
                    user_id: userId,
                    image_url: imageUrl
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create post");
            }

            setPosts((old) => [
                {
                    heading: headingInput,
                    contents: contentInput,
                    owner_id: userId,
                    created_at: new Date().toISOString(),
                    image_url: imageUrl
                },
                ...old
            ]);

            setHeadingInput("");
            setContentInput("");
            setFile(null);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <label htmlFor="heading-inp">Title</label>
                <input
                    type="text"
                    id="heading-inp"
                    value={headingInput}
                    onChange={(e) => setHeadingInput(e.target.value)}
                />

                <label htmlFor="content-inp">Content</label>
                <input
                    type="text"
                    id="content-inp"
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                />

                <label htmlFor="file-inp">Upload Image</label>
                <input type="file" id="file-inp" onChange={handleFileChange} accept="image/*"/>

                <button type="submit" disabled={uploading}>
                    {uploading ? "Uploading..." : "Post"}
                </button>
            </form>

            {userId && <p>User ID: {userId}</p>}

            {posts.map((post: PostType, idx: number) => (
                <Post key={idx} post={post}/>
            ))}
        </div>
    );
}
