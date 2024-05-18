"use client";
import CreateServerModel from "@/components/modals/create-server-modal";
import InviteModal from "@/components/modals/invite-modal";
import { useEffect, useState } from 'react'
import EditServerModal from "@/components/modals/edit-server-modal";
import MembersModal from "@/components/modals/members-modal";

const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState<boolean>(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) return null

    return (
        <>
            <CreateServerModel />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
        </>
    );
};

export default ModalProvider;
