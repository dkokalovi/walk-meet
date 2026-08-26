<template>
  <div class="container messages-container">
    <h1>Poruke i obavijesti</h1>

    <h2>Tko te lajkao</h2>
    <div id="likesNotifications">
      <p v-if="primljeniLikeovi.length === 0">Još nemaš nijedan like.</p>
      <div v-for="like in primljeniLikeovi" :key="like.od" class="user-card">
        <h3>{{ imeKorisnika(like.od) }}</h3>
        <p>Ova osoba je lajkala tvoj profil ❤️</p>
      </div>
    </div>

    <hr>

    <h2>Razgovori</h2>
    <div>
      <p v-if="razgovori.length === 0">Nemaš još nijedan razgovor.</p>
      <div
        v-for="r in razgovori"
        :key="r"
        class="conversation-card"
        :class="{ 'active-conversation': aktivniRazgovor === r }"
        @click="odaberiRazgovor(r)"
      >
        <h3>{{ imeKorisnika(r) }}</h3>
        <p>{{ zadnjaPoruka(r) }}</p>
      </div>
    </div>

    <hr>

    <div v-if="aktivniRazgovor">
      <h2>Razgovor s: {{ imeKorisnika(aktivniRazgovor) }}</h2>

      <div id="chatMessages">
        <p v-if="poruke.length === 0">Nema poruka.</p>
        <div
          v-for="p in poruke"
          :key="p.id"
          class="message-bubble"
          :class="p.od === mojUid ? 'my-message' : 'other-message'"
        >
          <img v-if="p.slikaUrl" :src="p.slikaUrl" alt="slika" class="chat-image" />
          <p v-if="p.tekst" style="white-space: pre-line">{{ p.tekst }}</p>
        </div>
      </div>

      <div class="chat-input-row">
        <input v-model="novaPorukaText" placeholder="Upiši poruku..." @keyup.enter="posaljiPoruku" />
        <div class="emoji-picker-wrapper">
          <button type="button" @click="emojiOtvoren = !emojiOtvoren">😊</button>
          <div v-if="emojiOtvoren" class="emoji-picker">
            <span
              v-for="e in emojiji"
              :key="e"
              class="emoji-option"
              @click="dodajEmoji(e)"
            >{{ e }}</span>
          </div>
        </div>
        <button @click="posaljiPoruku">Pošalji</button>
      </div>

      <div class="chat-image-row">
        <input v-model="novaSlikaUrl" placeholder="URL slike (opcionalno)..." />
        <button @click="posaljiSliku" :disabled="!novaSlikaUrl.trim()">Pošalji sliku</button>
      </div>

      <hr>
      <h3>Dogovor za šetnju</h3>
      <input v-model="walk.mjesto" placeholder="Mjesto susreta" />
      <input v-model="walk.ruta" placeholder="Ruta za šetnju" />
      <input v-model="walk.datum" type="date" />
      <input v-model="walk.vrijeme" type="time" />
      <button @click="posaljiSetnuju">Pošalji prijedlog šetnje</button>
    </div>

    <br>
    <router-link to="/"><button type="button">Nazad na početnu</button></router-link>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from "vue";
import { useRoute } from "vue-router";
import { auth, db } from "../firebase";
import {
  collection, query, where, getDocs, addDoc, onSnapshot, serverTimestamp
} from "firebase/firestore";

const route = useRoute();
const mojUid = auth.currentUser.uid;

const sviKorisnici = ref([]);
const primljeniLikeovi = ref([]);
const svePoruke = ref([]);
const poruke = ref([]);
const razgovori = ref([]);
const aktivniRazgovor = ref("");
const novaPorukaText = ref("");
const novaSlikaUrl = ref("");
const emojiOtvoren = ref(false);
const emojiji = ["😀", "😂", "😍", "😉", "👍", "❤️", "🚶", "🎉", "😢", "🤔", "🙌", "🔥"];
const walk = reactive({ mjesto: "", ruta: "", datum: "", vrijeme: "" });

let unsubPoslane, unsubPrimljene;

