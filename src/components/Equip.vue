<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const anarADemo = () => {
  router.push("/demo");
};

const anterior = () => {
  router.push("/funcionalidades");
};
</script>

<template>
  <div class="caja-equip">
    <h1>El Nostre Equip</h1>
    <div class="text-content">
      <p>
        <strong>MOODIFY</strong> és un projecte creat per dues desenvolupadores
        apassionades per la salut mental i la tecnologia. Som estudiants de
        <strong>Desenvolupament d'Aplicacions Web (AWS2)</strong>.
      </p>

      <div class="team-grid">
        <div class="member">
          <div class="avatar valeria">
            <i class="pi pi-user avatar-icon"></i>
          </div>
          <strong>Valeria Santana Megía</strong>
          <span>Desenvolupadora AWS2</span>
        </div>

        <div class="member">
          <div class="avatar ruth">
            <i class="pi pi-user avatar-icon"></i>
          </div>
          <strong>Ruth Romero Carretero</strong>
          <span>Desenvolupadora AWS2</span>
        </div>
      </div>

      <div class="tech-stack">
        <h3>Llenguatges i Eines</h3>
        <div class="tech-badges">
          <span class="badge vue"><i class="pi pi-code"></i> Vue.js</span>
          <span class="badge react"><i class="pi pi-mobile"></i> React Native</span>
          <span class="badge laravel"><i class="pi pi-server"></i> Laravel</span>
          <span class="badge mysql"><i class="pi pi-database"></i> MySQL</span>
        </div>
      </div>
    </div>

    <div class="button-group">
      <button @click="anterior" class="btn-primary">
        <i class="pi pi-arrow-left"></i> Enrere
      </button>
      <button @click="anarADemo" class="btn-primary" style="margin-top: 0">
        Provar la Demo <i class="pi pi-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.caja-equip {
  border: 2px solid var(--accent-border);
  padding: 40px;
  border-radius: 24px;
  max-width: 600px;
  width: 90%;
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

.text-content p {
  color: #374151;
  font-size: 1.15rem;
  line-height: 1.6;
  margin-bottom: 32px;
}

.team-grid {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 36px;
}

.member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.5);
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  flex: 1;
}

.member:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.avatar.valeria {
  background: linear-gradient(135deg, #ffab91, #ffccbc);
}

.avatar.ruth {
  background: linear-gradient(135deg, #d6eaf8, #aed6f1);
}

.avatar-icon {
  font-size: 2.5rem;
  color: #4b5563;
}

.member strong {
  font-size: 1.2rem;
  color: #1f2937;
}

.member span {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

@media (max-width: 500px) {
  .team-grid {
    flex-direction: column;
    gap: 20px;
  }
}

.tech-stack {
  margin-top: 10px;
  margin-bottom: 30px;
}

.tech-stack h3 {
  color: #1f2937;
  font-size: 1.3rem;
  margin-bottom: 16px;
}

.tech-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s ease;
}

.badge:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.badge.vue {
  background: rgba(65, 184, 131, 0.15);
  color: #2c3e50;
  border: 1px solid rgba(65, 184, 131, 0.3);
}

.badge.react {
  background: rgba(97, 218, 251, 0.15);
  color: #282c34;
  border: 1px solid rgba(97, 218, 251, 0.3);
}

.badge.laravel {
  background: rgba(255, 45, 32, 0.15);
  color: #4a0b07;
  border: 1px solid rgba(255, 45, 32, 0.3);
}

.badge.mysql {
  background: rgba(0, 117, 143, 0.15);
  color: #004b5c;
  border: 1px solid rgba(0, 117, 143, 0.3);
}

</style>
