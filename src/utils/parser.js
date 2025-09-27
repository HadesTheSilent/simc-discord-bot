const fs = require('fs').promises;
const cheerio = require('cheerio');
const { TWW_SPECS, DPS_ESTIMATES } = require('./tww-data');

/**
 * Mapeamento de nomes de classe do SimulationCraft para TWW_SPECS
 */
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

/**
 * Emojis das classes do WoW
 */
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

class ResultParser {
    /**
     * Parse completo dos resultados do SimulationCraft
     * @param {Object} results - Resultados brutos do SimC
     * @returns {Object} Resultados parseados e formatados
     */
    async parseResults(results) {
        const parsed = {
            simulationId: results.simulationId,
            timestamp: results.timestamp,
            fromCache: results.fromCache || false
        };

        // Se temos arquivo HTML, fazer parse dele (mais detalhado)
        if (results.htmlPath) {
            try {
                const htmlContent = await fs.readFile(results.htmlPath, 'utf8');
                console.log('🔍 Fazendo parse do arquivo HTML...');
                Object.assign(parsed, await this.parseHtmlResults(htmlContent));
                // Também fazer parse do HTML como texto para capturar gear_ilvl
                Object.assign(parsed, this.parseTextResults(htmlContent));
            } catch (error) {
                console.log('Erro ao ler arquivo HTML, tentando texto...');
            }
        }

        // Parse do arquivo de texto como fallback ou complemento
        if (results.textPath) {
            try {
                const textContent = await fs.readFile(results.textPath, 'utf8');
                Object.assign(parsed, this.parseTextResults(textContent));
            } catch (error) {
                console.log('Erro ao ler arquivo de texto');
            }
        }

        // Se temos rawOutput, também fazer parse dele
        if (results.rawOutput) {
            console.log('🔍 Fazendo parse do rawOutput...');
            Object.assign(parsed, this.parseTextResults(results.rawOutput));
        }

        // Usar dados já parseados se disponíveis
        if (results.dps) parsed.dps = results.dps;
        if (results.characterName) parsed.characterName = results.characterName;
        if (results.level) parsed.level = results.level;
        if (results.itemLevel) parsed.itemLevel = results.itemLevel;
        if (results.race) parsed.race = results.race;
        if (results.playerClass) parsed.playerClass = results.playerClass;
        if (results.spec) parsed.spec = results.spec;

        return parsed;
    }

    /**
     * Parse do arquivo HTML do SimulationCraft (mais detalhado)
     * @param {string} htmlContent - Conteúdo HTML
     * @returns {Object} Dados parseados
     */
    async parseHtmlResults(htmlContent) {
        const $ = cheerio.load(htmlContent);
        const parsed = {};

        try {
            // Tentar extrair informações básicas do HTML
            // Nota: O HTML do SimC tem uma estrutura específica que pode variar

            // DPS principal (geralmente na primeira tabela)
            const dpsText = $('td:contains("DPS")').next().text();
            if (dpsText) {
                parsed.dps = this.parseNumber(dpsText);
            }

            // Nome do personagem (geralmente no título ou primeira seção)
            const titleText = $('title').text() || $('h1').first().text();
            const nameMatch = titleText.match(/([A-Za-z]+)/);
            if (nameMatch) {
                parsed.characterName = nameMatch[1];
            }

            // Outras estatísticas importantes
            const hpsText = $('td:contains("HPS")').next().text();
            if (hpsText) {
                parsed.hps = this.parseNumber(hpsText);
            }

            const dtpsText = $('td:contains("DTPS")').next().text();
            if (dtpsText) {
                parsed.dtps = this.parseNumber(dtpsText);
            }

            // Informações de gear
            const itemLevelText = $('td:contains("Item Level")').next().text();
            if (itemLevelText) {
                parsed.itemLevel = this.parseNumber(itemLevelText);
            }

        } catch (error) {
            console.error('Erro ao fazer parse do HTML:', error);
        }

        return parsed;
    }

