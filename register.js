const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const noviKorisnik = {
        ime: document.getElementById("ime").value,
        prezime: document.getElementById("prezime").value,
        datumRodjenja: document.getElementById("datumRodjenja").value,
        spol: document.getElementById("spol").value,
        grad: document.getElementById("grad").value,
        obrazovanje: document.getElementById("obrazovanje").value,
        hobi: document.getElementById("hobi").value,
        posao: document.getElementById("posao").value,
        email: document.getElementById("email").value,
        korisnickoIme: document.getElementById("korisnickoIme").value,
        lozinka: document.getElementById("lozinka").value,
        opis: document.getElementById("opis").value
    };

    let korisnici = JSON.parse(localStorage.getItem("korisnici")) || [];

    const postojiEmail = korisnici.some(korisnik => korisnik.email === noviKorisnik.email);
    const postojiKorisnickoIme = korisnici.some(korisnik => korisnik.korisnickoIme === noviKorisnik.korisnickoIme);

    if (postojiEmail) {
        alert("Email već postoji.");
        return;
    }

    if (postojiKorisnickoIme) {
        alert("Korisničko ime već postoji.");
        return;
    }

    korisnici.push(noviKorisnik);
    localStorage.setItem("korisnici", JSON.stringify(korisnici));

    alert("Registracija uspješna! Sada se prijavi.");
    window.location.href = "login.html";
});