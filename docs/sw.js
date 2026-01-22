self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("pico").then(c =>
      c.addAll([
        "index.html",
        "app.js",
        "manifest.json"
      ])
    )
  );
});
