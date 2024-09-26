import {NextApiRequest} from "next";
import {NextApiResponseServerIo} from "@/types";
import {currentProfilePages} from "@/lib/current-profile-pages";

const handler = async (
    req: NextApiRequest,
    res: NextApiResponseServerIo
) => {
    if (req.method !== "POST" && req.method !== "PATCH") {
        return res.status(405).json({message: "Method Not Allowed"});
    }
    try {
        const profile = await currentProfilePages(req)

    } catch (e) {
        console.log(e)
    }
}