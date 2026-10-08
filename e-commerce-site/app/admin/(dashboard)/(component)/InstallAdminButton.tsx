'use client'

import { useEffect, useState } from "react"

type InstallPromptEvent = Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function InstallAdminButton() {
    const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
    const [installed, setInstalled] = useState(false)
    const [isIos, setIsIos] = useState(false)
    const [showInstructions, setShowInstructions] = useState(false)

    useEffect(() => {
        const standalone = window.matchMedia("(display-mode: standalone)").matches ||
            ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)

        const initialStateTimer = window.setTimeout(() => {
            setInstalled(standalone)
            setIsIos(ios && !standalone)
        }, 0)

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault()
            setInstallPrompt(event as InstallPromptEvent)
        }
        const handleAppInstalled = () => {
            setInstalled(true)
            setInstallPrompt(null)
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        window.addEventListener("appinstalled", handleAppInstalled)
        return () => {
            window.clearTimeout(initialStateTimer)
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
            window.removeEventListener("appinstalled", handleAppInstalled)
        }
    }, [])

    const installAdmin = async () => {
        if (isIos) {
            setShowInstructions(true)
            return
        }
        if (!installPrompt) return

        await installPrompt.prompt()
        const choice = await installPrompt.userChoice
        if (choice.outcome === "accepted") setInstalled(true)
        setInstallPrompt(null)
    }

    if (installed) return null

    return (
        <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm font-semibold text-neutral-900">Install admin app</p>
                <p className="mt-1 text-sm text-neutral-500">Keep order alerts and store management one tap away.</p>
                {showInstructions && <p className="mt-2 text-xs text-neutral-600">Tap Share in Safari, then choose Add to Home Screen.</p>}
            </div>
            <button
                type="button"
                onClick={() => void installAdmin()}
                disabled={!installPrompt && !isIos}
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {isIos ? "How to install" : "Install admin app"}
            </button>
        </section>
    )
}
