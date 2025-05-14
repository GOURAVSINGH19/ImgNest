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
    FolderPlus,
    ArrowRight,
} from "lucide-react";
import { addToast } from "@heroui/toast";

import axios from "axios";
import { useAuth } from "@clerk/nextjs";

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
    const [file, setFile] = useState<File | null>(null);
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
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            // Validate file size (5MB limit)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError("File size exceeds 5MB limit");
                return;
            }

            setFile(selectedFile);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];

            // Validate file size (5MB limit)
            if (droppedFile.size > 5 * 1024 * 1024) {
                setError("File size exceeds 5MB limit");
                return;
            }

            setFile(droppedFile);
            setError(null);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const clearFile = () => {
        setFile(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        if (!userId) {
            setError("Authentication error. Please try refreshing the page.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);
        if (currentFolder) {
            formData.append("parentId", currentFolder);
        }

        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            const token = await getToken();
            const data = await axios.post("/api/files/upload", formData, {
                headers: {
                    "Content-Type": "application/json",
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

            console.log(data)

            addToast({
                title: "Upload Successful",
                description: `${file.name} has been uploaded successfully.`,
                color: "success",
            });

            clearFile();

            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setError("Failed to upload file. Please try again.");
            addToast({
                title: "Upload Failed",
                description: "We couldn't upload your file. Please try again.",
                color: "danger",
            });
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
                        variant="flat"
                        startContent={<FileUp className="h-4 w-4" />}
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1"
                    >
                        Add Image
                    </Button>
                </div>

                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${error
                        ? "border-danger/30 bg-danger/5"
                        : file
                            ? "border-primary/30 bg-primary/5"
                            : "border-default-300 hover:border-primary/5"
                        }`}
                >
                    {!file ? (
                        <div className="space-y-3">
                            <FileUp className="h-12 w-12 mx-auto text-primary/70" />
                            <div>
                                <p className="text-default-600">
                                    Drag and drop your image here, or{" "}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-primary cursor-pointer font-medium inline bg-transparent border-0 p-0 m-0"
                                    >
                                        browse
                                    </button>
                                </p>
                                <p className="text-xs text-default-500 mt-1">Images up to 5MB</p>
                            </div>
                            <Input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
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
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-default-500">
                                            {file.size < 1024
                                                ? `${file.size} B`
                                                : file.size < 1024 * 1024
                                                    ? `${(file.size / 1024).toFixed(1)} KB`
                                                    : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                                        </p>
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
                                className="w-full"
                                isDisabled={!!error}
                            >
                                {uploading ? `Uploading... ${progress}%` : "Upload Image"}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="bg-default-100/5 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Tips</h4>
                    <ul className="text-xs text-default-600 space-y-1">
                        <li>• Images are private and only visible to you</li>
                        <li>• Supported formats: JPG, PNG, GIF, WebP</li>
                        <li>• Maximum file size: 5MB</li>
                    </ul>
                </div>
            </div>
        </div >
    );
}

export default FileUploadForm;