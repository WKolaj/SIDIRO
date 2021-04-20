self.addEventListener("push", (e) => {
  const data = e.data.json();

  let options = {};

  if (data.body) options.body = data.body;
  if (data.icon) options.icon = data.icon;
  console.log(data);
  self.registration.showNotification(data.title, options);
});

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open("sidiroCache").then(function(cache) {
      return cache.addAll([
        "/images/SIDIRO_ALERT.png",
        "/images/SIDIRO_INFO.png",
        "/images/SIDIRO_WARNING.png",
      ]);
    })
  );
});
