// @ts-nocheck

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

import {
  auth,
  db
} from "./firebase.js";


const app =
  document.querySelector(".app");

const aoControlButton =
  document.getElementById(
    "aoControlButton"
  );


/* Sembunyikan app semasa semak sesi */

if (app) {
  app.style.visibility = "hidden";
}


/* ==============================
   CHECK SESSION
================================ */

onAuthStateChanged(
  auth,
  async function (user) {

    if (!user) {

      window.location.replace(
        "auth.html"
      );

      return;
    }


    try {

      const userRef =
        doc(
          db,
          "users",
          user.uid
        );


      const userSnap =
        await getDoc(
          userRef
        );


      if (!userSnap.exists()) {

        await signOut(auth);

        window.location.replace(
          "auth.html"
        );

        return;
      }


      const profile =
        userSnap.data();


      /* ACCOUNT SUSPENDED */

      if (
        profile.status !== "active"
      ) {

        await signOut(auth);

        alert(
          "Akaun AO anda tidak aktif."
        );

        window.location.replace(
          "auth.html"
        );

        return;
      }


      console.log(
        "AO Username:",
        profile.username
      );

      console.log(
        "AO ID:",
        profile.aoId
      );

      console.log(
        "AO Role:",
        profile.role
      );


      /* ==========================
         DEVELOPER ACCESS
      ========================== */

      if (
        profile.role === "developer"
      ) {

        document.body.classList.add(
          "developer-mode"
        );


        if (aoControlButton) {

          aoControlButton.hidden =
            false;

        }

      }


      /* SHOW APP */

      if (app) {

        app.style.visibility =
          "visible";

      }


    } catch (error) {

      console.error(
        "AO Session Error:",
        error
      );

    }

  }
);