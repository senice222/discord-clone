'use client'
import { cn } from '@/lib/utils'
import { Member, MemberRule, Profile, Server } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { UserAvatar } from '../user-avatar'

interface ServerMemberProps {
    member: Member & { profile: Profile },
    server: Server
}

const iconMap = {
    [MemberRule.GUEST]: null,
    [MemberRule.MODERATOR]: <ShieldCheck className='w-4 h-4 ml-2 text-indigo-500' />,
    [MemberRule.ADMIN]: <ShieldAlert className='w-4 h-4 ml-2 text-rose-500' />,
}

const ServerMember = ({ member, server }: ServerMemberProps) => {
    const params = useParams()
    const router = useRouter()
    const icon = iconMap[member.role]

    return (
        <button
            className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.id === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <UserAvatar src={member.profile.imageUrl} className='h-8 w-8' />
            <p className={cn(
                "text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition font-semibold",
                params?.channelId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
            )}>{member.profile.name}</p>
            {icon}
        </button>
    )
}

export default ServerMember