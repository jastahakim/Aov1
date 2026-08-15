// AO COMMUNITY SERVICE WORKER


/* ==============================
   VERSION
================================ */

/*
  Setiap kali kita buat update
  besar nanti, naikkan version.

  v13
  v14
  v15
  dan seterusnya.
*/

const CACHE_NAME =
  "ao-community-v14";



/* ==============================
   AO FILES
================================ */

const APP_FILES = [

  "index.html",
  "style.css",
  "app.js",

  "firebase.js",
  "session.js",

  "auth.html",
  "auth.css",
  "auth.js",

  "admin.html",
  "admin.css",
  "admin.js",

  "announcement.html",
  "announcement.css",
  "announcement.js",

  "manifest.json",

  "icon-192.png",
  "icon-512.png",

  "trex-logo.png"

];



/* ==============================
   INSTALL
================================ */

self.addEventListener(
  "install",
  function (event) {

    console.log(
      "AO SW installing:",
      CACHE_NAME
    );


    event.waitUntil(

      (async function () {

        const cache =
          await caches.open(
            CACHE_NAME
          );


        /*
          Ambil versi terbaru
          daripada server.

          Fail dibuat satu-satu
          supaya satu fail gagal
          tidak menyebabkan
          seluruh SW gagal.
        */

        await Promise.allSettled(

          APP_FILES.map(
            async function (file) {

              try {

                const response =
                  await fetch(
                    file,
                    {
                      cache: "reload"
                    }
                  );


                if (
                  response &&
                  response.ok
                ) {

                  await cache.put(
                    file,
                    response.clone()
                  );


                  console.log(
                    "AO cached:",
                    file
                  );

                } else {

                  console.warn(
                    "AO cache gagal:",
                    file
                  );

                }


              } catch (error) {

                console.warn(
                  "AO cache skip:",
                  file,
                  error
                );

              }

            }
          )

        );


        /*
          Jangan tunggu SW lama.
          Aktifkan versi baru.
        */

        await self.skipWaiting();

      })()

    );

  }
);



/* ==============================
   ACTIVATE
================================ */

self.addEventListener(
  "activate",
  function (event) {

    console.log(
      "AO SW activating:",
      CACHE_NAME
    );


    event.waitUntil(

      (async function () {

        const cacheNames =
          await caches.keys();


        /*
          Padam cache versi lama.
        */

        await Promise.all(

          cacheNames.map(
            function (cacheName) {

              if (
                cacheName !==
                CACHE_NAME
              ) {

                console.log(
                  "AO delete old cache:",
                  cacheName
                );


                return caches.delete(
                  cacheName
                );

              }


              return Promise.resolve();

            }
          )

        );


        /*
          SW baru terus kawal
          PWA yang sudah terbuka.
        */

        await self.clients.claim();


        console.log(
          "AO SW ready:",
          CACHE_NAME
        );

      })()

    );

  }
);



/* ==============================
   FETCH
   NETWORK FIRST
================================ */

self.addEventListener(
  "fetch",
  function (event) {

    const request =
      event.request;


    /*
      Service worker hanya
      handle GET.
    */

    if (
      request.method !== "GET"
    ) {

      return;

    }


    const requestURL =
      new URL(
        request.url
      );


    /*
      Firebase CDN dan domain
      luar jangan dicache oleh SW AO.
    */

    if (
      requestURL.origin !==
      self.location.origin
    ) {

      return;

    }


    event.respondWith(

      (async function () {

        try {

          /*
            NETWORK FIRST

            Kalau internet ada,
            ambil file terbaru.
          */

          const networkResponse =
            await fetch(
              request,
              {
                cache: "no-cache"
              }
            );


          if (
            networkResponse &&
            networkResponse.ok
          ) {

            /*
              Simpan versi terbaru
              ke cache.
            */

            const cache =
              await caches.open(
                CACHE_NAME
              );


            await cache.put(
              request,
              networkResponse.clone()
            );

          }


          return networkResponse;


        } catch (error) {

          /*
            Kalau internet gagal,
            baru gunakan cache.
          */

          const cachedResponse =
            await caches.match(
              request
            );


          if (cachedResponse) {

            return cachedResponse;

          }


          /*
            Kalau navigation/page
            gagal ketika offline,
            gunakan homepage.
          */

          if (
            request.mode ===
            "navigate"
          ) {

            const home =
              await caches.match(
                "index.html"
              );


            if (home) {

              return home;

            }

          }


          /*
            Last fallback.
          */

          return new Response(
            "AO sedang offline.",
            {
              status: 503,

              headers: {
                "Content-Type":
                  "text/plain; charset=utf-8"
              }
            }
          );

        }

      })()

    );

  }
);
