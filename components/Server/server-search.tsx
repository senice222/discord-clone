"use client"
import { FC, ReactNode, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface ServerSearchProps {
    data: {
        label: string,
        type: "channel" | "member",
        data: {
            icon: ReactNode;
            name: string;
            id: string;
        }[] | undefined
    }[]
}

const ServerSearch: FC<ServerSearchProps> = ({ data }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('');
    const router = useRouter()
    const params = useParams()

    const handleToggle = () => setOpen(prev => !prev);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((prev) => !prev)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, []);

    const filteredData = data.map(group => ({
        ...group,
        data: group.data?.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }));

    const onClick = ({ id, type }: { id: string, type: "channel" | "member" }) => {
        setOpen(false)
        if (type === "member") {
            return router.push(`/servers/${params?.serverId}/conversations/${id}`)
        } else {
            return router.push(`/servers/${params?.serverId}/channels/${id}`)
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={"group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"}
            >
                <Search className={"w-4 h-4 text-zinc-500 dark:text-zinc-400"} />
                <p
                    className={"" +
                        "font-semibold text-sm text-zinc-500 dark:text-zinc-400 " +
                        "group-hover:text-zinc-600 dark:group-hover:text-zinc-300 " +
                        "transition"}
                >
                    Search
                </p>
                <kbd className={"pointer-events-none inline-flex h-5 select-none " +
                    "items-center gap-1 rounded border" +
                    "bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto"}>
                    <span className={"text-xs"}>CTRL</span>K
                </kbd>
            </button>
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={handleToggle}>
                    <div className="dark:bg-[#2B2D31] rounded-lg w-full max-w-lg p-4" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="text"
                            placeholder="Type a command or search..."
                            value={search}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                        {filteredData.map(group => (
                            (group.data && group.data?.length > 0) && (
                                <div key={group.label} className="mb-4">
                                    <h3 className="font-bold">{group.label}</h3>
                                    {group.data?.map(item => (
                                        <div key={item.id} onClick={() => onClick({ id: item.id, type: group.type })}
                                            className="flex items-center p-2 dark:hover:bg-zinc-700/50 cursor-pointer mt-2"
                                        >
                                            {item.icon}
                                            <span className="ml-2">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )
                        ))}
                        {filteredData.every(group => group.data?.length === 0) && (
                            <div>No results found.</div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ServerSearch;
