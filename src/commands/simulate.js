const { SlashCommandBuilder } = require('discord.js');
const simcManager = require('../utils/simc-manager');
const cacheManager = require('../utils/cache');
const resultParser = require('../utils/parser');
const { TWW_SPECS, FIGHT_STYLES, GEAR_LEVELS, DPS_ESTIMATES } = require('../utils/tww-data');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('simulate')
        .setDescription('Executa simulações do SimulationCraft')
        .addSubcommand(subcommand =>
            subcommand
                .setName('character')
                .setDescription('Simula um personagem específico')
                .addStringOption(option =>
                    option.setName('armory')
                        .setDescription('URL do armory do personagem')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('spec')
                        .setDescription('Especialização específica (opcional - ex: frost, fire, arcane)')
                        .setRequired(false))
                .addIntegerOption(option =>
                    option.setName('iterations')
                        .setDescription('Número de iterações (padrão: 1000)')
                        .setRequired(false)
                        .setMinValue(100)
                        .setMaxValue(10000))
                .addStringOption(option =>
                    option.setName('fight_style')
                        .setDescription('Estilo de luta (padrão: patchwerk)')
                        .setRequired(false)
                        .addChoices(
                            { name: '🎯 Patchwerk - DPS Puro', value: 'patchwerk' },
                            { name: '🚶 Light Movement - Movimento Leve', value: 'lightmovement' },
                            { name: '🏃 Heavy Movement - Movimento Pesado', value: 'heavymovement' },
                            { name: '🌪️ Helter Skelter - Movimento Caótico', value: 'helterskelter' },
                            { name: '🐉 Ultraxion - Burst Windows', value: 'ultraxion' }
                        ))
                .addBooleanOption(option =>
                    option.setName('use_cache')
                        .setDescription('Usar cache se disponível (padrão: true)')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('compare')
                .setDescription('Compara diferentes specs ou builds')
                .addStringOption(option =>
                    option.setName('armory')
                        .setDescription('URL base do armory do personagem')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('specs')
                        .setDescription('Specs para comparar (separadas por vírgula)')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('iterations')
                        .setDescription('Número de iterações (padrão: 1000)')
                        .setRequired(false)
                        .setMinValue(100)
                        .setMaxValue(5000)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('gear')
                .setDescription('Análise de gear e stat weights')
                .addStringOption(option =>
                    option.setName('armory')
                        .setDescription('URL do armory do personagem')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('analysis_type')
                        .setDescription('Tipo de análise')
                        .setRequired(true)
                        .addChoices(
                            { name: '⚖️ Stat Weights - Pesos das Stats', value: 'stat_weights' },
                            { name: '🎽 Gear Compare - Comparar Equipamentos', value: 'gear_compare' },
                            { name: '✨ Enchant Compare - Comparar Encantamentos', value: 'enchant_compare' },
                            { name: '💎 Gem Compare - Comparar Gemas', value: 'gem_compare' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('queue')
                .setDescription('Mostra o status da fila de simulações'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('cache')
                .setDescription('Gerencia o cache de simulações')
                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('Ação a executar')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Status', value: 'status' },
                            { name: 'Clear', value: 'clear' },
                            { name: 'List', value: 'list' }
                        ))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        try {
            switch (subcommand) {
                case 'character':
                    await this.handleCharacterSimulation(interaction);
                    break;
                case 'compare':
                    await this.handleCompareSimulation(interaction);
                    break;
                case 'gear':
                    await this.handleGearAnalysis(interaction);
                    break;
                case 'queue':
                    await this.handleQueueStatus(interaction);
                    break;
                case 'cache':
                    await this.handleCacheManagement(interaction);
                    break;
                default:
                    await interaction.reply({ content: 'Subcomando não reconhecido!', ephemeral: true });
            }
        } catch (error) {
            console.error(`Erro no comando simulate:`, error);
            
            const errorMessage = 'Ocorreu um erro ao processar sua solicitação.';
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    },

    async handleCharacterSimulation(interaction) {
        const armoryUrl = interaction.options.getString('armory');
        const spec = interaction.options.getString('spec');
        const iterations = interaction.options.getInteger('iterations') || 1000;
        const fightStyle = interaction.options.getString('fight_style') || 'patchwerk';
        const useCache = interaction.options.getBoolean('use_cache') ?? true;

        // Validar URL do armory
        if (!simcManager.validateArmoryUrl(armoryUrl)) {
            await interaction.reply({
                content: '❌ URL do armory inválida! Use uma URL do Battle.net ou WorldofWarcraft.com.',
                ephemeral: true
            });
            return;
        }

        const options = {
            armoryUrl,
            spec,
            iterations,
            fightStyle
        };

        // Verificar cache primeiro
        if (useCache) {
            const cached = cacheManager.get(options);
            if (cached) {
                const parsed = await resultParser.parseResults(cached);
                const formatted = resultParser.formatForDiscord(parsed);
                await interaction.reply(formatted);
                return;
            }
        }

        // Resposta inicial (a simulação pode demorar)
        await interaction.deferReply();

        try {
            // Mostrar posição na fila se necessário
            const queueStatus = simcManager.getQueueStatus();
            if (queueStatus.queuedSimulations > 0) {
                await interaction.editReply({
                    content: `⏳ Simulação adicionada à fila. Posição: ${queueStatus.queuedSimulations + 1}\n` +
                           `🔄 Simulações rodando: ${queueStatus.currentSimulations}/${queueStatus.maxConcurrent}`
                });
            } else {
                await interaction.editReply({
                    content: '🎯 Iniciando simulação... Isso pode levar alguns minutos.'
                });
            }

            // Executar simulação
            const results = await simcManager.runSimulation(options);
            
            // Parse e formatação dos resultados
            const parsed = await resultParser.parseResults(results);
            const formatted = resultParser.formatForDiscord(parsed);

            // Armazenar no cache
            if (useCache) {
                cacheManager.set(options, results);
            }

            // Enviar resultado final
            await interaction.editReply(formatted);

        } catch (error) {
            console.error('Erro na simulação:', error);
            await interaction.editReply({
                content: `❌ Erro na simulação: ${error.message}`
            });
        }
    },

    async handleCompareSimulation(interaction) {
        const armoryUrl = interaction.options.getString('armory');
        const specsStr = interaction.options.getString('specs');
        const iterations = interaction.options.getInteger('iterations') || 1000;

        // Validar URL
        if (!simcManager.validateArmoryUrl(armoryUrl)) {
            await interaction.reply({
                content: '❌ URL do armory inválida!',
                ephemeral: true
            });
            return;
        }

        // Parse das specs
        const specs = specsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
        if (specs.length < 2) {
            await interaction.reply({
                content: '❌ Você precisa especificar pelo menos 2 specs para comparar!',
                ephemeral: true
            });
            return;
        }

        if (specs.length > 4) {
            await interaction.reply({
                content: '❌ Máximo de 4 specs por comparação!',
                ephemeral: true
            });
            return;
        }

        await interaction.deferReply();

        try {
            await interaction.editReply({
                content: `🔄 Executando ${specs.length} simulações para comparação...`
            });

            const results = [];
            for (let i = 0; i < specs.length; i++) {
                const spec = specs[i];
                const options = {
                    armoryUrl,
                    spec,
                    iterations,
                    fightStyle: 'patchwerk'
                };

                // Verificar cache
                let result = cacheManager.get(options);
                if (!result) {
                    result = await simcManager.runSimulation(options);
                    cacheManager.set(options, result);
                }

                const parsed = await resultParser.parseResults(result);
                parsed.specName = spec;
                results.push(parsed);

                // Atualizar progresso
                await interaction.editReply({
                    content: `🔄 Progresso: ${i + 1}/${specs.length} simulações concluídas...`
                });
            }

            // Formatar comparação
            const comparison = this.formatComparison(results);
            await interaction.editReply(comparison);

        } catch (error) {
            console.error('Erro na comparação:', error);
            await interaction.editReply({
                content: `❌ Erro na comparação: ${error.message}`
            });
        }
    },

    async handleGearAnalysis(interaction) {
        const armoryUrl = interaction.options.getString('armory');
        const analysisType = interaction.options.getString('analysis_type');

        if (!simcManager.validateArmoryUrl(armoryUrl)) {
            await interaction.reply({
                content: '❌ URL do armory inválida!',
                ephemeral: true
            });
            return;
        }

        await interaction.deferReply();

        try {
            let extraOptions = [];
            
            switch (analysisType) {
                case 'stat_weights':
                    extraOptions = [
                        'calculate_scale_factors=1',
                        'scale_only=str,agi,int,crit,haste,mastery,vers'
                    ];
                    break;
                case 'gear_compare':
                    extraOptions = [
                        'gear_comparison=1'
                    ];
                    break;
                case 'enchant_compare':
                    extraOptions = [
                        'enchant_comparison=1'
                    ];
                    break;
            }

            const options = {
                armoryUrl,
                iterations: 1000,
                fightStyle: 'patchwerk',
                extraOptions
            };

            await interaction.editReply({
                content: '🎯 Executando análise de gear... Isso pode levar mais tempo que uma simulação normal.'
            });

            const results = await simcManager.runSimulation(options);
            const parsed = await resultParser.parseResults(results);
            const formatted = resultParser.formatForDiscord(parsed);

            // Adicionar informação sobre o tipo de análise
            formatted.embeds[0].title += ` - ${analysisType.replace('_', ' ').toUpperCase()}`;
            
            await interaction.editReply(formatted);

        } catch (error) {
            console.error('Erro na análise de gear:', error);
            await interaction.editReply({
                content: `❌ Erro na análise: ${error.message}`
            });
        }
    },

    async handleQueueStatus(interaction) {
        const status = simcManager.getQueueStatus();
        const cacheStats = cacheManager.getStats();

        const embed = {
            title: '📊 Status do Sistema',
            color: 0x0099FF,
            fields: [
                {
                    name: '🔄 Simulações',
                    value: `Rodando: ${status.currentSimulations}/${status.maxConcurrent}\n` +
                           `Na fila: ${status.queuedSimulations}`,
                    inline: true
                },
                {
                    name: '💾 Cache',
                    value: `Itens: ${cacheStats.keys}\n` +
                           `Hit Rate: ${(cacheStats.hitRate * 100).toFixed(1)}%`,
                    inline: true
                }
            ],
            timestamp: new Date()
        };

        await interaction.reply({ embeds: [embed] });
    },

    async handleCacheManagement(interaction) {
        const action = interaction.options.getString('action');

        switch (action) {
            case 'status':
                const stats = cacheManager.getStats();
                const embed = {
                    title: '💾 Status do Cache',
                    color: 0x00FF00,
                    fields: [
                        {
                            name: 'Estatísticas',
                            value: `Itens: ${stats.keys}\n` +
                                   `Hits: ${stats.hits}\n` +
                                   `Misses: ${stats.misses}\n` +
                                   `Hit Rate: ${(stats.hitRate * 100).toFixed(1)}%`,
                            inline: false
                        }
                    ]
                };
                await interaction.reply({ embeds: [embed] });
                break;

            case 'clear':
                const cleared = cacheManager.clear();
                await interaction.reply({
                    content: `🧹 Cache limpo! ${cleared} itens removidos.`,
                    ephemeral: true
                });
                break;

            case 'list':
                const keys = cacheManager.listKeys();
                if (keys.length === 0) {
                    await interaction.reply({
                        content: '📭 Cache vazio.',
                        ephemeral: true
                    });
                    return;
                }

                const listText = keys.slice(0, 10).map(item => 
                    `\`${item.key}\` - ${item.characterName || 'N/A'} (DPS: ${item.dps ? Math.round(item.dps).toLocaleString() : 'N/A'})`
                ).join('\n');

                await interaction.reply({
                    content: `📋 **Cache (${keys.length} itens, mostrando 10):**\n${listText}`,
                    ephemeral: true
                });
                break;
        }
    },

    formatComparison(results) {
        // Ordenar por DPS (maior primeiro)
        results.sort((a, b) => (b.dps || 0) - (a.dps || 0));

        // Usar dados do primeiro resultado para informações do personagem
        const baseResult = results[0] || {};
        
        // Obter emoji e cor da classe usando as funções do parser
        let classEmoji = '⚔️';
        let embedColor = 0x2ECC71;

        if (baseResult.playerClass) {
            // Usar a mesma lógica do parser para obter emoji da classe
            const CLASS_NAME_MAPPING = {
                'deathknight': 'death_knight',
                'demonhunter': 'demon_hunter',
                'paladin': 'paladin',
                'warrior': 'warrior',
                'rogue': 'rogue',
                'mage': 'mage',
                'druid': 'druid',
                'hunter': 'hunter',
                'priest': 'priest',
                'shaman': 'shaman',
                'warlock': 'warlock',
                'monk': 'monk',
                'evoker': 'evoker'
            };

            const CLASS_EMOJIS = {
                'death_knight': '⚔️',
                'demon_hunter': '😈',
                'druid': '🌿',
                'evoker': '🐲',
                'hunter': '🏹',
                'mage': '🔮',
                'monk': '👊',
                'paladin': '✨',
                'priest': '💡',
                'rogue': '🗡️',
                'shaman': '⚡',
                'warlock': '🔥',
                'warrior': '🛡️'
            };

            const mappedClassName = CLASS_NAME_MAPPING[baseResult.playerClass.toLowerCase()] || baseResult.playerClass.toLowerCase();
            classEmoji = CLASS_EMOJIS[mappedClassName] || '⚔️';
            
            // Usar cor baseada no DPS mais alto
            const dps = baseResult.dps || 0;
            if (dps >= 2000000) {
                embedColor = 0xFF6B35; // Laranja para DPS muito alto
            } else if (dps >= 1500000) {
                embedColor = 0xE74C3C; // Vermelho para DPS alto
            } else if (dps >= 1000000) {
                embedColor = 0xF39C12; // Amarelo para DPS médio-alto
            } else if (dps >= 500000) {
                embedColor = 0x2ECC71; // Verde para DPS médio
            } else {
                embedColor = 0x95A5A6; // Cinza para DPS baixo
            }
        }

        // Thumbnail desabilitado - não usar avatar do personagem
        let thumbnailUrl = null;

        const embed = {
            title: `${classEmoji} ${baseResult.characterName || 'Personagem'} - Comparação de Specs`,
            description: baseResult.playerClass ? 
                `${resultParser.capitalizeWords(baseResult.playerClass)} • Comparação de Especializações` : 
                'Comparação de Especializações',
            color: embedColor,
            timestamp: new Date(),
            thumbnail: thumbnailUrl ? { url: thumbnailUrl } : undefined,
            footer: {
                text: '⚔️ Comparação • '
            },
            fields: []
        };

        // Adicionar informações do personagem
        if (baseResult.level || baseResult.race) {
            let charInfo = '';
            if (baseResult.level) charInfo += `**Nível:** ${baseResult.level}\n`;
            if (baseResult.race) charInfo += `**Raça:** ${resultParser.capitalizeWords(baseResult.race)}`;
            
            if (charInfo.trim()) {
                embed.fields.push({
                    name: '👤 Personagem',
                    value: charInfo.trim(),
                    inline: true
                });
            }
        }

        // Configuração
        if (baseResult.itemLevel) {
            let configInfo = `**Item Level:** ${Math.round(baseResult.itemLevel)}\n`;
            
            const tierInfo = resultParser.getTierFromItemLevel(baseResult.itemLevel);
            if (tierInfo) {
                configInfo += `**Tier:** ${tierInfo}\n`;
            }
            configInfo += `**Luta:** Patchwerk`;

            embed.fields.push({
                name: '⚙️ Configuração',
                value: configInfo.trim(),
                inline: true
            });
        }

        // Espaço para alinhamento
        if (embed.fields.length % 2 === 1) {
            embed.fields.push({
                name: '\u200b',
                value: '\u200b',
                inline: true
            });
        }

        // Adicionar resultados de cada spec
        const baseDps = results[0].dps || 1;
        
        results.forEach((result, index) => {
            const dps = result.dps || 0;
            const percentage = baseDps > 0 ? ((dps / baseDps) * 100).toFixed(1) : '0.0';
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📊';
            
            // Capitalizar nome da spec
            const specName = result.specName ? resultParser.capitalizeWords(result.specName) : 'Spec';
            
            let specInfo = `**${resultParser.formatNumber(dps)} DPS**\n`;
            specInfo += `**Relativo:** ${percentage}%`;
            
            embed.fields.push({
                name: `${medal} ${specName}`,
                value: specInfo,
                inline: true
            });
        });

        // Adicionar footer com timestamp
        embed.footer.text += `Hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

        return { embeds: [embed] };
    }
};