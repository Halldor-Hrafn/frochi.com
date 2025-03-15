import {signInAction} from "@/app/actions";
import {FormMessage, Message} from "@/components/form-message";
import {SubmitButton} from "@/components/submit-button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
    const searchParams = await props.searchParams;
    return (
        <form className="flex-1 flex flex-col min-w-64">
            <h1 className="text-2xl font-medium mt-10">Sign in</h1>
            <p className="text-sm text-foreground">
                Átt þú ekki aðgang?{" "}
                <Link className="text-foreground font-medium underline" href="/sign-up">
                    Stofnaðu aðgang
                </Link>
            </p>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Label htmlFor="email">Netfang</Label>
                <Input className="border-border" name="email" placeholder="you@example.com" required/>
                <div className="flex justify-between items-center">
                    <Label htmlFor="password">Lykilorð</Label>
                    <Link
                        className="text-xs text-foreground underline"
                        href="/forgot-password"
                    >
                        Gleymdir lykilorði?
                    </Link>
                </div>
                <Input
                    className="border-border"
                    type="password"
                    name="password"
                    placeholder="Þitt lykilorð"
                    required
                />
                <SubmitButton pendingText="Skráir inn..." formAction={signInAction}>
                    Skrá inn
                </SubmitButton>
                <FormMessage message={searchParams}/>
            </div>
        </form>
    );
}
