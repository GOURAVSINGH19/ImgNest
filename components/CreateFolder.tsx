"use client"
import { useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { ArrowRight, FolderPlus, X } from 'lucide-react';
import { addToast } from '@heroui/toast';
import axios from 'axios';
import { Button } from "@heroui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FolderIcon } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { useAuth } from '@clerk/nextjs';

interface FolderCreationProps {
    userId: string;
    onUploadSuccess?: () => void;
    currentFolder?: string | null;
}
const CreateFolder = ({
    userId,
    onUploadSuccess,
    currentFolder,
}: FolderCreationProps) => {
    const { getToken } = useAuth();
    const [folderModalOpen, setFolderModalOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [creatingFolder, setCreatingFolder] = useState(false);

    const handleCreateFolder = async () => {
        if (!folderName.trim()) {
            addToast({
                title: "Invalid Folder Name",
                description: "Please enter a valid folder name.",
                color: "danger",
            });
            return;
        }

        setCreatingFolder(true);

        try {
            const token = await getToken();
            await axios.post("/api/folders/create", {
                name: folderName.trim(),
                userId: userId,
                parentId: currentFolder,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            addToast({
                title: "Folder Created",
                description: `Folder "${folderName}" has been created successfully.`,
                color: "success",
            });

            // Reset folder name and close modal
            setFolderName("");
            setFolderModalOpen(false);

            // Call the onUploadSuccess callback to refresh the file list
            if (onUploadSuccess) {
                onUploadSuccess();
            }
        } catch (error) {
            console.error("Error creating folder:", error);
            addToast({
                title: "Folder Creation Failed",
                description: "We couldn't create the folder. Please try again.",
                color: "danger",
            });
        } finally {
            setCreatingFolder(false);
        }
    };
    return (
        <div className="w-full h-full text-white  backdrop-blur-lg p-5 absolute top-0 left-0 z[200]">
            <div className='w-full min-h-full flex justify-center items-center'>
                <Modal
                    isOpen={folderModalOpen}
                    onOpenChange={setFolderModalOpen}
                >
                    <ModalContent>
                        <ModalHeader className="flex gap-2 items-center mb-1 mt-6">
                            <FolderPlus className="h-5 w-5 text-primary" />
                            <span>New Folder</span>
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4">
                                <p className="text-sm text-default-600">
                                    Enter a name for your folder:
                                </p>
                                <Input
                                    type="text"
                                    placeholder="Folder Name"
                                    value={folderName}
                                    className="bg-zinc-300 w-full outline-0 border-0"
                                    onChange={(e) => setFolderName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="flat"
                                color="default"
                                onClick={() => setFolderModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onClick={handleCreateFolder}
                                isLoading={creatingFolder}
                                isDisabled={!folderName.trim()}
                                endContent={!creatingFolder && <ArrowRight className="h-4 w-4" />}
                            >
                                Create
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Card className="w-[350px] bg-black text-white border-gray-800">
                    <CardHeader className="flex flex-row items-center gap-2">
                        <FolderIcon className="h-6 w-6 text-blue-400" />
                        <div>
                            <CardTitle>Create team folder</CardTitle>
                            <CardDescription className="text-gray-400">Create a new folder for your team.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="space-y-4">
                                    <p className="text-sm text-default-600">
                                        Enter a name for your folder:
                                    </p>
                                    <Input
                                        type="text"
                                        placeholder="Folder Name"
                                        value={folderName}
                                        className="bg-zinc-300 w-full outline-0 border-0"
                                        onChange={(e) => setFolderName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="parent-folder" className="text-gray-300">
                                        Parent Folder
                                    </Label>
                                    <Select>
                                        <SelectTrigger id="parent-folder" className="bg-gray-900 border-gray-700">
                                            <SelectValue placeholder="Root (optional)" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" className="bg-gray-900 border-gray-700">
                                            <SelectItem value="documents">Documents</SelectItem>
                                            <SelectItem value="projects">Projects</SelectItem>
                                            <SelectItem value="shared">Shared</SelectItem>
                                            <SelectItem value="personal">Personal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* <div className="flex flex-col space-y-1.5">
                                    <Label className="text-gray-300">Who can access</Label>
                                    <div className="text-sm text-gray-400 mb-2">You can change this later.</div>
                                    <RadioGroup defaultValue="everyone" className="space-y-2">
                                        <div className="flex items-start space-x-2 bg-gray-900 p-3 rounded-md">
                                            <RadioGroupItem value="everyone" id="everyone" className="mt-1" />
                                            <div className="grid gap-1">
                                                <Label htmlFor="everyone" className="font-medium">
                                                    Everyone at Gourav95411
                                                </Label>
                                                <p className="text-sm text-gray-400">Share with everyone on your team</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-2 bg-gray-900 p-3 rounded-md">
                                            <RadioGroupItem value="specific" id="specific" className="mt-1" />
                                            <div className="grid gap-1">
                                                <Label htmlFor="specific" className="font-medium">
                                                    Specific people
                                                </Label>
                                                <p className="text-sm text-gray-400">Choose who to share this folder with</p>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div> */}
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            variant="flat"
                            color="default"
                            onClick={() => setFolderModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onClick={handleCreateFolder}
                            isLoading={creatingFolder}
                            isDisabled={!folderName.trim()}
                            endContent={!creatingFolder && <ArrowRight className="h-4 w-4" />}
                        >
                            Create
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default CreateFolder