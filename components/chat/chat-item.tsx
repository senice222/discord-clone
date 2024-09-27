"use client"
import {Member, MemberRule, Profile} from '@prisma/client';
import React, {FC, useEffect, useState} from 'react'
import {UserAvatar} from '../user-avatar';
import ActionTooltip from '../action-tooltip';
import {Edit, FileIcon, ShieldAlert, ShieldCheck, Trash} from 'lucide-react';
import Image from 'next/image';
import {cn} from '@/lib/utils';
import * as z from 'zod'
import qs from 'query-string'
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem} from '../ui/form';
import {Input} from '../ui/input';
import {Button} from "@/components/ui/button";
import axios from "axios";
import {useModal} from "@/hooks/use-modal-hooks";

interface ChatItemProps {
    id: string;
    content: string;
    member: Member & {
        profile: Profile
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
}

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>
}

const formSchema = z.object({
    content: z.string().min(1)
})

const ChatItem: FC<ChatItemProps> = ({
                                         id,
                                         content,
                                         member,
                                         timestamp,
                                         fileUrl,
                                         deleted,
                                         currentMember,
                                         isUpdated,
                                         socketQuery,
                                         socketUrl
                                     }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const {onOpen} = useModal()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content
        }
    })
    const isLoading = form.formState.isSubmitting

    useEffect(() => {
        form.reset(({
            content
        }))
    }, [content])

    const fileType = fileUrl?.split('.').pop()

    const isAdmin = currentMember.role === MemberRule.ADMIN
    const isModerator = currentMember.role === MemberRule.MODERATOR
    const isOwner = currentMember.id === member.id
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
    const canEditMessage = !deleted && isOwner && !fileUrl
    const isPdf = fileType === "pdf" && fileUrl
    const isImage = !isPdf && fileUrl

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery,
            })

            await axios.patch(url, values)
            form.reset()
            setIsEditing(false)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className='group flex gap-x-2 items-start w-full'>
                <div className='cursor-pointer hover:drop-shadow-md transition'>
                    <div className='flex gap-x-2 '>
                        <UserAvatar src={member.profile.imageUrl}/>
                        <div className="flex flex-col w-full">
                            <div className='flex items-center gap-x-2'>
                                <div className="flex items-center">
                                    <p className='font-semibold text-sm hover:underline cursor-pointer'>
                                        {member.profile.name}
                                    </p>
                                    <ActionTooltip label={member.role}>
                                        {roleIconMap[member.role]}
                                    </ActionTooltip>
                                </div>
                                <span className='text-xs text-zinc-500 dark:text-zinc-400'>
                                    {timestamp}
                                </span>
                            </div>
                            {!isEditing && (
                                <p className={deleted ? "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1" : ""}>
                                    {content}
                                </p>
                            )}
                        </div>
                    </div>
                    {
                        isImage && (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'
                            >
                                <Image
                                    src={fileUrl}
                                    alt={content}
                                    fill
                                    className='object-cover'
                                />
                            </a>
                        )
                    }
                    {
                        isPdf && (
                            <div className="relative flex items-center p-2 mt-2 rounded-md bg-backgroud/10">
                                <FileIcon className="rounded-full h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                                >
                                    PDF File
                                </a>
                            </div>
                        )
                    }
                    {
                        (!fileUrl && !isEditing) && (
                            <p className={cn("text-sm text-zinc-600 dark:text-zinc-300",
                                deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                            )}>
                                {
                                    isUpdated && !deleted && (
                                        <span className="ml-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                                            (edited)
                                        </span>
                                    )
                                }
                            </p>
                        )
                    }
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form className="flex items-center w-full gap-x-2 pt-2"
                                  onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({field}) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className='relative w-full'>
                                                    <Input
                                                        disabled={isLoading}
                                                        className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                                                        placeholder='Edited message'
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={isLoading} size={"sm"} variant={"primary"}>Save</Button>
                            </form>
                            <span className={"text-[10px] mt-1 text-zinc-400"}>
                                Press escape to cancel, enter to save
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div
                    className='cursor-pointer hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm'>
                    {
                        canEditMessage && (
                            <ActionTooltip label="Edit">
                                <Edit
                                    onClick={() => setIsEditing(true)}
                                    className="w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                />
                            </ActionTooltip>
                        )
                    }
                    <ActionTooltip label="Delete">
                        <Trash
                            onClick={() => onOpen("deleteMessage", {apiUrl: `${socketUrl}/${id}`, query: socketQuery})}
                            className="w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}

export default ChatItem