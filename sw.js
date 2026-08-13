const CACHE_NAME =
  "ao-community-v04";


const FILES_TO_CACHE = [

  ".",

  "index.html",

  "style.css",

  "app.js",

  "manifest.json"

];



/* ==============================
   INSTALL
================================ */

self.addEventListener(
  "install",
  function (event) {

    event.waitUntil(

      caches
        .open(CACHE_NAME)

        .then(function (cache) {

          return cache.addAll(
            FILES_TO_CACHE
          );

        })

    );


    self.skipWaiting();

  }
);



/* ==============================
   ACTIVATE
================================ */

self.addEventListener(
  "activate",
  function (event) {

    event.waitUntil(

      caches
        .keys()

        .then(function (names) {

          return Promise.all(

            names.map(
              function (name) {

                if (
                  name !== CACHE_NAME
                ) {

                  return caches.delete(
                    name
                  );

                }

              }
            )

          );

        })

    );


    self.clients.claim();

  }
);



/* ==============================
   FETCH
================================ */

self.addEventListener(
  "fetch",
  function (event) {

    if (
      event.request.method !== "GET"
    ) {

      return;
    }


    event.respondWith(

      caches
        .match(
          event.request
        )

        .then(
          function (
            cachedResponse
          ) {

            if (
              cachedResponse
            ) {

              return cachedResponse;

            }


            return fetch(
              event.request
            );

          }
        )

    );

  }
);