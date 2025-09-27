const parser = require('./src/utils/parser.js');
const fs = require('fs');

async function testParser() {
    console.log('🧪 Testando parser completo...');
    
    const mockResults = {
        simulationId: '3d0acc47-c407-4dbf-a6e8-8861e500e1fc',
        timestamp: new Date(),
        htmlPath: './results/3d0acc47-c407-4dbf-a6e8-8861e500e1fc.html',
        dps: 4573581,
        characterName: 'Jullianxd',
        race: 'human',
        playerClass: 'rogue',
        spec: 'subtlety',
        level: 80
    };
    
    console.log('📊 Dados de entrada:', mockResults);
    
    const parsed = await parser.parseResults(mockResults);
    
    console.log('✅ Dados parseados:', parsed);
    console.log('🎯 Item Level final:', parsed.itemLevel);
    
    // Testar formatação para Discord
    const formatted = parser.formatForDiscord(parsed);
    console.log('🔍 Embed formatado:');
    console.log(JSON.stringify(formatted, null, 2));
}

testParser().catch(console.error);