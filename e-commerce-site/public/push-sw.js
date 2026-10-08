self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {}

  event.waitUntil(
    self.registration.showNotification(data.title || "Zarb Official", {
      body: data.body || "You have a new admin update.",
      icon: "/images/logo.png",
      badge: "/images/logo.png",
      data: { url: data.url || "/admin" },
    })
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data?.url || "/admin"

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existingClient = clients.find((client) => "focus" in client)
      if (existingClient) {
        existingClient.navigate(url)
        return existingClient.focus()
      }
      return self.clients.openWindow(url)
    })
  )
})
