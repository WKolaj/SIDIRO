self.addEventListener("push", (e) => {
  const data = e.data.json();

  let options = {};

  if (data.body) options.body = data.body;
  if (data.icon) options.icon = data.icon;
  
  self.registration.showNotification(data.title, {
    body: data.body
  });
});