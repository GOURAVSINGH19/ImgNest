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
    X,
    Download,
    ArchiveRestore,
    Shredder,
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
import RecentFolderOpen from './RecentFolderOpen'
import { toast } from 'react-toastify'
import DeleteRepositoryModal from './DeleteFolder'


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
    activeTab: string;
    refreshTrigger?: number;
}

const FileTable = ({ userId, onFolderChange, refreshTrigger = 0, activeTab = "all" }: allfilesProps) => {
    const [loading, setLoading] = useState(true);
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [folderPath, setFolderPath] = useState<
        Array<{ id: string; name: string }>
    >([]);
    const [SelectaAllCheckbox, setSelectAllCheckbox] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [Layout, setLayout] = useState();
    const [currentTab, setCurrentTab] = useState(activeTab);
    const [files, setFiles] = useState<FileType[]>([]);
    const [Onclick, setOnclick] = useState(false);

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

    //Handle Delete File
    const handleDeleteFile = async (fileId: string) => {
        try {
            const foundFile = files.find(t => t.id === fileId)
            if (!foundFile) {
                console.log("File not Found");
            }

            const res = await axios.delete(`/api/files/${fileId}/delete`);
            if (res.data.success) {
                //remove file from local state
                setFiles(files.filter((file) => file.id !== fileId));
            }
        }
        catch (error) {
            console.error("Error Trashing file:", error);
            toast.error("We couldn't Trash the file. Please try again later.")
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

                document.removeChild(link);
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

                document.removeChild(link);
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

    return (
        <>
            <div className="mb-8 flex gap-3 items-center">
                <Button
                    variant="light"
                    className={`rounded-full ${currentTab === 'all' ? 'bg-zinc-600 text-white' : 'text-gray-400'} mr-2 px-6 cursor-pointer`}
                    onClick={() => setCurrentTab('all')}
                >
                    <span className="flex items-center">
                        <Folder className="mr-2 h-4 w-4" />
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
                    className={`rounded-full ${currentTab === 'star' ? 'bg-zinc-600 text-white' : 'text-gray-400'} px-6 cursor-pointer`}
                    onClick={() => setCurrentTab('star')}
                >
                    <span className="flex items-center">
                        <Star className="mr-2 h-4 w-4" />
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
                    className={`rounded-full ${currentTab === 'trash' ? 'bg-zinc-600 text-white' : 'text-gray-400'} px-6 cursor-pointer`}
                    onClick={() => setCurrentTab('trash')}
                >
                    <span className="flex items-center">
                        <Trash className="mr-2 h-4 w-4" />
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
                <div className="ml-auto flex items-center justify-center w-fit">
                    <Button variant="light" className="text-gray-400 cursor-pointer ml-4">
                        <StretchHorizontal className='w-4 h-4' />
                    </Button>
                    <Button variant="light" className="text-gray-400 cursor-pointer ">
                        <LayoutGrid className='w-4 h-4' />
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center ml-3">
                    <Button
                        variant="light"
                        className={`rounded-ful px-6 cursor-pointer`}
                        onClick={Fetchdata}
                    >
                        <span className="flex items-center">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Refresh
                        </span>
                    </Button>
                </div>
                <div className="flex items-center gap-3">
                    <Checkbox
                        checked={SelectaAllCheckbox}
                        onClick={handleSelectAll}
                        className="h-5 w-5"
                    />
                    <p>Select all</p>
                    <div className="w-fit h-fit rounded-md flex items-center justify-center">
                        <Button onClick={handleOnclick} variant="light" className="cursor-pointer">Delete all</Button>
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
                            <div className="grid grid-cols-6 px-4 py-3 border-b border-gray-800 text-sm text-gray-400">
                                <div className="col-span-2 flex items-center gap-2">
                                    <span>Name</span>
                                    <ChevronUp className="ml-1 h-4 w-4 mt-1" />
                                </div>
                                <div className="flex items-center">Size</div>
                                <div className="flex items-center">Type</div>
                                <div className="flex items-center">Activity</div>
                                <div className="flex items-center justify-center">Actions</div>
                            </div>

                            {/* Table rows */}
                            <div className="divide-y divide-gray-800">
                                {
                                    filteredFiles.map((file) => (
                                        <div key={file.id} className="grid grid-cols-6 px-4 py-3">
                                            <div onClick={() => handleItemClick(file)} className="cursor-pointer col-span-2 flex items-center gap-2">
                                                <Checkbox
                                                    checked={selectedFiles.includes(file.id)}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFileSelect(file.id);
                                                    }}
                                                />
                                                <div className="bg-blue-500/20 p-2 rounded mr-3">
                                                    <FileIcon file={file} />
                                                </div>
                                                <div>
                                                    <p className="text-white">{file.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-300">{formatFileSize(file.size)}</div>
                                            <div className="flex items-center text-gray-300">{file.type}</div>
                                            <div className="flex items-center text-gray-300">{formatDate(file.createdAt)}</div>
                                            <div className='flex items-center justify-center'>
                                                {!file.isTrash && <Button
                                                    variant="light"
                                                    size="sm"
                                                    className="min-w-0 px-2 cursor-pointer"
                                                    startContent={
                                                        <Star
                                                            className={`h-4 w-4 ${file.isStarred
                                                                ? "text-yellow-400 fill-current"
                                                                : "text-gray-400"
                                                                }`}
                                                        />
                                                    }
                                                    onClick={(e) => { e.preventDefault(); handlestarredFile(file.id) }}
                                                >
                                                    <span className="hidden sm:inline">
                                                        {file.isStarred ? "Unstar" : "Star"}
                                                    </span>
                                                </Button>}
                                                <span
                                                    className="min-w-0 px-2"
                                                >
                                                    {!file.isTrash && <span onClick={(e) => { e.preventDefault(); handleTrashFile(file.id) }} className='cursor-pointer'>
                                                        <Trash
                                                            className={`h-4 w-4`}
                                                        />
                                                    </span>}
                                                    {file.isTrash && <span className="hidden sm:inline">
                                                        {
                                                            file.isTrash && (
                                                                <div className='flex justify-center gap-4 items-center'>
                                                                    <Button
                                                                        variant="light"
                                                                        size="sm"
                                                                        className="min-w-0 px-2 cursor-pointer"
                                                                        onClick={(e) => { e.preventDefault(); handledeleteTrashFile(file.id) }}
                                                                    >
                                                                        <span className="hidden sm:inline">
                                                                            <Shredder
                                                                                className={`h-4 w-4`}
                                                                            />
                                                                        </span>
                                                                    </Button>
                                                                    <Button
                                                                        variant="light"
                                                                        size="sm"
                                                                        className="min-w-0 px-2 cursor-pointer"
                                                                        onClick={(e) => { e.preventDefault(); handleRecoverFile(file.id) }}
                                                                    >
                                                                        <span className="hidden sm:inline">
                                                                            <ArchiveRestore
                                                                                className={`h-4 w-4`}
                                                                            />
                                                                        </span>
                                                                    </Button>
                                                                </div>
                                                            )
                                                        }
                                                    </span>}
                                                </span>
                                                {!file.isTrash && !file.isFolder && (
                                                    <Button
                                                        variant="flat"
                                                        size="sm"
                                                        onClick={() => handleDownload(file)}
                                                        className="min-w-0 px-2"
                                                        startContent={<Download className="h-4 w-4" />}
                                                    >
                                                        <span aria-label='Download-btn' className="hidden sm:inline">Download</span>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </>
            )
            }
        </ >
    )
}

export default FileTable