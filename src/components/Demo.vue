<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const volver = () => {
  router.push("/");
};
</script>

<template>
  <div class="caja-demo">
    <h1>Prova la nostra Demo</h1>
    <div class="text-content">
      <p>
        Escaneja aquest codi QR amb la càmera del teu telèfon mòbil per accedir a la versió interactiva de <strong>MOODIFY</strong> i descobrir com funciona.
      </p>
      
      <div class="qr-container">
        <!-- Puedes sustituir el src de esta imagen con la ruta de tu propio QR real -->
        <div class="qr-placeholder">
          <i class="pi pi-qrcode qr-icon"></i>
          <span>Afegeix aquí el teu QR</span>
        </div>
      </div>
    </div>
    
    <button @click="volver" class="btn-primary">
      <i class="pi pi-home"></i> Tornar a l'inici
    </button>
  </div>
</template>

<style scoped>
.caja-demo {
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
  margin-top: 40px;
  margin-bottom: 40px;
}

h1 {
  color: #111827;
  font-size: 2.5rem;
  margin-bottom: 24px;
}

.text-content {
  margin-bottom: 32px;
}

.text-content p {
  color: #374151;
  font-size: 1.15rem;
  line-height: 1.6;
  margin-bottom: 32px;
}

.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
}

.qr-placeholder {
  width: 250px;
  height: 250px;
  background: white;
  border-radius: 16px;
  border: 4px dashed var(--accent-border);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  color: #6b7280;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.qr-placeholder:hover {
  transform: scale(1.05);
  border-color: var(--accent);
}

.qr-icon {
  font-size: 5rem;
  color: var(--accent-2);
}
</style>
