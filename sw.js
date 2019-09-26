// we might be able to use global.caches, but I have to admit I'm not quite sure how...
const db = {};

self.addEventListener("install", function(event) {
  event.waitUntil(
    // caches.open(   //... we won't use caches in this demo.
    Promise.resolve(true)
  );
});

self.addEventListener("fetch", function(event) {
  const req = event.request,
    url = new URL(req.url),
    // parse the /path/ from every request url
    pathes = url.pathname.split("/"),
    // are we registering
    nameRegIndex = pathes.indexOf("nameForcer_register"),
    // or fetching
    nameFetcherIndex = pathes.indexOf("nameForcer_fetch");
  console.log("onfetch", req, pathes, nameRegIndex, nameFetcherIndex);

  if (nameRegIndex > -1) {
    // register
    event.respondWith(
      req
        .blob() // grab the POSTed Blob
        .then(blob => {
          const filename = decodeURIComponent(pathes[nameRegIndex + 1]) || "";
          // store in our db object
          db[filename] = blob;
          return filename;
        })
        .then(filename => new Response("/nameForcer_fetch/" + filename))
    );
  } else if (nameFetcherIndex > -1) {
    // fetch
    const filename = pathes[nameFetcherIndex + 1];
    const cached = db[filename];
    // just for Firefox, Chrome doesn't care...
    const headers = new Headers({
      "Content-Disposition": 'inline; filename="' + filename + '"'
    });
    event.respondWith(
      new Response(cached, {
        headers: headers
      })
    );
    delete db[filename]; // !! one time URI !!
  } else {
    // normal requests
    event.respondWith(fetch(event.request));
  }
});
