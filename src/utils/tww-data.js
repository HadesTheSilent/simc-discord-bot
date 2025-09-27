// Dados de referência para specs e classes do TWW Season 3
// Baseado nos dados do Archon.gg (Mythic+ e Mythic Raid)
// Atualizado em 27/09/2025

// Tier lists separadas por conteúdo
const TWW_TIER_MYTHIC_PLUS = {
    'S': [
        { spec: 'mage_arcane', score: 3402 },
        { spec: 'death_knight_frost', score: 3383 },
        { spec: 'demon_hunter_havoc', score: 3355 },
        { spec: 'rogue_subtlety', score: 3327 }
    ],
    'A': [
        { spec: 'warrior_fury', score: 3286 },
        { spec: 'druid_feral', score: 3286 },
        { spec: 'shaman_elemental', score: 3282 },
        { spec: 'druid_balance', score: 3272 },
        { spec: 'rogue_outlaw', score: 3261 },
        { spec: 'hunter_beast_mastery', score: 3252 },
        { spec: 'warlock_destruction', score: 3248 },
        { spec: 'death_knight_unholy', score: 3242 },
        { spec: 'hunter_marksmanship', score: 3231 }
    ],
    'B': [
        { spec: 'paladin_retribution', score: 3200 },
        { spec: 'warlock_affliction', score: 3199 },
        { spec: 'rogue_assassination', score: 3198 },
        { spec: 'warlock_demonology', score: 3196 },
        { spec: 'priest_shadow', score: 3194 },
        { spec: 'monk_windwalker', score: 3184 },
        { spec: 'shaman_enhancement', score: 3181 },
        { spec: 'evoker_devastation', score: 3170 },
        { spec: 'hunter_survival', score: 3166 },
        { spec: 'mage_fire', score: 3163 }
    ],
    'C': [
        { spec: 'evoker_augmentation', score: 3132 },
        { spec: 'warrior_arms', score: 3124 },
        { spec: 'mage_frost', score: 3114 }
    ]
};

const TWW_TIER_RAID = {
    'S': [
        { spec: 'death_knight_frost', dps: 7088.9 },
        { spec: 'mage_arcane', dps: 7058.0 },
        { spec: 'hunter_beast_mastery', dps: 6929.9 },
        { spec: 'warlock_destruction', dps: 6934.8 },
        { spec: 'demon_hunter_havoc', dps: 6545.4 },
        { spec: 'paladin_retribution', dps: 6518.7 },
        { spec: 'warrior_fury', dps: 6890.8 },
        { spec: 'shaman_elemental', dps: 6841.3 }
    ],
    'A': [
        { spec: 'hunter_marksmanship', dps: 7121.4 }
    ],
    'B': [
        { spec: 'priest_shadow', dps: 6569.3 },
        { spec: 'druid_balance', dps: 6372.4 },
        { spec: 'evoker_devastation', dps: 6516.1 },
        { spec: 'rogue_assassination', dps: 6488.5 },
        { spec: 'rogue_subtlety', dps: 6714.6 },
        { spec: 'monk_windwalker', dps: 6817.9 },
        { spec: 'mage_frost', dps: 6428.6 },
        { spec: 'warlock_demonology', dps: 6520.6 },
        { spec: 'death_knight_unholy', dps: 6560.7 },
        { spec: 'druid_feral', dps: 6346.1 },
        { spec: 'evoker_augmentation', dps: 6590.6 },
        { spec: 'shaman_enhancement', dps: 6365.8 },
        { spec: 'mage_fire', dps: 6740.8 },
        { spec: 'rogue_outlaw', dps: 6570.1 },
        { spec: 'hunter_survival', dps: 6456.7 },
        { spec: 'warlock_affliction', dps: 6580.4 },
        { spec: 'warrior_arms', dps: 6455.1 }
    ]
};

