import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FC } from "react";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  }
}

const ChannelIdPage: FC<ChannelIdPageProps> = async ({ params }) => {
  const { serverId, channelId } = params;
  const profile = await currentProfile()
  const channel = await db.channel.findUnique({
    where: {
      id: channelId
    }
  })

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile?.id
    }
  })

  if (!channel || !member) {
    redirect('/')
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        serverId={serverId}
        name={channel.name}
        type="channel"
      />
    </div>
  )
}

export default ChannelIdPage