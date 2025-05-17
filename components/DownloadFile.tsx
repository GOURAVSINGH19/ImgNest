"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DownloadFileProps {
    fileUrl: string;
    fileName: string;
    className?: string;
}

export default function DownloadFile({ fileUrl, fileName, className }: DownloadFileProps) {
    const handleDownload = async () => {
        try {
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <Button 
            onClick={handleDownload}
            className={className}
            variant="outline"
        >
            <Download className="mr-2 h-4 w-4" />
            Download
        </Button>
    );
} 