import {signOutAction} from "@/app/actions";
import {hasEnvVars} from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import {Badge} from "./ui/badge";
import {Button} from "./ui/button";
import {createClient} from "@/utils/supabase/server";
import {EnvVarWarning} from "./env-var-warning";
import {getProfileImageLinkFromId, getUsernameFromId} from "@/utils/supabase/user";
import {ThemeSwitcher} from "@/components/theme-switcher";


export default function Navbar() {
    return (
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">

                    <Link className={'size-10'} href={"/"}>
                        <img alt={"Home"} src={'/frochi.png'}/>
                    </Link>

                    <Button asChild size="sm" variant={"outline"}>
                        <Link href="/events">Events</Link>
                    </Button>
                </div>
                <div className="flex gap-5 items-center font-semibold">
                    {!hasEnvVars ? <EnvVarWarning/> : <AuthButton/>}
                    <ThemeSwitcher/>
                </div>
            </div>
        </nav>
    )

}


async function AuthButton() {
    const supabase = await createClient();
    const {
        data: {user},
    } = await supabase.auth.getUser();

    const profile_image = user ? await getProfileImageLinkFromId(user.id)
        : "https://emqvjwtowgujddqurtnb.supabase.co/storage/v1/object/public/profile-images//default_profile_image.png"


    const username = user ? await getUsernameFromId(user.id) : "Something has gone wrong"

    if (!hasEnvVars) {
        return (
            <>
                <div className="flex gap-4 items-center">
                    <div>
                        <Badge
                            variant={"default"}
                            className="font-normal pointer-events-none"
                        >
                            Please update .env.local file with anon key and url
                        </Badge>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            asChild
                            size="sm"
                            variant={"outline"}
                            disabled
                            className="opacity-75 cursor-none pointer-events-none"
                        >
                            <Link href="/sign-in">Sign in</Link>
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            variant={"default"}
                            disabled
                            className="opacity-75 cursor-none pointer-events-none"
                        >
                            <Link href="/sign-up">Sign up</Link>
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return user ? (
        <div className="flex  items-center gap-4">
            <a href="/user">
                <div className="rounded">
                    <img
                        src={profile_image}
                        alt=""
                        width="32"
                        height="32"
                        className="rounded-[50%]"/>
                </div>
            </a>
            <form action={signOutAction}>
                <Button type="submit" variant={"outline"}>
                    Sign out
                </Button>
            </form>
        </div>
    ) : (
        <div className="flex gap-2">
            <Button asChild size="sm" variant={"outline"}>
                <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant={"default"}>
                <Link href="/sign-up">Sign up</Link>
            </Button>
        </div>
    );
}

