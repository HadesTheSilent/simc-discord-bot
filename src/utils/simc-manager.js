const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache');

class SimcManager {
    constructor() {
        this.simcPath = process.env.SIMC_PATH || 'simc';
        this.timeout = parseInt(process.env.SIMC_TIMEOUT) || 300000; // 5 minutos
        this.maxConcurrent = parseInt(process.env.MAX_CONCURRENT_SIMS) || 3;
        this.currentSims = 0;
        this.queue = [];
        this.tempDir = path.join(__dirname, '../../temp');
        this.resultsDir = path.join(__dirname, '../../results');
        
        // Criar diretórios se não existirem
        this.ensureDirectories();
    }

    async ensureDirectories() {
        try {
            await fs.mkdir(this.tempDir, { recursive: true });
            await fs.mkdir(this.resultsDir, { recursive: true });
        } catch (error) {
            console.error('Erro ao criar diretórios:', error);
        }
    }

    /**
     * Executa uma simulação do SimulationCraft
     * @param {Object} options - Opções da simulação
     * @param {string} options.armoryUrl - URL do armory do personagem
     * @param {string} options.spec - Especialização (opcional)
     * @param {number} options.iterations - Número de iterações
     * @param {string} options.fightStyle - Estilo de luta (patchwerk, lightmovement, etc)
     * @param {Array} options.extraOptions - Opções extras do SimC
     * @returns {Promise<Object>} Resultado da simulação
     */
    async runSimulation(options) {
        const simulationId = uuidv4();
        
        // Se há muitas simulações rodando, adicionar à fila
        if (this.currentSims >= this.maxConcurrent) {
            return new Promise((resolve, reject) => {
                this.queue.push({ options, resolve, reject, simulationId });
            });
        }

        return this.executeSimulation(options, simulationId);
    }

    async executeSimulation(options, simulationId) {
        this.currentSims++;
        
        try {
            const result = await this.runSimcCommand(options, simulationId);
            return result;
        } finally {
            this.currentSims--;
            this.processQueue();
        }
    }

