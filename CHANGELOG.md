# Changelog - SimulationCraft Discord Bot

## v1.4.0 - Security & Stability (Atual - Setembro 2025)

### 🔒 Melhorias de Segurança
- **Gitleaks integration** - Varredura automática de segredos
- **GitHub Actions workflow** - Scanning em PRs e pushes  
- **Security documentation** - Políticas e guidelines completas
- **Enhanced .gitignore** - Padrões de segurança aprimorados

### 🛡️ Proteções Implementadas
- **Token detection** - Regras específicas para Discord/API tokens
- **Automated blocking** - PRs com segredos são rejeitados automaticamente
- **Local scanning** - Instruções para análise pré-commit
- **Vulnerability reporting** - Canal estruturado para reports

### 📊 Qualidade do Código
- **Repository badges** - Stars, forks e status de segurança
- **Professional structure** - Organização enterprise-level
- **Documentation** - README, SECURITY.md e guias detalhados

---

## v1.3.0 - The War Within Season 3 (Setembro 2025)

### 🎯 Funcionalidades Season 3
- **Suporte completo** ao patch 11.1 do World of Warcraft
- **Perfis TWW3** atualizados para conteúdo da Season 3
- **Novos tier sets** e níveis de item implementados
- **Meta atualizado** para cenário competitivo atual

### 🎨 Melhorias Visuais
- **DPS ranking system** baseado em tiers de performance
- **Colored embeds** por classe/especialização
- **Contextual emojis** para melhor legibilidade
- **Enhanced formatting** com visuais ricos

### ⚡ Performance
- **Sistema de Hero Talents** refinado para patch 11.1
- **Automatic tier detection** baseado em item level
- **Cache otimizado** para simulações recorrentes

---

## v1.2.0 - TWW Season 2 Updates (Agosto 2025)

### 🎮 Funcionalidades Season 2
- **Perfis TWW2** implementados e otimizados
- **Novos níveis de item** para conteúdo da Season 2
- **Ajustes de meta** para mudanças de balanceamento do patch 11.0.5
- **Otimização de performance** para novas mecânicas de encounter

### 🔧 Melhorias Técnicas
- **Parser aprimorado** do SimulationCraft
- **Suporte ao Tank Mitigation Index (TMI)**
- **Cálculo de Scale Factors** refinado
- **Action Priority Lists** detalhadas

---

## v1.1.0 - TWW Season 1 Enhanced (Julho 2025)

### ✨ Novas Funcionalidades
- **Comando `/tww` abrangente** - Informações completas sobre The War Within
  - Listagem de especializações por classe
  - Guia de disponibilidade dos Hero Talents
  - Explicações de estilos de luta
  - Recomendações de tier de equipamentos
  - Guia de consumíveis
  - Insights do meta atual

### 🎨 Melhorias Visuais
- **Embeds coloridos** por classe/especialização
- **Emojis contextuais** para melhor legibilidade
- **Formatação aprimorada** dos resultados
- **Sistema de ranking de DPS** baseado em tiers

### 🔧 Melhorias Técnicas
- **Parser melhorado** com suporte abrangente
- **Parse de Combat Statistics** detalhado
- **Detecção automática de tier** por item level

---

## v1.0.0 - Initial Release (Junho 2025)

### 🚀 Funcionalidades Principais
- **Comando `/simc`** - Simulações individuais de personagem
- **Comando `/simulate`** - Simulações avançadas com opções
  - Comparação de especializações
  - Análise de equipamentos
  - Diferentes estilos de luta
  - Múltiplas iterações

### 🎯 Recursos Avançados
- **Sistema de filas** - Gerenciamento inteligente de simulações
- **Cache otimizado** - Resultados instantâneos para sims recentes
- **Análise completa** - DPS, HPS, TMI e métricas detalhadas
- **Suporte TWW** - Perfis atualizados para The War Within

### 🔧 Infraestrutura
- **Integração SimulationCraft** - Wrapper completo da CLI
- **Error handling** robusto com fallbacks
- **Sistema de logging** detalhado
- **Configuração flexível** via variáveis de ambiente

---

## 📋 Notas de Desenvolvimento

### Tecnologias Utilizadas
- **Node.js 16+** - Runtime JavaScript
- **Discord.js v14** - API wrapper do Discord
- **SimulationCraft CLI** - Engine de simulação
- **NodeCache** - Sistema de cache em memória

### Estrutura do Projeto
- **src/commands/** - Comandos slash do Discord
- **src/utils/** - Utilitários (parser, cache, SimC manager)
- **profiles/** - Perfis de simulação organizados por season
- **tests/** - Testes e validações
- **docs/** - Documentação detalhada

### Contribuição
- **Issues** - Report de bugs e sugestões
- **Pull Requests** - Contribuições são bem-vindas
- **Segurança** - Scanning automático implementado