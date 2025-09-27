require('dotenv').config();
const simcManager = require('./src/utils/simc-manager.js');

async function testSimulation() {
    console.log('🧪 Iniciando teste de simulação...');
    const testUrl = 'https://worldofwarcraft.com/en-us/character/goldrinn/jullianxd';
    
    try {
        console.log(`🔗 Testando URL: ${testUrl}`);
        const options = { armoryUrl: testUrl };
        const results = await simcManager.runSimulation(options);
        
        console.log('✅ Simulação concluída!');
        console.log('📊 Resultados:', results);
        
        if (results.dps) {
            console.log(`🎯 DPS: ${results.dpsFormatted || results.dps}`);
        }
        
        if (results.characterName) {
            console.log(`👤 Personagem: ${results.characterName} (${results.spec} ${results.playerClass})`);
        }
        
    } catch (error) {
        console.error('❌ Erro na simulação:', error.message);
        console.error('Stack:', error.stack);
    }
}

testSimulation();