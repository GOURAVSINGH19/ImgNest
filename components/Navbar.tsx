'use client';
import { useClerk, useUser, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User } from 'lucide-react';
import { Avatar } from "@heroui/avatar";
import { useState } from 'react';
import Dropdown from './Dropdown/DropdownTab';
import IMG from '@/public/undefined.jpeg';

const Navbar = () => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const { isSignedIn } = useAuth();

    const pathname = usePathname();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const onDashboardPage =
        pathname === "/dashboard" || pathname?.startsWith("/dashboard/");

    const handleSignOut = () => {
        signOut(() => {
            router.push("/")
        })
    }

    return (
        <nav className='w-full max-w-screen-xl mx-auto text-white bg-[#121212]'>
            <div className='px-[1.5em] py-[1.3em] flex justify-between items-center'>
                <div className='logo'>
                    <Link href="/">INest</Link>
                </div>

                <div className="flex-between flex items-center gap-5">
                    {!onDashboardPage && <div>
                        {user ?
                            <button onClick={handleSignOut} color="secondary" className='p-2 md:px-3 cursor-pointer btn mr-4 rounded-md flex items-center justify-center'>
                                <span className='text-sm'>sign out</span>
                            </button>
                            : <Link href="/sign-in">
                                <button color="primary" className='p-2 md:px-4 cursor-pointer btn mr-4 rounded-md flex items-center justify-center'>
                                    <span className='text-sm'>Login</span>
                                </button>
                            </Link>
                        }
                    </div>}

                    <div className='flex item-center gap-4'>
                        {!onDashboardPage &&
                            <Link href="/dashboard" onClick={(e) => {
                                if (!isSignedIn) {
                                    e.preventDefault();
                                    router.push('/sign-in');
                                }
                            }}>
                                <button className='cursor-pointer btn p-2 rounded-md text-sm' color="primary" >
                                    Dashboard
                                </button>
                            </Link>
                        }
                        {onDashboardPage &&
                            <div className='w-full'>
                                <div>
                                    <Avatar
                                        size="sm"
                                        src={user ? user?.imageUrl : IMG.src}
                                        className="h-8 w-8 flex items-center justify-center cursor-pointer shadow-2xl rounded-full"
                                        fallback={<User className="h-4 w-4" />}
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    />
                                </div>
                                {isDropdownOpen && (
                                    <div className='absolute top-[3.8rem] shadow-sm shadow-white right-[2rem] rounded-lg p-3 w-[20rem] sm:w-[25em] min-h-fit z-[100] bg-white'>
                                        <Dropdown
                                            isDropdownOpen={isDropdownOpen}
                                            signOut={handleSignOut}
                                            user={user}
                                        />
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
