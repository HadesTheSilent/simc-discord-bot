# Referência de Comandos SimulationCraft

## Comandos Básicos do SimC

### Importação de Personagens
```simc
# Importar do armory
armory=us,stormrage,charactername
armory=eu,kazzak,charactername
armory=kr,azshara,charactername

# Importar de arquivo local
local_json=character.json

# Força especialização específica
spec=fire
spec=frost
spec=arcane
```

### Configurações de Simulação
```simc
# Número de iterações
iterations=10000

# Duração da luta (segundos)
max_time=300
vary_combat_length=0.2

# Tipo de luta
fight_style=Patchwerk
fight_style=LightMovement
fight_style=HeavyMovement
fight_style=HelterSkelter
fight_style=Ultraxion

# Número de alvos
desired_targets=1
enemy=2  # Para multi-target
```

### Otimização e Análise
```simc
# Calcular pesos das stats
calculate_scale_factors=1
scale_only=str,agi,int,crit,haste,mastery,vers

# Comparação de gear
gear_comparison=1

# Análise de trinkets
single_actor_batch=1
```

### Saídas e Relatórios
```simc
# Arquivo HTML
html=results.html

# Arquivo de texto
text=results.txt

# Arquivo JSON
json2=results.json

# Arquivo CSV
csv=results.csv

# Log detalhado
log=1
debug=1
```

## Especializations por Classe

### Death Knight
- blood (Tank)
- frost (Melee DPS)
- unholy (Melee DPS)

### Demon Hunter
- havoc (Melee DPS)
- vengeance (Tank)

### Druid
- balance (Ranged DPS)
- feral (Melee DPS)
- guardian (Tank)
- restoration (Healer)

### Evoker
- devastation (Ranged DPS)
- preservation (Healer)
- augmentation (Support DPS)

### Hunter
- beast_mastery (Ranged DPS)
- marksmanship (Ranged DPS)
- survival (Melee DPS)

### Mage
- arcane (Ranged DPS)
- fire (Ranged DPS)
- frost (Ranged DPS)

### Monk
- brewmaster (Tank)
- mistweaver (Healer)
- windwalker (Melee DPS)

### Paladin
- holy (Healer)
- protection (Tank)
- retribution (Melee DPS)

### Priest
- discipline (Healer)
- holy (Healer)
- shadow (Ranged DPS)

### Rogue
- assassination (Melee DPS)
- outlaw (Melee DPS)
- subtlety (Melee DPS)

### Shaman
- elemental (Ranged DPS)
- enhancement (Melee DPS)
- restoration (Healer)

### Warlock
- affliction (Ranged DPS)
- demonology (Ranged DPS)
- destruction (Ranged DPS)

### Warrior
- arms (Melee DPS)
- fury (Melee DPS)
- protection (Tank)

## Configurações Avançadas

### Multi-Target
```simc
desired_targets=3
enemy=Fluffy_Pillow
enemy=Enemy2
enemy=Enemy3
```

### Buffs de Raid
```simc
# Buffs automáticos
optimal_raid=1

# Buffs específicos
buff.arcane_intellect=1
buff.battle_shout=1
buff.power_word_fortitude=1
```

### Consumíveis
```simc
# Poção
potion=elemental_potion_of_ultimate_power_3

# Flask
flask=phial_of_elemental_chaos_3

# Food
food=fated_fortune_cookie

# Augment Rune
augmentation=draconic
```

### Análise de Talentos
```simc
# Comparar builds de talentos
talent_format=numbers
talents=1213123...

# Múltiplas builds
copy=build1
talents=1213123...

copy=build2  
talents=3213123...
```

## Perfis de Referência (TWW Season 1)

### DPS Ranges Aproximados (ilvl ~639)
- **S-Tier (80k+ DPS)**: Affliction Warlock, Frost Mage, Enhancement Shaman
- **A-Tier (75-80k DPS)**: Fire Mage, Shadow Priest, Fury Warrior
- **B-Tier (70-75k DPS)**: Arms Warrior, Unholy DK, Havoc DH
- **C-Tier (65-70k DPS)**: Frost DK, Outlaw Rogue, Beast Mastery Hunter

*Nota: Valores aproximados para Patchwerk, podem variar significativamente por fight style e gear*

## Comandos de Troubleshooting

### Debug
```simc
# Log detalhado
log=1
debug=1

# Apenas mostrar build info
display_build=1

# Verificar spell data
spell_query=spell.name=fireball

# Mostrar bonus IDs
show_bonus_ids=1
```

### Performance
```simc
# Threads
threads=4

# Cleanup
cleanup_threads=1

# Otimização
optimize_expressions=1
```