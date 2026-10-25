export function GET() {
    return Response.json({
        name: "Zarb Store Admin",
        short_name: "Zarb Admin",
        description: "Zarb Store administration",
        start_url: "/admin",
        id: "/admin",
        scope: "/admin",
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
    }, {
        headers: {
            "Content-Type": "application/manifest+json",
        },
    })
}
