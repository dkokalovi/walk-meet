<template>
  <div class="container">
    <h1>Profil</h1>

    <div v-if="korisnik">
      <img
        v-if="korisnik.slikaUrl"
        :src="korisnik.slikaUrl"
        alt="profilna slika"
        style="width:120px; height:120px; border-radius:50%; object-fit:cover; margin-bottom:10px;"
      />
      <h2>{{ korisnik.ime }} {{ korisnik.prezime }}</h2>
      <p><strong>Grad:</strong> {{ korisnik.grad }}</p>
      <p><strong>Spol:</strong> {{ korisnik.spol }}</p>
      <p><strong>Datum rođenja:</strong> {{ korisnik.datumRodjenja }}</p>
      <p><strong>Obrazovanje:</strong> {{ korisnik.obrazovanje }}</p>
      <p><strong>Posao:</strong> {{ korisnik.posao }}</p>
      <p><strong>Hobi:</strong> {{ korisnik.hobi }}</p>
      <p><strong>O meni:</strong> {{ korisnik.opis || "-" }}</p>

      <button @click="posaljiLike" :disabled="vecLajkano">
        {{ vecLajkano ? "❤️ Lajkano" : "🤍 Like" }}
      </button>
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
  collection, query, where, getDocs, addDoc
} from "firebase/firestore";

const route = useRoute();
const router = useRouter();
const korisnik = ref(null);
const vecLajkano = ref(false);

async function ucitajKorisnika() {
  const username = route.params.username;
  const snap = await getDocs(
    query(collection(db, "korisnici"), where("korisnickoIme", "==", username))
  );
  if (!snap.empty) {
    korisnik.value = snap.docs[0].data();
    await provjeriLike();
  }
}

async function provjeriLike() {
  const mojUid = auth.currentUser.uid;
  const q = query(
    collection(db, "likeovi"),
    where("od", "==", mojUid),
    where("prema", "==", korisnik.value.uid)
  );
  const snap = await getDocs(q);
  vecLajkano.value = !snap.empty;
}

async function posaljiLike() {
  if (!korisnik.value || vecLajkano.value) return;

  const mojUid = auth.currentUser.uid;
  await addDoc(collection(db, "likeovi"), {
    od: mojUid,
    prema: korisnik.value.uid
  });

  vecLajkano.value = true;
}

function posaljiPoruku() {
  router.push({ path: "/messages", query: { with: korisnik.value.korisnickoIme } });
}

onMounted(() => {
  ucitajKorisnika();
});
</script>
