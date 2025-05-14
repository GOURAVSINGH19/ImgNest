"use client"
import Image from "next/image"
import { ArrowRight, Eye, EyeOff, FolderPlus, Plus, Upload, X } from "lucide-react"
import FileTable from "./FileTable"
import { useCallback, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import FileUploadForm from "./FileUploading"
import CreateFolder from "./CreateFolder"


const Home = () => {
    const { userId } = useAuth();
    const [Onclick, setOnclick] = useState<Boolean>(false);
    const [See, setSee] = useState<boolean>(false);
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("all");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [CreateFolderClick, setCreateFolderClick] = useState(false);


    const handleFolderChange = useCallback((folderId: string | null) => {
        setCurrentFolder(folderId);
    }, []);

    const handleFileUploadSuccess = useCallback(() => {
        setRefreshTrigger((prev) => prev + 1);
    }, []);




    return (
        <div className="min-h-screen bg-[#121212] text-white p-6">
            <div className="grid grid-cols-5 gap-4 mb-10">
                <div onClick={() => setOnclick(!Onclick)} className="bg-[#1e1e1e] hover:bg-[#252525] rounded-xl p-6 flex flex-col items-start justify-center cursor-pointer transition">
                    <Upload className="h-6 w-6 mb-2" />
                    <span>Upload or drop</span>
                </div>
                <>
                    {
                        Onclick && (
                            <div className="w-full  fixed top-0 left-0 z-[100] backdrop-blur-xl flex justify-center items-center h-screen ">
                                <X onClick={() => setOnclick(!Onclick)} className="absolute z-[102] top-4 right-4 cursor-pointer" />
                                {userId && (
                                    <FileUploadForm
                                        userId={userId}
                                        currentFolder={currentFolder}
                                        onUploadSuccess={handleFileUploadSuccess}
                                    />
                                )}
                            </div>
                        )
                    }
                </>
                <div onClick={() => setCreateFolderClick(true)} className="bg-[#1e1e1e] hover:bg-[#252525] rounded-xl p-6 flex flex-col items-start justify-center cursor-pointer transition">
                    <Plus className="h-6 w-6 mb-2" />
                    <span
                        color="primary"
                        className="flex-1"
                    >
                        Create Folder
                    </span>
                </div>
                <>
                    {
                        CreateFolderClick && (
                            <div className="w-full h-full fixed top-0 left-0 z-[100]">
                                <X onClick={() => setCreateFolderClick(!CreateFolderClick)} className="absolute z-[102] top-4 right-4 cursor-pointer" />
                                {userId && (
                                    < CreateFolder
                                        userId={userId}
                                        currentFolder={currentFolder}
                                        onUploadSuccess={handleFileUploadSuccess}
                                    />
                                )}
                            </div>
                        )
                    }
                </>
                <div className="bg-[#1e1e1e] hover:bg-[#252525] rounded-xl p-6 flex flex-col items-start justify-center cursor-pointer transition">
                    <ArrowRight className="h-6 w-6 mb-2" />
                    <span>Share</span>
                </div>
            </div>
            {/* Suggested section */}
            <div className="mb-10">
                <div className="flex items-center mb-4">
                    <h2 className="text-xl font-semibold">Suggested for you</h2>
                    {See ? <Eye onClick={() => setSee(!See)} className="ml-2 h-5 w-5 mt-2 text-gray-400 cursor-pointer" /> : <EyeOff onClick={() => setSee(!See)} className="ml-2 h-5 w-5 mt-2 text-gray-400 cursor-pointer" />}
                </div>
                {See ? <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer">
                        <div className="h-48 flex items-center justify-center p-4">
                            <div className="bg-[#78a9ff] w-32 h-28 rounded-md relative">
                                <div className="absolute top-0 left-4 w-24 h-3 bg-[#5a7fbf] rounded-t-md"></div>
                                <div className="absolute top-8 left-8 w-16 h-16 flex flex-col justify-center items-center">
                                    <div className="w-10 h-1.5 bg-[#5a7fbf] mb-1"></div>
                                    <div className="w-10 h-1.5 bg-[#5a7fbf] mb-1"></div>
                                    <div className="w-10 h-1.5 bg-[#5a7fbf] mb-1"></div>
                                    <div className="w-6 h-4 bg-[#5a7fbf]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="font-medium">Gourav95... Folder</p>
                            <p className="text-sm text-gray-400">Folder • Gourav95411</p>
                        </div>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer">
                        <div className="h-48 flex items-center justify-center p-4">
                            <div className="bg-[#78a9ff] w-32 h-28 rounded-md relative">
                                <div className="absolute top-0 left-4 w-24 h-3 bg-[#5a7fbf] rounded-t-md"></div>
                                <div className="absolute top-8 left-8 w-16 h-16 flex justify-center items-center">
                                    <div className="w-10 h-10 rounded-full bg-[#5a7fbf]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="font-medium">Gourav Singh</p>
                            <p className="text-sm text-gray-400">Folder • Gourav95411</p>
                        </div>
                    </div>
                    <div className="bg-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer">
                        <div className="h-48 flex items-center justify-center p-4 bg-[#1a1a1a]">
                            <div className="w-32 h-28 relative overflow-hidden rounded-md">
                                <Image
                                    src="/placeholder.svg?height=112&width=128"
                                    alt="Screenshot preview"
                                    width={128}
                                    height={112}
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="font-medium">Screenshot 2...4-09 230</p>
                            <p className="text-sm text-gray-400">PNG • Gourav Singh</p>
                        </div>
                    </div>
                </div> :
                    <p className="text-yellow-700">Folders are Hidden</p>
                }
            </div>

            {/* All files section */}
            {userId &&
                <FileTable
                    userId={userId}
                    onFolderChange={handleFolderChange}
                    activeTab={activeTab}
                    refreshTrigger={refreshTrigger}
                />
            }
        </div>
    )
}

export default Home