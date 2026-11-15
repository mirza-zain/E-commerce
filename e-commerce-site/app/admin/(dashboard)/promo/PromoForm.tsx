"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";

type PromoFormProps = {
    initialPromo: {
        imageUrl: string;
        linkUrl: string;
        isActive: boolean;
    };
};

export default function PromoForm({ initialPromo }: PromoFormProps) {
    const [imageUrl, setImageUrl] = useState(initialPromo.imageUrl);
    const [linkUrl, setLinkUrl] = useState(initialPromo.linkUrl);
    const [isActive, setIsActive] = useState(initialPromo.isActive);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!imageUrl.trim()) {
            setError("Please provide a promo image (upload one or enter an image URL/path).");
            return;
        }

        try {
            setIsSaving(true);
            const response = await fetch("/api/site-promo", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageUrl: imageUrl.trim(),
                    linkUrl: linkUrl.trim(),
                    isActive,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to save promo");
            }

            setSuccess(isActive ? "Promo saved and enabled." : "Promo saved (currently disabled).");
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={handleSave} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-3">
                    <WarningCircleIcon className="size-5 shrink-0 text-red-500" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-3">
                    <CheckCircleIcon className="size-5 shrink-0 text-emerald-600" />
                    <span>{success}</span>
                </div>
            )}

            <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <div>
                    <p className="text-sm font-semibold text-neutral-900">Show promo popup on store</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                        Enable when a promotion is live. Disable to hide it without deleting the image/link.
                    </p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-4 w-4 rounded border-neutral-300"
                    />
                    <span className="text-sm font-medium text-neutral-700">{isActive ? "Enabled" : "Disabled"}</span>
                </label>
            </div>

            <div>
                <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                    Promo Image
                </label>
                <div className="flex flex-wrap items-center gap-3">
                    <CldUploadWidget
                        uploadPreset="zarb_official"
                        onSuccess={(result) => {
                            if (typeof result.info !== "string" && result.info) {
                                setImageUrl(result.info.secure_url);
                                setSuccess("");
                                setError("");
                            }
                        }}
                    >
                        {({ open }) => (
                            <button
                                type="button"
                                onClick={() => open()}
                                className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium hover:border-black transition"
                            >
                                Upload new image
                            </button>
                        )}
                    </CldUploadWidget>
                    <button
                        type="button"
                        onClick={() => setImageUrl("/images/ad.jpg")}
                        className="px-4 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium hover:border-black transition"
                    >
                        Use default ad.jpg
                    </button>
                </div>

                <div className="mt-3">
                    <label htmlFor="imageUrl" className="block text-xs font-medium text-neutral-500 mb-1">
                        Image URL or path
                    </label>
                    <input
                        id="imageUrl"
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="/images/ad.jpg or https://..."
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition"
                    />
                </div>

                {imageUrl.trim() && (
                    <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3 inline-block">
                        <p className="text-xs font-medium text-neutral-500 mb-2">Preview</p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt="Promo preview"
                            className="max-h-80 w-auto rounded-lg object-contain bg-white"
                        />
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="linkUrl" className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                    Link URL (optional)
                </label>
                <input
                    id="linkUrl"
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://zarb.store/... or /shop"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition"
                />
                <p className="mt-1.5 text-xs text-neutral-500">
                    If set, clicking the popup image will open this link in a new tab.
                </p>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-semibold uppercase tracking-wider rounded-xl transition active:scale-[0.99]"
                >
                    {isSaving ? "Saving..." : "Save Promo Settings"}
                </button>
            </div>
        </form>
    );
}
