"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"
import { toast, Bounce } from "react-toastify"
import { useTheme } from "next-themes"

export function NotFound({id}: {id?: string}) {
	const { theme } = useTheme()
	useEffect(() => {
		toast.error(`Error: Article ${id} not found`, {
			position: "bottom-right",
			autoClose: 2500,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			transition: Bounce,
			theme: theme
			});
            redirect("/articles")
	})
	
	return <></>
}
