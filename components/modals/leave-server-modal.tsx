"use client";
import {
    Dialog,
    DialogContent, DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {useModal} from "@/hooks/use-modal-hooks";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";

const LeaveServerModal = () => {
    const {isOpen, onClose, type, data} = useModal();
    const [isLoading, setIsLoading] = useState(false)
    const isModalOpen = isOpen && type === "leaveServer";
    const {server} = data
    const router = useRouter()

    const onClick = async () => {
        try {
            setIsLoading(true)
            await axios.patch(`/api/servers/${server?.id}/leave`)

            onClose()
            router.push('/')
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Leave server
                    </DialogTitle>
                    <DialogDescription className={"text-center text-zinc-500"}>
                        Are you sure you want leave the server <span
                        className={"font-semibold text-indigo-500"}>
                        {server?.name}
                    </span>?
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6">
                    leave server
                </div>
                <DialogFooter className={"bg-gray-100 px-6 py-4"}>
                    <div className="flex items-center justify-between w-full">
                        <Button disabled={isLoading} onClick={onClose} variant={"ghost"}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={onClick} variant={"primary"}>
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default LeaveServerModal;
