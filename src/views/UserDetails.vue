<template>
  <div class="container">
    <h1>Profil</h1>

    <div v-if="korisnik">
      <h2>{{ korisnik.ime }} {{ korisnik.prezime }}</h2>
      <p><strong>Grad:</strong> {{ korisnik.grad }}</p>
      <p><strong>Spol:</strong> {{ korisnik.spol }}</p>
      <p><strong>Datum rođenja:</strong> {{ korisnik.datumRodjenja }}</p>
      <p><strong>Obrazovanje:</strong> {{ korisnik.obrazovanje }}</p>
      <p><strong>Posao:</strong> {{ korisnik.posao }}</p>
      <p><strong>Hobi:</strong> {{ korisnik.hobi }}</p>
      <p><strong>O meni:</strong> {{ korisnik.opis || "-" }}</p>

      <button @click="posaljiLike">❤️ Like</button>
      <button @click="posaljiPoruku">💬 Pošalji poruku</button>
    </div>
    <p v-else>Korisnik nije pronađen.</p>

    <br>
    <router-link to="/">Nazad</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { auth, db } from "../firebase";
import {
  collection, query, where, getDocs, addDoc, doc, getDoc
} from "firebase/firestore";

const route = useRoute();
const router = useRouter();
const korisnik = ref(null);
let mojeKorisnickoIme = "";

onMounted(async () => {
  const username = route.params.username;

  // Dohvati moje korisničko ime
  const meSnap = await getDocs(query(collection(db, "korisnici"), where("uid", "==", auth.currentUser.uid)));
  if (!meSnap.empty) mojeKorisnickoIme = meSnap.docs[0].data().korisnickoIme;

  // Dohvati odabranog korisnika
  const snap = await getDocs(query(collection(db, "korisnici"), where("korisnickoIme", "==", username)));
  if (!snap.empty) korisnik.value = snap.docs[0].data();
});

async function posaljiLike() {
  const q = query(collection(db, "likeovi"),
    where("od", "==", mojeKorisnickoIme),
    where("prema", "==", korisnik.value.korisnickoIme)
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    alert("Već si poslao/la like ovoj osobi.");
    return;
  }
  await addDoc(collection(db, "likeovi"), {
    od: mojeKorisnickoIme,
    prema: korisnik.value.korisnickoIme
  });
  alert("Like poslan ❤️");
}

function posaljiPoruku() {
  router.push({ path: "/messages", query: { s: korisnik.value.korisnickoIme } });
}
</script>