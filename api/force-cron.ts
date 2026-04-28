import { executarColetaDeAlertas } from './src/features/alertas-fiscais/alertas.job.js';

async function main() {
  console.log('Iniciando script de força manual...');
  await executarColetaDeAlertas();
  console.log('Finalizado.');
  process.exit(0);
}

main();