const TWW_SPECS = {
    // Death Knight
    'death_knight': {
        'blood': { role: 'tank', color: 0x17A2B8 },
        'frost': { role: 'dps', color: 0x17A2B8 },
        'unholy': { role: 'dps', color: 0x17A2B8 }
    },
    
    // Demon Hunter  
    'demon_hunter': {
        'havoc': { role: 'dps', color: 0xA330C9 },
        'vengeance': { role: 'tank', color: 0xA330C9 }
    },
    
    // Druid
    'druid': {
        'balance': { role: 'dps', color: 0xFF7D0A },
        'feral': { role: 'dps', color: 0xFF7D0A },
        'guardian': { role: 'tank', color: 0xFF7D0A },
        'restoration': { role: 'healer', color: 0xFF7D0A }
    },
    
    // Evoker
    'evoker': {
        'devastation': { role: 'dps', color: 0x33937F },
        'preservation': { role: 'healer', color: 0x33937F },
        'augmentation': { role: 'support', color: 0x33937F }
    },
    
    // Hunter
    'hunter': {
        'beast_mastery': { role: 'dps', color: 0xABD473 },
        'marksmanship': { role: 'dps', color: 0xABD473 },
        'survival': { role: 'dps', color: 0xABD473 }
    },
    
    // Mage
    'mage': {
        'arcane': { role: 'dps', color: 0x40C7EB },
        'fire': { role: 'dps', color: 0x40C7EB },
        'frost': { role: 'dps', color: 0x40C7EB }
    },
    
    // Monk
    'monk': {
        'brewmaster': { role: 'tank', color: 0x00FF96 },
        'mistweaver': { role: 'healer', color: 0x00FF96 },
        'windwalker': { role: 'dps', color: 0x00FF96 }
    },
    
    // Paladin
    'paladin': {
        'holy': { role: 'healer', color: 0xF58CBA },
        'protection': { role: 'tank', color: 0xF58CBA },
        'retribution': { role: 'dps', color: 0xF58CBA }
    },
    
    // Priest
    'priest': {
        'discipline': { role: 'healer', color: 0xFFFFFF },
        'holy': { role: 'healer', color: 0xFFFFFF },
        'shadow': { role: 'dps', color: 0xFFFFFF }
    },
    
    // Rogue
    'rogue': {
        'assassination': { role: 'dps', color: 0xFFD700 },
        'outlaw': { role: 'dps', color: 0xFFD700 },
        'subtlety': { role: 'dps', color: 0xFFD700 }
    },
    
    // Shaman
    'shaman': {
        'elemental': { role: 'dps', color: 0x0070DE },
        'enhancement': { role: 'dps', color: 0x0070DE },
        'restoration': { role: 'healer', color: 0x0070DE }
    },
    
    // Warlock
    'warlock': {
        'affliction': { role: 'dps', color: 0x8787ED },
        'demonology': { role: 'dps', color: 0x8787ED },
        'destruction': { role: 'dps', color: 0x8787ED }
    },
    
    // Warrior
    'warrior': {
        'arms': { role: 'dps', color: 0xC79C6E },
        'fury': { role: 'dps', color: 0xC79C6E },
        'protection': { role: 'tank', color: 0xC79C6E }
    }
};

// Hero Talents (TWW Season 1)
const HERO_TALENTS = {
    'death_knight': {
        'frost': ['rider', 'deathbringer'],
        'unholy': ['sanlayn', 'rider']
    },
    'mage': {
        'arcane': ['sunfury', 'spellslinger'],
        'fire': ['sunfury', 'spellslinger'],
        'frost': ['frostfire', 'spellslinger']
    },
    'monk': {
        'windwalker': ['celestial', 'grandmaster']
    },
    'paladin': {
        'protection': ['templar', 'herald'],
        'retribution': ['herald', 'templar']
    },
    'priest': {
        'shadow': ['archon', 'voidweaver']
    },
    'rogue': {
        'assassination': ['fatebound', 'deathstalker']
    },
    'shaman': {
        'elemental': ['farseer', 'stormbringer'],
        'enhancement': ['stormbringer', 'farseer']
    },
    'warlock': {
        'affliction': ['hellcaller', 'soul_harvester'],
        'demonology': ['diabolist', 'soul_harvester'],
        'destruction': ['hellcaller', 'diabolist']
    }
};

// Fight Styles com descrições
const FIGHT_STYLES = {
    'patchwerk': {
        name: 'Patchwerk',
        description: 'Alvo parado, DPS puro sem mecânicas',
        usage: 'Ideal para comparar DPS máximo teórico'
    },
    'lightmovement': {
        name: 'Light Movement',
        description: 'Movimento ocasional (~25% uptime)',
        usage: 'Simula fights com mecânicas leves'
    },
    'heavymovement': {
        name: 'Heavy Movement',
        description: 'Movimento frequente (~50% uptime)',
        usage: 'Simula fights com muito movimento'
    },
    'helterskelter': {
        name: 'Helter Skelter',
        description: 'Movimento caótico e imprevisível',
        usage: 'Simula fights muito dinâmicos'
    },
    'ultraxion': {
        name: 'Ultraxion',
        description: 'Based no fight clássico do Dragon Soul',
        usage: 'Simula burst windows específicos'
    }
};

