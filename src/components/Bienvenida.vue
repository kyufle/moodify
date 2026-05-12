<script setup>
import "primeicons/primeicons.css";
import { useRouter } from "vue-router";

const mensaje = " MOODIFY";
const router = useRouter();

const irADescubre = () => {
  router.push("/descubre");
};
</script>

<template>
  <div class="caja">
    <img src="../assets/moodifyLogo.png" alt="Logo" />
    <h1>{{ mensaje }}</h1>
    <h3 class="subtitle">~ On les teves emocions cobren forma ~</h3>
    <p>
      Una aplicació web interactiva centrada en el benestar emocional i la
      creació d’hàbits saludables.
    </p>
    <div class="authors">
      <span><i class="pi pi-user"></i> Valeria Santana Megia</span>
      <span><i class="pi pi-user"></i> Ruth Romero Carretero</span>
    </div>
    <div class="button-group">
      <button @click="irADescubre" class="btn-primary">
        Dona un cop d'ull <i class="pi pi-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 200px;
  height: 200px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    width: 120px;
    height: 120px;
    margin-bottom: 12px;
  }
}

h2 {
  color: #111827;
  font-size: 3.5rem;
  margin-bottom: 5px;
  letter-spacing: -2px;
  font-weight: 700;
}

.subtitle {
  color: var(--accent-2);
  font-size: 1.2rem;
  font-style: italic;
  font-weight: 500;
  margin-bottom: 24px;
}

p {
  color: #374151;
  font-size: 1.2rem;
  line-height: 1.6;
  font-weight: 500;
  margin-bottom: 24px;
}

.authors {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #6b7280;
  font-size: 1rem;
  font-weight: 600;
}
</style>
