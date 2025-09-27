const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { TWW_SPECS, TWW_TIER_MYTHIC_PLUS, TWW_TIER_RAID, HERO_TALENTS, FIGHT_STYLES, GEAR_LEVELS, CONSUMABLES } = require('../utils/tww-data');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tww')
        .setDescription('Informações sobre The War Within Season 3')
        .addSubcommand(subcommand =>
            subcommand
                .setName('specs')
                .setDescription('Lista as especializações disponíveis')
                .addStringOption(option =>
                    option.setName('class')
                        .setDescription('Classe específica (opcional)')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Death Knight', value: 'death_knight' },
                            { name: 'Demon Hunter', value: 'demon_hunter' },
                            { name: 'Druid', value: 'druid' },
                            { name: 'Evoker', value: 'evoker' },
                            { name: 'Hunter', value: 'hunter' },
                            { name: 'Mage', value: 'mage' },
                            { name: 'Monk', value: 'monk' },
                            { name: 'Paladin', value: 'paladin' },
                            { name: 'Priest', value: 'priest' },
                            { name: 'Rogue', value: 'rogue' },
                            { name: 'Shaman', value: 'shaman' },
                            { name: 'Warlock', value: 'warlock' },
                            { name: 'Warrior', value: 'warrior' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('hero_talents')
                .setDescription('Mostra Hero Talents disponíveis')
                .addStringOption(option =>
                    option.setName('class')
                        .setDescription('Classe específica')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Death Knight', value: 'death_knight' },
                            { name: 'Mage', value: 'mage' },
                            { name: 'Monk', value: 'monk' },
                            { name: 'Paladin', value: 'paladin' },
                            { name: 'Priest', value: 'priest' },
                            { name: 'Rogue', value: 'rogue' },
                            { name: 'Shaman', value: 'shaman' },
                            { name: 'Warlock', value: 'warlock' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('fight_styles')
                .setDescription('Explica os diferentes estilos de luta'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('gear_levels')
                .setDescription('Mostra os níveis de gear do TWW S1'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('consumables')
                .setDescription('Lista consumíveis recomendados para TWW S1'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('tier')
                .setDescription('Mostra tier list da Season 3')
                .addStringOption(option =>
                    option.setName('content')
                        .setDescription('Tipo de conteúdo')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Mythic+ (Dungeons)', value: 'mythic_plus' },
                            { name: 'Mythic Raid', value: 'raid' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('meta')
                .setDescription('Resumo do meta atual da Season 3'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('profiles')
                .setDescription('Mostra profiles de simulação disponíveis')
                .addStringOption(option =>
                    option.setName('tier')
                        .setDescription('Tier do conteúdo')
                        .setRequired(false)
                        .addChoices(
                            { name: 'TWW Season 1', value: 'TWW1' },
                            { name: 'TWW Season 2', value: 'TWW2' },
                            { name: 'TWW Season 3', value: 'TWW3' },
                            { name: 'Pre-Raid', value: 'PreRaids' }
                        ))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'specs':
                await this.showSpecs(interaction);
                break;
            case 'hero_talents':
                await this.showHeroTalents(interaction);
                break;
            case 'fight_styles':
                await this.showFightStyles(interaction);
                break;
            case 'gear_levels':
                await this.showGearLevels(interaction);
                break;
            case 'consumables':
                await this.showConsumables(interaction);
                break;
            case 'tier':
                await this.showTierList(interaction);
                break;
            case 'meta':
                await this.showMeta(interaction);
                break;
            case 'profiles':
                await this.showProfiles(interaction);
                break;
        }
    },

    async showSpecs(interaction) {
        const selectedClass = interaction.options.getString('class');

        if (selectedClass) {
            // Mostrar specs de uma classe específica
            const classSpecs = TWW_SPECS[selectedClass];
            if (!classSpecs) {
                await interaction.reply({ content: 'Classe não encontrada!', ephemeral: true });
                return;
            }

            const className = selectedClass.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const embed = new EmbedBuilder()
                .setTitle(`⚔️ ${className} - Especializações`)
                .setColor(Object.values(classSpecs)[0].color)
                .setTimestamp();

            for (const [specName, specData] of Object.entries(classSpecs)) {
                const roleEmoji = this.getRoleEmoji(specData.role);
                const formattedName = specName.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                embed.addFields({
                    name: `${roleEmoji} ${formattedName}`,
                    value: `Papel: ${specData.role.toUpperCase()}`,
                    inline: true
                });
            }

            // Adicionar Hero Talents se disponíveis
            if (HERO_TALENTS[selectedClass]) {
                let heroText = '';
                for (const [spec, heroes] of Object.entries(HERO_TALENTS[selectedClass])) {
                    heroText += `**${spec.replace('_', ' ')}:** ${heroes.join(', ')}\n`;
                }
                
                if (heroText) {
                    embed.addFields({
                        name: '🌟 Hero Talents',
                        value: heroText.trim(),
                        inline: false
                    });
                }
            }

            await interaction.reply({ embeds: [embed] });
        } else {
            // Mostrar todas as classes
            const embed = new EmbedBuilder()
                .setTitle('⚔️ The War Within - Todas as Especializações')
                .setDescription('Use `/tww specs class:` para ver detalhes de uma classe específica')
                .setColor(0x00AE86)
                .setTimestamp();

            for (const [className, classSpecs] of Object.entries(TWW_SPECS)) {
                const formattedName = className.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                const specList = Object.keys(classSpecs).map(spec => 
                    spec.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                ).join(', ');

                embed.addFields({
                    name: formattedName,
                    value: specList,
                    inline: true
                });
            }

            await interaction.reply({ embeds: [embed] });
        }
    },

    async showHeroTalents(interaction) {
        const selectedClass = interaction.options.getString('class');
        const heroTalents = HERO_TALENTS[selectedClass];

        if (!heroTalents) {
            await interaction.reply({ 
                content: 'Esta classe não possui Hero Talents implementados ainda.', 
                ephemeral: true 
            });
            return;
        }

        const className = selectedClass.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        const embed = new EmbedBuilder()
            .setTitle(`🌟 ${className} - Hero Talents`)
            .setColor(0xFFD700)
            .setDescription('Hero Talents disponíveis para cada especialização')
            .setTimestamp();

        for (const [spec, heroes] of Object.entries(heroTalents)) {
            const specName = spec.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const heroList = heroes.map(hero => 
                hero.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
            ).join('\n• ');

            embed.addFields({
                name: `⚡ ${specName}`,
                value: `• ${heroList}`,
                inline: false
            });
        }

        await interaction.reply({ embeds: [embed] });
    },

    async showFightStyles(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🎯 Estilos de Luta - SimulationCraft')
            .setColor(0xFF6B35)
            .setDescription('Diferentes estilos de simulação para cenários variados')
            .setTimestamp();

        for (const [style, data] of Object.entries(FIGHT_STYLES)) {
            embed.addFields({
                name: data.name,
                value: `**Descrição:** ${data.description}\n**Uso:** ${data.usage}`,
                inline: false
            });
        }

        embed.addFields({
            name: '💡 Dica',
            value: 'Use **Patchwerk** para comparar DPS puro, **Light/Heavy Movement** para cenários mais realistas de raid.',
            inline: false
        });

        await interaction.reply({ embeds: [embed] });
    },

    async showGearLevels(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('⚔️ Níveis de Gear - The War Within Season 3')
            .setDescription('Níveis de item atualizados para Season 3')
            .setColor(0x9B59B6)
            .setTimestamp();

        // Agrupar por season/conteúdo
        const season3Content = Object.entries(GEAR_LEVELS).filter(([key]) => key.includes('tww3') || key.includes('vault') || key.includes('mythic_plus'));
        const season2Content = Object.entries(GEAR_LEVELS).filter(([key]) => key.includes('tww2'));
        const season1Content = Object.entries(GEAR_LEVELS).filter(([key]) => key.includes('tww1') || key.includes('pre_raid'));

        // Season 3 (Current)
        if (season3Content.length > 0) {
            let s3List = '';
            season3Content.forEach(([tier, data]) => {
                const emoji = tier.includes('mythic') ? '🏆' : 
                             tier.includes('heroic') ? '🥇' :
                             tier.includes('vault') ? '💎' :
                             tier.includes('mythic_plus') ? '⚔️' : '🥈';
                s3List += `${emoji} **${data.ilvl}** - ${data.description}\n`;
            });
            
            embed.addFields({
                name: '🆕 **Season 3 (Atual)**',
                value: s3List.trim(),
                inline: false
            });
        }

        // Season 2
        if (season2Content.length > 0) {
            let s2List = '';
            season2Content.forEach(([tier, data]) => {
                const emoji = tier.includes('mythic') ? '🏆' : 
                             tier.includes('heroic') ? '🥇' : '🥈';
                s2List += `${emoji} **${data.ilvl}** - ${data.description}\n`;
            });
            
            embed.addFields({
                name: '⏮️ **Season 2**',
                value: s2List.trim(),
                inline: false
            });
        }

        // Season 1
        if (season1Content.length > 0) {
            let s1List = '';
            season1Content.forEach(([tier, data]) => {
                const emoji = tier.includes('mythic') ? '🏆' : 
                             tier.includes('heroic') ? '🥇' :
                             tier.includes('normal') ? '🥈' : '🥉';
                s1List += `${emoji} **${data.ilvl}** - ${data.description}\n`;
            });
            
            embed.addFields({
                name: '📜 **Season 1**',
                value: s1List.trim(),
                inline: false
            });
        }

        embed.addFields({
            name: '📊 **DPS Estimado Season 3**',
            value: 'Para ilvl 736 (Mythic): **6.5M - 7.5M** DPS\nPara ilvl 723 (Heroic): **5.8M - 6.8M** DPS\nPara ilvl 710 (Normal): **5.2M - 6.2M** DPS',
            inline: false
        });

        await interaction.reply({ embeds: [embed] });
    },

    async showConsumables(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🧪 Consumíveis - The War Within Season 3')
            .setDescription('Consumíveis otimizados para Season 3 - Baseado no meta atual')
            .setColor(0x27AE60)
            .setTimestamp();

        embed.addFields(
            {
                name: '⚗️ **Poções de Combat**',
                value: '🔥 **Tempered Potion** - Melhor para DPS geral\n' +
                       '⚡ **Elemental Potion of Ultimate Power** - Burst windows\n' +
                       '🎯 **Potion of Unwavering Focus** - Caster DPS\n' +
                       '⚔️ **Frontline Potion** - Melee DPS',
                inline: false
            },
            {
                name: '🍶 **Flasks (1 hora)**',
                value: '🌀 **Flask of Alchemical Chaos** - Melhor para a maioria\n' +
                       '💪 **Flask of Power** - DPS puro\n' +
                       '🛡️ **Flask of Stamina** - Survivability',
                inline: false
            },
            {
                name: '🍖 **Comida (1 hora)**',
                value: '🍯 **Feast of the Divine Day** - +61 stats (recomendado)\n' +
                       '🥠 **Fated Fortune Cookie** - Versatilidade\n' +
                       '💀 **Timely Demise** - Crítico',
                inline: false
            },
            {
                name: '💎 **Augment Runes**',
                value: '💎 **Crystallized Augment Rune** - +81 stats principais\n*Obtido via Weekly Quest ou Great Vault*',
                inline: false
            },
            {
                name: '🏺 **Outros Consumíveis**',
                value: '🔧 **Weapon Stones** - Armas temporárias\n' +
                       '🧴 **Healing Potions** - Emergência\n' +
                       '🍺 **Well Fed Buffs** - Secundário',
                inline: false
            },
            {
                name: '� **Dicas de Custo S3**',
                value: '• **Flask of Alchemical Chaos** é o mais versátil\n' +
                       '• **Tempered Potion** oferece melhor custo-benefício\n' +
                       '• Use **Feast of the Divine Day** para raid/M+\n' +
                       '• Augment Runes são caros mas essenciais para alta performance',
                inline: false
            }
        );

        await interaction.reply({ embeds: [embed] });
    },

    async showMeta(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('📊 Meta Atual - TWW Season 1 (Aproximado)')
            .setColor(0xE74C3C)
            .setDescription('*Baseado em dados da comunidade e simulações. Pode variar por encounter.*')
            .setTimestamp();

        embed.addFields(
            {
                name: '🥇 S-Tier DPS (80k+ DPS)',
                value: '• **Affliction Warlock**\n• **Frost Mage**\n• **Enhancement Shaman**\n• **Shadow Priest (Archon)**',
                inline: false
            },
            {
                name: '🥈 A-Tier DPS (75-80k DPS)',
                value: '• **Fire Mage (Sunfury)**\n• **Fury Warrior**\n• **Unholy Death Knight**\n• **Havoc Demon Hunter**',
                inline: false
            },
            {
                name: '🥉 B-Tier DPS (70-75k DPS)',
                value: '• **Arms Warrior**\n• **Frost Death Knight**\n• **Outlaw Rogue**\n• **Beast Mastery Hunter**',
                inline: false
            },
            {
                name: '🏆 Top Tanks',
                value: '• **Blood Death Knight**\n• **Protection Paladin (Templar)**\n• **Brewmaster Monk**',
                inline: true
            },
            {
                name: '💚 Top Healers',
                value: '• **Restoration Shaman**\n• **Discipline Priest**\n• **Preservation Evoker**',
                inline: true
            }
        );

        embed.setFooter({ 
            text: 'Meta sujeita a mudanças com patches. Use simulações para seu gear específico!' 
        });

        await interaction.reply({ embeds: [embed] });
    },

    async showProfiles(interaction) {
        const tier = interaction.options.getString('tier') || 'TWW1';
        
        const profiles = {
            'TWW1': {
                title: 'The War Within Season 1 - Profiles',
                description: 'Profiles otimizados para Raid Tier TWW1 (Nerub-ar Palace)',
                color: 0xFF6B6B,
                specs: [
                    { name: 'Death Knight Blood', file: 'TWW1_Death_Knight_Blood.simc' },
                    { name: 'Death Knight Frost', file: 'TWW1_Death_Knight_Frost.simc' },
                    { name: 'Death Knight Frost (Rider)', file: 'TWW1_Death_Knight_Frost_Rider.simc' },
                    { name: 'Death Knight Unholy', file: 'TWW1_Death_Knight_Unholy.simc' },
                    { name: 'Death Knight Unholy (San\'layn)', file: 'TWW1_Death_Knight_Unholy_San\'layn.simc' },
                    { name: 'Demon Hunter Havoc', file: 'TWW1_Demon_Hunter_Havoc.simc' },
                    { name: 'Druid Balance', file: 'TWW1_Druid_Balance.simc' },
                    { name: 'Druid Feral', file: 'TWW1_Druid_Feral.simc' },
                    { name: 'Mage Arcane', file: 'TWW1_Mage_Arcane.simc' },
                    { name: 'Mage Arcane (Sunfury)', file: 'TWW1_Mage_Arcane_Sunfury.simc' },
                    { name: 'Mage Fire', file: 'TWW1_Mage_Fire.simc' },
                    { name: 'Mage Fire (Sunfury)', file: 'TWW1_Mage_Fire_Sunfury.simc' },
                    { name: 'Mage Frost', file: 'TWW1_Mage_Frost.simc' },
                    { name: 'Paladin Retribution', file: 'TWW1_Paladin_Retribution.simc' },
                    { name: 'Paladin Retribution (Herald)', file: 'TWW1_Paladin_Retribution_Herald.simc' },
                    { name: 'Priest Shadow', file: 'TWW1_Priest_Shadow.simc' },
                    { name: 'Priest Shadow (Archon)', file: 'TWW1_Priest_Shadow_Archon.simc' },
                    { name: 'Rogue Assassination', file: 'TWW1_Rogue_Assassination.simc' },
                    { name: 'Rogue Outlaw', file: 'TWW1_Rogue_Outlaw.simc' },
                    { name: 'Rogue Subtlety', file: 'TWW1_Rogue_Subtlety.simc' },
                    { name: 'Shaman Enhancement', file: 'TWW1_Shaman_Enhancement.simc' },
                    { name: 'Shaman Enhancement (Stormbringer)', file: 'TWW1_Shaman_Enhancement_Stormbringer.simc' },
                    { name: 'Shaman Elemental', file: 'TWW1_Shaman_Elemental.simc' },
                    { name: 'Warlock Affliction', file: 'TWW1_Warlock_Affliction.simc' },
                    { name: 'Warlock Demonology', file: 'TWW1_Warlock_Demonology.simc' },
                    { name: 'Warlock Destruction', file: 'TWW1_Warlock_Destruction.simc' }
                ]
            },
            'PreRaids': {
                title: 'Pre-Raid Profiles',
                description: 'Profiles para conteúdo pré-raid e dungeons',
                color: 0x4ECDC4,
                specs: [
                    { name: 'Priest Shadow', file: 'PR_Priest_Shadow.simc' },
                    { name: 'Shaman Enhancement', file: 'PR_Shaman_Enhancement.simc' },
                    { name: 'Shaman Enhancement (Stormbringer)', file: 'PR_Shaman_Enhancement_Stormbringer.simc' },
                    { name: 'Warrior Arms', file: 'PR_Warrior_Arms.simc' },
                    { name: 'Warrior Fury', file: 'PR_Warrior_Fury.simc' },
                    { name: 'Warrior Protection', file: 'PR_Warrior_Protection.simc' }
                ]
            },
            'TWW2': {
                title: 'The War Within Season 2 - Profiles',
                description: 'Profiles para TWW Season 2 (Em breve)',
                color: 0x45B7D1,
                specs: []
            },
            'TWW3': {
                title: 'The War Within Season 3 - Profiles',
                description: 'Profiles otimizados baseados no meta da Season 3 (Archon.gg)',
                color: 0x96CEB4,
                specs: [
                    { name: '🔮 Mage Arcane', tier: 'S-Tier M+', file: 'mage_arcane_base.simc' },
                    { name: '⚔️ Death Knight Frost', tier: 'S-Tier M+/Raid', file: 'death_knight_frost_base.simc' },
                    { name: '😈 Demon Hunter Havoc', tier: 'S-Tier M+', file: 'demon_hunter_havoc_base.simc' },
                    { name: '🗡️ Rogue Subtlety', tier: 'S-Tier M+', file: 'rogue_subtlety_base.simc' },
                    { name: '🏹 Hunter Beast Mastery', tier: 'S-Tier Raid', file: 'hunter_beast_mastery_base.simc' },
                    { name: '🔥 Warlock Destruction', tier: 'S-Tier Raid', file: 'warlock_destruction_base.simc' },
                    { name: '🛡️ Warrior Fury', tier: 'A-Tier M+/Raid', file: 'warrior_fury_base.simc' },
                    { name: '🌿 Druid Feral', tier: 'A-Tier M+', file: 'druid_feral_base.simc' },
                    { name: '⚡ Shaman Elemental', tier: 'A-Tier M+/Raid', file: 'shaman_elemental_base.simc' }
                ]
            }
        };

        const selectedProfile = profiles[tier];
        if (!selectedProfile) {
            await interaction.reply({ content: 'Tier não encontrado!', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`📋 ${selectedProfile.title}`)
            .setDescription(selectedProfile.description)
            .setColor(selectedProfile.color)
            .setTimestamp();

        if (selectedProfile.specs.length === 0) {
            embed.addFields({
                name: '🚧 Em Desenvolvimento',
                value: 'Profiles para este tier ainda não estão disponíveis.',
                inline: false
            });
        } else {
            // Agrupar por tier para TWW3
            if (tier === 'TWW3') {
                const sTierSpecs = selectedProfile.specs.filter(spec => spec.tier.includes('S-Tier'));
                const aTierSpecs = selectedProfile.specs.filter(spec => spec.tier.includes('A-Tier'));
                
                if (sTierSpecs.length > 0) {
                    const sTierList = sTierSpecs.map(spec => `${spec.name} **(${spec.tier})**`).join('\n');
                    embed.addFields({
                        name: '🥇 **S-Tier Specs**',
                        value: sTierList,
                        inline: false
                    });
                }
                
                if (aTierSpecs.length > 0) {
                    const aTierList = aTierSpecs.map(spec => `${spec.name} **(${spec.tier})**`).join('\n');
                    embed.addFields({
                        name: '🥈 **A-Tier Specs**',
                        value: aTierList,
                        inline: false
                    });
                }
            } else {
                // Agrupar por classe para outros tiers
                const classesByGroup = {};
                selectedProfile.specs.forEach(spec => {
                    const className = spec.name.split(' ')[0];
                    if (!classesByGroup[className]) {
                        classesByGroup[className] = [];
                    }
                    classesByGroup[className].push(spec.name);
                });

                for (const [className, specs] of Object.entries(classesByGroup)) {
                    embed.addFields({
                        name: `⚔️ ${className}`,
                        value: specs.join('\n'),
                        inline: true
                    });
                }
            }

            embed.addFields({
                name: '📖 Como usar',
                value: 'Use `/simulate character` e o bot aplicará automaticamente o profile mais adequado para sua spec.',
                inline: false
            });
        }

        await interaction.reply({ embeds: [embed] });
    },

    async showTierList(interaction) {
        const content = interaction.options.getString('content');
        
        let tierData, title, description, color;
        
        if (content === 'mythic_plus') {
            tierData = TWW_TIER_MYTHIC_PLUS;
            title = '🏆 TWW Season 3 - Mythic+ Tier List';
            description = 'Baseado em Mythic+ Score (95th percentile) - Archon.gg\n*Keys +7 a +20 • Últimos 14 dias*';
            color = 0x9B59B6;
        } else {
            tierData = TWW_TIER_RAID;
            title = '🏆 TWW Season 3 - Mythic Raid Tier List';
            description = 'Baseado em DPS (95th percentile) - Archon.gg\n*Mythic Manaforge Omega • Últimos 14 dias*';
            color = 0xE74C3C;
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setTimestamp()
            .setFooter({ text: 'Dados atualizados em 27/09/2025' });

        // Adicionar cada tier como field
        for (const [tier, specs] of Object.entries(tierData)) {
            const tierEmoji = tier === 'S' ? '🥇' : tier === 'A' ? '🥈' : tier === 'B' ? '🥉' : '📊';
            
            let specList = '';
            specs.forEach(spec => {
                const [className, specName] = spec.spec.split('_');
                const emoji = this.getClassEmoji(className);
                const value = content === 'mythic_plus' ? `${spec.score} score` : `${spec.dps}K DPS`;
                
                specList += `${emoji} ${this.capitalizeWords(className)} ${this.capitalizeWords(specName)} - ${value}\n`;
            });

            if (specList.length > 1024) {
                // Split se muito longo
                const midpoint = Math.floor(specs.length / 2);
                const firstHalf = specs.slice(0, midpoint);
                const secondHalf = specs.slice(midpoint);
                
                let firstList = '';
                let secondList = '';
                
                firstHalf.forEach(spec => {
                    const [className, specName] = spec.spec.split('_');
                    const emoji = this.getClassEmoji(className);
                    const value = content === 'mythic_plus' ? `${spec.score} score` : `${spec.dps}K DPS`;
                    firstList += `${emoji} ${this.capitalizeWords(className)} ${this.capitalizeWords(specName)} - ${value}\n`;
                });
                
                secondHalf.forEach(spec => {
                    const [className, specName] = spec.spec.split('_');
                    const emoji = this.getClassEmoji(className);
                    const value = content === 'mythic_plus' ? `${spec.score} score` : `${spec.dps}K DPS`;
                    secondList += `${emoji} ${this.capitalizeWords(className)} ${this.capitalizeWords(specName)} - ${value}\n`;
                });
                
                embed.addFields(
                    { name: `${tierEmoji} **${tier} Tier** (1/2)`, value: firstList.trim(), inline: false },
                    { name: `${tierEmoji} **${tier} Tier** (2/2)`, value: secondList.trim(), inline: false }
                );
            } else {
                embed.addFields({
                    name: `${tierEmoji} **${tier} Tier**`,
                    value: specList.trim(),
                    inline: false
                });
            }
        }

        await interaction.reply({ embeds: [embed] });
    },

    async showMeta(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('📊 TWW Season 3 - Meta Overview')
            .setDescription('Resumo do meta atual baseado nos dados do Archon.gg')
            .setColor(0xF39C12)
            .setTimestamp();

        // Top 3 Mythic+
        const topM = TWW_TIER_MYTHIC_PLUS.S.slice(0, 3);
        let mpList = '';
        topM.forEach((spec, index) => {
            const [className, specName] = spec.spec.split('_');
            const emoji = this.getClassEmoji(className);
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
            mpList += `${medal} ${emoji} ${this.capitalizeWords(className)} ${this.capitalizeWords(specName)} (${spec.score})\n`;
        });

        // Top 3 Raid
        const topR = TWW_TIER_RAID.S.slice(0, 3);
        let raidList = '';
        topR.forEach((spec, index) => {
            const [className, specName] = spec.spec.split('_');
            const emoji = this.getClassEmoji(className);
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
            raidList += `${medal} ${emoji} ${this.capitalizeWords(className)} ${this.capitalizeWords(specName)} (${spec.dps}K)\n`;
        });

        embed.addFields(
            { name: '🏰 **Top 3 Mythic+**', value: mpList.trim(), inline: true },
            { name: '🐲 **Top 3 Mythic Raid**', value: raidList.trim(), inline: true },
            { name: '\u200b', value: '\u200b', inline: true }, // Spacer
            { name: '📈 **Observações Season 3**', value: '• Death Knight Frost domina ambos os conteúdos\n• Mage Arcane muito forte em M+ e Raid\n• Demon Hunter Havoc excelente em M+\n• Hunter Beast Mastery consistente em Raid', inline: false },
            { name: '🔗 **Comandos Úteis**', value: '`/tww tier mythic_plus` - Tier list completo M+\n`/tww tier raid` - Tier list completo Raid\n`/simulate compare` - Compare specs do seu personagem', inline: false }
        );

        await interaction.reply({ embeds: [embed] });
    },

    getClassEmoji(className) {
        const emojis = {
            'death': '⚔️', 'knight': '⚔️', 'death_knight': '⚔️',
            'demon': '😈', 'hunter': '😈', 'demon_hunter': '😈',
            'druid': '🌿',
            'evoker': '🐲',
            'mage': '🔮',
            'monk': '👊',
            'paladin': '✨',
            'priest': '💡',
            'rogue': '🗡️',
            'shaman': '⚡',
            'warlock': '🔥',
            'warrior': '🛡️'
        };
        return emojis[className] || '⚔️';
    },

    capitalizeWords(str) {
        return str.replace(/_/g, ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    },

    getRoleEmoji(role) {
        switch (role) {
            case 'tank': return '🛡️';
            case 'healer': return '💚';
            case 'dps': return '⚔️';
            case 'support': return '🌟';
            default: return '❓';
        }
    }
};