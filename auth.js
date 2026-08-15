// @ts-nocheck


import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser
} from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


import {
  auth,
  db
} from "./firebase.js";



/* ==============================
   ELEMENT
================================ */

const loginPanel =
  document.getElementById(
    "loginPanel"
  );


const registerPanel =
  document.getElementById(
    "registerPanel"
  );


const loginForm =
  document.getElementById(
    "loginForm"
  );


const registerForm =
  document.getElementById(
    "registerForm"
  );


const loginMessage =
  document.getElementById(
    "loginMessage"
  );


const registerMessage =
  document.getElementById(
    "registerMessage"
  );



/* ==============================
   USERNAME
================================ */

function normalizeUsername(
  username
) {

  return username
    .trim()
    .toLowerCase();

}


/*
  Firebase menggunakan email
  di belakang tabir.

  Pengguna AO tidak melihat
  alamat ini.
*/

function usernameToInternalEmail(
  username
) {

  const normalized =
    normalizeUsername(
      username
    );


  return (
    normalized +
    "@ao.invalid"
  );

}



/* ==============================
   AO ID
================================ */

function createAOID(uid) {

  const clean =
    uid
      .replace(
        /[^a-zA-Z0-9]/g,
        ""
      )
      .toUpperCase();


  return (
    "AO-" +
    clean.substring(0, 8)
  );

}



/* ==============================
   USERNAME VALIDATION
================================ */

function validUsername(
  username
) {

  return /^[a-zA-Z0-9_]{3,20}$/
    .test(username);

}



/* ==============================
   MESSAGE
================================ */

function showMessage(
  element,
  text,
  type = "error"
) {

  element.textContent =
    text;

  element.className =
    "message " + type;

}


function clearMessage(
  element
) {

  element.textContent = "";

  element.className =
    "message";

}



/* ==============================
   REGISTER
================================ */

registerForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    clearMessage(
      registerMessage
    );


    const username =
      document
        .getElementById(
          "registerUsername"
        )
        .value
        .trim();


    const password =
      document
        .getElementById(
          "registerPassword"
        )
        .value;


    const confirmPassword =
      document
        .getElementById(
          "confirmPassword"
        )
        .value;


    if (
      !validUsername(username)
    ) {

      showMessage(
        registerMessage,
        "Nama pengguna mesti 3 hingga 20 aksara dan hanya menggunakan huruf, nombor atau _."
      );

      return;
    }


    if (
      password.length < 8
    ) {

      showMessage(
        registerMessage,
        "Kata laluan mesti sekurang-kurangnya 8 aksara."
      );

      return;
    }


    if (
      password !==
      confirmPassword
    ) {

      showMessage(
        registerMessage,
        "Kata laluan tidak sepadan."
      );

      return;
    }


    const button =
      document.getElementById(
        "registerButton"
      );


    button.disabled = true;

    button.textContent =
      "Mencipta akaun...";


    let createdUser = null;


    try {

      const usernameKey =
        normalizeUsername(
          username
        );


      const internalEmail =
        usernameToInternalEmail(
          username
        );


      const credential =
        await createUserWithEmailAndPassword(
          auth,
          internalEmail,
          password
        );


      createdUser =
        credential.user;


      const aoId =
        createAOID(
          createdUser.uid
        );


      await setDoc(

        doc(
          db,
          "users",
          createdUser.uid
        ),

        {

          uid:
            createdUser.uid,

          username:
            username,

          usernameKey:
            usernameKey,

          aoId:
            aoId,

          role:
            "member",

          status:
            "active",

          community:
            "trex-community",

          createdAt:
            serverTimestamp(),

          lastLoginAt:
            serverTimestamp()

        }

      );


      showMessage(
        registerMessage,
        "Akaun AO berjaya dicipta.",
        "success"
      );


      setTimeout(
        function () {

          window.location.href =
            "index.html";

        },
        700
      );


    } catch (error) {

      console.error(
        error
      );


      /*
        Jika Firebase Auth berjaya
        tetapi Firestore gagal,
        padam semula akaun supaya
        tidak wujud akaun separuh siap.
      */

      if (
        createdUser &&
        error.code ===
        "permission-denied"
      ) {

        try {

          await deleteUser(
            createdUser
          );

        } catch (
          rollbackError
        ) {

          console.error(
            rollbackError
          );

        }

      }


      let message =
        "Tidak dapat mencipta akaun.";


      if (
        error.code ===
        "auth/email-already-in-use"
      ) {

        message =
          "Nama pengguna itu sudah digunakan.";

      }


      if (
        error.code ===
        "auth/weak-password"
      ) {

        message =
          "Kata laluan terlalu lemah.";

      }


      if (
        error.code ===
        "auth/too-many-requests"
      ) {

        message =
          "Terlalu banyak percubaan. Cuba lagi sebentar.";

      }


      if (
        error.code ===
        "permission-denied"
      ) {

        message =
          "Firestore menolak pendaftaran. Semak Security Rules.";

      }


      showMessage(
        registerMessage,
        message
      );


    } finally {

      button.disabled = false;

      button.textContent =
        "Daftar Akaun";

    }

  }
);



