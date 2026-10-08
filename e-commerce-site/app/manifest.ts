import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Zarb Official Admin",
        short_name: "Zarb Admin",
        description: "Zarb Official store administration",
        start_url: "/admin",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
            {
                src: "/images/logo.png",
                sizes: "any",
                type: "image/png",
            },
        ],
    }
}