    async runSimcCommand(options, simulationId) {
        const {
            armoryUrl,
            spec,
            iterations = 1000,
            fightStyle = 'patchwerk',
            extraOptions = []
        } = options;

        // Criar arquivo de configuração temporário
        const configPath = path.join(this.tempDir, `${simulationId}.simc`);
        const htmlPath = path.join(this.resultsDir, `${simulationId}.html`);
        const textPath = path.join(this.resultsDir, `${simulationId}.txt`);

        // Construir configuração do SimC
        let simcConfig = `# Simulação ID: ${simulationId}\n`;
        
        // Importar personagem do armory
        console.log(`🔍 Checking URL: ${armoryUrl}`);
        console.log(`🔍 Contains worldofwarcraft.com: ${armoryUrl.includes('worldofwarcraft.com')}`);
        console.log(`🔍 Contains worldofwarcraft.blizzard.com: ${armoryUrl.includes('worldofwarcraft.blizzard.com')}`);
        console.log(`🔍 Contains battle.net: ${armoryUrl.includes('battle.net')}`);
        
        if (armoryUrl.includes('worldofwarcraft.com') || armoryUrl.includes('worldofwarcraft.blizzard.com') || armoryUrl.includes('battle.net')) {
            // Usar a função parseArmoryUrl para extrair informações
            const armoryInfo = this.parseArmoryUrl(armoryUrl);
            if (armoryInfo) {
                const { region, realm, character } = armoryInfo;
                simcConfig += `armory=${region},${realm},${character}\n`;
                console.log(`🔍 Armory parsed: ${region}, ${realm}, ${character}`);
            } else {
                throw new Error('URL do armory inválida - formato não reconhecido');
            }
        } else {
            throw new Error('URL do armory não reconhecida - domínio não suportado');
        }

        // Configurações básicas
        simcConfig += `iterations=${iterations}\n`;
        simcConfig += `fight_style=${fightStyle}\n`;
        simcConfig += `default_actions=1\n`;
        simcConfig += `cleanup_threads=1\n`;
        
        // Outputs
        simcConfig += `html=${htmlPath}\n`;
        
        // Especialização específica (se fornecida e válida)
        if (spec && spec !== 'active' && spec.length > 0) {
            simcConfig += `spec=${spec}\n`;
            // Quando mudamos a spec, devemos limpar talentos para evitar conflitos
            // O SimC vai usar talentos padrão da spec especificada
            simcConfig += `talents=\n`;
            console.log(`🎯 Forçando spec: ${spec} com talentos padrão`);
        }

        // Opções extras
        if (extraOptions.length > 0) {
            simcConfig += extraOptions.join('\n') + '\n';
        }

        // Salvar arquivo de configuração
        await fs.writeFile(configPath, simcConfig);

        return new Promise((resolve, reject) => {
            console.log(`🎯 Iniciando simulação ${simulationId}...`);
            console.log(`🎯 Comando: ${this.simcPath} ${configPath}`);
            
            const simcProcess = spawn(this.simcPath, [configPath], {
                stdio: ['pipe', 'pipe', 'pipe'],
                timeout: this.timeout
            });

            let stdout = '';
            let stderr = '';

            simcProcess.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            simcProcess.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            simcProcess.on('close', async (code) => {
                try {
                    // Debug: não limpar arquivo temporário ainda
                    console.log(`🔍 Arquivo de config: ${configPath}`);
                    console.log(`🔍 Código de saída: ${code}`);
                    console.log(`🔍 STDOUT:`, stdout);
                    console.log(`🔍 STDERR:`, stderr);
                    
                    if (code !== 0) {
                        console.error(`❌ SimulationCraft falhou (código ${code}):`, stderr);
                        reject(new Error(`SimulationCraft falhou: ${stderr}`));
                        return;
                    }

                    console.log(`✅ Simulação ${simulationId} concluída`);

                    // Capturar DPS diretamente do STDOUT (método mais confiável)
                    let dps = null;
                    let characterInfo = {};
                    
                    // Padrão 1: Na seção DPS Ranking (mais confiável)
                    const dpsRankingMatch = stdout.match(/DPS Ranking:\s*(\d+)/);
                    if (dpsRankingMatch) {
                        dps = parseInt(dpsRankingMatch[1]);
                        console.log('🎯 DPS encontrado via Ranking:', dps);
                    }
                    
                    // Padrão 2: Na linha do player DPS=valor
                    if (!dps) {
                        const dpsPlayerMatch = stdout.match(/DPS=(\d+\.?\d*)/);
                        if (dpsPlayerMatch) {
                            dps = Math.round(parseFloat(dpsPlayerMatch[1]));
                            console.log('🎯 DPS encontrado via Player:', dps);
                        }
                    }
                    
                    // Extrair informações básicas do personagem
                    const playerMatch = stdout.match(/Player:\s+(\w+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\d+)/);
                    if (playerMatch) {
                        const [, name, race, playerClass, spec, level] = playerMatch;
                        characterInfo = {
                            characterName: name,
                            race: race,
                            playerClass: playerClass,
                            spec: spec,
                            level: parseInt(level)
                        };
                        console.log('🎯 Info do personagem:', characterInfo);
                    }

                    // Criar resultado base com dados do STDOUT
                    const baseResults = {
                        simulationId,
                        timestamp: new Date(),
                        dps: dps,
                        dpsFormatted: dps ? this.formatDPS(dps) : null,
                        ...characterInfo,
                        rawOutput: stdout // Manter output bruto para debug
                    };
                    
                    // Parse dos arquivos HTML/texto para informações adicionais como gear_ilvl
                    try {
                        const additionalResults = await this.parseResults(simulationId, htmlPath, textPath);
                        // Combinar resultados, dando prioridade aos dados dos arquivos
                        const results = { ...baseResults, ...additionalResults };
                        console.log('🎯 Resultado final combinado:', results);
                        resolve(results);
                    } catch (parseError) {
                        console.warn('⚠️ Erro ao fazer parse dos arquivos, usando apenas dados do STDOUT:', parseError.message);
                        console.log('🎯 Resultado final (STDOUT apenas):', baseResults);
                        resolve(baseResults);
                    }

                } catch (error) {
                    reject(error);
                }
            });

            simcProcess.on('error', (error) => {
                console.error(`❌ Erro ao executar SimulationCraft:`, error);
                reject(new Error(`Falha ao executar SimulationCraft: ${error.message}`));
            });

            // Timeout handling
            setTimeout(() => {
                if (!simcProcess.killed) {
                    simcProcess.kill('SIGTERM');
                    reject(new Error('Simulação expirou (timeout)'));
                }
            }, this.timeout);
        });
    }

