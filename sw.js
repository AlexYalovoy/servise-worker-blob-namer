const registerPattern = "registerBase64";
const fetchPattern = "fetchBase64";

const db = {};

self.addEventListener("install", function(event) {
  event.waitUntil(
    Promise.resolve(true).then(() => console.log("sw installed"))
  );
});

self.addEventListener("fetch", function(event) {
  const url = new URL(event.request.url).pathname;
  const filename = decodeURIComponent(url.slice(url.lastIndexOf("/") + 1));

  if (url.includes(registerPattern)) {
    console.log("register request", url);
    event.respondWith(
      event.request
        .blob()
        .then(file => {
          db[filename] = file;
          return filename;
        })
        .then(() => new Response(null))
    );
  } else if (url.includes(fetchPattern)) {
    console.log("fetch request", url);
    console.log("return cached file", db[filename]);
    const cached = db[filename];
    event.respondWith(new Response(cached));
    delete db[filename];
  } else {
    console.log("regular request, ignore", url);
    event.respondWith(fetch(event.request));
  }
});
