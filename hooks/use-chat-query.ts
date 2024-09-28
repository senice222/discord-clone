import {useSocket} from "@/providers/socket-provider";
import {useInfiniteQuery} from "@tanstack/react-query";
import qs from "query-string";

interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
}

export const useChatQuery = ({queryKey, apiUrl, paramKey, paramValue}: ChatQueryProps) => {
    const {isConnected} = useSocket();

    const fetchMessages = async (pageParam: number) => {
        const url = qs.stringifyUrl(
            {
                url: apiUrl,
                query: {
                    cursor: pageParam === 1 ? null : pageParam,
                    [paramKey]: paramValue,
                },
            },
            {skipNull: true}
        );
        const res = await fetch(url);
        return res.json();
    };

    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} =
        useInfiniteQuery({
            queryKey: [queryKey],
            queryFn: ({pageParam}) => fetchMessages(pageParam),
            initialPageParam: 1,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            refetchInterval: isConnected ? false : 1000
        });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    }
}