// Níveis de gear aproximados para TWW Season 3
const GEAR_LEVELS = {
    // Season 1 Content
    'pre_raid': { ilvl: 593, description: 'Pre-Raid (M0, Crafted)' },
    'tww1_lfr': { ilvl: 610, description: 'LFR Nerub-ar Palace' },
    'tww1_normal': { ilvl: 623, description: 'Normal Nerub-ar Palace' },
    'tww1_heroic': { ilvl: 636, description: 'Heroic Nerub-ar Palace' },
    'tww1_mythic': { ilvl: 649, description: 'Mythic Nerub-ar Palace' },
    
    // Season 2 Content
    'tww2_normal': { ilvl: 671, description: 'Normal Liberation of Undermine' },
    'tww2_heroic': { ilvl: 684, description: 'Heroic Liberation of Undermine' },
    'tww2_mythic': { ilvl: 697, description: 'Mythic Liberation of Undermine' },
    
    // Season 3 Content (Current)
    'tww3_normal': { ilvl: 710, description: 'Normal Manaforge Omega' },
    'tww3_heroic': { ilvl: 723, description: 'Heroic Manaforge Omega' },
    'tww3_mythic': { ilvl: 736, description: 'Mythic Manaforge Omega' },
    
    // Season 3 Mythic+ Rewards
    'mythic_plus_2': { ilvl: 616, description: 'M+ 2-3 Great Vault' },
    'mythic_plus_4': { ilvl: 623, description: 'M+ 4-6 Great Vault' },
    'mythic_plus_7': { ilvl: 629, description: 'M+ 7-9 Great Vault' },
    'mythic_plus_10': { ilvl: 636, description: 'M+ 10-12 Great Vault' },
    'mythic_plus_13': { ilvl: 642, description: 'M+ 13-15 Great Vault' },
    'mythic_plus_16': { ilvl: 649, description: 'M+ 16+ Great Vault' },
    
    // Season 3 Weekly Vault Max
    'vault_max': { ilvl: 736, description: 'Great Vault Max (M20+, Mythic Raid)' }
};

// DPS estimates para diferentes ilvls (Patchwerk, baseado em Season 3 data)
const DPS_ESTIMATES = {
    // Season 1 Levels
    593: { high: 1800000, average: 1600000, low: 1400000 },
    623: { high: 2200000, average: 2000000, low: 1800000 },
    636: { high: 2800000, average: 2500000, low: 2200000 },
    649: { high: 3500000, average: 3200000, low: 2800000 },
    
    // Season 2 Levels
    671: { high: 4200000, average: 3800000, low: 3400000 },
    684: { high: 4800000, average: 4400000, low: 4000000 },
    697: { high: 5500000, average: 5000000, low: 4500000 },
    
    // Season 3 Levels (Current Meta)
    710: { high: 6200000, average: 5700000, low: 5200000 },
    723: { high: 6800000, average: 6300000, low: 5800000 },
    736: { high: 7500000, average: 7000000, low: 6500000 }
};

// Consumíveis atuais do TWW Season 3
const CONSUMABLES = {
    potions: [
        'tempered_potion',
        'elemental_potion_of_ultimate_power',
        'potion_of_unwavering_focus',
        'frontline_potion'
    ],
    flasks: [
        'flask_of_alchemical_chaos',
        'flask_of_power',
        'flask_of_stamina'
    ],
    food: [
        'feast_of_the_divine_day',
        'fated_fortune_cookie',
        'timely_demise'
    ],
    augmentation: 'crystallized_augment_rune',
    weapon_stones: [
        'ironclaw_whetstone',
        'buzzing_rune'
    ],
    healing: [
        'refreshing_healing_potion',
        'dreamwalkers_healing_potion'
    ]
};

module.exports = {
    TWW_SPECS,
    TWW_TIER_MYTHIC_PLUS,
    TWW_TIER_RAID,
    HERO_TALENTS,
    FIGHT_STYLES,
    GEAR_LEVELS,
    DPS_ESTIMATES,
    CONSUMABLES
};