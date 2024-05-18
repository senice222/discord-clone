"use client";
import {
    Dialog,
    DialogContent, DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {useModal} from "@/hooks/use-modal-hooks";
import {ServerWithMembersWithProfiles} from "@/types";
import {ScrollArea} from "@/components/ui/scroll-area";
import {UserAvatar} from "@/components/user-avatar";
import {
    Check, Gavel, Loader2,
    MoreVertical,
    Shield,
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion,
} from "lucide-react";
import {useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator,
    DropdownMenuSub, DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MemberRule} from "@prisma/client";
import {useRouter} from "next/navigation";
import qs from 'query-string'
import axios from "axios";

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className={"h-4 w-4 ml-2 text-indigo-500"}/>,
    "ADMIN": <ShieldAlert className={"h-4 w-4 text-rose-500"}/>
}

const MembersModal = () => {
    const router = useRouter()
    const {onOpen, isOpen, onClose, type, data} = useModal();
    const isModalOpen = isOpen && type === "members";
    const {server} = data as { server: ServerWithMembersWithProfiles }
    const [loadingId, setLoadingId] = useState("");

    const onRoleChange = async (role: MemberRule, memberId: string) => {
        try {
            setLoadingId(memberId)
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id
                }
            })
            const {data} = await axios.patch(url, { role })
            router.refresh()
            onOpen("members", { server: data })
            setLoadingId("")
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription
                        className={"text-center text-zinc-500"}
                    >
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className={"mt-8 max-h-[420px] pr-6"}>
                    {server?.members?.map(item => (
                        <div key={item.id} className={"flex items-center gap-x-2 mb-6 "}>
                            <UserAvatar src={item.profile.imageUrl}/>
                            <div className={"flex flex-col gap-y-1"}>
                                <div className={"text-xs font-semibold flex items-center gap-x-1"}>
                                    {item.profile.name}
                                    <p>{roleIconMap[item.role]}</p>
                                </div>
                                <p className={"text-xs text-zinc-500"}>{item.profile.email}</p>
                            </div>
                            {
                                server.profileId !== item.profileId &&
                                loadingId !== item.id && (
                                    <div className={"ml-auto"}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreVertical className={"h-4 w-4 text-zinc-500"}/>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side={"left"}>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger className={"flex items-center"}>
                                                        <ShieldQuestion className={"w-4 h-4 mr-2"}/>
                                                        <span>Role</span>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem onClick={() => onRoleChange("GUEST", item.id)}>
                                                                <Shield className={"h-4 w-4 mr-2"}/>
                                                                Guest
                                                                {item.role === "GUEST" && (
                                                                    <Check className={"h-4 w-4 ml-auto"}/>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => onRoleChange("MODERATOR", item.id)}>
                                                                <ShieldCheck className={"h-4 w-4 mr-2"}/>
                                                                Moderator
                                                                {item.role === "MODERATOR" && (
                                                                    <Check className={"h-4 w-4 ml-auto"} />
                                                                )}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem>
                                                    <Gavel className={"h-4 w-4 mr-2"}/>
                                                    Kick
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )
                            }
                            {loadingId === item.id && (
                                <Loader2 className={"animate-spin text-zinc-500 ml-auto w-4 h-4"}/>
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default MembersModal;
