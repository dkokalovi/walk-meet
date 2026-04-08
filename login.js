const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const unesenoImeIliEmail = document.getElementById("loginKorisnickoIme").value;
    const unesenaLozinka = document.getElementById("loginLozinka").value;

    let korisnici = JSON.parse(localStorage.getItem("korisnici")) || [];

    const prijavljeniKorisnik = korisnici.find(korisnik =>
        (korisnik.korisnickoIme === unesenoImeIliEmail || korisnik.email === unesenoImeIliEmail) &&
        korisnik.lozinka === unesenaLozinka
    );

    if (prijavljeniKorisnik) {
        localStorage.setItem("ulogiraniKorisnik", JSON.stringify(prijavljeniKorisnik));
        alert("Prijava uspješna!");
        window.location.href = "home.html";
    } else {
        alert("Pogrešno korisničko ime/email ili lozinka.");
    }
});