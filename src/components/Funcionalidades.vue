<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const router = useRouter()
const siguiente = () => router.push("/bloom")
const anterior  = () => router.push("/descubre")

const flipped = ref(new Set())
const toggle = (i) => {
  const s = new Set(flipped.value)
  s.has(i) ? s.delete(i) : s.add(i)
  flipped.value = s
}

const cards = computed(() => [
  { color: 'peach',     emoji: '📅', tip: t('funcionalitats.c1'), desc: t('funcionalitats.c1d') },
  { color: 'lightblue', emoji: '📊', tip: t('funcionalitats.c2'), desc: t('funcionalitats.c2d') },
  { color: 'yellow',    emoji: '🏆', tip: t('funcionalitats.c3'), desc: t('funcionalitats.c3d') },
  { color: 'pink',      emoji: '👥', tip: t('funcionalitats.c4'), desc: t('funcionalitats.c4d') },
  { color: 'lavender',  emoji: '🌸', tip: t('funcionalitats.c5'), desc: t('funcionalitats.c5d') },
  { color: 'green',     emoji: '😴', tip: t('funcionalitats.c6'), desc: t('funcionalitats.c6d') },
])
</script>

<template>
  <div class="caja">
    <h1>{{ t('funcionalitats.title') }}</h1>

    <div class="cards">
      <div v-for="(card, i) in cards" :key="i" class="flip-wrap" @click="toggle(i)">
        <div :class="['flip-inner', card.color, { flipped: flipped.has(i) }]">

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
        <i class="pi pi-arrow-left"></i> {{ t('btn.back') }}
      </button>
      <button @click="siguiente" class="btn-primary">
        {{ t('btn.next_bloom') }} <i class="pi pi-arrow-right"></i>
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

@media (max-width: 700px) { .cards { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .cards { grid-template-columns: 1fr; } }

.flip-wrap {
  perspective: 900px;
  height: 180px;
}

.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  cursor: pointer;
}

.flip-wrap:hover .flip-inner,
.flip-inner.flipped { transform: rotateY(180deg); }

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

.peach    { background: linear-gradient(135deg, #ffab91, #ffccbc); }
.lightblue{ background: linear-gradient(135deg, #d6eaf8, #aed6f1); }
.yellow   { background: linear-gradient(135deg, #fff176, #fff9ae); }
.pink     { background: linear-gradient(135deg, #f5b7b1, #fadbd8); }
.lavender { background: linear-gradient(135deg, #e6e6fa, #d8bfd8); }
.green    { background: linear-gradient(135deg, #b2dfdb, #80cbc4); }

.card-emoji       { font-size: 2.2rem; line-height: 1; }
.card-emoji.small { font-size: 1.4rem; }
.tip  { font-size: 1rem;   font-weight: 700; color: #1f2937; margin: 0; }
.desc { font-size: 0.78rem; color: #4b5563; line-height: 1.5; margin: 0; text-align: center; }
</style>
