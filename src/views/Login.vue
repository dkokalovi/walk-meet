<template>
  <div class="container">
    <h1>Prijava</h1>

    <form @submit.prevent="prijavi">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="lozinka" type="password" placeholder="Lozinka" required />
      <button type="submit">Prijavi se</button>
    </form>

    <p v-if="greska" style="color:red">{{ greska }}</p>
    <p><router-link to="/register">Registracija</router-link></p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const lozinka = ref("");
const greska = ref("");

async function prijavi() {
  greska.value = "";
  try {
    await signInWithEmailAndPassword(auth, email.value, lozinka.value);
    router.push("/");
  } catch (e) {
    greska.value = "Pogrešan email ili lozinka.";
  }
}
</script>