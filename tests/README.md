# Arquivos de Teste

Esta pasta contém todos os arquivos de teste e utilitários de desenvolvimento.

## Testes Principais

- `test-quick.js` - Testes rápidos de funcionalidades
- `test-simulate.js` - Teste completo do comando de simulação
- `test-complete-embed.js` - Teste de embeds do Discord
- `test-final-complete.js` - Teste de funcionalidades finais
- `test-simc-command.js` - Teste de comandos SimC
- `test-simc-file.js` - Teste de arquivos SimC

## Testes Específicos

- `test-corrections.js` - Testa correções de dados
- `test-dk-embed.js` - Teste específico para Death Knight embed
- `test-iterations-fightstyle.js` - Testa configurações de iterações e fight styles
- `test-parser-complete.js` - Teste completo do parser
- `test-realms.js` - Testa funcionalidade de realms
- `test-rogue-embed.js` - Teste específico para Rogue embed

## Utilitários

- `debug-colors.js` - Utilitário para debug de cores

## Como Executar

Para executar um teste específico:
```bash
node tests/test-nome-do-arquivo.js
```

Ou usar os scripts npm:
```bash
npm test              # Executa teste rápido
npm run test:all      # Executa todos os testes principais
```