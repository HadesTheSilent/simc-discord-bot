const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Mostra informações de ajuda e exemplos de uso')
        .addStringOption(option =>
            option.setName('topic')
                .setDescription('Tópico específico de ajuda')
                .setRequired(false)
                .addChoices(
                    { name: 'Comandos Básicos', value: 'basic' },
                    { name: 'URLs do Armory', value: 'armory' },
                    { name: 'Comparações', value: 'compare' },
                    { name: 'Análise de Gear', value: 'gear' },
                    { name: 'Cache e Performance', value: 'cache' },
                    { name: 'Troubleshooting', value: 'troubleshoot' }
                )),

    async execute(interaction) {
        const topic = interaction.options.getString('topic');

        if (topic) {
            await this.showSpecificHelp(interaction, topic);
        } else {
            await this.showGeneralHelp(interaction);
        }
    },

    async showGeneralHelp(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🤖 SimulationCraft Discord Bot - Ajuda')
            .setDescription('Bot para executar simulações do SimulationCraft diretamente no Discord!')
            .setColor(0x00AE86)
            .addFields(
                {
                    name: '📊 Comandos Principais',
                    value: '`/simulate character` - Simula um personagem\n' +
                           '`/simulate compare` - Compara specs\n' +
                           '`/simulate gear` - Análise de gear\n' +
                           '`/simulate queue` - Status da fila\n' +
                           '`/simulate cache` - Gerenciar cache',
                    inline: false
                },
                {
                    name: '🎯 Exemplo Rápido',
                    value: '```/simulate character armory:https://worldofwarcraft.com/en-us/character/stormrage/exemplo```',
                    inline: false
                },
                {
                    name: '📚 Ajuda Detalhada',
                    value: 'Use `/help topic:` seguido de um tópico específico:\n' +
                           '• `basic` - Comandos básicos\n' +
                           '• `armory` - Como usar URLs do armory\n' +
                           '• `compare` - Comparações entre specs\n' +
                           '• `gear` - Análise de equipamentos\n' +
                           '• `cache` - Sistema de cache\n' +
                           '• `troubleshoot` - Solução de problemas',
                    inline: false
                },
                {
                    name: '⚠️ Importante',
                    value: '• Simulações podem demorar 1-5 minutos\n' +
                           '• Use cache para resultados mais rápidos\n' +
                           '• URLs do armory devem ser do Battle.net',
                    inline: false
                }
            )
            .setFooter({ text: 'SimulationCraft Bot v1.0' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },

    async showSpecificHelp(interaction, topic) {
        let embed;

        switch (topic) {
            case 'basic':
                embed = new EmbedBuilder()
                    .setTitle('📊 Comandos Básicos')
                    .setColor(0x0099FF)
                    .addFields(
                        {
                            name: '/simulate character',
                            value: '**Simula um personagem específico**\n' +
                                   '• `armory` - URL do armory (obrigatório)\n' +
                                   '• `spec` - Especialização (opcional)\n' +
                                   '• `iterations` - Número de iterações (100-10000)\n' +
                                   '• `fight_style` - Estilo de luta\n' +
                                   '• `use_cache` - Usar cache (padrão: true)',
                            inline: false
                        },
                        {
                            name: 'Exemplo',
                            value: '```/simulate character\n' +
                                   'armory: https://worldofwarcraft.com/en-us/character/area52/exemplo\n' +
                                   'iterations: 5000\n' +
                                   'fight_style: patchwerk```',
                            inline: false
                        },
                        {
                            name: 'Estilos de Luta Disponíveis',
                            value: '• **Patchwerk** - Alvo parado, DPS puro\n' +
                                   '• **Light Movement** - Movimento leve\n' +
                                   '• **Heavy Movement** - Movimento pesado\n' +
                                   '• **Helter Skelter** - Movimento caótico\n' +
                                   '• **Ultraxion** - Simulação específica',
                            inline: false
                        }
                    );
                break;

            case 'armory':
                embed = new EmbedBuilder()
                    .setTitle('🔗 URLs do Armory')
                    .setColor(0xFF6B35)
                    .addFields(
                        {
                            name: 'Formatos Aceitos',
                            value: '• `worldofwarcraft.com/en-us/character/servidor/nome`\n' +
                                   '• `battle.net/wow/en/character/servidor/nome`\n' +
                                   '• Funcionam com qualquer região (us, eu, kr, tw, cn)',
                            inline: false
                        },
                        {
                            name: 'Como Obter a URL',
                            value: '1. Acesse o armory no Battle.net\n' +
                                   '2. Navegue até o personagem desejado\n' +
                                   '3. Copie a URL da barra de endereços\n' +
                                   '4. Cole no comando do bot',
                            inline: false
                        },
                        {
                            name: 'Exemplos Válidos',
                            value: '```https://worldofwarcraft.com/en-us/character/stormrage/exemplo\n' +
                                   'https://worldofwarcraft.com/pt-br/character/azralon/exemplo\n' +
                                   'https://battle.net/wow/en/character/area52/exemplo```',
                            inline: false
                        },
                        {
                            name: '⚠️ Dicas Importantes',
                            value: '• O personagem deve estar público no armory\n' +
                                   '• URLs com parâmetros extras (?tab=talents) funcionam\n' +
                                   '• Nomes com caracteres especiais podem precisar de ajuste',
                            inline: false
                        }
                    );
                break;

            case 'compare':
                embed = new EmbedBuilder()
                    .setTitle('⚔️ Comparações entre Specs')
                    .setColor(0x9B59B6)
                    .addFields(
                        {
                            name: '/simulate compare',
                            value: '**Compara diferentes especializações**\n' +
                                   '• `armory` - URL base do personagem\n' +
                                   '• `specs` - Lista de specs separadas por vírgula\n' +
                                   '• `iterations` - Número de iterações (padrão: 1000)',
                            inline: false
                        },
                        {
                            name: 'Exemplo de Uso',
                            value: '```/simulate compare\n' +
                                   'armory: https://worldofwarcraft.com/en-us/character/stormrage/exemplo\n' +
                                   'specs: frost,fire,arcane\n' +
                                   'iterations: 2000```',
                            inline: false
                        },
                        {
                            name: 'Specs Comuns por Classe',
                            value: '• **Mage**: frost, fire, arcane\n' +
                                   '• **Warrior**: arms, fury, protection\n' +
                                   '• **Paladin**: holy, protection, retribution\n' +
                                   '• **Death Knight**: blood, frost, unholy\n' +
                                   '• **Hunter**: beast_mastery, marksmanship, survival',
                            inline: false
                        },
                        {
                            name: '📈 Resultado',
                            value: 'O bot mostrará um ranking com DPS e percentual relativo ao melhor spec.',
                            inline: false
                        }
                    );
                break;

            case 'gear':
                embed = new EmbedBuilder()
                    .setTitle('⚔️ Análise de Gear')
                    .setColor(0xE67E22)
                    .addFields(
                        {
                            name: '/simulate gear',
                            value: '**Analisa equipamentos e estatísticas**\n' +
                                   '• `armory` - URL do personagem\n' +
                                   '• `analysis_type` - Tipo de análise',
                            inline: false
                        },
                        {
                            name: 'Tipos de Análise',
                            value: '• **Stat Weights** - Peso das estatísticas\n' +
                                   '• **Gear Compare** - Comparação de equipamentos\n' +
                                   '• **Enchant Compare** - Comparação de encantamentos',
                            inline: false
                        },
                        {
                            name: 'Stat Weights',
                            value: 'Mostra quanto cada stat vale em DPS:\n' +
                                   '```Força: 1.00\n' +
                                   'Critical Strike: 0.75\n' +
                                   'Haste: 0.68\n' +
                                   'Mastery: 0.45```',
                            inline: false
                        },
                        {
                            name: '⏱️ Tempo de Execução',
                            value: 'Análises de gear demoram mais que simulações normais (3-10 minutos).',
                            inline: false
                        }
                    );
                break;

            case 'cache':
                embed = new EmbedBuilder()
                    .setTitle('💾 Cache e Performance')
                    .setColor(0x27AE60)
                    .addFields(
                        {
                            name: 'Sistema de Cache',
                            value: 'O bot salva simulações recentes para acelerar consultas repetidas.\n' +
                                   'Cache padrão: 1 hora',
                            inline: false
                        },
                        {
                            name: 'Comandos de Cache',
                            value: '• `/simulate cache action:status` - Ver estatísticas\n' +
                                   '• `/simulate cache action:list` - Listar itens\n' +
                                   '• `/simulate cache action:clear` - Limpar cache',
                            inline: false
                        },
                        {
                            name: 'Quando o Cache é Usado',
                            value: 'Cache é baseado em:\n' +
                                   '• URL do armory\n' +
                                   '• Especialização\n' +
                                   '• Número de iterações\n' +
                                   '• Estilo de luta\n' +
                                   '• Opções extras',
                            inline: false
                        },
                        {
                            name: 'Sistema de Filas',
                            value: 'Máximo de 3 simulações simultâneas. Outras vão para fila.\n' +
                                   'Use `/simulate queue` para ver status.',
                            inline: false
                        }
                    );
                break;

            case 'troubleshoot':
                embed = new EmbedBuilder()
                    .setTitle('🔧 Solução de Problemas')
                    .setColor(0xE74C3C)
                    .addFields(
                        {
                            name: 'Problemas Comuns',
                            value: '**❌ "URL do armory inválida"**\n' +
                                   '• Verifique se a URL é do Battle.net ou WorldofWarcraft.com\n' +
                                   '• Certifique-se que o personagem existe\n\n' +
                                   '**❌ "SimulationCraft falhou"**\n' +
                                   '• Personagem pode estar com gear inválido\n' +
                                   '• Servidor do armory pode estar indisponível\n\n' +
                                   '**⏱️ "Simulação expirou (timeout)"**\n' +
                                   '• Reduza o número de iterações\n' +
                                   '• Tente novamente mais tarde',
                            inline: false
                        },
                        {
                            name: 'Limitações',
                            value: '• Personagens privados no armory não funcionam\n' +
                                   '• Máximo 10.000 iterações por simulação\n' +
                                   '• Máximo 4 specs por comparação\n' +
                                   '• Timeout de 5 minutos por simulação',
                            inline: false
                        },
                        {
                            name: 'Dicas de Performance',
                            value: '• Use cache sempre que possível\n' +
                                   '• Comece com poucas iterações (1000-2000)\n' +
                                   '• Evite muitas simulações simultâneas\n' +
                                   '• Use fight_style adequado ao seu objetivo',
                            inline: false
                        },
                        {
                            name: '🆘 Ainda com problemas?',
                            value: 'Verifique se:\n' +
                                   '• O bot tem permissões adequadas\n' +
                                   '• O SimulationCraft está instalado no servidor\n' +
                                   '• Há espaço em disco suficiente',
                            inline: false
                        }
                    );
                break;

            default:
                embed = new EmbedBuilder()
                    .setTitle('❓ Tópico Não Encontrado')
                    .setDescription('Use `/help` sem parâmetros para ver a ajuda geral.')
                    .setColor(0xFF0000);
        }

        await interaction.reply({ embeds: [embed] });
    }
};