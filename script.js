const firebaseConfig = {
  apiKey: "AIzaSyA9az5M2O2p9dP-gWQaNEnb7iWz4ik89eg",
  authDomain: "hhjjb-48c90.firebaseapp.com",
  projectId: "hhjjb-48c90",
  storageBucket: "hhjjb-48c90.appspot.com",
  messagingSenderId: "507778529162",
  appId: "1:507778529162:web:308976e239e786e899fa73"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const uid = "default-user"; // Replace with unique user id logic if needed

let currentGroup = null;

function addGroup() {
  const name = document.getElementById("groupInput").value.trim();
  if (!name) return;
  db.ref(`${uid}/groups/${name}`).set([]);
  document.getElementById("groupInput").value = "";
  loadGroups();
}

function handleKey(e) {
  if (e.key === "Enter") {
    const link = e.target.value.trim();
    if (!link || !currentGroup) return;
    db.ref(`${uid}/groups/${currentGroup}`).once("value", snapshot => {
      const urls = snapshot.val() || [];
      urls.push(link);
      db.ref(`${uid}/groups/${currentGroup}`).set(urls);
      e.target.value = "";
      loadLinks(currentGroup);
    });
  }
}

function loadGroups() {
  db.ref(`${uid}/groups`).once("value", snapshot => {
    const groups = snapshot.val() || {};
    const container = document.getElementById("groups");
    container.innerHTML = "";
    Object.keys(groups).forEach(name => {
      const btn = document.createElement("button");
      btn.textContent = name;
      btn.onclick = () => {
        currentGroup = name;
        loadLinks(name);
      };
      container.appendChild(btn);
    });
  });
}

function loadLinks(group) {
  db.ref(`${uid}/groups/${group}`).once("value", snapshot => {
    const links = snapshot.val() || [];
    const container = document.getElementById("links");
    container.innerHTML = `<h2>${group}</h2>`;
    links.forEach(link => {
      const a = document.createElement("a");
      a.href = link;
      a.textContent = link;
      a.target = "_blank";
      container.appendChild(a);
    });
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

window.onload = loadGroups;
