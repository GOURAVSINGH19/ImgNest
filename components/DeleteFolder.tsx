"use client"

import { useState } from "react"
import { X, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DeleteFolderProps {
    handleOnclick: () => void;
    onDelete: () => Promise<void>;
}

export default function DeleteFolder({ handleOnclick, onDelete }: DeleteFolderProps) {
    const [repoName, setRepoName] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const fullRepoName = "delete all"

    const isConfirmed = repoName === fullRepoName

    const handleDelete = async () => {
        if (!isConfirmed) return;
        
        try {
            setIsDeleting(true);
            await onDelete();
            handleOnclick(); // Close modal after successful deletion
        } catch (error) {
            console.error('Error deleting folders:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-md">
            <div className="bg-[#0f1010] rounded-md w-full max-w-md text-white shadow-lg">
                <div className="flex items-center justify-between p-4 border-b border-[#30363d]">
                    <h2 className="text-xl font-semibold">Delete All Folders</h2>
                    <button className="text-gray-400 hover:text-white">
                        <X onClick={handleOnclick} size={20} className="cursor-pointer" />
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center">
                    <div className="bg-[#161b22] p-3 rounded-md border border-[#30363d] mb-4">
                        <div className="relative">
                            <div className="text-gray-400">
                                <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-3.5a.25.25 0 0 1-.25-.25Z" />
                                </svg>
                                <Lock size={16} className="absolute bottom-0 right-0" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <p className="text-base mb-2">To confirm, type "{fullRepoName}" in the box below</p>
                        <Input
                            value={repoName}
                            onChange={(e) => setRepoName(e.target.value)}
                            className="bg-[#0d1117] border border-[#30363d] text-white mb-4 focus:border-[#388bfd] focus:ring-1 focus:ring-[#388bfd]"
                        />

                        <Button
                            disabled={!isConfirmed || isDeleting}
                            onClick={handleDelete}
                            className={`w-full py-2 rounded-md ${isConfirmed
                                ? "bg-[#da3633] hover:bg-[#b92e2c] text-white"
                                : "bg-[#21262d] text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {isDeleting ? "Deleting..." : "Delete all folders"}
                        </Button>

                        <p className="text-gray-400 text-sm mt-4">
                            Once you delete all folders, there is no going back. Please be certain.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
