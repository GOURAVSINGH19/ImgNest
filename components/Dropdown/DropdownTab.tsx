"use client"
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button'
import { ArrowRight, Plus, Settings, User } from 'lucide-react'
import Link from 'next/link';
import IMG from '@/public/undefined.jpeg';
import { memo } from 'react';

interface DropdownProps {
    isDropdownOpen: boolean;
    signOut: () => void;
    user: any;
}

const Dropdown: React.FC<DropdownProps> = memo(({ isDropdownOpen, signOut, user }) => {
    return (
        <div className={`${isDropdownOpen} ? " " :hidden text-gray-700`}>
            <div className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-base text-white">
                            <Avatar
                                size="sm"
                                src={user ? user?.imageUrl : IMG.src}
                                className="h-8 w-8 flex items-center justify-center cursor-pointer shadow-2xl rounded-full"
                                fallback={<User className="h-4 w-4" />}
                            />
                        </span>
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-gray-900">{user?.username}</p>
                        <p className="text-sm text-gray-600">{user?.emailAddresses[0]?.emailAddress}</p>
                    </div>
                </div>
            </div>

            <div className="p-3 gap-2 w-full flex justify-between items-center">
                <Button
                    variant="light"
                    className=" h-10 text-gray-700 cursor-pointer "
                    onClick={signOut}
                >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Sign out
                </Button>
            </div>

            <div className="border-t border-gray-200 p-3">
                <Link href="/sign-in">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 cursor-pointer"
                    >
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <Plus className="h-3 w-3 text-gray-600" />
                        </div>
                        Add account
                    </Button>
                </Link>
            </div>
        </div>
    )
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;