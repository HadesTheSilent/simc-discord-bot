# Segurança e Detecção de Segredos

Este projeto utiliza varredura automática para prevenir vazamento de segredos (tokens, senhas, chaves, etc).

## 🔒 Política de Segurança

### Dados Sensíveis Proibidos
- **Tokens Discord** (bot tokens, user tokens)
- **Chaves de API** (qualquer serviço externo)
- **Senhas e credenciais** de qualquer tipo
- **Chaves privadas** (SSH, GPG, certificados)
- **IDs de aplicação** reais (apenas exemplos em documentação)
- **URLs de webhook** com tokens
- **Strings de conexão** de banco de dados

### Arquivos que NÃO devem ser versionados
- `.env` (variáveis de ambiente)
- `config.json` (configurações locais)
- `*.key`, `*.pem`, `*.p12` (chaves privadas)
- `results/*.html` (resultados de simulação temporários)
- `temp/*` (arquivos temporários)

## 🔍 Como rodar análise localmente

### Pré-requisito
Instale o [Gitleaks](https://github.com/gitleaks/gitleaks):

```bash
# Linux/macOS (via Homebrew)
brew install gitleaks

# Linux (manual)
curl -sSfL https://raw.githubusercontent.com/gitleaks/gitleaks/master/scripts/install.sh | sh

# Windows (via Chocolatey)
choco install gitleaks

# Windows (via Scoop)
scoop install gitleaks
```

### Executar varredura
```bash
# Detectar segredos no repositório atual
gitleaks detect --source .

# Detectar com configuração customizada
gitleaks detect --config .gitleaks.toml --verbose

# Detectar apenas nos commits não enviados
gitleaks detect --source . --log-opts="--since=1.week"

# Gerar relatório em JSON
gitleaks detect --config .gitleaks.toml --report-format json --report-path security-report.json
```

### Exemplo de saída limpa
```bash
$ gitleaks detect --source .

    ○
    │╲
    │ ○
    ○ ░
    ░    gitleaks

Finding secrets in source code...
8:06PM INF 124 commits scanned.
8:06PM INF scan completed in 86.8ms
8:06PM INF no leaks found
```

## 🤖 Automação

### GitHub Actions
- **Todo push** para `master/main/develop` é automaticamente escaneado
- **Todo Pull Request** passa por varredura detalhada
- **PRs com segredos** são automaticamente bloqueados
- **Relatórios detalhados** são salvos como artefatos

### Configuração Personalizada
O arquivo `.gitleaks.toml` contém:
- ✅ Regras específicas para tokens Discord
- ✅ Detecção de chaves de API genéricas
- ✅ Whitelist para arquivos de exemplo
- ✅ Ignorar hashes legítimos (package-lock.json)
- ✅ Exceções para strings de talento do WoW

## 🚨 Em caso de vazamento

### Se você acidentalmente commitou um segredo:

1. **REVOGUE IMEDIATAMENTE** o token/chave comprometida
2. **Gere uma nova** credencial
3. **Remova do histórico** usando um dos métodos:

```bash
# Método 1: Remover do último commit
git reset --soft HEAD~1
git reset HEAD arquivo_com_segredo.js
# edite o arquivo removendo o segredo
git add .
git commit -m "Remove sensitive data"

# Método 2: Usar BFG Repo-Cleaner (para histórico extenso)
java -jar bfg.jar --replace-text passwords.txt
git reflog expire --expire=now --all && git gc --prune=now --aggressive

# Método 3: Filter-branch (casos específicos)
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch arquivo_com_segredo.js' \
--prune-empty --tag-name-filter cat -- --all
```

4. **Force push** (⚠️ cuidado em repositórios compartilhados):
```bash
git push --force-with-lease origin master
```

## 📞 Reportar Vulnerabilidades

Se você encontrar uma vulnerabilidade de segurança:

1. **NÃO abra uma issue pública**
2. **Envie um email** para: [seguranca@dominio.com] ou contate via Discord
3. **Inclua detalhes** sobre a vulnerabilidade encontrada
4. **Aguarde nossa resposta** em até 48 horas

## 🎯 Status de Segurança

![Security Scan](https://github.com/HadesTheSilent/simc-discord-bot/actions/workflows/security.yml/badge.svg)

- ✅ **Varredura ativa** - Gitleaks configurado
- ✅ **CI/CD protegido** - GitHub Actions executando
- ✅ **Histórico limpo** - Nenhum segredo detectado
- ✅ **Documentação atualizada** - Políticas claras

---

> **💡 Dica:** Configure hooks locais para executar o Gitleaks antes de cada commit:
> ```bash
> # .git/hooks/pre-commit
> #!/bin/sh
> gitleaks detect --config .gitleaks.toml --staged
> ```