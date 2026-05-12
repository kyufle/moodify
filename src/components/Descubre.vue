<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const volver   = () => router.push("/funcionalidades");
const anterior = () => router.push("/");
</script>

<template>
  <div class="caja">

    <!-- ESTADÍSTICA -->
    <div class="stat-hook">
      <span class="stat-num">1 de cada 4</span>
      <span class="stat-label">joves pateix ansietat o estrès crònic</span>
    </div>

    <p class="resposta">
      En una societat accelerada, no sempre tenim espai per expressar com ens sentim.<br>
      <strong>Moodify és aquest espai.</strong>
    </p>

    <!-- NOMBRE AAP -->
    <div class="etimologia">
      <div class="etim-block mood">
        <span class="etim-word">Mood</span>
        <span class="etim-def">Estat d'ànim</span>
      </div>
      <span class="etim-op">+</span>
      <div class="etim-block modify">
        <span class="etim-word">Modify</span>
        <span class="etim-def">Transformació</span>
      </div>
      <span class="etim-op">=</span>
      <div class="etim-block result">
        <span class="etim-word">MOODIFY</span>
        <span class="etim-def">El teu canvi</span>
      </div>
    </div>

    <!-- PILARS -->
    <div class="pilars-grid">
      <div class="pilar">
        <span class="pilar-emoji">🧠</span>
        <strong>Mentalitat</strong>
        <span>Autoconeixement emocional diari</span>
      </div>
      <div class="pilar">
        <span class="pilar-emoji">🔁</span>
        <strong>Hàbits</strong>
        <span>Rutines de valor amb seguiment</span>
      </div>
      <div class="pilar">
        <span class="pilar-emoji">📈</span>
        <strong>Progrés</strong>
        <span>Visualitza la teva evolució</span>
      </div>
    </div>

    <div class="button-group">
      <button @click="anterior" class="btn-primary">
        <i class="pi pi-arrow-left"></i> Enrere
      </button>
      <button @click="volver" class="btn-primary" style="margin-top:0">
        Veure Funcionalitats <i class="pi pi-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.stat-hook {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, rgba(255,171,145,0.2), rgba(230,230,250,0.3));
  border: 1px solid var(--accent-border);
  border-radius: 16px;
  padding: 18px 24px;
  margin-bottom: 20px;
}

.stat-num {
  font-size: 2rem;
  font-weight: 800;
  color: var(--accent-2);
  letter-spacing: -1px;
}

.stat-label {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

.resposta {
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 24px;
}

.etimologia {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.etim-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border-radius: 14px;
  min-width: 90px;
}

.etim-block.mood {
  background: linear-gradient(135deg, #d6eaf8, #aed6f1);
  border: 1px solid #93c5fd;
}
.etim-block.modify {
  background: linear-gradient(135deg, #ede9fe, #ddd6fe);
  border: 1px solid #a78bfa;
}
.etim-block.result {
  background: linear-gradient(135deg, #ffab91, #ffccbc);
  border: 1px solid var(--accent-border);
}

.etim-word {
  font-size: 1.05rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.5px;
}

.etim-def {
  font-size: 0.72rem;
  color: #6b7280;
}

.etim-op {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d1d5db;
}

/* ── PILARS ───────────────────────────────── */
.pilars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 8px;
}

@media (max-width: 520px) {
  .pilars-grid { grid-template-columns: 1fr; }
  .etimologia  { gap: 6px; }
}

.pilar {
  background: rgba(255,255,255,0.5);
  border: 1px solid rgba(255,171,145,0.25);
  padding: 18px 12px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: transform 0.3s ease;
}

.pilar:hover { transform: translateY(-5px); }

.pilar-emoji {
  font-size: 1.9rem;
  line-height: 1;
}

.pilar strong {
  font-size: 1rem;
  color: #111827;
}

.pilar span {
  font-size: 0.78rem;
  color: #6b7280;
  text-align: center;
  line-height: 1.4;
}
</style>
