<script setup>
import "primeicons/primeicons.css";
import { useRouter } from 'vue-router';

const mensaje = " MOODIFY";
const router = useRouter();

const irADescubre = () => {
  router.push('/descubre');
};
</script>

<template>
  <div class="caja">
    <h2>{{ mensaje }}</h2>
    <h3 class="subtitle">~ On les teves emocions cobren forma ~</h3>
    <p>
      Una aplicació web interactiva centrada en el benestar emocional i la creació d’hàbits saludables.
    </p>
    <div class="authors">
      <span><i class="pi pi-user"></i> Valeria Santana Megia</span>
      <span><i class="pi pi-user"></i> Ruth Romero Carretero</span>
    </div>

    <button @click="irADescubre" class="btn-primary">
      Dona un cop d'ull <i class="pi pi-arrow-right"></i>
    </button>
  </div>
</template>

<style scoped>
.caja {
  border: 2px solid var(--accent-border);
  padding: 40px;
  border-radius: 24px;
  max-width: 550px;
  width: 90%;
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  text-align: center;
  box-shadow: var(--shadow);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  margin-top: 20px;
}

.caja:hover {
  transform: translateY(-8px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
