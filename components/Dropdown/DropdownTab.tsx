"use client"
import { Button } from '@heroui/button'
import { ArrowRight, Plus, Settings } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Dropdown = () => {
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
    return (

        <div className='w-full h-fit bg-red-500'>
            <div
                key="dropdown"
                id="user-dropdown"
                className={`absolute right-0 top-12 w-72 bg-white rounded-lg shadow-lg z-50 overflow-hidden ${isDropdownOpen ? "" : "hidden"}`}
            >
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

                <div className="p-3 flex gap-2">
                    <Button
                        variant="shadow"
                        className="flex-1 h-10 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Manage account
                    </Button>
                    <Button
                        variant="shadow"
                        className="flex-1 h-10 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Sign out
                    </Button>
                </div>

                <div className="border-t border-gray-200 p-3">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                            <Plus className="h-3 w-3 text-gray-600" />
                        </div>
                        Add account
                    </Button>
                </div>

                <div className="border-t border-gray-200 p-3 flex justify-center">
                    <p className="text-sm text-gray-500 flex items-center">
                        Secured by
                        <span className="ml-1 font-medium flex items-center">
                            <span className="mr-1">c</span>lerk
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Dropdown