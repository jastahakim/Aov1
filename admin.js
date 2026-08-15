// @ts-nocheck


import {
  onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


import {
  auth,
  db
} from "./firebase.js";



/* ==============================
   ELEMENTS
================================ */

const adminApp =
  document.getElementById(
    "adminApp"
  );


const userList =
  document.getElementById(
    "userList"
  );


const userSearch =
  document.getElementById(
    "userSearch"
  );


const refreshUsersButton =
  document.getElementById(
    "refreshUsers"
  );


let currentDeveloperUID = null;

let allUsers = [];



/* ==============================
   AUTH + DEVELOPER CHECK
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

      const profileSnap =
        await getDoc(

          doc(
            db,
            "users",
            user.uid
          )

        );


      if (
        !profileSnap.exists()
      ) {

        window.location.replace(
          "index.html"
        );

        return;
      }


      const profile =
        profileSnap.data();


      /*
        AO Control hanya untuk
        developer.
      */

      if (
        profile.role !==
        "developer"
      ) {

        alert(
          "Akses AO Control ditolak."
        );


        window.location.replace(
          "index.html"
        );

        return;
      }


      /*
        Akaun developer mesti aktif.
      */

      if (
        profile.status !==
        "active"
      ) {

        alert(
          "Akaun developer tidak aktif."
        );


        window.location.replace(
          "index.html"
        );

        return;
      }


      currentDeveloperUID =
        user.uid;


      const developerInfo =
        document.getElementById(
          "developerInfo"
        );


      if (developerInfo) {

        developerInfo.textContent =
          profile.username +
          " • " +
          profile.aoId;

      }


      adminApp.style.visibility =
        "visible";


      await loadUsers();


    } catch (error) {

      console.error(
        "AO Control Error:",
        error
      );


      alert(
        "AO Control gagal dimuatkan."
      );

    }

  }
);



/* ==============================
   LOAD USERS
================================ */

async function loadUsers() {

  if (!userList) {
    return;
  }


  userList.innerHTML =
    '<div class="loading">Memuatkan ahli...</div>';


  try {

    const snapshot =
      await getDocs(

        collection(
          db,
          "users"
        )

      );


    allUsers = [];


    snapshot.forEach(
      function (userDoc) {

        allUsers.push({

          id:
            userDoc.id,

          ...userDoc.data()

        });

      }
    );


    /*
      Developer dipaparkan
      paling atas.
    */

    allUsers.sort(
      function (a, b) {

        if (
          a.role === "developer" &&
          b.role !== "developer"
        ) {

          return -1;

        }


        if (
          b.role === "developer" &&
          a.role !== "developer"
        ) {

          return 1;

        }


        return (
          a.username || ""
        ).localeCompare(
          b.username || ""
        );

      }
    );


    updateStats();


    renderUsers(
      allUsers
    );


  } catch (error) {

    console.error(
      "Load Users Error:",
      error
    );


    userList.innerHTML =
      '<div class="loading">Gagal memuatkan ahli.</div>';

  }

}



/* ==============================
   STATISTICS
================================ */

function updateStats() {

  const total =
    allUsers.length;


  const active =
    allUsers.filter(
      function (user) {

        return (
          user.status ===
          "active"
        );

      }
    ).length;


  const staff =
    allUsers.filter(
      function (user) {

        return (

          user.role ===
            "developer" ||

          user.role ===
            "admin" ||

          user.role ===
            "moderator"

        );

      }
    ).length;


  const suspended =
    allUsers.filter(
      function (user) {

        return (
          user.status ===
          "suspended"
        );

      }
    ).length;


  const totalUsers =
    document.getElementById(
      "totalUsers"
    );


  const activeUsers =
    document.getElementById(
      "activeUsers"
    );


  const staffUsers =
    document.getElementById(
      "staffUsers"
    );


  const suspendedUsers =
    document.getElementById(
      "suspendedUsers"
    );


  if (totalUsers) {

    totalUsers.textContent =
      total;

  }


  if (activeUsers) {

    activeUsers.textContent =
      active;

  }


  if (staffUsers) {

    staffUsers.textContent =
      staff;

  }


  if (suspendedUsers) {

    suspendedUsers.textContent =
      suspended;

  }

}



/* ==============================
   SAFE HTML
================================ */

function escapeHTML(value) {

  return String(
    value ?? ""
  )

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}



/* ==============================
   RENDER USERS
================================ */

function renderUsers(users) {

  if (!userList) {
    return;
  }


  userList.innerHTML = "";


  if (
    users.length === 0
  ) {

    userList.innerHTML =
      '<div class="loading">Tiada ahli dijumpai.</div>';

    return;
  }


  users.forEach(
    function (user) {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "user-card";


      const isSelf =
        user.id ===
        currentDeveloperUID;


      const firstLetter =
        (
          user.username ||
          "A"
        )
          .charAt(0)
          .toUpperCase();


      card.innerHTML = `

        <div class="user-top">

          <div class="user-avatar">

            ${escapeHTML(firstLetter)}

          </div>


          <div class="user-main">

            <strong>

              ${escapeHTML(
                user.username ||
                "Unknown"
              )}

            </strong>


            <span>

              ${escapeHTML(
                user.aoId ||
                "Tiada AO ID"
              )}

              •

              <span
                class="${
                  user.status ===
                  "active"

                    ? "status-active"

                    : "status-suspended"
                }"
              >

                ${escapeHTML(
                  user.status ||
                  "unknown"
                )}

              </span>

            </span>

          </div>


          <div
            class="role-badge ${escapeHTML(
              user.role
            )}"
          >

            ${escapeHTML(
              user.role ||
              "member"
            )}

          </div>

        </div>



        <div class="user-controls">


          <select
            class="role-select"
            data-user-id="${escapeHTML(
              user.id
            )}"
            ${isSelf ? "disabled" : ""}
          >

            <option
              value="member"
              ${
                user.role === "member"
                  ? "selected"
                  : ""
              }
            >
              Member
            </option>


            <option
              value="moderator"
              ${
                user.role ===
                "moderator"

                  ? "selected"
                  : ""
              }
            >
              Moderator
            </option>


            <option
              value="admin"
              ${
                user.role === "admin"
                  ? "selected"
                  : ""
              }
            >
              Admin
            </option>

          </select>



          <select
            class="status-select"
            data-user-id="${escapeHTML(
              user.id
            )}"
            ${isSelf ? "disabled" : ""}
          >

            <option
              value="active"
              ${
                user.status ===
                "active"

                  ? "selected"
                  : ""
              }
            >
              Aktif
            </option>


            <option
              value="suspended"
              ${
                user.status ===
                "suspended"

                  ? "selected"
                  : ""
              }
            >
              Suspend
            </option>

          </select>


        </div>

      `;


      userList.appendChild(
        card
      );

    }
  );


  bindUserControls();

}