    /**
     * Parse do arquivo de texto do SimulationCraft
     * @param {string} textContent - Conteúdo do arquivo de texto
     * @returns {Object} Dados parseados
     */
    parseTextResults(textContent) {
        const parsed = {};

        try {
            // Parse da linha de cabeçalho do personagem
            // Formato: Nome Level Raça Classe Spec
            const headerMatch = textContent.match(/^([A-Za-z\u00C0-\u00FF]+)\s+(\d+)\s+([A-Za-z_]+)\s+([A-Za-z_]+)\s+([A-Za-z_]+)/m);
            if (headerMatch) {
                parsed.characterName = headerMatch[1];
                parsed.level = parseInt(headerMatch[2]);
                parsed.race = headerMatch[3];
                parsed.class = headerMatch[4];
                parsed.spec = headerMatch[5];
            }

            // DPS - formato mais abrangente
            const dpsMatch = textContent.match(/(?:DPS|Damage Per Second)[:\s]+([\d,\.]+)/i);
            if (dpsMatch) {
                parsed.dps = this.parseNumber(dpsMatch[1]);
            }

            // HPS (Healing Per Second)
            const hpsMatch = textContent.match(/(?:HPS|Healing Per Second)[:\s]+([\d,\.]+)/i);
            if (hpsMatch) {
                parsed.hps = this.parseNumber(hpsMatch[1]);
            }

            // DTPS (Damage Taken Per Second)
            const dtpsMatch = textContent.match(/(?:DTPS|Damage Taken Per Second)[:\s]+([\d,\.]+)/i);
            if (dtpsMatch) {
                parsed.dtps = this.parseNumber(dtpsMatch[1]);
            }

            // TMI (Tank Mitigation Index)
            const tmiMatch = textContent.match(/TMI[:\s]+([\d,\.]+)/i);
            if (tmiMatch) {
                parsed.tmi = this.parseNumber(tmiMatch[1]);
            }

            // Item Level - busca otimizada focando na seção Gear Summary
            let ilevelMatch = null;
            
            // Primeira tentativa: procurar na seção "Gear Summary" (mais eficiente)
            const gearSummaryMatch = textContent.match(/# Gear Summary[\s\S]{0,500}?# gear_ilvl=([\d\.]+)/i);
            if (gearSummaryMatch) {
                ilevelMatch = [null, gearSummaryMatch[1]];
            }
            
            if (!ilevelMatch) {
                // Segunda tentativa: busca direta por gear_ilvl (limitada a primeiros 10000 chars)
                const limitedContent = textContent.substring(0, 10000);
                ilevelMatch = limitedContent.match(/gear_ilvl[=:\s]+([\d\.]+)/i);
            }
            
            if (!ilevelMatch) {
                // Terceira tentativa: busca com comentário HTML (limitada)
                const limitedContent = textContent.substring(0, 15000);
                ilevelMatch = limitedContent.match(/#\s*gear_ilvl[=:\s]+([\d\.]+)/i);
            }
            if (ilevelMatch) {
                parsed.itemLevel = this.parseNumber(ilevelMatch[1]);
                console.log(`🎯 Item Level extraído: ${parsed.itemLevel}`);
            } else {
                console.log('⚠️ Item Level não encontrado no output');
            }

            // Fight Length
            const fightLengthMatch = textContent.match(/Fight Length[:\s]+([\d\.]+)/i);
            if (fightLengthMatch) {
                parsed.fightLength = this.parseNumber(fightLengthMatch[1]);
            }

            // Vary Combat Length
            const varyLengthMatch = textContent.match(/Vary Combat Length[:\s]+([\d\.]+)%/i);
            if (varyLengthMatch) {
                parsed.varyCombatLength = parseFloat(varyLengthMatch[1]);
            }

            // Iterations - múltiplas formas de capturar
            let iterationsMatch = textContent.match(/Iterations[:\s]+=?\s*(\d+)/i);
            if (!iterationsMatch) {
                // Capturar da linha de simulação: "iterations=2032"
                iterationsMatch = textContent.match(/iterations[=:\s]+(\d+)/i);
            }
            if (iterationsMatch) {
                parsed.iterations = parseInt(iterationsMatch[1]);
                console.log(`🎯 Iterations extraído: ${parsed.iterations}`);
            } else {
                console.log('⚠️ Iterations não encontrado');
            }

            // Target Error
            const targetErrorMatch = textContent.match(/Target Error[:\s]+([\d\.]+)%/i);
            if (targetErrorMatch) {
                parsed.targetError = parseFloat(targetErrorMatch[1]);
            }

            // Confidence Interval
            const confidenceMatch = textContent.match(/Confidence interval[:\s]+([\d\.]+)%/i);
            if (confidenceMatch) {
                parsed.confidence = parseFloat(confidenceMatch[1]);
            }

            // Error (DPS standard deviation)
            const errorMatch = textContent.match(/Error[:\s]+([\d\.]+)%/i);
            if (errorMatch) {
                parsed.error = parseFloat(errorMatch[1]);
            }

            // Fight Style - múltiplas formas de capturar
            let fightStyleMatch = textContent.match(/<b>Fight Style:<\/b>\s+([A-Za-z]+)/i);
            if (!fightStyleMatch) {
                // Formato alternativo: "Fight Style: Patchwerk"
                fightStyleMatch = textContent.match(/Fight Style[:\s]+([A-Za-z]+)/i);
            }
            if (!fightStyleMatch) {
                // Capturar da linha de simulação: "fight_style=Patchwerk"
                fightStyleMatch = textContent.match(/fight_style[=:\s]+([A-Za-z]+)/i);
            }
            if (fightStyleMatch) {
                parsed.fightStyle = fightStyleMatch[1];
                console.log(`🎯 Fight Style extraído: ${parsed.fightStyle}`);
            } else {
                console.log('⚠️ Fight Style não encontrado');
            }

            // Total Damage
            const totalDamageMatch = textContent.match(/Total Damage[:\s]+([\d,\.]+)([kMGT]?)/i);
            if (totalDamageMatch) {
                parsed.totalDamage = this.parseNumber(totalDamageMatch[1] + (totalDamageMatch[2] || ''));
            }

            // Extrair seção de habilidades
            const actionListMatch = textContent.match(/Action Priority List[\s\S]*?(?=\n\n|Statistics|Gear|$)/i);
            if (actionListMatch) {
                parsed.actionPriorityList = this.parseActionList(actionListMatch[0]);
            }

            // Extrair estatísticas de combate
            const combatStatsMatch = textContent.match(/Combat Statistics[\s\S]*?(?=\n\n|Action|Gear|$)/i);
            if (combatStatsMatch) {
                parsed.combatStats = this.parseCombatStats(combatStatsMatch[0]);
            }

            // Scale factors (se calculados)
            const scaleFactorsMatch = textContent.match(/Scale Factors[\s\S]*?(?=\n\n|$)/i);
            if (scaleFactorsMatch) {
                parsed.scaleFactors = this.parseScaleFactors(scaleFactorsMatch[0]);
            }

        } catch (error) {
            console.error('Erro ao fazer parse do texto:', error);
        }

        return parsed;
    }

    /**
     * Parse da Action Priority List
     * @param {string} aplText - Texto da seção APL
     * @returns {Array} Lista de ações
     */
    parseActionList(aplText) {
        const actions = [];
        const lines = aplText.split('\n');

        for (const line of lines) {
            // Procurar por linhas de ação
            const actionMatch = line.match(/^\s*([A-Za-z_\s]+)\s+([\d,\.]+)\s+([\d\.]+)%/);
            if (actionMatch) {
                actions.push({
                    name: actionMatch[1].trim(),
                    count: this.parseNumber(actionMatch[2]),
                    percentage: parseFloat(actionMatch[3])
                });
            }
        }

        return actions.slice(0, 8); // Top 8 ações
    }

    /**
     * Parse das estatísticas de combate
     * @param {string} statsText - Texto das estatísticas
     * @returns {Object} Estatísticas parseadas
     */
    parseCombatStats(statsText) {
        const stats = {};
        
        // Parse de estatísticas específicas
        const patterns = {
            hitChance: /Hit Chance[:\s]+([\d\.]+)%/i,
            critChance: /Crit Chance[:\s]+([\d\.]+)%/i,
            hasteRating: /Haste Rating[:\s]+([\d,\.]+)/i,
            masteryRating: /Mastery Rating[:\s]+([\d,\.]+)/i,
            versatilityRating: /Versatility Rating[:\s]+([\d,\.]+)/i,
            critRating: /Critical Strike Rating[:\s]+([\d,\.]+)/i
        };

        for (const [key, pattern] of Object.entries(patterns)) {
            const match = statsText.match(pattern);
            if (match) {
                stats[key] = this.parseNumber(match[1]);
            }
        }

        return stats;
    }

    /**
     * Parse dos Scale Factors
     * @param {string} scaleText - Texto dos scale factors
     * @returns {Object} Scale factors parseados
     */
    parseScaleFactors(scaleText) {
        const scales = {};
        const lines = scaleText.split('\n');

        for (const line of lines) {
            // Procurar por linhas de scale factor
            const scaleMatch = line.match(/^\s*([A-Za-z\s]+)[:\s]+([\d\.]+)/);
            if (scaleMatch) {
                const statName = scaleMatch[1].trim().toLowerCase();
                scales[statName] = parseFloat(scaleMatch[2]);
            }
        }

        return scales;
    }

    /**
     * Parse das habilidades principais (compatibilidade)
     * @param {string} abilitiesText - Texto da seção de habilidades
     * @returns {Array} Lista de habilidades
     */
    parseAbilities(abilitiesText) {
        return this.parseActionList(abilitiesText);
    }

    /**
     * Formatar resultados para exibição no Discord
     * @param {Object} results - Resultados parseados
     * @returns {Object} Embed formatado para Discord
     */
    formatForDiscord(results) {
        // Determinar cor baseada na classe/spec primeiro, depois DPS como fallback
        let embedColor = results.fromCache ? 0xFFA500 : 0x2ECC71;
        
        // Usar cor baseada na classe/especialização se disponível (prioridade)
        if (results.playerClass && results.spec) {
            const mappedClassName = CLASS_NAME_MAPPING[results.playerClass.toLowerCase()] || results.playerClass.toLowerCase();
            const classData = TWW_SPECS[mappedClassName];
            if (classData) {
                const specData = classData[results.spec.toLowerCase()];
                if (specData) {
                    embedColor = specData.color;
                }
            }
        } else if (results.dps) {
            embedColor = this.getDPSColor(results.dps);
        }

        // Obter emoji da classe
        const mappedClassName = CLASS_NAME_MAPPING[results.playerClass?.toLowerCase()] || results.playerClass?.toLowerCase();
        const classEmoji = CLASS_EMOJIS[mappedClassName] || '⚔️';
        
        // Não usar thumbnail para manter design limpo
        let thumbnailUrl = null;

        const embed = {
            title: `${classEmoji} ${results.characterName || 'Personagem'}`,
            description: results.playerClass && results.spec ? 
                `${this.capitalizeWords(results.playerClass)} • ${this.capitalizeWords(results.spec)}` : null,
            color: embedColor,
            timestamp: results.timestamp,
            thumbnail: thumbnailUrl ? { url: thumbnailUrl } : undefined,
            footer: {
                text: results.fromCache ? '📦 Cache • ' : '✨ Nova simulação • '
            },
            fields: []
        };

        // Adicionar footer com ID da simulação
        if (results.simulationId) {
            embed.footer.text += `ID: ${results.simulationId.substring(0, 8)}`;
        }

        // Informações do personagem
        if (results.level || results.race) {
            let charInfo = '';
            if (results.level) charInfo += `**Nível:** ${results.level}\n`;
            if (results.race) charInfo += `**Raça:** ${this.capitalizeWords(results.race)}`;
            
            if (charInfo.trim()) {
                embed.fields.push({
                    name: '👤 Personagem',
                    value: charInfo.trim(),
                    inline: true
                });
            }
        }

        // Equipamento e configuração
        if (results.itemLevel || results.fightStyle) {
            let configInfo = '';
            if (results.itemLevel) {
                configInfo += `**Item Level:** ${Math.round(results.itemLevel)}\n`;
                
                const tierInfo = this.getTierFromItemLevel(results.itemLevel);
                if (tierInfo) {
                    configInfo += `**Tier:** ${tierInfo}\n`;
                }
            }
            if (results.fightStyle) {
                configInfo += `**Luta:** ${this.capitalizeWords(results.fightStyle)}`;
            }

            if (configInfo.trim()) {
                embed.fields.push({
                    name: '⚙️ Configuração',
                    value: configInfo.trim(),
                    inline: true
                });
            }
        }

        // Adicionar espaço se necessário para alinhamento
        if (embed.fields.length % 2 === 1) {
            embed.fields.push({
                name: '\u200b',
                value: '\u200b',
                inline: true
            });
        }

        // DPS principal - seção destacada
        if (results.dps) {
            const dpsFormatted = results.dpsFormatted || this.formatNumber(results.dps);
            let dpsInfo = `**${dpsFormatted} DPS**\n`;
            
            // Performance tier sem ranking específico
            const performanceTier = this.getPerformanceTier(results.dps);
            if (performanceTier) {
                dpsInfo += `${performanceTier}\n\n`;
            }
            
            // Contexto visual do DPS
            const dpsBar = this.getDPSBar(results.dps);
            if (dpsBar) {
                dpsInfo += dpsBar;
            }

            embed.fields.push({
                name: '⚔️ Damage Per Second',
                value: dpsInfo.trim(),
                inline: false
            });
        }

        // Outros resultados (excluindo iterations que vai para seção de simulação)
        let otherResults = '';
        if (results.hps) {
            otherResults += `**HPS:** ${this.formatNumber(results.hps)}\n`;
        }
        if (results.dtps) {
            otherResults += `**DTPS:** ${this.formatNumber(results.dtps)}\n`;
        }
        if (results.tmi) {
            otherResults += `**TMI:** ${this.formatNumber(results.tmi)}\n`;
        }

        if (otherResults) {
            embed.fields.push({
                name: '📊 Outros Resultados',
                value: otherResults.trim(),
                inline: false
            });
        }

        // Informações da simulação
        let simInfo = '';
        if (results.iterations) simInfo += `**Iterações:** ${results.iterations.toLocaleString('pt-BR')}\n`;
        if (results.fightStyle) simInfo += `**Estilo de Luta:** ${this.capitalizeWords(results.fightStyle)}\n`;
        if (results.fightLength) simInfo += `**Duração:** ${results.fightLength}s\n`;
        if (results.varyCombatLength) simInfo += `**Variação:** ±${results.varyCombatLength}%\n`;
        if (results.error) simInfo += `**Erro:** ±${results.error}%\n`;
        if (results.confidence) simInfo += `**Confiança:** ${results.confidence}%`;

        if (simInfo) {
            embed.fields.push({
                name: '⚙️ Detalhes da Simulação',
                value: simInfo.trim(),
                inline: true
            });
        }

        // Scale Factors (se disponíveis)
        if (results.scaleFactors && Object.keys(results.scaleFactors).length > 0) {
            const scaleText = Object.entries(results.scaleFactors)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([stat, value]) => `**${this.capitalizeWords(stat)}:** ${value.toFixed(2)}`)
                .join('\n');

            embed.fields.push({
                name: '⚖️ Pesos das Stats',
                value: scaleText,
                inline: true
            });
        }

        // Top Ações/Habilidades
        if (results.actionPriorityList && results.actionPriorityList.length > 0) {
            const actionsText = results.actionPriorityList
                .slice(0, 5)
                .map(action => `**${action.name}:** ${action.percentage.toFixed(1)}%`)
                .join('\n');

            embed.fields.push({
                name: '🎯 Top Ações',
                value: actionsText,
                inline: false
            });
        }

        return { embeds: [embed] };
    }

    /**
     * Obter tier de performance baseado no DPS
     * @param {number} dps - Valor do DPS
     * @returns {string} Tier de performance
     */
    getPerformanceTier(dps) {
        if (!dps) return null;
        
        if (dps >= 5000000) return '🌟 **Excepcional** • Performance extraordinária';
        if (dps >= 4000000) return '⭐ **Excelente** • Performance muito alta';
        if (dps >= 3000000) return '🔥 **Muito Bom** • Performance sólida';
        if (dps >= 2000000) return '✨ **Bom** • Performance satisfatória';
        if (dps >= 1000000) return '📈 **Regular** • Performance mediana';
        return '📊 **Iniciante** • Há espaço para melhorias';
    }

    /**
     * Gerar barra visual de DPS
     * @param {number} dps - Valor do DPS
     * @returns {string} Barra visual
     */
    getDPSBar(dps) {
        if (!dps) return '';
        
        const maxDPS = 6000000; // DPS máximo para a barra
        const percentage = Math.min(100, (dps / maxDPS) * 100);
        const filledBars = Math.round(percentage / 10);
        const emptyBars = 10 - filledBars;
        
        const filled = '█'.repeat(filledBars);
        const empty = '░'.repeat(emptyBars);
        
        return `\`${filled}${empty}\` ${Math.round(percentage)}%`;
    }

    /**
     * Capitalizar palavras
     */
    capitalizeWords(str) {
        return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Obter tier baseado no item level
     */
    getTierFromItemLevel(ilvl) {
        const level = Math.round(ilvl);
        if (level >= 649) return 'Mythic TWW1';
        if (level >= 636) return 'Heroic TWW1';
        if (level >= 623) return 'Normal TWW1';
        if (level >= 610) return 'LFR TWW1';
        if (level >= 593) return 'Pre-Raid';
        return null;
    }

    /**
     * Obter rank aproximado do DPS
     */
    getDPSRank(dps, ilvl) {
        if (!ilvl || !dps) return null;
        
        const level = Math.round(ilvl);
        const estimates = DPS_ESTIMATES[level];
        if (!estimates) return null;

        if (dps >= estimates.high) return '🥇 Top Tier';
        if (dps >= estimates.average) return '🥈 Good';
        if (dps >= estimates.low) return '🥉 Average';
        return '📊 Below Average';
    }

    /**
     * Parse um número removendo vírgulas e convertendo para float
     * @param {string} numberStr - String do número
     * @returns {number} Número parseado
     */
    parseNumber(numberStr) {
        if (!numberStr) return 0;
        return parseFloat(numberStr.toString().replace(/,/g, ''));
    }

    /**
     * Formatar número para exibição (com separadores de milhares)
     * @param {number} number - Número para formatar
     * @returns {string} Número formatado
     */
    formatNumber(number) {
        if (!number) return '0';
        return Math.round(number).toLocaleString('pt-BR');
    }

    /**
     * Determina cor do embed baseada no DPS
     * @param {number} dps - Valor do DPS
     * @returns {number} Cor em hexadecimal
     */
    getDPSColor(dps) {
        if (!dps) return 0x95A5A6; // Cinza
        if (dps >= 200000) return 0xE74C3C; // Vermelho (Excelente)
        if (dps >= 150000) return 0xF39C12; // Laranja (Muito Bom)
        if (dps >= 100000) return 0xF1C40F; // Amarelo (Bom)
        if (dps >= 50000) return 0x2ECC71; // Verde (Mediano)
        return 0x3498DB; // Azul (Baixo)
    }

    /**
     * Determina rank baseado no DPS e item level
     * @param {number} dps - Valor do DPS
     * @param {number} itemLevel - Item level do personagem
     * @returns {string} Rank aproximado
     */
    getDPSRank(dps, itemLevel) {
        if (!dps) return null;
        
        // Ajustar expectations baseado no item level
        let multiplier = 1;
        if (itemLevel >= 460) multiplier = 1.2; // Mythic raid gear
        else if (itemLevel >= 447) multiplier = 1.1; // Heroic raid gear
        else if (itemLevel >= 434) multiplier = 1.0; // Normal raid gear
        else if (itemLevel >= 421) multiplier = 0.9; // LFR/M+ gear
        else multiplier = 0.8; // Leveling/low gear
        
        const adjustedDPS = dps / multiplier;
        
        if (adjustedDPS >= 180000) return '🏆 **S-Tier** (Top 1%)';
        if (adjustedDPS >= 150000) return '🥇 **A-Tier** (Top 5%)';
        if (adjustedDPS >= 120000) return '🥈 **B-Tier** (Top 15%)';
        if (adjustedDPS >= 90000) return '🥉 **C-Tier** (Top 35%)';
        if (adjustedDPS >= 60000) return '📊 **D-Tier** (Average)';
        return '📉 **Below Average**';
    }
}

module.exports = new ResultParser();