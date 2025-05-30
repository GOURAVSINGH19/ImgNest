"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Share,
  Star,
  Trash,
  Download,
  MoreVertical,
  Folder,
  File,
  ImageIcon,
  Video,
  Music,
  Archive,
  Code,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { File as FileType } from "@/drizzle/db/schema"

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

const FileIcon = ({ file }: { file: any }) => {
  if (file.isFolder) return <Folder className="h-8 w-8 text-blue-500" />

  const extension = file.name.split(".").pop()?.toLowerCase()

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
    return <ImageIcon className="h-8 w-8 text-green-500" />
  }
  if (["mp4", "avi", "mov", "wmv"].includes(extension)) {
    return <Video className="h-8 w-8 text-purple-500" />
  }
  if (["mp3", "wav", "flac", "aac"].includes(extension)) {
    return <Music className="h-8 w-8 text-pink-500" />
  }
  if (["zip", "rar", "7z", "tar"].includes(extension)) {
    return <Archive className="h-8 w-8 text-orange-500" />
  }
  if (["js", "ts", "jsx", "tsx", "html", "css", "py", "java"].includes(extension)) {
    return <Code className="h-8 w-8 text-yellow-500" />
  }

  return <File className="h-8 w-8 text-gray-500" />
}

interface FileGridItemProps {
  file: FileType;
  index: string;
  selectedFiles: string[];
  onItemClick: (file: any) => void;
  handleFileSelect: (fileId: string) => void;
  handleSelectClick: (file: any) => void;
  onStarredFile: (fileId: string) => void;
  onTrashFile: (fileId: string) => void;
  onDeleteTrashFile: (fileId: string) => void;
  onRecoverFile: (fileId: string) => void;
  onDownload: (file: FileType) => void;
}

export default function GridLayout({
  file,
  selectedFiles,
  onItemClick,
  handleFileSelect,
  handleSelectClick,
  onStarredFile,
  onTrashFile,
  onDeleteTrashFile,
  onRecoverFile,
  onDownload,
}: FileGridItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={`relative  w-[100%] group cursor-pointer transition-all duration-200 hover:shadow-lg border-gray-700 bg-gray-800/50 ${selectedFiles.includes(file.id) ? "border-1 border-blue-500 bg-blue-500/10" : ""
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onItemClick(file)}
    >
      <CardContent className="p-4">
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={selectedFiles.includes(file.id)}
            onClick={(e) => {
              e.stopPropagation()
              handleFileSelect(file.id)
            }}
            className="bg-gray-700 border-gray-600"
          />
        </div>

        <div
          className={`absolute top-2 right-2 z-10 transition-opacity duration-200 ${isHovered || selectedFiles.includes(file.id) ? "opacity-100" : "opacity-0"
            }`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-gray-700/80 hover:bg-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
              {!file.isTrash && (
                <>
                  {!file.isFolder && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectClick(file)
                      }}
                      className="text-gray-300 hover:bg-gray-700"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onStarredFile(file.id)
                    }}
                    className="text-gray-300 hover:bg-gray-700"
                  >
                    <Star className={`h-4 w-4 mr-2 ${file.isStarred ? "text-yellow-400 fill-current" : ""}`} />
                    {file.isStarred ? "Unstar" : "Star"}
                  </DropdownMenuItem>
                  {!file.isFolder && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onDownload(file)
                      }}
                      className="text-gray-300 hover:bg-gray-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onTrashFile(file.id)
                    }}
                    className="text-red-400 hover:bg-gray-700"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Move to Trash
                  </DropdownMenuItem>
                </>
              )}
              {file.isTrash && (
                <>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onRecoverFile(file.id)
                    }}
                    className="text-green-400 hover:bg-gray-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Restore
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteTrashFile(file.id)
                    }}
                    className="text-red-400 hover:bg-gray-700"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Forever
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-center mb-3 mt-6">
          <div className="bg-blue-500/20 p-3 rounded-lg relative">
            <FileIcon file={file} />
            {file.isStarred && (
              <div className="absolute top-[-10] right-[-10]">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-2">
          <h3 className="text-white font-medium text-sm truncate" title={file.name}>
            {file.name}
          </h3>
        </div>

        <div className="space-y-1 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Size:</span>
            <span>{formatFileSize(file.size)}</span>
          </div>
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="truncate ml-2">{file.type}</span>
          </div>
          <div className="flex justify-between">
            <span>Modified:</span>
            <span>{formatDate(file.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