function imeKorisnika(uid) {
  const k = sviKorisnici.value.find(k => k.uid === uid);
  return k ? `${k.ime} ${k.prezime}` : uid;
}

function preracunajRazgovore() {
  const set = new Set();
  svePoruke.value.forEach(p => {
    const drugi = p.od === mojUid ? p.prema : p.od;
    set.add(drugi);
  });
  razgovori.value = [...set];

  if (aktivniRazgovor.value) {
    odaberiRazgovor(aktivniRazgovor.value);
  }
}

function odaberiRazgovor(uid) {
  aktivniRazgovor.value = uid;
  poruke.value = svePoruke.value
    .filter(p =>
      (p.od === mojUid && p.prema === uid) ||
      (p.od === uid && p.prema === mojUid)
    )
    .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
}

function zadnjaPoruka(uid) {
  const rel = svePoruke.value.filter(p =>
    (p.od === mojUid && p.prema === uid) ||
    (p.od === uid && p.prema === mojUid)
  );
  if (rel.length === 0) return "Nema poruka";
  const zadnja = rel[rel.length - 1];
  if (zadnja.slikaUrl && !zadnja.tekst) return "📷 Slika";
  const tekst = zadnja.tekst || "";
  return tekst.length > 50 ? tekst.slice(0, 50) + "..." : tekst;
}

function dodajEmoji(e) {
  novaPorukaText.value += e;
  emojiOtvoren.value = false;
}

async function posaljiPoruku() {
  if (!aktivniRazgovor.value || !novaPorukaText.value.trim()) return;
  await addDoc(collection(db, "poruke"), {
    od: mojUid,
    prema: aktivniRazgovor.value,
    tekst: novaPorukaText.value.trim(),
    createdAt: serverTimestamp()
  });
  novaPorukaText.value = "";
}

async function posaljiSliku() {
  if (!aktivniRazgovor.value || !novaSlikaUrl.value.trim()) return;
  await addDoc(collection(db, "poruke"), {
    od: mojUid,
    prema: aktivniRazgovor.value,
    tekst: "",
    slikaUrl: novaSlikaUrl.value.trim(),
    createdAt: serverTimestamp()
  });
  novaSlikaUrl.value = "";
}

async function posaljiSetnuju() {
  if (!walk.mjesto || !walk.ruta || !walk.datum || !walk.vrijeme) {
    alert("Ispuni sva polja za prijedlog šetnje.");
    return;
  }
  const tekst = `🚶 PRIJEDLOG ŠETNJE:\nMjesto: ${walk.mjesto}\nRuta: ${walk.ruta}\nDatum: ${walk.datum}\nVrijeme: ${walk.vrijeme}`;
  await addDoc(collection(db, "poruke"), {
    od: mojUid,
    prema: aktivniRazgovor.value,
    tekst,
    createdAt: serverTimestamp()
  });
  Object.assign(walk, { mjesto: "", ruta: "", datum: "", vrijeme: "" });
}

onMounted(async () => {
  const korisniciSnap = await getDocs(collection(db, "korisnici"));
  sviKorisnici.value = korisniciSnap.docs.map(d => d.data());

  const likSnap = await getDocs(query(collection(db, "likeovi"), where("prema", "==", mojUid)));
  primljeniLikeovi.value = likSnap.docs.map(d => d.data());

  if (route.query.with) {
    const k = sviKorisnici.value.find(k => k.korisnickoIme === route.query.with);
    if (k) aktivniRazgovor.value = k.uid;
  }

  unsubPoslane = onSnapshot(query(collection(db, "poruke"), where("od", "==", mojUid)), snap => {
    const poslane = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    svePoruke.value = [...svePoruke.value.filter(p => p.od !== mojUid), ...poslane];
    preracunajRazgovore();
  });

  unsubPrimljene = onSnapshot(query(collection(db, "poruke"), where("prema", "==", mojUid)), snap => {
    const primljene = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    svePoruke.value = [...svePoruke.value.filter(p => p.prema !== mojUid), ...primljene];
    preracunajRazgovore();
  });
});

onUnmounted(() => {
  if (unsubPoslane) unsubPoslane();
  if (unsubPrimljene) unsubPrimljene();
});
</script>
