"use client"
import { Plus, Upload, X } from "lucide-react"
import FileTable from "./FileTable"
import { useCallback, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import FileUploadForm from "./FileUploading"
import CreateFolder from "./CreateFolder"




const Home = () => {
    const { userId } = useAuth();
    const [Onclick, setOnclick] = useState(false);
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                <div onClick={() => setOnclick(!Onclick)} className="bg-[#8b5cf6] rounded-xl p-6 flex flex-col items-start justify-center cursor-pointer transition">
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
            </div>
            {userId &&
                <FileTable
                    userId={userId}
                    onFolderChange={handleFolderChange}
                    refreshTrigger={refreshTrigger}
                />
            }
        </div>
    )
}

export default Home