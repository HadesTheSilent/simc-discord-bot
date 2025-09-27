const simcCommand = require('./src/commands/simc.js');

// Testar o parse da string SimC
function testSimcString() {
    const testString = `# Jullianxd - Subtlety - 2025-09-27 13:11 - US/Goldrinn
# SimC Addon 11.2.0-03
# WoW 11.2.0.63305, TOC 110200
# Requires SimulationCraft 1000-01 or newer

rogue="Jullianxd"
level=80
race=human
region=us
server=goldrinn
role=attack
professions=leatherworking=65/skinning=100
spec=subtlety
# loot_spec=subtlety

talents=CUQAA0tw2gAD7pPTLoW5IGZDeAAM2mBAAAAAgZZMWmGzYMmZGjZ8AzMjhxsNLGjttxMmZmxgxysNAAAAmZwAYMbGGYgZRL0iNYA`;

    console.log('🧪 Testando parse de string SimC...');
    console.log('📄 String de entrada (primeiras 5 linhas):');
    console.log(testString.split('\n').slice(0, 5).join('\n'));
    console.log();

    // Simular a função parseSimcString do comando
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

    const result = parseSimcString(testString);
    
    console.log('✅ Informações extraídas:');
    console.log('📛 Nome:', result.name);
    console.log('🗡️ Classe:', result.class);
    console.log('🎯 Spec:', result.spec);
    console.log('📊 Level:', result.level);
    console.log('🧬 Raça:', result.race);
    console.log('🌍 Região:', result.region);
    console.log('🖥️ Servidor:', result.server);
    
    console.log();
    console.log('🎯 Validação: String é válida?', 
        testString.includes('# SimC Addon') || 
        (testString.includes('rogue=') && testString.includes('level=')));
}

testSimcString();