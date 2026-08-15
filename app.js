// @ts-nocheck

console.log("AO Community");


/* ==============================
   AO SPLASH INTRO
================================ */

const aoSplash =
  document.getElementById("aoSplash");


const isStandalone =
  window.matchMedia(
    "(display-mode: standalone)"
  ).matches ||
  window.navigator.standalone === true;


function closeSplash() {

  if (!aoSplash) {
    return;
  }

  aoSplash.classList.add(
    "splash-hide"
  );

  setTimeout(
    function () {

      aoSplash.remove();

    },
    500
  );

}


/*
  Dalam PWA:
  tunjuk intro AO.
*/

if (isStandalone) {

  setTimeout(
    closeSplash,
    1200
  );

} else {

  /*
    Browser biasa:
    terus masuk AO.
  */

  closeSplash();

}



/* ==============================
   SERVICE WORKER
   + AUTO UPDATE
================================ */

if ("serviceWorker" in navigator) {

  /*
    Kalau PWA sudah mempunyai
    service worker aktif.
  */

  const alreadyControlled =
    Boolean(
      navigator.serviceWorker.controller
    );


  window.addEventListener(
    "load",
    async function () {

      try {

        const registration =
          await navigator
            .serviceWorker
            .register(
              "sw.js",
              {
                /*
                  Jangan gunakan
                  HTTP cache untuk
                  semakan sw.js.
                */

                updateViaCache:
                  "none"
              }
            );


        console.log(
          "AO Service Worker aktif"
        );


        /*
          Paksa browser semak
          sama ada sw.js terbaru
          tersedia.
        */

        try {

          await registration.update();

          console.log(
            "AO semakan update selesai"
          );

        } catch (updateError) {

          console.warn(
            "AO update check gagal:",
            updateError
          );

        }


      } catch (error) {

        console.error(
          "AO Service Worker Error:",
          error
        );

      }

    }
  );


  /*
    Bila SW baru berjaya
    mengambil alih PWA,
    reload satu kali supaya
    code terbaru digunakan.
  */

  if (alreadyControlled) {

    let reloading = false;


    navigator
      .serviceWorker
      .addEventListener(
        "controllerchange",
        function () {

          if (reloading) {
            return;
          }


          reloading = true;


          console.log(
            "AO versi baru aktif"
          );


          window.location.reload();

        }
      );

  }

}



/* ==============================
   MASUK KOMUNITI
================================ */

const startButton =
  document.getElementById(
    "startButton"
  );


const communitySection =
  document.getElementById(
    "communitySection"
  );


if (
  startButton &&
  communitySection
) {

  startButton.addEventListener(
    "click",
    function () {

      communitySection
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );

}



/* ==============================
   COMMUNITY ROOMS
================================ */

const roomCards =
  document.querySelectorAll(
    ".room-card"
  );


roomCards.forEach(
  function (room) {

    room.addEventListener(
      "click",
      function () {

        const roomName =
          room.getAttribute(
            "data-room"
          );


        console.log(
          "Ruang dipilih:",
          roomName
        );


        /* ==========================
           PENGUMUMAN
        ========================== */

        if (
          roomName ===
          "pengumuman"
        ) {

          window.location.href =
            "announcement.html";

          return;

        }


        /* ==========================
           CHATTING
        ========================== */

        if (
          roomName ===
          "chatting"
        ) {

          console.log(
            "Chatting Blox Fruits belum aktif."
          );

          return;

        }


        /* ==========================
           SEA EVENT
        ========================== */

        if (
          roomName ===
          "sea-event"
        ) {

          console.log(
            "Sea Event belum aktif."
          );

          return;

        }


        /* ==========================
           TRADING
        ========================== */

        if (
          roomName ===
          "trading"
        ) {

          console.log(
            "Trading belum aktif."
          );

          return;

        }


        /* ==========================
           RAID
        ========================== */

        if (
          roomName ===
          "raid"
        ) {

          console.log(
            "Raid belum aktif."
          );

          return;

        }


        /* ==========================
           TRIAL
        ========================== */

        if (
          roomName ===
          "trial"
        ) {

          console.log(
            "Trial belum aktif."
          );

          return;

        }

      }
    );

  }
);



/* ==============================
   BOTTOM NAVIGATION
================================ */

const navButtons =
  document.querySelectorAll(
    ".nav-button"
  );


navButtons.forEach(
  function (button) {

    button.addEventListener(
      "click",
      function () {

        const page =
          button.getAttribute(
            "data-page"
          );


        /*
          Buang active lama.
        */

        navButtons.forEach(
          function (nav) {

            nav.classList.remove(
              "active"
            );

          }
        );


        /*
          Active baru.
        */

        button.classList.add(
          "active"
        );


        console.log(
          "AO Page:",
          page
        );


        /* ==========================
           UTAMA
        ========================== */

        if (
          page === "utama"
        ) {

          const mainContent =
            document.querySelector(
              ".main-content"
            );


          if (mainContent) {

            mainContent.scrollTo({
              top: 0,
              behavior: "smooth"
            });

          }


          return;

        }


        /* ==========================
           KOMUNITI
        ========================== */

        if (
          page === "komuniti"
        ) {

          if (communitySection) {

            communitySection
              .scrollIntoView({
                behavior: "smooth"
              });

          }


          return;

        }


        /* ==========================
           NOTIFIKASI
        ========================== */

        if (
          page === "notifikasi"
        ) {

          console.log(
            "Halaman Notifikasi belum aktif."
          );


          return;

        }


        /* ==========================
           PROFIL
        ========================== */

        if (
          page === "profil"
        ) {

          console.log(
            "Profil AO akan dibina dalam Phase 2."
          );


          return;

        }

      }
    );

  }
);



/* ==============================
   HEADER NOTIFICATION
================================ */

const notificationButton =
  document.getElementById(
    "notificationButton"
  );


if (notificationButton) {

  notificationButton.addEventListener(
    "click",
    function () {

      console.log(
        "AO Notifications"
      );

    }
  );

}
