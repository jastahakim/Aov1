// @ts-nocheck


import {
  onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";


import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


import {
  auth,
  db
} from "./firebase.js";



const announcementApp =
  document.getElementById(
    "announcementApp"
  );


const publishCard =
  document.getElementById(
    "publishCard"
  );


const devBadge =
  document.getElementById(
    "devBadge"
  );


const announcementForm =
  document.getElementById(
    "announcementForm"
  );


const announcementList =
  document.getElementById(
    "announcementList"
  );


const formMessage =
  document.getElementById(
    "formMessage"
  );


let currentUser = null;

let currentProfile = null;

let isDeveloper = false;



/* ===========================
   BACK
=========================== */

document
  .getElementById(
    "backButton"
  )
  .addEventListener(
    "click",
    function () {

      window.location.href =
        "index.html";

    }
  );



/* ===========================
   AUTH
=========================== */

onAuthStateChanged(
  auth,
  async function (user) {

    if (!user) {

      window.location.replace(
        "auth.html"
      );

      return;
    }


    currentUser = user;


    try {

      const profileSnap =
        await getDoc(

          doc(
            db,
            "users",
            user.uid
          )

        );


      if (!profileSnap.exists()) {

        window.location.replace(
          "index.html"
        );

        return;
      }


      currentProfile =
        profileSnap.data();


      isDeveloper =
        currentProfile.role ===
        "developer";


      if (isDeveloper) {

        publishCard.hidden =
          false;

        devBadge.hidden =
          false;

      }


      announcementApp.style.visibility =
        "visible";


      await loadAnnouncements();


    } catch (error) {

      console.error(
        "Announcement Auth Error:",
        error
      );

    }

  }
);



/* ===========================
   PUBLISH
=========================== */

announcementForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    if (
      !isDeveloper ||
      !currentUser
    ) {

      return;
    }


    const title =
      document
        .getElementById(
          "announcementTitle"
        )
        .value
        .trim();


    const message =
      document
        .getElementById(
          "announcementMessage"
        )
        .value
        .trim();


    const important =
      document
        .getElementById(
          "announcementImportant"
        )
        .checked;


    if (!title || !message) {

      showFormMessage(
        "Isi tajuk dan mesej.",
        "error"
      );

      return;
    }


    const publishButton =
      document.getElementById(
        "publishButton"
      );


    publishButton.disabled =
      true;

    publishButton.textContent =
      "Menerbitkan...";


    try {

      await addDoc(

        collection(
          db,
          "announcements"
        ),

        {

          title:
            title,

          message:
            message,

          important:
            important,

          authorUid:
            currentUser.uid,

          authorName:
            currentProfile.username,

          community:
            "trex-community",

          createdAt:
            serverTimestamp()

        }

      );


      announcementForm.reset();


      showFormMessage(
        "Pengumuman berjaya diterbitkan.",
        "success"
      );


      await loadAnnouncements();


    } catch (error) {

      console.error(
        "Publish Error:",
        error
      );


      showFormMessage(
        "Pengumuman gagal diterbitkan.",
        "error"
      );


    } finally {

      publishButton.disabled =
        false;

      publishButton.textContent =
        "Terbitkan Pengumuman";

    }

  }
);



/* ===========================
   LOAD
=========================== */

async function loadAnnouncements() {

  announcementList.innerHTML =
    '<div class="loading">Memuatkan pengumuman...</div>';


  try {

    const announcementQuery =
      query(

        collection(
          db,
          "announcements"
        ),

        orderBy(
          "createdAt",
          "desc"
        ),

        limit(50)

      );


    const snapshot =
      await getDocs(
        announcementQuery
      );


    announcementList.innerHTML =
      "";


    if (snapshot.empty) {

      announcementList.innerHTML =
        '<div class="loading">Belum ada pengumuman.</div>';

      return;
    }


    snapshot.forEach(
      function (announcementDoc) {

        renderAnnouncement(
          announcementDoc.id,
          announcementDoc.data()
        );

      }
    );


  } catch (error) {

    console.error(
      "Load Announcement Error:",
      error
    );


    announcementList.innerHTML =
      '<div class="loading">Gagal memuatkan pengumuman.</div>';

  }

}



/* ===========================
   RENDER
=========================== */

function renderAnnouncement(
  id,
  data
) {

  const card =
    document.createElement(
      "article"
    );


  card.className =
    "announcement-card";


  if (data.important) {

    card.classList.add(
      "important"
    );

  }


  if (data.important) {

    const badge =
      document.createElement(
        "div"
      );

    badge.className =
      "important-badge";

    badge.textContent =
      "PENTING";

    card.appendChild(
      badge
    );

  }


  const title =
    document.createElement(
      "h3"
    );

  title.textContent =
    data.title || "Pengumuman";


  const message =
    document.createElement(
      "div"
    );

  message.className =
    "announcement-message";

  message.textContent =
    data.message || "";


  const meta =
    document.createElement(
      "div"
    );

  meta.className =
    "announcement-meta";


  let dateText =
    "Baru sahaja";


  if (
    data.createdAt &&
    data.createdAt.toDate
  ) {

    dateText =
      data.createdAt
        .toDate()
        .toLocaleString(
          "ms-MY",
          {
            dateStyle:
              "medium",

            timeStyle:
              "short"
          }
        );

  }


  meta.textContent =
    (
      data.authorName ||
      "Trex Community"
    )
    +
    " • "
    +
    dateText;


  card.appendChild(
    title
  );

  card.appendChild(
    message
  );

  card.appendChild(
    meta
  );


  if (isDeveloper) {

    const deleteButton =
      document.createElement(
        "button"
      );


    deleteButton.className =
      "delete-button";

    deleteButton.type =
      "button";

    deleteButton.textContent =
      "✕";


    deleteButton.addEventListener(
      "click",
      async function () {

        const confirmed =
          confirm(
            "Padam pengumuman ini?"
          );


        if (!confirmed) {

          return;

        }


        try {

          await deleteDoc(

            doc(
              db,
              "announcements",
              id
            )

          );


          await loadAnnouncements();


        } catch (error) {

          console.error(
            "Delete Error:",
            error
          );


          alert(
            "Gagal memadam pengumuman."
          );

        }

      }
    );


    card.appendChild(
      deleteButton
    );

  }


  announcementList.appendChild(
    card
  );

}



/* ===========================
   MESSAGE
=========================== */

function showFormMessage(
  message,
  type
) {

  formMessage.textContent =
    message;

  formMessage.className =
    "form-message " + type;

}



/* ===========================
   REFRESH
=========================== */

document
  .getElementById(
    "refreshButton"
  )
  .addEventListener(
    "click",
    loadAnnouncements
  );