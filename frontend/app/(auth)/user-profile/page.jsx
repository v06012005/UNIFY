"use client"
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const UserProfile = () => {

    const { data: session } = useSession();
    console.log(session?.user);

    if (!session) return <p>Loading...</p>;

    return (
        <div align={`center`} className={`mt-10 grid gap-2 place-content-center`}>
            <span>{session?.user?.name}</span>
            <span>{session?.user?.email}</span>
            <img src={session?.user?.image} alt={"img"} className={`m-auto`} />
            <Button onClick={() => signOut({ callbackUrl: 'http://localhost:3000' })} className={`w-20 m-auto`}>
                Sign Out
            </Button>
        </div>
    )
}

export default UserProfile;