    async parseResults(simulationId, htmlPath, textPath) {
        try {
            console.log(`🔍 Procurando arquivos de resultado:`);
            console.log(`🔍 HTML: ${htmlPath}`);
            console.log(`🔍 Text: ${textPath}`);
            
            // Verificar se os arquivos existem
            const htmlExists = await fs.access(htmlPath).then(() => true).catch(() => false);
            const textExists = await fs.access(textPath).then(() => true).catch(() => false);
            
            console.log(`🔍 HTML existe: ${htmlExists}`);
            console.log(`🔍 Text existe: ${textExists}`);
            
            // Tentar ler arquivo HTML primeiro (mais rico em informações)
            let htmlContent = null;
            let textContent = null;

            if (htmlExists) {
                try {
                    htmlContent = await fs.readFile(htmlPath, 'utf8');
                    console.log(`✅ HTML lido com sucesso (${htmlContent.length} chars)`);
                } catch (error) {
                    console.log('❌ Erro ao ler arquivo HTML:', error.message);
                }
            }

            if (textExists) {
                try {
                    textContent = await fs.readFile(textPath, 'utf8');
                    console.log(`✅ Text lido com sucesso (${textContent.length} chars)`);
                } catch (error) {
                    console.log('❌ Erro ao ler arquivo Text:', error.message);
                }
            }

            if (!htmlContent && !textContent) {
                // Listar arquivos no diretório de resultados para debug
                try {
                    const files = await fs.readdir(this.resultsDir);
                    console.log(`🔍 Arquivos no diretório results:`, files);
                } catch (error) {
                    console.log('❌ Erro ao listar diretório results:', error.message);
                }
                throw new Error('Nenhum arquivo de resultado encontrado');
            }

            // Parse básico dos resultados
            const results = {
                simulationId,
                timestamp: new Date(),
                htmlPath: htmlContent ? htmlPath : null,
                textPath: textContent ? textPath : null
            };

            // Extrair informações do HTML se disponível (prioridade para gear_ilvl)
            if (htmlContent) {
                // Buscar gear_ilvl no conteúdo HTML (formato: # gear_ilvl=711.00)
                const gearIlvlMatch = htmlContent.match(/#\s*gear_ilvl[=:\s]+([\d\.]+)/i);
                if (gearIlvlMatch) {
                    results.itemLevel = parseFloat(gearIlvlMatch[1]);
                    console.log(`🎯 Item Level extraído do HTML: ${results.itemLevel}`);
                } else {
                    console.log('⚠️ gear_ilvl não encontrado no HTML');
                }

                // Também buscar fight style no HTML se não foi encontrado no texto
                const htmlFightStyleMatch = htmlContent.match(/<b>Fight Style:<\/b>\s*([^<\n]+)/i);
                if (htmlFightStyleMatch) {
                    results.fightStyle = htmlFightStyleMatch[1].trim();
                    console.log(`🎯 Fight Style extraído do HTML: ${results.fightStyle}`);
                }
            }

            // Extrair informações do texto se disponível
            if (textContent) {
                // Extrair DPS (formato: "DPS: 1,234,567.89" ou "DPS: 1234567.89")
                const dpsMatch = textContent.match(/DPS:\s+([\d,\.]+)/i);
                if (dpsMatch) {
                    const dpsValue = dpsMatch[1].replace(/,/g, '');
                    results.dps = parseFloat(dpsValue);
                    results.dpsFormatted = this.formatDPS(results.dps);
                }

                // Extrair nome do personagem e informações básicas
                const characterMatch = textContent.match(/^([A-Za-z\u00C0-\u017F]+)\s+(\d+)\s+(\w+)\s+(\w+)\s+(\w+)/m);
                if (characterMatch) {
                    const [, name, level, race, playerClass, spec] = characterMatch;
                    results.characterName = name;
                    results.level = parseInt(level);
                    results.race = race;
                    results.playerClass = playerClass;
                    results.spec = spec;
                }

                // Extrair item level do texto (fallback se não foi encontrado no HTML)
                if (!results.itemLevel) {
                    const itemLevelMatch = textContent.match(/Item Level:\s+(\d+)/i);
                    if (itemLevelMatch) {
                        results.itemLevel = parseInt(itemLevelMatch[1]);
                    }
                }

                // Extrair informações de fight style
                const fightStyleMatch = textContent.match(/Fight Style:\s+([^\n]+)/i);
                if (fightStyleMatch) {
                    results.fightStyle = fightStyleMatch[1].trim();
                }

                // Extrair número de iterações
                const iterationsMatch = textContent.match(/Iterations:\s+(\d+)/i);
                if (iterationsMatch) {
                    results.iterations = parseInt(iterationsMatch[1]);
                }

                // Extrair level e item level
                const levelMatch = textContent.match(/Level:\s+(\d+)/);
                if (levelMatch) {
                    results.level = parseInt(levelMatch[1]);
                }

                const ilevelMatch = textContent.match(/Item Level:\s+([\d\.]+)/);
                if (ilevelMatch) {
                    results.itemLevel = parseFloat(ilevelMatch[1]);
                }
            }

            return results;

        } catch (error) {
            console.error('Erro ao fazer parse dos resultados:', error);
            throw new Error(`Falha ao processar resultados: ${error.message}`);
        }
    }

    processQueue() {
        if (this.queue.length > 0 && this.currentSims < this.maxConcurrent) {
            const { options, resolve, reject, simulationId } = this.queue.shift();
            
            this.executeSimulation(options, simulationId)
                .then(resolve)
                .catch(reject);
        }
    }

    getQueueStatus() {
        return {
            currentSimulations: this.currentSims,
            queuedSimulations: this.queue.length,
            maxConcurrent: this.maxConcurrent
        };
    }

    /**
     * Valida se uma URL do armory é válida
     * @param {string} url - URL para validar
     * @returns {boolean} True se válida
     */
    validateArmoryUrl(url) {
        // Padrões mais flexíveis para URLs do armory - aceita worldofwarcraft.com e worldofwarcraft.blizzard.com
        // Formato: /locale/character/region/realm/character
        const armoryPattern1 = /worldofwarcraft\.com\/[a-z_-]+\/character\/[^\/\s]+\/[^\/\s]+\/[^\/\s\?]+/i;
        const armoryPattern2 = /worldofwarcraft\.blizzard\.com\/[a-z_-]+\/character\/[^\/\s]+\/[^\/\s]+\/[^\/\s\?]+/i;
        const battlenetPattern = /battle\.net\/wow\/[a-z_-]+\/character\/[^\/\s]+\/[^\/\s]+\/[^\/\s\?]+/i;
        
        // Log para debug
        console.log('🔍 Validando URL:', url);
        console.log('🔍 Teste armory (.com):', armoryPattern1.test(url));
        console.log('🔍 Teste armory (.blizzard.com):', armoryPattern2.test(url));
        console.log('🔍 Teste battle.net:', battlenetPattern.test(url));
        
        return armoryPattern1.test(url) || armoryPattern2.test(url) || battlenetPattern.test(url);
    }

    /**
     * Extrai informações básicas de uma URL do armory
     * @param {string} url - URL do armory
     * @returns {Object} Informações extraídas
     */
    parseArmoryUrl(url) {
        // Mapeamento de locales para regi�es do SimC
        const localeToRegion = {
            'en-us': 'us', 'es-us': 'us', 'pt-br': 'us',
            'en-gb': 'eu', 'es-es': 'eu', 'pt-pt': 'eu', 'fr-fr': 'eu', 'de-de': 'eu', 'it-it': 'eu', 'ru-ru': 'eu',
            'ko-kr': 'kr', 'zh-tw': 'tw', 'zh-cn': 'cn'
        };
        console.log(`🔍 Parsing URL: ${url}`);
        
        // Padrão 1: worldofwarcraft.com/locale/character/realm/character
        // URL: https://worldofwarcraft.com/en-us/character/goldrinn/jullianxd
        let match = url.match(/worldofwarcraft\.com\/([a-z_-]+)\/character\/([^\/\s]+)\/([^\/\s\?]+)/i);
        if (match) {
            let [, locale, realm, character] = match;
            
            // Converter locale para formato padrão (underscores) para uso no SimC
            const region = localeToRegion[locale.toLowerCase()] || 'us';
            
            console.log(`🔍 Padrão 1 - locale=${locale}, realm=${realm}, character=${character}`);
            console.log(`🔍 Resultado final: region=${region}, realm=${realm}, character=${character}`);
            return { region, realm, character };
        }
        
        // Padrão 2: worldofwarcraft.blizzard.com/locale/character/region/realm/character
        // URL: worldofwarcraft.blizzard.com/en-us/character/us/goldrinn/Jullianxd
        match = url.match(/worldofwarcraft\.blizzard\.com\/([a-z_-]+)\/character\/([^\/\s]+)\/([^\/\s]+)\/([^\/\s\?]+)/i);
        if (match) {
            let [, locale, serverRegion, realm, character] = match;
            
            // Converter locale para formato padrão (underscores) para uso no SimC
            const region = localeToRegion[locale.toLowerCase()] || 'us';
            
            console.log(`🔍 Padrão 2 - locale=${locale}, serverRegion=${serverRegion}, realm=${realm}, character=${character}`);
            console.log(`🔍 Resultado final: region=${region}, realm=${realm}, character=${character}`);
            return { region, realm, character };
        }
        
        console.log(`🔍 Nenhum padrão reconhecido para: ${url}`);
        return null;
    }

    /**
     * Formata valor de DPS para exibição
     * @param {number} dps - Valor do DPS
     * @returns {string} DPS formatado
     */
    formatDPS(dps) {
        if (!dps) return '0';
        
        if (dps >= 1000000) {
            return `${(dps / 1000000).toFixed(2)}M`;
        } else if (dps >= 1000) {
            return `${(dps / 1000).toFixed(1)}k`;
        }
        return Math.round(dps).toString();
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
}

module.exports = new SimcManager();
