<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const anterior = () => router.push("/bloom");
const siguiente = () => router.push("/demo");
</script>

<template>
  <div class="caja">
    <h1>Arquitectura Tècnica</h1>

    <div class="diagrama">

      <!-- CAPA 1: CLIENT -->
      <div class="capa">
        <div class="node mobile">
          <span class="node-icon">📱</span>
          <strong>App Mòbil</strong>
          <span>React Native + Expo</span>
        </div>
      </div>

      <div class="arrow-h">
        <span class="arrow-label">HTTPS / JSON</span>
        <span class="arrow-line"></span>
        <span class="arrow-tip">▼</span>
      </div>

      <!-- CAPA 2: SERVIDOR -->
      <div class="capa servidor">
        <div class="servidor-label">Servidor Proxmox · Ubuntu 22.04</div>
        <div class="servidor-inner">

          <div class="node apache">
            <span class="node-icon">🌐</span>
            <strong>Apache</strong>
            <span>Proxy + Landing</span>
          </div>

          <div class="arrow-h small">
            <span class="arrow-tip">▶</span>
          </div>

          <div class="node laravel">
            <span class="node-icon">⚙️</span>
            <strong>Laravel API</strong>
            <span>PHP 8.2 · Sanctum</span>
          </div>

          <div class="right-group">
            <div class="arrow-v">
              <span class="arrow-line-v"></span>
              <span class="arrow-tip-v">▼</span>
            </div>
            <div class="arrow-v">
              <span class="arrow-line-v"></span>
              <span class="arrow-tip-v">▼</span>
            </div>

            <div class="node mysql">
              <span class="node-icon">🗄️</span>
              <strong>MySQL</strong>
              <span>Base de dades</span>
            </div>
            <div class="node ollama">
              <span class="node-icon">🤖</span>
              <strong>Ollama IA</strong>
              <span>qwen3-vl · Local</span>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- BADGES TECH -->
    <div class="tech-row">
      <span class="tbadge rn">React Native</span>
      <span class="tbadge laravel">Laravel 13</span>
      <span class="tbadge mysql">MySQL</span>
      <span class="tbadge ollama">Ollama</span>
      <span class="tbadge apache">Apache</span>
      <span class="tbadge proxmox">Proxmox</span>
    </div>

    <div class="button-group">
      <button @click="anterior" class="btn-primary">
        <i class="pi pi-arrow-left"></i> Enrere
      </button>
      <button @click="siguiente" class="btn-primary">
        <i class="pi pi-arrow-right"></i> Conèixer MOODIFY
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

/* ── DIAGRAMA ─────────────────────────────── */
.diagrama {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 8px;
}

/* ── NODOS ────────────────────────────────── */
.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 18px;
  border-radius: 16px;
  min-width: 110px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: transform 0.25s ease;
}
.node:hover { transform: translateY(-4px); }

.node-icon { font-size: 1.8rem; line-height: 1; }
.node strong { font-size: 0.95rem; color: #111827; }
.node span   { font-size: 0.72rem; color: #6b7280; }

.node.mobile  { background: linear-gradient(135deg, #dbeafe, #bfdbfe); border: 1px solid #93c5fd; }
.node.apache  { background: linear-gradient(135deg, #fef3c7, #fde68a); border: 1px solid #fbbf24; }
.node.laravel { background: linear-gradient(135deg, #fee2e2, #fecaca); border: 1px solid #f87171; }
.node.mysql   { background: linear-gradient(135deg, #d1fae5, #a7f3d0); border: 1px solid #34d399; }
.node.ollama  { background: linear-gradient(135deg, #ede9fe, #ddd6fe); border: 1px solid #a78bfa; }

/* ── FLECHAS HORIZONTALES ─────────────────── */
.arrow-h {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0 4px;
}
.arrow-line {
  display: block;
  width: 40px;
  height: 2px;
  background: #9ca3af;
}
.arrow-tip {
  color: #9ca3af;
  font-size: 0.85rem;
  margin-top: -6px;
  margin-left: 34px;
}
.arrow-label {
  font-size: 0.62rem;
  color: #4b5563;
  white-space: nowrap;
  background: rgba(255,255,255,0.6);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 6px;
  padding: 2px 7px;
}
.arrow-h.small .arrow-line { width: 24px; }
.arrow-h.small .arrow-tip  { margin-left: 18px; }

/* ── SERVIDOR (caja contenedora) ─────────── */
.servidor {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.servidor-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1.5px dashed #d1d5db;
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  padding: 6px 16px;
  background: rgba(255,255,255,0.4);
}
.servidor-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1.5px dashed #d1d5db;
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 16px;
  background: rgba(255,255,255,0.3);
}

/* ── GRUPO DERECHA (mysql + ollama) ────────── */
.right-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 8px;
  align-items: center;
}

/* las dos flechas verticales van en la primera fila */
.arrow-v {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.arrow-line-v {
  display: block;
  width: 2px;
  height: 20px;
  background: #9ca3af;
}
.arrow-tip-v {
  color: #9ca3af;
  font-size: 0.75rem;
  margin-top: -4px;
}

/* ── MÓVIL ────────────────────────────────── */
@media (max-width: 600px) {
  h1 { font-size: 1.5rem; margin-bottom: 16px; }

  .diagrama { flex-direction: column; align-items: center; }

  .arrow-h {
    flex-direction: row;
    gap: 4px;
  }
  .arrow-line { width: 2px; height: 28px; }
  .arrow-tip  { margin: 0; font-size: 0.85rem; }
  .arrow-label { display: none; }

  .servidor-inner {
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .arrow-h.small { flex-direction: row; }
  .arrow-h.small .arrow-line { width: 2px; height: 20px; }

  .right-group {
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }

  .node { min-width: 80px; padding: 10px 12px; }
  .node-icon { font-size: 1.4rem; }
  .node strong { font-size: 0.8rem; }
}

/* ── BADGES ───────────────────────────────── */
.tech-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}
.tbadge {
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}
.tbadge.rn      { background: rgba(147,197,253,0.3); color: #1e40af; border: 1px solid #93c5fd; }
.tbadge.laravel { background: rgba(248,113,113,0.2); color: #991b1b; border: 1px solid #f87171; }
.tbadge.mysql   { background: rgba(52,211,153,0.2);  color: #065f46; border: 1px solid #34d399; }
.tbadge.ollama  { background: rgba(167,139,250,0.2); color: #4c1d95; border: 1px solid #a78bfa; }
.tbadge.apache  { background: rgba(251,191,36,0.2);  color: #78350f; border: 1px solid #fbbf24; }
.tbadge.proxmox { background: rgba(156,163,175,0.2); color: #374151; border: 1px solid #9ca3af; }
</style>
