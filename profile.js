const profileForm = document.getElementById("profileForm");

let korisnici = JSON.parse(localStorage.getItem("korisnici")) || [];
let ulogiraniKorisnik = JSON.parse(localStorage.getItem("ulogiraniKorisnik"));

if (ulogiraniKorisnik) {
    document.getElementById("ime").value = ulogiraniKorisnik.ime;
    document.getElementById("prezime").value = ulogiraniKorisnik.prezime;
    document.getElementById("datumRodjenja").value = ulogiraniKorisnik.datumRodjenja;
    document.getElementById("spol").value = ulogiraniKorisnik.spol;
    document.getElementById("grad").value = ulogiraniKorisnik.grad;
    document.getElementById("obrazovanje").value = ulogiraniKorisnik.obrazovanje;
    document.getElementById("hobi").value = ulogiraniKorisnik.hobi;
    document.getElementById("posao").value = ulogiraniKorisnik.posao;
    document.getElementById("opis").value = ulogiraniKorisnik.opis;
}

profileForm.addEventListener("submit", function(e) {
    e.preventDefault();

    ulogiraniKorisnik.ime = document.getElementById("ime").value;
    ulogiraniKorisnik.prezime = document.getElementById("prezime").value;
    ulogiraniKorisnik.datumRodjenja = document.getElementById("datumRodjenja").value;
    ulogiraniKorisnik.spol = document.getElementById("spol").value;
    ulogiraniKorisnik.grad = document.getElementById("grad").value;
    ulogiraniKorisnik.obrazovanje = document.getElementById("obrazovanje").value;
    ulogiraniKorisnik.hobi = document.getElementById("hobi").value;
    ulogiraniKorisnik.posao = document.getElementById("posao").value;
    ulogiraniKorisnik.opis = document.getElementById("opis").value;

    const index = korisnici.findIndex(
        k => k.korisnickoIme === ulogiraniKorisnik.korisnickoIme
    );

    if (index !== -1) {
        korisnici[index] = ulogiraniKorisnik;
    }

    localStorage.setItem("korisnici", JSON.stringify(korisnici));
    localStorage.setItem("ulogiraniKorisnik", JSON.stringify(ulogiraniKorisnik));

    alert("Profil ažuriran!");
});