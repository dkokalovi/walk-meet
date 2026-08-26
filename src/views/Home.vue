<template>
  <div class="container home-container">
    <div class="top-bar">
      <h1>walk&meet</h1>
      <div class="top-buttons">
        <router-link to="/profile"><button>Moj profil</button></router-link>
        <router-link to="/messages"><button id="messagesBtn">Poruke</button></router-link>
        <button @click="odjavi">Odjava</button>
      </div>
    </div>

    <!-- Notifikacije -->
    <div class="notification-summary" v-if="notif.likeovi !== null">
      <p>Likeovi: <strong>{{ notif.likeovi }}</strong></p>
      <p>Primljene poruke: <strong>{{ notif.poruke }}</strong></p>
    </div>

    <h2>Drugi korisnici</h2>

    <div class="filters">
      <select v-model="filterSpol" class="filterSpol">
        <option value="svi">Svi</option>
        <option value="Muško">Muško</option>
        <option value="Žensko">Žensko</option>
      </select>

      <select v-model="filterGrad" class="filterGrad">
        <option value="svi">Svi gradovi</option>
        <option v-for="grad in dostupniGradovi" :key="grad" :value="grad">{{ grad }}</option>
      </select>

      <select v-model="filterHobi" class="filterHobi">
        <option value="svi">Svi hobiji</option>
        <option v-for="hobi in dostupniHobiji" :key="hobi" :value="hobi">{{ hobi }}</option>
      </select>

      <div class="filter-dob">
        <label>Dob od</label>
        <input v-model.number="dobOd" type="number" min="0" placeholder="npr. 18" />
        <label>do</label>
        <input v-model.number="dobDo" type="number" min="0" placeholder="npr. 99" />
      </div>
    </div>

    <div id="usersList">
      <p v-if="filtriraniKorisnici.length === 0">Nema korisnika za ovaj filter.</p>
      <div
        v-for="k in filtriraniKorisnici"
        :key="k.uid"
        class="user-card"
      >
        <img
          v-if="k.slikaUrl"
          :src="k.slikaUrl"
          alt="profilna slika"
          style="width:60px; height:60px; border-radius:50%; object-fit:cover;"
        />
        <h3>{{ k.ime }} {{ k.prezime }}</h3>
        <p><strong>Grad:</strong> {{ k.grad }}</p>
        <p><strong>Hobi:</strong> {{ k.hobi }}</p>
        <p><strong>Spol:</strong> {{ k.spol }}</p>
        <p v-if="izracunajDob(k.datumRodjenja) !== null"><strong>Dob:</strong> {{ izracunajDob(k.datumRodjenja) }}</p>
        <button @click="pogledajProfil(k.korisnickoIme)">Pogledaj profil</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const sviKorisnici = ref([]);
const filterSpol = ref("svi");
const filterGrad = ref("svi");
const filterHobi = ref("svi");
const dobOd = ref(null);
const dobDo = ref(null);
const notif = ref({ likeovi: null, poruke: null });

function izracunajDob(datumRodjenja) {
  if (!datumRodjenja) return null;
  const rodjen = new Date(datumRodjenja);
  if (isNaN(rodjen.getTime())) return null;
  const danas = new Date();
  let dob = danas.getFullYear() - rodjen.getFullYear();
  const josNijeBioRodjendan =
    danas.getMonth() < rodjen.getMonth() ||
    (danas.getMonth() === rodjen.getMonth() && danas.getDate() < rodjen.getDate());
  if (josNijeBioRodjendan) dob--;
  return dob;
}

const dostupniGradovi = computed(() => {
  const skup = new Set(sviKorisnici.value.map(k => k.grad).filter(Boolean));
  return [...skup].sort();
});

const dostupniHobiji = computed(() => {
  const skup = new Set(sviKorisnici.value.map(k => k.hobi).filter(Boolean));
  return [...skup].sort();
});

const filtriraniKorisnici = computed(() => {
  return sviKorisnici.value.filter(k => {
    if (k.uid === auth.currentUser.uid) return false;
    if (filterSpol.value !== "svi" && k.spol !== filterSpol.value) return false;
    if (filterGrad.value !== "svi" && k.grad !== filterGrad.value) return false;
    if (filterHobi.value !== "svi" && k.hobi !== filterHobi.value) return false;

    const dob = izracunajDob(k.datumRodjenja);
    if (dobOd.value !== null && dobOd.value !== "" && (dob === null || dob < dobOd.value)) return false;
    if (dobDo.value !== null && dobDo.value !== "" && (dob === null || dob > dobDo.value)) return false;

    return true;
  });
});

async function ucitajKorisnike() {
  const snap = await getDocs(collection(db, "korisnici"));
  sviKorisnici.value = snap.docs.map(d => d.data());
}

async function ucitajNotifikacije() {
  const uid = auth.currentUser.uid;

  const likovi = await getDocs(query(collection(db, "likeovi"), where("prema", "==", uid)));
  const poruke = await getDocs(query(collection(db, "poruke"), where("prema", "==", uid)));

  notif.value = { likeovi: likovi.size, poruke: poruke.size };
}

function pogledajProfil(korisnickoIme) {
  router.push(`/user/${korisnickoIme}`);
}

async function odjavi() {
  await signOut(auth);
  router.push("/login");
}

onMounted(async () => {
  await ucitajKorisnike();
  await ucitajNotifikacije();
});
</script>
