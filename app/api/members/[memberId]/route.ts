import {currentProfile} from "@/lib/current-profile";
import {NextResponse} from "next/server";
import {db} from "@/lib/db";

export const PATCH = async (req: Request, {params}: { params: { memberId: string } }) => {
    try {
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url)
        const {role} = await req.json()
        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401});
        }
        if (!serverId) {
            return new NextResponse("Server Id missing", {status: 400});
        }
        if (!params.memberId) {
            return new NextResponse("Member Id missing", {status: 400});
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (e) {
        console.log(e)
    }
}