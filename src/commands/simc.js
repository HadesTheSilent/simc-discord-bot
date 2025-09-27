const { SlashCommandBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const simcManager = require('../utils/simc-manager');
const parser = require('../utils/parser');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('simc')
        .setDescription('Simula usando uma string do addon SimC in-game')
        .addStringOption(option =>
            option.setName('string')
                .setDescription('Cole aqui a string gerada pelo addon SimC in-game')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const simcString = interaction.options.getString('string');
            
            // Validar se é uma string válida do SimC addon
            if (!simcString.includes('# SimC Addon') && !simcString.includes('rogue=') && !simcString.includes('level=')) {
                return await interaction.editReply({
                    content: '❌ **Erro:** Esta não parece ser uma string válida do addon SimC. Certifique-se de copiar a string completa gerada pelo addon in-game.',
                    ephemeral: true
                });
            }

            // Extrair informações básicas da string
            const characterInfo = parseSimcString(simcString);
            
            if (!characterInfo.name) {
                return await interaction.editReply({
                    content: '❌ **Erro:** Não foi possível extrair o nome do personagem da string.',
                    ephemeral: true
                });
            }

            const simulationId = uuidv4();
            
            await interaction.editReply({
                content: `🎯 **Iniciando simulação para ${characterInfo.name}**\n` +
                        `⚙️ **Classe:** ${characterInfo.class || 'Desconhecida'} (${characterInfo.spec || 'Desconhecida'})\n` +
                        `🔄 **Status:** Processando... (isso pode demorar alguns minutos)`
            });

            // Salvar a string do SimC em um arquivo temporário
            const tempPath = path.join(__dirname, '../../temp', `${simulationId}.simc`);
            await fs.promises.writeFile(tempPath, simcString, 'utf8');

            console.log(`🎯 Iniciando simulação ${simulationId} usando string do addon...`);
            console.log(`📁 Arquivo salvo em: ${tempPath}`);

            // Executar simulação
            const results = await simcManager.runSimulation(tempPath, simulationId);
            
            if (!results || !results.dps) {
                throw new Error('Simulação não retornou resultados válidos');
            }

            // Parse dos resultados
            const parsedResults = await parser.parseResults(results);
            
            // Formatear para Discord
            const embed = parser.formatForDiscord(parsedResults);

            await interaction.editReply(embed);
            
        } catch (error) {
            console.error('Erro na simulação:', error);
            
            let errorMessage = '❌ **Erro na simulação:**\n';
            
            if (error.message.includes('não encontrado')) {
                errorMessage += '🔍 Personagem não encontrado ou perfil inválido.';
            } else if (error.message.includes('timeout')) {
                errorMessage += '⏱️ Simulação demorou muito para completar.';
            } else if (error.message.includes('SimulationCraft')) {
                errorMessage += '⚙️ Erro no SimulationCraft. Verifique se a string está correta.';
            } else {
                errorMessage += `🐛 Erro interno: ${error.message}`;
            }
            
            await interaction.editReply({
                content: errorMessage,
                ephemeral: true
            });
        }
    }
};

/**
 * Parse da string do addon SimC para extrair informações básicas
 * @param {string} simcString - String do addon SimC
 * @returns {Object} Informações do personagem
 */
function parseSimcString(simcString) {
    const info = {};
    
    try {
        // Extrair nome do personagem
        const nameMatch = simcString.match(/^(\w+)="([^"]+)"/m);
        if (nameMatch) {
            info.class = nameMatch[1];
            info.name = nameMatch[2];
        }
        
        // Extrair level
        const levelMatch = simcString.match(/^level=(\d+)/m);
        if (levelMatch) {
            info.level = parseInt(levelMatch[1]);
        }
        
        // Extrair race
        const raceMatch = simcString.match(/^race=(\w+)/m);
        if (raceMatch) {
            info.race = raceMatch[1];
        }
        
        // Extrair região e servidor
        const regionMatch = simcString.match(/^region=(\w+)/m);
        if (regionMatch) {
            info.region = regionMatch[1];
        }
        
        const serverMatch = simcString.match(/^server=(\w+)/m);
        if (serverMatch) {
            info.server = serverMatch[1];
        }
        
        // Extrair spec
        const specMatch = simcString.match(/^spec=(\w+)/m);
        if (specMatch) {
            info.spec = specMatch[1];
        }
        
        // Extrair informações do cabeçalho se disponível
        const headerMatch = simcString.match(/^# ([^-]+) - ([^-]+) - ([^-]+) - (.+)/m);
        if (headerMatch) {
            info.name = info.name || headerMatch[1].trim();
            info.spec = info.spec || headerMatch[2].trim();
            info.server = info.server || headerMatch[4].trim().split('/')[1];
        }
        
    } catch (error) {
        console.error('Erro ao fazer parse da string SimC:', error);
    }
    
    return info;
}