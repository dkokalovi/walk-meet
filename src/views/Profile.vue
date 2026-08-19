<template>
  <div class="container">
    <h1>Moj profil</h1>

    <form v-if="form.ime !== undefined" @submit.prevent="spremi">
      <input v-model="form.ime" placeholder="Ime" />
      <input v-model="form.prezime" placeholder="Prezime" />
      <input v-model="form.datumRodjenja" type="date" />
      <select v-model="form.spol">
        <option value="Muško">Muško</option>
        <option value="Žensko">Žensko</option>
      </select>
      <input v-model="form.grad" placeholder="Grad" />
      <input v-model="form.obrazovanje" placeholder="Obrazovanje" />
      <input v-model="form.hobi" placeholder="Hobi" />
      <input v-model="form.posao" placeholder="Posao" />
      <textarea v-model="form.opis" placeholder="O meni"></textarea>

      <button type="submit">Spremi promjene</button>
    </form>

    <br>
    <router-link to="/"><button>Nazad</button></router-link>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const form = reactive({});

onMounted(async () => {
  const snap = await getDoc(doc(db, "korisnici", auth.currentUser.uid));
  if (snap.exists()) Object.assign(form, snap.data());
});

async function spremi() {
  await updateDoc(doc(db, "korisnici", auth.currentUser.uid), {
    ime: form.ime,
    prezime: form.prezime,
    datumRodjenja: form.datumRodjenja,
    spol: form.spol,
    grad: form.grad,
    obrazovanje: form.obrazovanje,
    hobi: form.hobi,
    posao: form.posao,
    opis: form.opis,
  });
  alert("Profil ažuriran!");
}
</script>