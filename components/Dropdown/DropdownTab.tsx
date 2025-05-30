"use client"
import { Button } from '@heroui/button'
import { ArrowRight, Plus, Settings } from 'lucide-react'
import Link from 'next/link';
interface Subnav {
    isDropdownOpen: boolean,
    signOut: () => void;
}

const Dropdown = ({ isDropdownOpen, signOut }: Subnav) => {
    return (
        <div className={`${isDropdownOpen} ? " " :hidden`}>
            <div className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-base text-white">GS</span>
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-gray-900">Gourav Singh</p>
                        <p className="text-sm text-gray-600">gourav95411@gmail.com</p>
                    </div>
                </div>
            </div>

            <div className="p-3 gap-2 w-full flex justify-between items-center">
                <Button
                    variant="light"
                    className=" h-10 text-gray-700 cursor-pointer "
                >
                    <Settings className="mr-2 h-4 w-4" />
                    Manage account
                </Button>
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
}

export default Dropdown