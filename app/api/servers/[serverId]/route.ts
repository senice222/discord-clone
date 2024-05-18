import {currentProfile} from "@/lib/current-profile";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export const PATCH = async (req: Request, {params}: { params: { serverId: string } }) => {
    const {name, imageUrl} = await req.json();

    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name,
                imageUrl
            }
        })
        return NextResponse.json(server)
    } catch (e) {
        console.log(e)
    }
}