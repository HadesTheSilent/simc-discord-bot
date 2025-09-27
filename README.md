# SimulationCraft Discord Bot

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-14.x-blue.svg)](https://discord.js.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/HadesTheSilent/simc-discord-bot?style=flat&color=yellow)](https://github.com/HadesTheSilent/simc-discord-bot/stargazers)
[![Forks](https://img.shields.io/github/forks/HadesTheSilent/simc-discord-bot?style=flat&color=blue)](https://github.com/HadesTheSilent/simc-discord-bot/network/members)

Um bot para Discord avançado que integra com SimulationCraft para realizar simulações detalhadas de DPS do World of Warcraft, oferecendo análises completas de personagens com visualizações ricas e sistema de cache inteligente.

## ✨ Funcionalidades

- 🎯 **Simulações individuais** - Análise completa de DPS para qualquer personagem
- ⚖️ **Comparação de specs** - Compare diferentes especializações lado a lado  
- 🔧 **Análise de equipamentos** - Otimização de gear e stat weights
- 🔄 **Sistema de filas** - Gerenciamento inteligente de múltiplas simulações
- 💾 **Cache otimizado** - Resultados instantâneos para simulações recentes
- ⚡ **Comandos slash** - Interface moderna e intuitiva do Discord
- 📊 **Visualizações ricas** - Embeds detalhados com gráficos e estatísticas

## Pré-requisitos

1. **Node.js** (versão 16.11.0 ou superior)
2. **SimulationCraft** instalado no sistema
   - Download: https://www.simulationcraft.org/download.html
3. **Bot Discord** configurado no Discord Developer Portal

## Instalação

### 1. Clone ou baixe o projeto

```bash
git clone <url-do-repositorio>
cd simc-bot
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DISCORD_TOKEN=seu_token_do_bot_aqui
CLIENT_ID=seu_client_id_aqui
SIMC_PATH=simc
```

### 4. Configure o SimulationCraft

- **Windows**: Defina `SIMC_PATH` como o caminho completo para `simc.exe`
- **Linux/Mac**: Certifique-se de que `simc` está no PATH do sistema

### 5. Deploy dos comandos

```bash
npm run deploy-commands
```

### 6. Inicie o bot

```bash
npm start
```

Para desenvolvimento:
```bash
npm run dev
```

## Configuração do Bot Discord

**Configuração Rápida:**
1. Acesse https://discord.com/developers/applications
2. Crie uma nova aplicação e bot
3. Copie o token e Client ID para o `.env`
4. Adicione o bot ao servidor com permissões básicas

📖 **Para guia completo e detalhado**, consulte: [`docs/SETUP_DISCORD.md`](docs/SETUP_DISCORD.md)

## Comandos Disponíveis

### `/simulate character`
Simula um personagem específico
- `armory`: Link do armory do personagem
- `spec`: Especialização (opcional)
- `iterations`: Número de iterações (padrão: 1000)
- `fight_style`: Estilo de luta (patchwerk, lightmovement, etc.)
- `use_cache`: Usar cache se disponível

### `/simulate compare`
Compara diferentes specs ou builds
- `armory`: Link do armory base
- `specs`: Lista de specs para comparar (separadas por vírgula)
- `iterations`: Número de iterações

### `/simulate gear`
Análise avançada de equipamentos
- `armory`: Link do armory do personagem
- `analysis_type`: Tipo de análise (stat_weights, gear_compare, enchant_compare, gem_compare)

### `/simulate queue`
Mostra status da fila de simulações

### `/simulate cache`
Gerencia o cache de simulações
- `action`: status, clear, list

### `/tww specs`
Lista especializações do The War Within
- `class`: Classe específica (opcional)

### `/tww hero_talents`
Mostra Hero Talents disponíveis por classe

### `/tww fight_styles`
Explica diferentes estilos de luta

### `/tww gear_levels`
Mostra níveis de gear do TWW Season 1

### `/tww consumables`
Lista consumíveis recomendados

### `/tww meta`
Mostra tier lists e meta atual

### `/help`
Sistema de ajuda completo com exemplos
- `topic`: Tópico específico (basic, armory, compare, gear, cache, troubleshoot)

## Estrutura do Projeto

```
simc-discord-bot/
├── src/
│   ├── index.js              # Arquivo principal do bot
│   ├── deploy-commands.js    # Deploy dos slash commands
│   ├── commands/             # Comandos do bot
│   └── utils/               # Utilitários e helpers
├── docs/                   # Documentação do projeto
│   ├── EXAMPLES.md         # Exemplos de uso
│   ├── SETUP_DISCORD.md    # Guia de configuração do Discord
│   └── SIMC_REFERENCE.md   # Referência do SimulationCraft
├── profiles/                # Perfis de exemplo do SimC
│   ├── TWW1/               # Perfis The War Within Season 1
│   ├── TWW3/               # Perfis The War Within Season 3
│   ├── mage_fire_example.simc
│   └── warrior_fury_example.simc
├── tests/                  # Arquivos de teste e desenvolvimento
├── results/                # Resultados das simulações (ignorado pelo git)
├── temp/                   # Arquivos temporários (ignorado pelo git)
├── CHANGELOG.md           # Histórico de mudanças
└── LICENSE                # Licença MIT
```

## Desenvolvimento e Testes

Os arquivos de teste estão organizados na pasta `tests/`:
- `test-quick.js` - Testes rápidos
- `test-simulate.js` - Teste do comando principal
- `test-complete-embed.js` - Teste de embeds completos

Execute um teste específico:
```bash
node tests/test-quick.js
```

## Troubleshooting

### Bot não responde
- Verifique se o token está correto
- Confirme se os comandos foram deployados
- Verifique as permissões do bot no servidor

### SimulationCraft não funciona
- Confirme se o SIMC_PATH está correto
- Teste o SimulationCraft manualmente
- Verifique se há espaço em disco suficiente

### Simulações muito lentas
- Reduza o número de iterações
- Aumente o timeout no .env
- Considere aumentar MAX_CONCURRENT_SIMS

## 📚 Documentação Adicional

Para informações mais detalhadas, consulte a pasta [`docs/`](docs/):

- **[Exemplos de Uso](docs/EXAMPLES.md)** - Casos práticos e exemplos detalhados
- **[Configuração Discord](docs/SETUP_DISCORD.md)** - Setup completo do bot
- **[Referência SimC](docs/SIMC_REFERENCE.md)** - Documentação técnica do SimulationCraft

## Autor

**Hadestws/Jullian**

Desenvolvido com ❤️ para a comunidade do World of Warcraft.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).