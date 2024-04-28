"use client";
import CreateServerModel from "@/components/modals/create-server-modal";
import InviteModal from "@/components/modals/invite-modal";
import { useEffect, useState } from 'react'

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
        </>
    );
};

export default ModalProvider;
