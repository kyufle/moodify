<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const volver = () => {
  router.push("/funcionalidades");
};
</script>

<template>
  <div class="caja-descubre">
    <h1>El perquè de MOODIFY</h1>
    <div class="text-content">
      <p class="origin">
        El nom neix de la fusió de dos conceptes: <strong>Mood</strong> (Estat d'ànim i reflexió) i <strong>Modify</strong> (Acció i transformació). 
        La nostra motivació és oferir un espai segur en una societat accelerada on no sempre tenim temps per expressar com ens sentim.
      </p>

      <div class="pilars-section">
        <h3>Els tres pilars fonamentals</h3>
        <div class="pilars-grid">
          <div class="pilar">
            <i class="pi pi-compass icon-pilar"></i>
            <strong>Hàbits</strong>
            <span>Construir rutines de valor</span>
          </div>
          <div class="pilar">
            <i class="pi pi-heart icon-pilar"></i>
            <strong>Mentalitat</strong>
            <span>Autoconeixement emocional</span>
          </div>
          <div class="pilar">
            <i class="pi pi-chart-line icon-pilar"></i>
            <strong>Progrés</strong>
            <span>Observar l'evolució</span>
          </div>
        </div>
      </div>
    </div>
    <button @click="volver" class="btn-primary">
      Veure Funcionalitats <i class="pi pi-arrow-right"></i>
    </button>
  </div>
</template>

<style scoped>
.caja-descubre {
  border: 2px solid var(--accent-border);
  padding: 40px;
  border-radius: 24px;
  max-width: 650px;
  width: 50%;
  background-color: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  text-align: center;
  box-shadow: var(--shadow);
  margin-top: 40px;
  margin-bottom: 40px;
}

h1 {
  color: #111827;
  font-size: 2.5rem;
  margin-bottom: 24px;
}

.text-content {
  text-align: left;
  margin-bottom: 32px;
}

.text-content .origin {
  color: #374151;
  font-size: 1.15rem;
  line-height: 1.6;
  margin-bottom: 32px;
  text-align: center;
  background: rgba(255, 255, 255, 0.4);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.pilars-section {
  text-align: center;
}

.pilars-section h3 {
  color: #1f2937;
  font-size: 1.3rem;
  margin-bottom: 20px;
}

.pilars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.pilar {
  background: linear-gradient(135deg, rgba(255,171,145,0.2), rgba(255,255,255,0.6));
  padding: 20px 15px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
  transition: transform 0.3s ease;
  border: 1px solid rgba(255, 171, 145, 0.3);
}

.pilar:hover {
  transform: translateY(-5px);
}

.icon-pilar {
  font-size: 2rem;
  color: var(--accent);
  margin-bottom: 5px;
}

.pilar strong {
  font-size: 1.1rem;
  color: #111827;
}

.pilar span {
  font-size: 0.85rem;
  color: #4b5563;
  text-align: center;
}

</style>
