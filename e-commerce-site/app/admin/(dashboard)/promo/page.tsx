import { db } from "@/app/lib/db";
import { sitePromo } from "@/app/db/schema";
import PromoForm from "./PromoForm";

export default async function PromoPage() {
    const rows = await db.select().from(sitePromo).limit(1);
    const promo = rows[0] ?? null;

    return (
        <main className="min-h-screen bg-white px-6 py-8 text-neutral-950 sm:px-10 lg:px-12">
            <div className="mx-auto max-w-3xl">
                <div className="border-b border-neutral-200 pb-8">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        Marketing
                    </p>
                    <h1 className="font-[Gebuk] text-4xl tracking-tight sm:text-5xl">Promo Popup</h1>
                    <p className="mt-3 max-w-2xl text-sm text-neutral-500">
                        Manage the promotional popup shown on the store. Turn it on when a promotion is live,
                        update the image/link for new campaigns, and turn it off when the promotion ends.
                    </p>
                </div>

                <div className="mt-8">
                    <PromoForm
                        initialPromo={
                            promo
                                ? {
                                      imageUrl: promo.imageUrl,
                                      linkUrl: promo.linkUrl ?? "",
                                      isActive: promo.isActive,
                                  }
                                : {
                                      imageUrl: "/images/ad.jpg",
                                      linkUrl: "",
                                      isActive: false,
                                  }
                        }
                    />
                </div>
            </div>
        </main>
    );
}
