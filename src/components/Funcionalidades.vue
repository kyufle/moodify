<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const hoveredCard = ref(null);

const volver = () => {
  router.push("/demo");
};
</script>

<template>
  <div class="contenedor-funcionalidades">
    <div class="cards">
      <div
        v-for="(card, index) in [
          { color: 'peach', tip: 'Diari emocional', desc: 'Anota emocions i pensaments' },
          { color: 'lightblue', tip: 'Gràfics d\'evolució', desc: 'Evolució setmanal i mensual' },
          { color: 'yellow', tip: 'Sistema d\'hàbits', desc: 'Crear hàbits i seguiment' },
          { color: 'pink', tip: 'Fòrum comunitari', desc: 'Publicacions i moderació' },
          { color: 'lavender', tip: 'Chat IA integrat', desc: 'Assistent emocional intel·ligent' },
          { color: 'peach', tip: 'Notificacions', desc: 'Recordatoris i resums periòdics' },
        ]"
        :key="index"
        :class="['card', card.color]"
      >
        <p class="tip">{{ card.tip }}</p>
        <p class="second-text">{{ card.desc }}</p>
      </div>
    </div>
    <button @click="volver" class="btn-primary" style="margin-top: 32px">
      Accedir a la Demo <i class="pi pi-arrow-right"></i>
    </button>
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
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
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

/* COLORES BASADOS EN BG-WEB.SVG */
.cards .peach {
  background: linear-gradient(135deg, #ffab91, #ffccbc);
}
.cards .lightblue {
  background: linear-gradient(135deg, #d6eaf8, #aed6f1);
}
.cards .pink {
  background: linear-gradient(135deg, #f5b7b1, #fadbd8);
}
.cards .yellow {
  background: linear-gradient(135deg, #fff24a, #fff9ae);
}
.cards .lavender {
  background: linear-gradient(135deg, #e6e6fa, #d8bfd8);
}

/* CARD BASE */
.cards .card {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 120px;
  border-radius: 18px;
  color: #1f2937;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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

</style>