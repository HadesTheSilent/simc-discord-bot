# Exemplos de Uso - SimulationCraft Discord Bot

## Simulações Básicas

### Simular um personagem
```
/simulate character armory:https://worldofwarcraft.com/en-us/character/stormrage/exemplo
```

### Simular com parâmetros específicos
```
/simulate character 
    armory: https://worldofwarcraft.com/pt-br/character/azralon/exemplo
    iterations: 5000
    fight_style: lightmovement
    use_cache: false
```

## Comparações

### Comparar specs de um mago
```
/simulate compare 
    armory: https://worldofwarcraft.com/en-us/character/area52/exemplo
    specs: frost,fire,arcane
    iterations: 2000
```

### Comparar specs de um guerreiro
```
/simulate compare 
    armory: https://worldofwarcraft.com/en-us/character/stormrage/exemplo
    specs: arms,fury
```

## Análise de Gear

### Verificar pesos das stats
```
/simulate gear 
    armory: https://worldofwarcraft.com/en-us/character/tichondrius/exemplo
    analysis_type: stat_weights
```

### Comparar equipamentos
```
/simulate gear 
    armory: https://worldofwarcraft.com/en-us/character/mal-ganis/exemplo
    analysis_type: gear_compare
```

## Comandos de Sistema

### Ver status da fila
```
/simulate queue
```

### Gerenciar cache
```
/simulate cache action:status
/simulate cache action:list
/simulate cache action:clear
```

## Exemplos Avançados

### Simulação com alta precisão
```
/simulate character 
    armory: https://worldofwarcraft.com/en-us/character/illidan/exemplo
    iterations: 10000
    fight_style: patchwerk
    use_cache: false
```

### Comparação detalhada (todas as specs de DK)
```
/simulate compare 
    armory: https://worldofwarcraft.com/en-us/character/area52/exemplo
    specs: blood,frost,unholy
    iterations: 3000
```

## URLs de Armory Suportadas

### Formatos válidos:
- `https://worldofwarcraft.com/en-us/character/servidor/nome`
- `https://worldofwarcraft.com/pt-br/character/servidor/nome`
- `https://battle.net/wow/en/character/servidor/nome`

### Regiões suportadas:
- **US**: en-us, es-mx, pt-br
- **EU**: en-gb, de-de, es-es, fr-fr, it-it, pt-pt, ru-ru
- **KR**: ko-kr
- **TW**: zh-tw
- **CN**: zh-cn

## Specs por Classe

### Death Knight
- `blood` (Tank)
- `frost` (Melee DPS)
- `unholy` (Melee DPS)

### Demon Hunter
- `havoc` (Melee DPS)
- `vengeance` (Tank)

### Druid
- `balance` (Ranged DPS)
- `feral` (Melee DPS)
- `guardian` (Tank)
- `restoration` (Healer)

### Evoker
- `devastation` (Ranged DPS)
- `preservation` (Healer)
- `augmentation` (Support)

### Hunter
- `beast_mastery` (Ranged DPS)
- `marksmanship` (Ranged DPS)
- `survival` (Melee DPS)

### Mage
- `arcane` (Ranged DPS)
- `fire` (Ranged DPS)
- `frost` (Ranged DPS)

### Monk
- `brewmaster` (Tank)
- `mistweaver` (Healer)
- `windwalker` (Melee DPS)

### Paladin
- `holy` (Healer)
- `protection` (Tank)
- `retribution` (Melee DPS)

### Priest
- `discipline` (Healer)
- `holy` (Healer)
- `shadow` (Ranged DPS)

### Rogue
- `assassination` (Melee DPS)
- `outlaw` (Melee DPS)
- `subtlety` (Melee DPS)

### Shaman
- `elemental` (Ranged DPS)
- `enhancement` (Melee DPS)
- `restoration` (Healer)

### Warlock
- `affliction` (Ranged DPS)
- `demonology` (Ranged DPS)
- `destruction` (Ranged DPS)

### Warrior
- `arms` (Melee DPS)
- `fury` (Melee DPS)
- `protection` (Tank)

## Estilos de Luta

- **patchwerk**: Target parado, DPS puro
- **lightmovement**: Movimento ocasional
- **heavymovement**: Movimento frequente
- **helterskelter**: Movimento caótico
- **ultraxion**: Simulação específica de raid

## Dicas de Performance

### Para simulações rápidas:
- Use 1000-2000 iterações
- Deixe o cache ativado
- Use fight_style "patchwerk"

### Para simulações precisas:
- Use 5000-10000 iterações
- Desative o cache se quiser dados frescos
- Consider o fight_style apropriado ao seu cenário

### Para comparações:
- Use o mesmo número de iterações para todas
- Mantenha outros parâmetros iguais
- 2000-3000 iterações são suficientes para comparações