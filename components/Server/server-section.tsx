'use client'
import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRule } from "@prisma/client";
import { FC } from "react";
import ActionTooltip from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-hooks";

interface ServerSectionProps {
    label: string;
    role?: MemberRule;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfiles
}

const ServerSection: FC<ServerSectionProps> = ({
    label,
    role,
    sectionType,
    channelType,
    server,
}) => {
    const {onOpen} = useModal()

    return (
        <div className="flex items-center justify-between py-2">
            <p className='text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400'>
                {label}
            </p>
            {
                role !== MemberRule.GUEST && sectionType === "channels" && (
                    <ActionTooltip label="Create channel" side="top">
                        <button onClick={() => onOpen("createChannel")} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                            <Plus className="w-4 h-4" />
                        </button>
                    </ActionTooltip>
                )
            }
            {
                role === MemberRule.ADMIN && sectionType === "members" && (
                    <ActionTooltip label="Create channel" side="top">
                        <button onClick={() => onOpen("members", {server})} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                            <Settings className="w-4 h-4" />
                        </button>
                    </ActionTooltip>
                )
            }
        </div>
    )
}

export default ServerSection