const usersList = document.getElementById("usersList");
const logoutBtn = document.getElementById("logoutBtn");
const filterSpol = document.getElementById("filterSpol");
const notificationsBox = document.getElementById("notificationsBox");

const korisnici = JSON.parse(localStorage.getItem("korisnici")) || [];
const ulogiraniKorisnik = JSON.parse(localStorage.getItem("ulogiraniKorisnik"));
const likeovi = JSON.parse(localStorage.getItem("likeovi")) || [];
const poruke = JSON.parse(localStorage.getItem("poruke")) || [];

if (!ulogiraniKorisnik) {
    alert("Moraš se prvo prijaviti.");
    window.location.href = "login.html";
}

function prikaziNotifikacije() {
    const brojLikeova = likeovi.filter(
        like => like.prema === ulogiraniKorisnik.korisnickoIme
    ).length;

    const brojPoruka = poruke.filter(
        poruka => poruka.prema === ulogiraniKorisnik.korisnickoIme
    ).length;

    notificationsBox.innerHTML = `
        <div class="notification-summary">
            <p>❤️ Likeovi: <strong>${brojLikeova}</strong></p>
            <p>💬 Primljene poruke: <strong>${brojPoruka}</strong></p>
        </div>
    `;
}

function prikaziKorisnike() {
    usersList.innerHTML = "";

    let filtrirani = korisnici.filter(
        k => k.korisnickoIme !== ulogiraniKorisnik.korisnickoIme
    );

    if (filterSpol.value !== "svi") {
        filtrirani = filtrirani.filter(
            k => k.spol === filterSpol.value
        );
    }

    if (filtrirani.length === 0) {
        usersList.innerHTML = "<p>Nema korisnika za ovaj filter.</p>";
        return;
    }

    filtrirani.forEach((korisnik) => {
        const userCard = document.createElement("div");
        userCard.classList.add("user-card");

        userCard.innerHTML = `
            <h3>${korisnik.ime} ${korisnik.prezime}</h3>
            <p><strong>Grad:</strong> ${korisnik.grad}</p>
            <p><strong>Hobi:</strong> ${korisnik.hobi}</p>
            <p><strong>Spol:</strong> ${korisnik.spol}</p>
            <button onclick="pogledajProfil('${korisnik.korisnickoIme}')">Pogledaj profil</button>
        `;

        usersList.appendChild(userCard);
    });
}

function pogledajProfil(korisnickoIme) {
    localStorage.setItem("odabraniKorisnikIme", korisnickoIme);
    window.location.href = "user-details.html";
}

filterSpol.addEventListener("change", prikaziKorisnike);

logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("ulogiraniKorisnik");
    localStorage.removeItem("razgovorKorisnikIme");
    window.location.href = "index.html";
});

prikaziNotifikacije();
prikaziKorisnike();