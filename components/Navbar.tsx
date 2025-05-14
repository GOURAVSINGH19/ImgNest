'use client';
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from "@heroui/button";
import { usePathname, useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import { Avatar } from "@heroui/avatar";
import { useEffect, useState } from 'react';
interface UserDetails {
    id: Number,
    firstname?: string,
    lastname?: string,
    imageUrl?: string,
    username?: string,
    emailAddress?: string
}

interface User {
    propuser?: UserDetails | null
}

const Navbar = ({ propuser }: User) => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const pathname = usePathname();
    const router = useRouter();

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const dropdown = document.getElementById("user-dropdown")
            const avatar = document.querySelector("[data-avatar-button]")

            if (dropdown && !dropdown.contains(event.target as Node) && avatar && !avatar.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const onDashboardPage =
        pathname === "/dashboard" || pathname?.startsWith("/dashboard/");


    // const userDetails = {
    //     fullName: user
    //         ? `${user.firstname || ""} ${user.lastname || ""}`.trim()
    //         : "",
    //     initials: user
    //         ? `${user.firstname || ""} ${user.lastname || ""}`
    //             .trim()
    //             .split(" ")
    //             .map((name) => name?.[0] || "")
    //             .join("")
    //             .toUpperCase() || "U"
    //         : "U",
    //     displayName: user
    //         ? user.firstname && user.lastname
    //             ? `${user.firstname} ${user.lastname}`
    //             : user.firstname || user.username || user.email || "User"
    //         : "User",
    //     email: user?.email || "",
    // };

    const handleSignOut = () => {
        signOut(() => {
            router.push("/")
        })
    }


    return (
        <nav className='w-full max-w-screen-xl mx-auto text-white bg-[#121212]'>
            <div className='px-[1.5em] py-[1.3em] flex justify-between items-center'>
                <div className='logo'>
                    <Link href="/">logo</Link>
                </div>

                <div className="flex-between flex items-center gap-5 cursor-pointer">
                    <div className='user-login flex items-center justify-center gap-[1em]'>
                        {!onDashboardPage && <div>
                            {user ?
                                <Button onClick={handleSignOut} variant="faded" color="secondary" radius='full' className='cursor-pointer mr-4 transform duration-500 ease-in-out hover:bg-zinc-800'>
                                    Sign out
                                </Button>
                                : <Link href="/sign-in">
                                    <Button variant="flat" color="primary" className='cursor-pointer'>
                                        Login
                                    </Button>
                                </Link>
                            }
                        </div>}
                        <SignedIn>
                            <div className='flex item-center gap-4'>
                                {!onDashboardPage &&
                                    <Link href="/dashboard">
                                        <Button className='cursor-pointer bg-purple-400 px-2 py-2 rounded-2xl text-sm' color="primary" variant="shadow">
                                            Dashboard
                                        </Button>
                                    </Link>
                                }
                                {onDashboardPage &&
                                    <div>
                                        <Avatar
                                            name={user?.username || ""}
                                            size="sm"
                                            src={user?.imageUrl || undefined}
                                            className="h-8 w-8  flex items-center justify-center flex-shrink-0 shadow-2xl bg-gray-700 rounded-full"
                                            fallback={<User className="h-4 w-4" />}
                                        />
                                    </div>
                                }
                            </div>
                        </SignedIn >
                    </div >
                </div >
            </div >
        </nav >
    );
};

export default Navbar;
