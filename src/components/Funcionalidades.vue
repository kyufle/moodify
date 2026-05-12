<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const volver   = () => router.push("/bloom");
const anterior = () => router.push("/descubre");

const cards = [
  {
    color:  'peach',
    emoji:  '📅',
    tip:    'Diari Emocional',
    desc:   'Registra el teu estat d\'ànim cada dia amb emojis i notes. Visualitza el teu historial en un calendari mensual.',
  },
  {
    color:  'lightblue',
    emoji:  '📊',
    tip:    'Gràfics d\'Evolució',
    desc:   'Estadístiques setmanals i mensuals del teu benestar. Descobreix patrons i tendències al teu estat anímic.',
  },
  {
    color:  'yellow',
    emoji:  '🏆',
    tip:    'Sistema d\'Hàbits',
    desc:   'Crea hàbits personalitzats i fes-ne seguiment diari. Guanya punts i racxes per mantenir la constància.',
  },
  {
    color:  'pink',
    emoji:  '👥',
    tip:    'Fòrum Comunitari',
    desc:   'Comparteix publicacions, dona likes i segueix altres usuaris. Veu l\'estat d\'ànim de les persones que segueixes.',
  },
  {
    color:  'lavender',
    emoji:  '🌸',
    tip:    'Chat amb Bloom',
    desc:   'Parla amb la nostra psicòloga virtual disponible 24/7. Escolta activa, empàtica i totalment privada.',
  },
  {
    color:  'green',
    emoji:  '😴',
    tip:    'Seguiment del Son',
    desc:   'Registra les hores dormides i la qualitat del son. Relaciona el descans amb el teu estat d\'ànim diari.',
  },
]
</script>

<template>
  <div class="caja">
    <h1>Funcionalitats</h1>

    <div class="cards">
      <div v-for="(card, i) in cards" :key="i" class="flip-wrap">
        <div :class="['flip-inner', card.color]">

          <div class="flip-front">
            <span class="card-emoji">{{ card.emoji }}</span>
            <p class="tip">{{ card.tip }}</p>
          </div>

          <div class="flip-back">
            <span class="card-emoji small">{{ card.emoji }}</span>
            <p class="tip">{{ card.tip }}</p>
            <p class="desc">{{ card.desc }}</p>
          </div>

        </div>
      </div>
    </div>

    <div class="button-group">
      <button @click="anterior" class="btn-primary">
        <i class="pi pi-arrow-left"></i> Enrere
      </button>
      <button @click="volver" class="btn-primary" style="margin-top:0">
        Coneix a Bloom <i class="pi pi-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2rem;
  color: #111827;
  margin-bottom: 28px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 28px;
  margin-top: 20px;
  width: 100%;
}

@media (max-width: 700px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .cards { grid-template-columns: 1fr; }
}

.flip-wrap {
  perspective: 900px;
  height: 150px;
}

.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  cursor: default;
}

.flip-wrap:hover .flip-inner {
  transform: rotateY(180deg);
}

/* ── CARAS ────────────────────────────────── */
.flip-front,
.flip-back {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  padding: 14px;
}

.flip-back {
  transform: rotateY(180deg);
  background: rgba(255,255,255,0.55) !important;
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255,255,255,0.7);
}

/* ── COLORES CARA FRONTAL ─────────────────── */
.peach    { background: linear-gradient(135deg, #ffab91, #ffccbc); }
.lightblue{ background: linear-gradient(135deg, #d6eaf8, #aed6f1); }
.yellow   { background: linear-gradient(135deg, #fff176, #fff9ae); }
.pink     { background: linear-gradient(135deg, #f5b7b1, #fadbd8); }
.lavender { background: linear-gradient(135deg, #e6e6fa, #d8bfd8); }
.green    { background: linear-gradient(135deg, #b2dfdb, #80cbc4); }

.card-emoji {
  font-size: 2.2rem;
  line-height: 1;
}
.card-emoji.small {
  font-size: 1.4rem;
}

.tip {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.desc {
  font-size: 0.78rem;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
  text-align: center;
}
</style>
