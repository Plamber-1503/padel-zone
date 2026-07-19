// Script para verificar qué hay en la entidad User del backend real
// Ejecutar con: node check-users.mjs

const APP_ID = '6a1c3274412c9d8929167f71';

// Leer el token de base44_access_token del localStorage no es posible desde Node.
// Necesitamos el token. Podés encontrarlo abriendo DevTools en localhost:5173
// y ejecutando: localStorage.getItem('base44_access_token')
// Luego ponelo aquí:
const TOKEN = process.env.BASE44_TOKEN || 'PONE_TU_TOKEN_AQUI';

async function checkUsers() {
  const url = `https://padelzone.base44.app/api/apps/${APP_ID}/entities/User?limit=20`;
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'X-App-Id': APP_ID,
    }
  });

  if (!res.ok) {
    console.error('❌ Error:', res.status, await res.text());
    return;
  }

  const data = await res.json();
  console.log('✅ Usuarios encontrados:', data.length);
  console.log(JSON.stringify(data, null, 2));
}

async function checkCourts() {
  const url = `https://padelzone.base44.app/api/apps/${APP_ID}/entities/Court?limit=20`;
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'X-App-Id': APP_ID,
    }
  });

  if (!res.ok) {
    console.error('❌ Error Courts:', res.status, await res.text());
    return;
  }

  const data = await res.json();
  console.log('\n✅ Canchas encontradas:', data.length);
  console.log(JSON.stringify(data, null, 2));
}

checkUsers();
checkCourts();
