# Como Configurar o Bot Discord

## 1. Criar Aplicação no Discord

1. Acesse https://discord.com/developers/applications
2. Clique em "New Application"
3. Dê um nome ao seu bot (ex: "SimulationCraft Bot")
4. Clique em "Create"

## 2. Configurar o Bot

1. Na sidebar, clique em "Bot"
2. Clique em "Add Bot" → "Yes, do it!"
3. **IMPORTANTE**: Desative "Public Bot" se você não quiser que outros adicionem seu bot
4. Copie o token do bot (será usado no .env)
5. Em "Privileged Gateway Intents", ative:
   - ✅ Message Content Intent (se necessário)

## 3. Obter Client ID

1. Na sidebar, clique em "General Information"
2. Copie o "Application ID" (será usado como CLIENT_ID no .env)

## 4. Configurar Permissões

1. Na sidebar, clique em "OAuth2" → "URL Generator"
2. Em "Scopes", selecione:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Em "Bot Permissions", selecione:
   - ✅ Send Messages
   - ✅ Use Slash Commands
   - ✅ Embed Links
   - ✅ Attach Files
   - ✅ Read Message History

## 5. Adicionar Bot ao Servidor

1. Copie a URL gerada no passo anterior
2. Cole no navegador
3. Selecione seu servidor
4. Autorize as permissões

## 6. Configurar .env

```env
DISCORD_TOKEN=seu_token_aqui
CLIENT_ID=seu_client_id_aqui
SIMC_PATH=simc
SIMC_TIMEOUT=300000
MAX_CONCURRENT_SIMS=3
CACHE_TTL=3600
```

## 7. Deploy dos Comandos

```bash
npm run deploy-commands
```

## 8. Iniciar o Bot

```bash
npm start
```

## Verificação

Se tudo estiver correto, você verá:
- ✅ Bot online no Discord
- ✅ Comandos slash disponíveis (`/simulate`, `/help`)
- ✅ Bot responde aos comandos

## Troubleshooting

### Bot não aparece online
- Verifique se o token está correto
- Confirme se o bot foi adicionado ao servidor

### Comandos não aparecem
- Execute `npm run deploy-commands` novamente
- Aguarde alguns minutos (pode demorar para sincronizar)
- Tente reiniciar o Discord

### Erro de permissões
- Verifique se o bot tem as permissões necessárias
- Confirme se está usando as scopes corretas (`bot` + `applications.commands`)