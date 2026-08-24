<template>
  <div class="container">
    <h1>Registracija</h1>

    <form @submit.prevent="registriraj">
      <input v-model="form.ime" placeholder="Ime" />
      <input v-model="form.prezime" placeholder="Prezime" />
      <input v-model="form.datumRodjenja" type="date" />
      <select v-model="form.spol">
        <option value="">Odaberi spol</option>
        <option value="Muško">Muško</option>
        <option value="Žensko">Žensko</option>
      </select>
      <input v-model="form.grad" placeholder="Grad" />
      <input v-model="form.obrazovanje" placeholder="Obrazovanje" />
      <input v-model="form.hobi" placeholder="Hobi" />
      <input v-model="form.posao" placeholder="Posao" />
      <input v-model="form.email" type="email" placeholder="Email" />
      <input v-model="form.korisnickoIme" placeholder="Korisničko ime" />
      <input v-model="form.lozinka" type="password" placeholder="Lozinka" />
      <input v-model="form.slikaUrl" placeholder="URL slike profila (opcionalno)" />
      <textarea v-model="form.opis" placeholder="Napiši nešto o sebi"></textarea>

      <button type="submit">Registriraj se</button>
    </form>

    <p v-if="greska" style="color:red">{{ greska }}</p>
    <p><router-link to="/login">Prijava</router-link></p>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useRouter } from "vue-router";

const router = useRouter();
const greska = ref("");

const form = reactive({
  ime: "", prezime: "", datumRodjenja: "", spol: "",
  grad: "", obrazovanje: "", hobi: "", posao: "",
  email: "", korisnickoIme: "", lozinka: "", opis: "", slikaUrl: ""
});

async function registriraj() {
  greska.value = "";

  // Provjeri postoji li korisničko ime
  const q = query(collection(db, "korisnici"), where("korisnickoIme", "==", form.korisnickoIme));
  const snap = await getDocs(q);
  if (!snap.empty) {
    greska.value = "Korisničko ime već postoji.";
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, form.email, form.lozinka);

    await setDoc(doc(db, "korisnici", userCred.user.uid), {
      ime: form.ime,
      prezime: form.prezime,
      datumRodjenja: form.datumRodjenja,
      spol: form.spol,
      grad: form.grad,
      obrazovanje: form.obrazovanje,
      hobi: form.hobi,
      posao: form.posao,
      email: form.email,
      korisnickoIme: form.korisnickoIme,
      opis: form.opis,
      slikaUrl: form.slikaUrl,
      uid: userCred.user.uid
    });

    router.push("/");
  } catch (e) {
    greska.value = "Greška pri registraciji: " + e.message;
  }
}
</script>