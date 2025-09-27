require('dotenv').config();
const simcManager = require('./src/utils/simc-manager.js');

async function testSimulation() {
    console.log('🧪 Testando simulação corrigida...');
    
    const testUrl = 'https://worldofwarcraft.com/en-us/character/goldrinn/jullianxd';
    
    try {
        console.log(`🔗 Testando URL: ${testUrl}`);
        const options = { armoryUrl: testUrl };
        const results = await simcManager.runSimulation(options);
        
        console.log('✅ Simulação concluída com sucesso!');
        console.log('📊 Resultados:', {
            dps: results.dpsFormatted || results.dps,
            character: results.characterName,
            spec: results.spec,
            class: results.playerClass,
            level: results.level
        });
        
    } catch (error) {
        console.error('❌ Erro na simulação:', error.message);
        
        // Se houver log detalhado do erro, mostrar
        if (error.message.includes('SimulationCraft falhou')) {
            console.error('🔍 Erro detalhado do SimC');
        }
    }
}

testSimulation();