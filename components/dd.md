"use client"
import React, { useEffect, useMemo, useState } from 'react'
import {
    Star,
    LayoutGrid,
    ChevronUp,
    StretchHorizontal,
    RefreshCcw,
    Trash,
    Folder,
    Download,
    ArchiveRestore,
    Shredder,
    ListX,
    Share,
} from "lucide-react"
import { Button } from "@heroui/button"
import { Checkbox } from './ui/checkbox'
import FileIcon from "./FileIcon"
import axios from "axios"
import FileLoadingState from './FileLoadingState'
import { File as FileType } from "../drizzle/db/schema"
import FileEmptyState from './FileEmptyState'
import Badge from './ui/badge'
import FolderNavigation from './FolderNavigation'
import { toast } from 'react-toastify'
import DeleteRepositoryModal from './DeleteFolder'
import { useAuth } from '@clerk/nextjs'
import FlexLayout from './FlexLayout'
import GridLayout from './GridLayout'


const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString();
};

interface allfilesProps {
    userId: string;
    onFolderChange?: (folderId: string | null) => void;
    refreshTrigger?: number;
}

const FileTable = ({ userId, onFolderChange, refreshTrigger = 0 }: allfilesProps) => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [folderPath, setFolderPath] = useState<
        Array<{ id: string; name: string }>
    >([]);
    const [SelectaAllCheckbox, setSelectAllCheckbox] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [currentTab, setCurrentTab] = useState("all");
    const [files, setFiles] = useState<FileType[]>([]);
    const [Onclick, setOnclick] = useState(false);
    const [flexlayout, setflexLayout] = useState(false);
    const [gridLayout, setgridLayout] = useState(false)

    const starredCount = useMemo(() => {
        return files.filter((file) => file.isStarred && !file.isTrash).length;
    }, [files]);

    const TrashCount = useMemo(() => {
        return files.filter((file) => file.isTrash).length;
    }, [files]);


    const Fetchdata = async () => {
        setLoading(true);
        try {
            let getUrl = `/api/files?userId=${userId}`;
            if (currentFolder) {
                getUrl += `&parentId=${currentFolder}`;
            }
            const res = await axios.get(getUrl)
            setFiles(res.data);
        } catch (error) {
            toast.error("Error in Fetching Data.")
            console.log("Error in Fetching Data", error)
        } finally {
            setLoading(false);
        }
    }

    // Handle  Star file
    const handlestarredFile = async (fileId: string) => {
        try {
            await axios.patch(`/api/files/${fileId}/star`);

            setFiles(
                files.map((file) =>
                    file.id === fileId ? { ...file, isStarred: !file.isStarred } : file
                )
            );

        } catch (error) {
            console.error("Error starring file:", error);
            toast.error("Error in Fetching Data")
        }
    }

    //Handle Trash folder
    const handleTrashFile = async (fileId: string) => {
        try {
            await axios.post(`/api/files/${fileId}/trash`)
            toast.success("Check File in Trash Tab");
            setFiles(
                files.map((file) => (
                    file.id === fileId ? { ...file, isTrash: !file.isTrash } : file
                ))
            )
        } catch (error) {
            console.error("Error starring file:", error);
            toast.error("Error in Trashing File");
        }
    }

    //Handle Recover File 
    const handleRecoverFile = async (fileId: string) => {
        try {
            const response = await axios.post(`/api/files/${fileId}/trash`);

            if (response.data.success) {
                // Update the file in the local state
                setFiles(files.map((file) =>
                    file.id === fileId ? { ...file, isTrash: false } : file
                ));
                toast.success("File restored successfully");
            }
        } catch (error) {
            console.error("Error restoring file:", error);
            toast.error("Failed to restore file");
        }
    }

    //handle Delete trash file
    const handledeleteTrashFile = async (fileId: string) => {
        try {
            const foundFile = files.find(f => f.id === fileId);
            if (!foundFile) {
                console.warn("File not found in UI state:", fileId);
                return;
            }

            const res = await axios.delete(`/api/files/${fileId}/emptyFolder-trash`);

            if (res.data.success) {
                setFiles(prev => prev.filter(f => f.id !== fileId));
                toast.success("File delete SuccessFully");
            } else {
                throw new Error(res.data.error || "Unknown error");
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            toast.error("We couldn't delete the file. Please try again later.")
        }
    };


    //Handle DeleteAll File
    const handleDeleteFolders = async () => {
        try {
            // First delete all files from the database
            const response = await axios.delete('/api/files/delete-all');

            if (response.data.success) {
                // Clear the files list in UI
                setFiles([]);
                toast.success("All files and folders deleted successfully");
            } else {
                throw new Error(response.data.error || "Failed to delete files");
            }
        }
        catch (error) {
            console.error("Error in deleting Folders:", error);
            toast.error("Error in Delete All Folders");
        }
    }


    const openImageViewer = (file: FileType) => {
        if (file.type.startsWith("image/")) {
            const optimizedUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-90,w-1600,h-1200,fo-auto/${file.path}`;
            window.open(optimizedUrl, "_blank");
        }
    };

    // Navigate to a folder
    const navigateToFolder = (folderId: string, folderName: string) => {
        setCurrentFolder(folderId);
        setFolderPath([...folderPath, { id: folderId, name: folderName }]);

        // Notify parent component about folder change
        if (onFolderChange) {
            onFolderChange(folderId);
        }
    };

    // Navigate back to parent folder
    const navigateUp = () => {
        if (folderPath.length > 0) {
            const newPath = [...folderPath];
            newPath.pop();
            setFolderPath(newPath);
            const newFolderId =
                newPath.length > 0 ? newPath[newPath.length - 1].id : null;
            setCurrentFolder(newFolderId);

            // Notify parent component about folder change
            if (onFolderChange) {
                onFolderChange(newFolderId);
            }
        }
    };

    // Navigate to specific folder in path
    const navigateToPathFolder = (index: number) => {
        if (index < 0) {
            setCurrentFolder(null);
            setFolderPath([]);

            // Notify parent component about folder change
            if (onFolderChange) {
                onFolderChange(null);
            }
        } else {
            const newPath = folderPath.slice(0, index + 1);
            setFolderPath(newPath);
            const newFolderId = newPath[newPath.length - 1].id;
            setCurrentFolder(newFolderId);

            // Notify parent component about folder change
            if (onFolderChange) {
                onFolderChange(newFolderId);
            }
        }
    };

    // Handle file or folder click
    const handleItemClick = (file: FileType) => {
        if (file.isFolder) {
            navigateToFolder(file.id, file.name);
        } else if (file.type.startsWith("image/")) {
            openImageViewer(file);
        }
    };

    useEffect(() => {
        Fetchdata();
    }, [refreshTrigger, currentFolder, userId])


    const filteredFiles = useMemo(() => {
        switch (currentTab) {
            case "recent":
                return files
                    .filter((file) => file.createdAt)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case "star":
                const starredFiles = files.filter((file) => !file.isTrash && file.isStarred);
                return starredFiles;
            case "trash":
                return files.filter((file) => file.isTrash && !file.isStarred);

            case "all":
            default:
                return files.filter((file) => !file.isTrash);
        }
    }, [files, currentTab]);


    const handleSelectAll = () => {
        setSelectAllCheckbox(!SelectaAllCheckbox);
        if (!SelectaAllCheckbox) {
            setSelectedFiles(filteredFiles.map(file => file.id));
        } else {
            setSelectedFiles([]);
        }
    };

    const handleFileSelect = (fileId: string) => {
        setSelectedFiles(prev => {
            if (prev.includes(fileId)) {
                return prev.filter(id => id !== fileId)
            } else {
                return [...prev, fileId]
            }
        })
    };

    const handleDownload = async (file: FileType) => {
        try {
            if (!file) {
                console.log("File is required");
            }

            toast.isActive(`Getting "${file.name}" ready for download...`);

            //for download image file
            if (file.type.startsWith("image/")) {
                const downloadUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`;

                //first fetch url to check is available
                const response = await fetch(downloadUrl);
                if (!response.ok) {
                    toast.error("Fail to download image")
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.href = url;
                link.download = file.name;
                document.body.appendChild(link);


                toast.success(`${file.name}" is ready to download.`);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                // download other file
                const response = await fetch(file.fileUrl);
                if (!response.ok) {
                    toast.error("Fail to download file")
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.href = url;
                link.download = file.name;
                document.body.appendChild(link);

                toast.success(`${file.name}" is ready to download.`);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }

        } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("We couldn't download the file. Please try again later.")
        }
    }

    const handleOnclick = () => {
        setOnclick(!Onclick)
    }


    const handleShareClick = async (file: FileType) => {
        try {
            if (!file) {
                console.log("file not found");
            }
            const token = await getToken();
            const res = await axios.post(`/api/files/${file.id}/sharefile`, { isPublic: true }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data);
            const shareUrl = res.data.url;
            navigator.clipboard.writeText(shareUrl);
            toast.success("Share link copied to clipboard");
        }
        catch (error) {
            console.error(error);
        }
    };

    const handleLayoutChange = () => {
        setflexLayout(!flexlayout);
        setgridLayout(!gridLayout);
    }


    return (
        <>
            <div className="mb-8 flex gap-3  items-center justify-center">
                <div className='flex'>
                    <Button
                        variant="light"
                        className={` rounded-md md:rounded-full ${currentTab === 'all' ? 'btn text-white' : 'text-gray-400'} mr-2 px-3 md:px-6 cursor-pointer`}
                        onClick={() => setCurrentTab('all')}
                    >
                        <span className="flex items-center">
                            <Folder className="mr-2 h-4 w-4 hidden md:inline" fill='#22c55e' />
                            All
                        </span>
                        <Badge
                            variant="solid"
                            color="success"
                            size="sm"
                            className='text-zinc-200'
                            aria-label={`${files.filter((file) => !file.isTrash && !file.isStarred).length} files`}
                        >
                            {files.filter((file) => !file.isTrash).length}
                        </Badge>
                    </Button>
                    <Button
                        variant="light"
                        className={`rounded-md md:rounded-full ${currentTab === 'star' ? 'btn text-white' : 'text-gray-400'} px-3 md:px-6 cursor-pointer`}
                        onClick={() => setCurrentTab('star')}
                    >
                        <span className="flex items-center">
                            <Star className="mr-2 h-4 w-4 hidden md:inline" fill='#eab308' />
                            Starred
                            <Badge
                                variant="flat"
                                color="warning"
                                size="sm"
                                aria-label={`${starredCount} starred files`}
                            >
                                {starredCount}
                            </Badge>
                        </span>
                    </Button>
                    <Button
                        variant="light"
                        className={`rounded-md md:rounded-full ${currentTab === 'trash' ? 'btn text-white' : 'text-gray-400'} px-3 md:px-6 cursor-pointer`}
                        onClick={() => setCurrentTab('trash')}
                    >
                        <span className="flex items-center">
                            <Trash className="mr-2 h-4 w-4 hidden md:inline" fill='#ef4444' />
                            Trash
                            <Badge
                                variant="flat"
                                color="warning"
                                size="sm"
                                aria-label={`${TrashCount} trash files`}
                            >
                                {TrashCount}
                            </Badge>
                        </span>
                    </Button>
                </div>
                <div className="ml-auto flex items-center justify-center w-fit">
                    {gridLayout ? <Button onClick={handleLayoutChange} variant="light" className="text-gray-400 cursor-pointer ml-4 ">
                        <StretchHorizontal className='w-4 h-4' />
                    </Button> : <Button onClick={handleLayoutChange} variant="light" className="text-gray-400 cursor-pointer ">
                        <LayoutGrid className='w-4 h-4' />
                    </Button>}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center ">
                    <div className='flex items-center justify-center gap-3 ml-5'>
                        <Checkbox
                            checked={SelectaAllCheckbox}
                            onClick={handleSelectAll}
                            className="md:h-5 md:w-5 h-4 w-4"
                        />
                        <p>Select all</p>
                    </div>
                    <div className="w-fit h-fit rounded-md flex items-center justify-center">
                        {
                            SelectaAllCheckbox && <Button onClick={handleOnclick} variant="light" className="cursor-pointer ">
                                <ListX className='w-5 h-5' />
                            </Button>
                        }
                        {
                            Onclick &&
                            (
                                <DeleteRepositoryModal onDelete={async () => {
                                    await handleDeleteFolders();
                                }} handleOnclick={handleOnclick} />
                            )
                        }
                    </div>
                </div>
                <div className="flex items-center ml-3">
                    <Button
                        variant="light"
                        className={`rounded-ful px-4 cursor-pointer  text-white rounded-md btn`}
                        onClick={Fetchdata}
                    >
                        <span className="flex items-center text-sm">
                            <RefreshCcw className="mr-2 h-3 w-3" />
                            Refresh
                        </span>
                    </Button>
                </div>
            </div>
            {currentTab == "all" &&
                <FolderNavigation
                    folderPath={folderPath}
                    navigateUp={navigateUp}
                    navigateToPathFolder={navigateToPathFolder}
                />
            }

            {loading ? (
                <FileLoadingState />
            ) : (
                <>
                    {filteredFiles.length === 0 ? (
                        <FileEmptyState activeTab={currentTab} />
                    ) : (
                        <div className="bg-[#121212] rounded-lg overflow-hidden">
                            {/* Table header */}
                            <div className={`${flexlayout ? 'flex flex-col' : 'flex justify-between md:grid md:grid-cols-6'} px-4 py-3 border-b border-gray-800 text-sm text-gray-400`}>
                                <div className="col-span-2 flex items-center gap-2">
                                    <span>Name</span>
                                    <ChevronUp className="ml-1 h-4 w-4 mt-1" />
                                </div>
                                <div className="hidden md:flex items-center">Size</div>
                                <div className="hidden md:flex items-center">Type</div>
                                <div className="hidden md:flex items-center">Activity</div>
                                <div className="mr-5 md:mr-0 flex items-center justify-center">Actions</div>
                            </div>

                            {/* Table rows */}
                            <div className="divide-y divide-gray-800">
                                {filteredFiles.map((file) => (
                                    gridLayout ? <GridLayout key={file.id}
                                        file={filteredFiles}
                                        selectedFiles={selectedFiles}
                                        onItemClick={onItemClick}
                                        onFileSelect={onFileSelect}
                                        onShareClick={onShareClick}
                                        onStarredFile={onStarredFile}
                                        onTrashFile={onTrashFile}
                                        onDeleteTrashFile={onDeleteTrashFile}
                                        onRecoverFile={onRecoverFile}
                                        onDownload={onDownload}
                                        formatFileSize={formatFileSize}
                                        formatDate={formatDate} /> :
                                        <FlexLayout key={file.id}
                                            file={file}
                                            selectedFiles={selectedFiles}
                                            onItemClick={onItemClick}
                                            onFileSelect={onFileSelect}
                                            onShareClick={onShareClick}
                                            onStarredFile={onStarredFile}
                                            onTrashFile={onTrashFile}
                                            onDeleteTrashFile={onDeleteTrashFile}
                                            onRecoverFile={onRecoverFile}
                                            onDownload={onDownload}
                                            formatFileSize={formatFileSize}
                                            formatDate={formatDate}
                                        />

                                ))}
                            </div >
                        </div >

                    )}
                </>
            )
            }
        </ >
    )
}

export default FileTable