/* ==============================
   BIND USER CONTROLS
================================ */

function bindUserControls() {


  document
    .querySelectorAll(
      ".role-select"
    )
    .forEach(
      function (select) {

        select.addEventListener(
          "change",
          async function () {

            await updateUserField(

              select.dataset.userId,

              "role",

              select.value

            );

          }
        );

      }
    );



  document
    .querySelectorAll(
      ".status-select"
    )
    .forEach(
      function (select) {

        select.addEventListener(
          "change",
          async function () {

            await updateUserField(

              select.dataset.userId,

              "status",

              select.value

            );

          }
        );

      }
    );

}



/* ==============================
   UPDATE USER
================================ */

async function updateUserField(
  uid,
  field,
  value
) {

  /*
    Developer tidak boleh
    suspend/demote dirinya sendiri.
  */

  if (
    uid ===
    currentDeveloperUID
  ) {

    alert(
      "Akaun developer utama tidak boleh diubah dari panel ini."
    );

    return;
  }


  /*
    Nilai role yang dibenarkan.
  */

  if (
    field === "role"
  ) {

    const allowedRoles = [
      "member",
      "moderator",
      "admin"
    ];


    if (
      !allowedRoles.includes(
        value
      )
    ) {

      return;
    }

  }


  /*
    Nilai status yang dibenarkan.
  */

  if (
    field === "status"
  ) {

    const allowedStatus = [
      "active",
      "suspended"
    ];


    if (
      !allowedStatus.includes(
        value
      )
    ) {

      return;
    }

  }


  try {

    await updateDoc(

      doc(
        db,
        "users",
        uid
      ),

      {
        [field]:
          value
      }

    );


    const localUser =
      allUsers.find(
        function (user) {

          return (
            user.id === uid
          );

        }
      );


    if (localUser) {

      localUser[field] =
        value;

    }


    updateStats();


    /*
      Render semula supaya
      badge role/status berubah.
    */

    renderUsers(
      allUsers
    );


    console.log(
      "AO user updated:",
      uid,
      field,
      value
    );


  } catch (error) {

    console.error(
      "Update User Error:",
      error
    );


    alert(
      "Gagal mengubah akaun."
    );


    await loadUsers();

  }

}



/* ==============================
   SEARCH USER
================================ */

if (userSearch) {

  userSearch.addEventListener(
    "input",
    function () {

      const keyword =
        userSearch
          .value
          .trim()
          .toLowerCase();


      if (!keyword) {

        renderUsers(
          allUsers
        );

        return;
      }


      const filtered =
        allUsers.filter(
          function (user) {

            const username =
              (
                user.username ||
                ""
              )
                .toLowerCase();


            const aoId =
              (
                user.aoId ||
                ""
              )
                .toLowerCase();


            const uid =
              (
                user.id ||
                ""
              )
                .toLowerCase();


            return (

              username.includes(
                keyword
              )

              ||

              aoId.includes(
                keyword
              )

              ||

              uid.includes(
                keyword
              )

            );

          }
        );


      renderUsers(
        filtered
      );

    }
  );

}



/* ==============================
   REFRESH USERS
================================ */

if (refreshUsersButton) {

  refreshUsersButton.addEventListener(
    "click",
    async function () {

      refreshUsersButton.disabled =
        true;


      refreshUsersButton.textContent =
        "...";


      await loadUsers();


      refreshUsersButton.disabled =
        false;


      refreshUsersButton.textContent =
        "↻";

    }
  );

}



/* ==============================
   QUICK ACTIONS
================================ */

document
  .querySelectorAll(
    ".action-card"
  )
  .forEach(
    function (button) {

      button.addEventListener(
        "click",
        function () {

          const action =
            button.dataset.action;



          /* ======================
             PENGUMUMAN
          ====================== */

          if (
            action ===
            "announcement"
          ) {

            window.location.href =
              "announcement.html";

            return;

          }



          /* ======================
             PUSH NOTIFICATION
          ====================== */

          if (
            action ===
            "push"
          ) {

            alert(
              "Push Notification akan dibina selepas backend FCM siap."
            );

            return;

          }



          /* ======================
             ROOM CONTROL
          ====================== */

          if (
            action ===
            "rooms"
          ) {

            alert(
              "Room Control akan aktif apabila Phase 3 dibina."
            );

            return;

          }



          /* ======================
             APP CONTROL
          ====================== */

          if (
            action ===
            "app"
          ) {

            alert(
              "App Control akan dibina selepas sistem Pengumuman selesai."
            );

            return;

          }

        }
      );

    }
  );