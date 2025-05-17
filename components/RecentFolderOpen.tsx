"use client";
import { Eye, EyeOff } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { File as FileType } from '@/drizzle/db/schema';

interface RecentFile {
    files: FileType[];
}

const RecentFolderOpen = ({ files }: RecentFile) => {
    const [see, setSee] = useState(false);
    const recentFiles = useMemo(() => {
        return files
            .filter((file) => file.createdAt)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [files]);

    return (
        <div className="mb-10">
            <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Files</h2>
                {/* Toggle visibility */}
                {see ? (
                    <EyeOff
                        onClick={() => setSee(!see)}
                        className="ml-2 h-5 w-5 mt-2 text-gray-400 cursor-pointer"
                    />
                ) : (
                    <Eye
                        onClick={() => setSee(!see)}
                        className="ml-2 h-5 w-5 mt-2 text-gray-400 cursor-pointer"
                    />
                )}
            </div>

            {/* Conditionally render files based on 'see' state */}
            {see ? (
                <div className="grid grid-cols-3 gap-4">
                    {recentFiles.map((file) => (
                        <div key={file.id} className="bg-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer">
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
                                <p className="font-medium truncate">{file.name}</p>
                                {/* Display folder/file label */}
                                <p className="text-sm text-gray-400">
                                    {file.isFolder ? 'Folder' : 'File'} • {new Date(file.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-yellow-700">Folders are Hidden</p>
            )}
        </div>
    );
};

export default RecentFolderOpen;
