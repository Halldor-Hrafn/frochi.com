import {signUpAction} from "@/app/actions";
import {FormMessage, Message} from "@/components/form-message";
import {SubmitButton} from "@/components/submit-button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;
    if ("message" in searchParams) {
        return (
            <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
                <FormMessage message={searchParams}/>
            </div>
        );
    }

    return (
        <>
            <form className="flex flex-col min-w-64 max-w-64 mx-auto">
                <h1 className="text-2xl font-medium">Stofna aðgang</h1>
                <p className="text-sm text text-foreground">
                    Átt núþegar aðgang?{" "}
                    <Link className="text-primary font-medium underline" href="/sign-in">
                        Skrá inn
                    </Link>
                </p>
                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                    <Label htmlFor="email">Netfang</Label>
                    <Input className="border-border" name="email" placeholder="you@example.com" required/>
                    <Label htmlFor="password">Lykilorð</Label>
                    <Input
                        className="border-border"
                        type="password"
                        name="password"
                        placeholder="Your password"
                        minLength={6}
                        required
                    />
                    <SubmitButton formAction={signUpAction} pendingText="Býr til aðgang....">
                        Stofna aðgang
                    </SubmitButton>
                    <FormMessage message={searchParams}/>
                </div>
            </form>
        </>
    );
}
