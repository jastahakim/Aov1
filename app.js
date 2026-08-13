console.log(
  "AO Community V0.1"
);


/* ==============================
   SERVICE WORKER
================================ */

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    function () {

      navigator
        .serviceWorker
        .register("sw.js")

        .then(function () {

          console.log(
            "AO PWA aktif"
          );

        })

        .catch(function (error) {

          console.error(
            "Service Worker gagal:",
            error
          );

        });

    }
  );

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


startButton.addEventListener(
  "click",
  function () {

    communitySection
      .scrollIntoView({
        behavior: "smooth"
      });

  }
);



/* ==============================
   ROOM
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


        /*
          PHASE CHAT NANTI

          Di sini kita akan
          membuka ruang chat.
        */

      }
    );

  }
);



/* ==============================
   NAVIGATION
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

        navButtons.forEach(
          function (nav) {

            nav.classList.remove(
              "active"
            );

          }
        );


        button.classList.add(
          "active"
        );


        const page =
          button.getAttribute(
            "data-page"
          );


        console.log(
          "Halaman:",
          page
        );

      }
    );

  }
);



/* ==============================
   NOTIFICATION
================================ */

const notificationButton =
  document.getElementById(
    "notificationButton"
  );


notificationButton.addEventListener(
  "click",
  function () {

    console.log(
      "Notifikasi AO"
    );

  }
);