/* ==============================
   LOGIN
================================ */

loginForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    clearMessage(
      loginMessage
    );


    const username =
      document
        .getElementById(
          "loginUsername"
        )
        .value
        .trim();


    const password =
      document
        .getElementById(
          "loginPassword"
        )
        .value;


    if (
      !validUsername(username)
    ) {

      showMessage(
        loginMessage,
        "Nama pengguna tidak sah."
      );

      return;
    }


    const button =
      document.getElementById(
        "loginButton"
      );


    button.disabled = true;

    button.textContent =
      "Log masuk...";


    try {

      const internalEmail =
        usernameToInternalEmail(
          username
        );


      const credential =
        await signInWithEmailAndPassword(
          auth,
          internalEmail,
          password
        );


      const profileRef =
        doc(
          db,
          "users",
          credential.user.uid
        );


      const profileSnap =
        await getDoc(
          profileRef
        );


      if (
        !profileSnap.exists()
      ) {

        await signOut(auth);

        throw new Error(
          "profile-not-found"
        );

      }


      const profile =
        profileSnap.data();


      if (
        profile.status !==
        "active"
      ) {

        await signOut(auth);

        showMessage(
          loginMessage,
          "Akaun ini tidak aktif. Hubungi Admin Trex Community."
        );

        return;
      }


      await updateDoc(
        profileRef,
        {
          lastLoginAt:
            serverTimestamp()
        }
      );


      showMessage(
        loginMessage,
        "Log masuk berjaya.",
        "success"
      );


      setTimeout(
        function () {

          window.location.href =
            "index.html";

        },
        400
      );


    } catch (error) {

      console.error(
        error
      );


      let message =
        "Nama pengguna atau kata laluan salah.";


      if (
        error.code ===
        "auth/too-many-requests"
      ) {

        message =
          "Terlalu banyak percubaan. Cuba lagi sebentar.";

      }


      if (
        error.message ===
        "profile-not-found"
      ) {

        message =
          "Profil AO tidak dijumpai.";

      }


      showMessage(
        loginMessage,
        message
      );


    } finally {

      button.disabled = false;

      button.textContent =
        "Log Masuk";

    }

  }
);



/* ==============================
   SWITCH
================================ */

document
  .getElementById(
    "showRegister"
  )
  .addEventListener(
    "click",
    function () {

      loginPanel.classList.add(
        "hidden"
      );

      registerPanel.classList.remove(
        "hidden"
      );

    }
  );


document
  .getElementById(
    "showLogin"
  )
  .addEventListener(
    "click",
    function () {

      registerPanel.classList.add(
        "hidden"
      );

      loginPanel.classList.remove(
        "hidden"
      );

    }
  );



/* ==============================
   SHOW PASSWORD
================================ */

document
  .querySelectorAll(
    ".show-password"
  )
  .forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const target =
            document.getElementById(
              button.dataset.target
            );


          if (
            target.type ===
            "password"
          ) {

            target.type =
              "text";

            button.textContent =
              "Sorok";

          } else {

            target.type =
              "password";

            button.textContent =
              "Lihat";

          }

        }
      );

    }
  );



/* ==============================
   FORGOT PASSWORD
================================ */

document
  .getElementById(
    "forgotPasswordButton"
  )
  .addEventListener(
    "click",
    function () {

      showMessage(
        loginMessage,
        "Pemulihan akaun melalui Admin AO akan ditambah dalam Phase 2."
      );

    }
  );