"use client";
import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@heroui/input";
import {
    Upload,
    X,
    FileUp,
    AlertTriangle,
    ArrowRight,
} from "lucide-react";

import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";

interface FileUploadFormProps {
    userId: string;
    onUploadSuccess?: () => void;
    currentFolder?: string | null;
}

const FileUploadForm = ({
    userId,
    onUploadSuccess,
    currentFolder = null,
}: FileUploadFormProps) => {
    const { getToken } = useAuth();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!userId) {
        return (
            <div className="text-center p-4">
                <p className="text-danger">Authentication error. Please try refreshing the page.</p>
            </div>
        );
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            const oversized = filesArray.find(f => f.size > 5 * 1024 * 1024);
            if (oversized) {
                setError(`File "${oversized.name}" exceeds 5MB limit`);
                return;
            }
            setFiles(filesArray);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const filesArray = Array.from(e.dataTransfer.files);
            const oversized = filesArray.find(f => f.size > 5 * 1024 * 1024);
            if (oversized) {
                setError(`File "${oversized.name}" exceeds 5MB limit`);
                return;
            }
            setFiles(filesArray);
            setError(null);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const clearFile = () => {
        setFiles([]);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!files.length) return;
        if (!userId) {
            setError("Authentication error. Please try refreshing the page.");
            return;
        }

        const formData = new FormData();
        files.forEach(f => {
            formData.append("files", f, f.webkitRelativePath || f.name);
        });
        formData.append("userId", userId);
        if (currentFolder) {
            formData.append("parentId", currentFolder);
        }

        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            const token = await getToken();
            await axios.post("/api/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    }
                },
            });

            toast.success(`Files have been uploaded successfully.`);
            clearFile();

            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (error) {
            console.log("Failed to upload files. Please try again.", error);
            toast.error("Failed to Upload Files");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4  w-full h-full relative">
            <div className={`space-y-4  flex justify-center items-center flex-col w-full h-full`}>
                <div className="flex gap-2 mb-2">
                    <Button
                        color="primary"
                        variant="shadow"
                        startContent={<FileUp className="h-4 w-4" />}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 rounded-md"
                    >
                        Add Multiples File
                    </Button>
                </div>

                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${error
                        ? "border-danger/30 bg-danger/5"
                        : files.length
                            ? "border-primary/30 bg-primary/5"
                            : "border-default-300 hover:border-primary/5"
                        }`}
                >
                    {!files.length ? (
                        <div className="space-y-3">
                            <FileUp className="h-12 w-12 mx-auto  text-white" />
                            <div>
                                <p className="text-default-600">
                                    Drag and drop your file here, or{" "}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-blue-400 cursor-pointer font-medium inline bg-transparent border-0 p-0 m-0 "
                                    >
                                        browse
                                    </button>
                                </p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*,.pdf"
                                multiple
                                // @ts-ignore
                                webkitdirectory
                            />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <FileUp className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium truncate max-w-[180px]">
                                            {files.length} file{files.length > 1 ? 's' : ''} selected
                                        </p>
                                        <ul className="text-xs text-default-500 max-h-20 overflow-y-auto">
                                            {files.map(f => (
                                                <li key={f.name + f.size} className="truncate">
                                                    {f.webkitRelativePath || f.name} ({f.size < 1024
                                                        ? `${f.size} B`
                                                        : f.size < 1024 * 1024
                                                            ? `${(f.size / 1024).toFixed(1)} KB`
                                                            : `${(f.size / (1024 * 1024)).toFixed(1)} MB`})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    onClick={clearFile}
                                    className="text-default-500"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {error && (
                                <div className="bg-danger-5 text-danger-700 p-3 rounded-lg flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            {uploading && (
                                <Progress
                                    value={progress}
                                    color="primary"
                                    className="max-w-full"
                                />
                            )}

                            <Button
                                color="primary"
                                startContent={<Upload className="h-4 w-4" />}
                                endContent={!uploading && <ArrowRight className="h-4 w-4" />}
                                onClick={handleUpload}
                                isLoading={uploading}
                                className="w-full "
                                isDisabled={!!error}
                            >
                                {uploading ? `Uploading... ${progress}%` : "Upload Files"}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="bg-default-100/5 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Tips</h4>
                    <ul className="text-xs text-default-600 space-y-1">
                        <li>• Files are private and only visible to you</li>
                        <li>• Supported formats: JPG, PNG, GIF, WebP, PDF</li>
                        <li>• Maximum file size: 5MB</li>
                    </ul>
                </div>
            </div>
        </div >
    );
}

export default FileUploadForm;