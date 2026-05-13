<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const anterior  = () => router.push("/");
const siguiente = () => router.push("/descubre");
</script>

<template>
  <div class="caja">
    <h1>El Nostre Equip</h1>
    <p class="intro">
      Estudiants de <strong>Desenvolupament d'Aplicacions Web (DAW2)</strong>
      a l'Institut Esteve Terrades i Illa.
    </p>

    <div class="team-grid">

      <!-- ── VALERIA ── -->
      <div class="member">
        <div class="avatar valeria">V</div>
        <strong>Valeria Santana Megia</strong>
      </div>

      <!-- ── RUTH ── -->
      <div class="member">
        <div class="avatar ruth">R</div>
        <strong>Ruth Romero Carretero</strong>
      </div>

    </div>

    <div class="button-group">
      <button @click="anterior" class="btn-primary">
        <i class="pi pi-arrow-left"></i> Enrere
      </button>
      <button @click="siguiente" class="btn-primary">
        Descobreix Moodify <i class="pi pi-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2.2rem;
  color: #111827;
  margin-bottom: 8px;
}

.intro {
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 32px;
}

/* ── GRID ─────────────────────────────────── */
.team-grid {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 32px;
}

@media (max-width: 520px) {
  .team-grid { flex-direction: column; align-items: center; }
}

/* ── CARD MEMBRE ──────────────────────────── */
.member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255,171,145,0.25);
  padding: 28px 24px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  flex: 1;
  max-width: 260px;
}

.member:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(0,0,0,0.1);
}

/* ── AVATAR INICIAL ───────────────────────── */
.avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 6px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  letter-spacing: -1px;
}

.avatar.valeria {
  background: linear-gradient(135deg, #ffab91, #ff7043);
}

.avatar.ruth {
  background: linear-gradient(135deg, #9e9ec9, #6c63ff);
}

/* ── TEXTOS ───────────────────────────────── */
.member strong {
  font-size: 1.05rem;
  color: #111827;
}

.role {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--accent-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-height: 1em;
}

/* ── CONTRIBUCIONS ────────────────────────── */
.contrib {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
  text-align: left;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.contrib li {
  font-size: 0.82rem;
  color: #4b5563;
  padding: 5px 10px;
  background: rgba(255,255,255,0.6);
  border-radius: 8px;
  border-left: 3px solid var(--accent);
  min-height: 1.4em;
}

.contrib li:empty {
  opacity: 0.3;
  border-left-color: #d1d5db;
}
</style>
