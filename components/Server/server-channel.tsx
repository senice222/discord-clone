'use client'

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRule, Server } from "@prisma/client"
import { Hash, Mic, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FC } from "react";

interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: MemberRule
}

const iconMap = {
    [ChannelType.TEXT]: Hash,
    [ChannelType.AUDIO]: Mic,
    [ChannelType.VIDEO]: Video,
}

const ServerChannel: FC<ServerChannelProps> = ({
    channel,
    server,
    role
}) => {
    const params = useParams()
    const router = useRouter()
    const Icon = iconMap[channel.type]
    const isChannelActive = params?.channelId === channel.id

    return (
        <button
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                isChannelActive && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
            onClick={() => { }}
        >
            <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
            <p className={cn(
                "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                isChannelActive && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>
                {channel.name}
            </p>
        </button>
    )
}

export default ServerChannel