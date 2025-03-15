
export default function UserProfile({ username, profile_image }: { username: string | null, profile_image: string }) {
    return (
        <div>
            <div className="max-w-7xl flex flex-col gap-12 items-start m-10">
                <div className="mx-auto text-center">
                    <div className="flex justify-center items-center">
                        <img 
                        src={profile_image} 
                        alt="Profile Image" 
                        width="200px"
                        className="max-w-full rounded-[50%] size-[200px]"/>
                    </div>
                    <h2 className="text-2xl">{username}</h2>
                </div>
            </div>
        </div>
    )
}