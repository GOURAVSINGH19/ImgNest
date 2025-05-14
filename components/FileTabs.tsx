// "use client";

// import { Clock, File, LayoutGrid, Star, StretchHorizontal, Trash } from "lucide-react";
// import { Tabs, Tab } from "@heroui/tabs";
// import type { File as FileType } from "@/drizzle/db/schema";
// import Badge from "./ui/badge";
// import { Checkbox } from "./ui/checkbox";
// import { Button } from "./ui/button";

// interface FileTabsProps {
//     activeTab: string;
//     files: FileType[];
//     starredCount: number;
// }

// export default function FileTabs({
//     activeTab,
//     files,
//     starredCount,
// }: FileTabsProps) {
//     return (
//         <div cla>
//             <Tabs
//                 selectedKey={activeTab}
//                 //   onSelectionChange={(key) => onTabChange(key as string)}
//                 color="primary"
//                 variant="underlined"
//                 classNames={{
//                     base: "w-full overflow-x-auto",
//                     tabList: "gap-2 sm:gap-4 md:gap-6 flex-nowrap flex-col min-w-full",
//                     tab: "py-3 whitespace-nowrap",
//                     cursor: "bg-primary",
//                 }}
//             >
//                 <Tab
//                     key="all"
//                     title={
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center">
//                                 <h2 className="text-xl font-semibold">All files</h2>
//                                 <Badge
//                                     variant="flat"
//                                     color="default"
//                                     size="sm"
//                                     aria-label={`${files.filter((file) => !file.isTrash).length} files`}
//                                 >
//                                     {files.filter((file) => !file.isTrash).length}
//                                 </Badge>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <Checkbox className="h-5 w-5" />
//                                 <p>Sellect All</p>
//                                 <div className="w-fit h-fit rounded-md   flex items-center justify-center">
//                                     <Button variant="default" className="cursor-pointer">Delete All</Button>
//                                 </div>
//                             </div>
//                         </div>
//                     }
//                 />
//                 <Tab
//                     key="starred"
//                     title={
//                         <div className="mb-4 flex items-center mt-10">
//                             <Button variant="default" className="rounded-full bg-white/10 text-white mr-2 px-6">
//                                 <span className="flex items-center cursor-pointer">
//                                     <Clock className="mr-2 h-4 w-4" />
//                                     Recents
//                                 </span>
//                             </Button>
//                             <Button variant="default" className="rounded-full text-gray-400 px-6">
//                                 <span className="flex items-center cursor-pointer">
//                                     <Star className="mr-2 h-4 w-4" />
//                                     Starred
//                                     <Badge
//                                         variant="flat"
//                                         color="warning"
//                                         size="sm"
//                                         aria-label={`${starredCount} starred files`}
//                                     >
//                                         {starredCount}
//                                     </Badge>
//                                 </span>
//                             </Button>
//                             <div className="ml-auto flex items-center gap-2 w-fit">
//                                 <Button variant="default" size="icon" className="text-gray-400 cursor-pointer">
//                                     <StretchHorizontal />
//                                 </Button>
//                                 <Button variant="default" size="icon" className="text-gray-400 cursor-pointer">
//                                     <LayoutGrid />
//                                 </Button>
//                             </div>
//                         </div>
//                     }
//                 />
//                 {/* <Tab
//                 key="trash"
//                 title={
//                     <div className="flex items-center gap-2 sm:gap-3">
//                         <Trash className="h-4 w-4 sm:h-5 sm:w-5" />
//                         <span className="font-medium">Trash</span>
//                         <Badge
//                             variant="solid"
//                             color="danger"
//                             size="sm"
//                             aria-label={`${trashCount} files in trash`}
//                         >
//                             {trashCount}
//                         </Badge>
//                     </div>
//                 }
//             /> */}
//             </Tabs>
//         </div>
//     );
// }
