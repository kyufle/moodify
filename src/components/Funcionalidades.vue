<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const hoveredCard = ref(null);

const volver = () => {
  router.push("/");
};
</script>

<template>
  <div class="contenedor-funcionalidades">
    <div class="cards">
      <div
        v-for="(card, index) in [
          { color: 'red', tip: 'Registro Diario', desc: 'Anota cómo te sientes' },
          { color: 'blue', tip: 'Estadísticas', desc: 'Visualiza tu progreso' },
          { color: 'green', tip: 'Recordatorios', desc: 'No olvides tus hábitos' },
          { color: 'red', tip: 'Metas', desc: 'Define tus objetivos' },
          { color: 'blue', tip: 'Comunidad', desc: 'Comparte tus logros' },
          { color: 'green', tip: 'Soporte 24/7', desc: 'Siempre contigo' },
        ]"
        :key="index"
        class="card"
      >
        <p class="tip">{{ card.tip }}</p>
        <p class="second-text">{{ card.desc }}</p>
      </div>

      <button @click="volver" class="btn-volver">
        <i class="pi pi-arrow-left"></i> Volver al inicio
      </button>
    </div>
  </div>
</template>

<style scoped>
/* CONTENEDOR CON GLASSMORPHISM */
.contenedor-funcionalidades {
  border: 2px solid var(--accent-border);
  padding: 40px;
  border-radius: 24px;
  max-width: 900px;
  width: 95%;
  background: rgba(255, 255, 255, 0.25);
  text-align: center;
  box-shadow: var(--shadow);
  margin-top: 40px;
}

/* GRID REAL */
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .cards {
    grid-template-columns: 1fr;
  }
}

/* COLORES CON GRADIENT */
.cards .red {
  background: linear-gradient(135deg, #f43f5e, #fb7185);
}
.cards .blue {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}
.cards .green {
  background: linear-gradient(135deg, #22c55e, #4ade80);
}

/* CARD BASE */
.cards .card {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 120px;
  border-radius: 18px;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* HOVER ANIMADO */
.cards .card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.08);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 18px;
}

.cards .card:hover::before {
  opacity: 1; /* glow sutil */
}

.cards .card:hover {
  transform: translateY(-10px) scale(1.07);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

/* TEXTO ANIMADO */
.cards .card .tip {
  font-size: 1.1em;
  font-weight: 700;
  transition: transform 0.3s ease;
}

.cards .card:hover .tip {
  transform: translateY(-3px);
}

.cards .card .second-text {
  font-size: 0.8em;
  opacity: 0.9;
  transition: transform 0.3s ease;
}

.cards .card:hover .second-text {
  transform: translateY(-1px);
}

/* BOTÓN */
.btn-volver {
  grid-column: 1 / -1;
  justify-self: center;
  margin-top: 20px;
  padding: 12px 24px;
  border: none;
  font-size: 17px;
  color: #fff;
  border-radius: 10px;
  letter-spacing: 2px;
  font-weight: 700;
  text-transform: uppercase;
  transition: 0.3s;
  cursor: pointer;
  background: var(--accent);
  box-shadow: 0 0 20px var(--accent-bg);
}

.btn-volver:hover {
  box-shadow: 0 0 40px var(--accent);
  transform: translateY(-2px);
}
</style>