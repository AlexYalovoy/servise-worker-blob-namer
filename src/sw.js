import { fetchPattern, registerPattern } from "./variables";

const db = {};

self.addEventListener("install", function(event) {
  event.waitUntil(
    // caches.open(   //... we won't use caches in this demo.
    Promise.resolve(true)
  );
});

self.addEventListener("fetch", function(event) {
  const url = new URL(event.request.url).pathname;
  const filename = decodeURIComponent(url.slice(url.lastIndexOf("/")));

  console.log("onfetch", url, filename);

  if (url.includes(registerPattern)) {
    event.respondWith(
      event.request
        .blob()
        .then(blob => {
          db[filename] = blob;
          return filename;
        })
        .then(filename => new Response(`/${fetchPattern}/` + filename))
    );
  } else if (url.includes(fetchPattern)) {
    const cached = db[filename];
    event.respondWith(new Response(cached));
    delete db[filename];
  } else {
    event.respondWith(fetch(event.request));
  }
});
