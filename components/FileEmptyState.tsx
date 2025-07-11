"use client";

import { File } from "lucide-react";
import { Card, CardBody } from "@heroui/card";

interface FileEmptyStateProps {
  activeTab: string;
}

export default function FileEmptyState({ activeTab }: FileEmptyStateProps) {
  return (
    <Card >
      <CardBody className="text-center py-16">
        <File color="primarary" className="h-16 w-16 mx-auto text-primary/50 mb-6" />
        <h3 className="text-xl font-medium mb-2 text-zinc-500">
          {activeTab === "all" && "No files available"}
          {activeTab === "star" && "No Starred files"}
          {activeTab === "trash" && "Trash is empty"}
          {activeTab === "recent" && "No Folder or File use recently"}
        </h3>
        <p className="text-zinc-600 mt-2 max-w-md mx-auto">
          {activeTab === "all" &&
            "No Files or Folders"}
          {activeTab === "star" &&
            "Mark important files with a star to find them quickly when you need them"}
          {activeTab === "trash" &&
            "Files you delete will appear here for 30 days before being permanently removed"}
          {activeTab === "recent" &&
            "Files or Folder you use recently"}
        </p>
      </CardBody>
    </Card>
  );
}
