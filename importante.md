✅ Configuração completa do PM2
API rodando agora via PM2 → http://192.168.3.11:3001
Reinicia sozinha se travar
Sobe automaticamente quando o PC ligar
Comandos úteis do dia a dia
bash
# Ver status da API
pm2 status
# Ver logs em tempo real
pm2 logs nf-inteligente-api
# Reiniciar (ex: após atualizar o código)
pm2 restart nf-inteligente-api
# Parar
pm2 stop nf-inteligente-api
⚠️ Lembrete importante
Sempre que atualizar o código da API, você precisa:

bash
cd .../api
npm run build
pm2 restart nf-inteligente-api