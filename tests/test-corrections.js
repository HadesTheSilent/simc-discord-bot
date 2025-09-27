const parser = require('./src/utils/parser');

console.log('=== TESTE SIMPLES - CORREÇÕES ===\n');

const testData = {
    characterName: 'Hadestws',
    playerClass: 'deathknight',
    spec: 'frost',
    dps: 4173075,
    level: 80,
    race: 'nightelf',
    realm: 'goldrinn',
    itemLevel: 635,
    fightStyle: 'patchwerk',
    iterations: 1000,
    simulationId: '9fb7a885-test',
    timestamp: new Date(),
    fromCache: false
};

console.log('🎯 Verificando as correções solicitadas:');
console.log('1. ✅ Item Level deve aparecer na seção de DPS');
console.log('2. ✅ Formatação "## 4.173.075 DPS" deve estar correta');
console.log('');

try {
    const result = parser.formatForDiscord(testData);
    const embed = result.embeds[0];
    
    console.log('📊 SEÇÃO DE DPS:');
    const dpsField = embed.fields.find(f => f.name.includes('Damage Per Second'));
    if (dpsField) {
        console.log(`Nome: ${dpsField.name}`);
        console.log('Valor:');
        console.log(dpsField.value);
        
        // Verificar se tem iLvl
        const hasItemLevel = dpsField.value.includes('iLvl');
        console.log(`\n✅ Item Level presente: ${hasItemLevel}`);
        
        // Verificar formatação do DPS
        const dpsMatch = dpsField.value.match(/## ([\d.,]+) DPS/);
        console.log(`✅ DPS formatado: ${dpsMatch ? dpsMatch[1] : 'Não encontrado'}`);
    }
    
} catch (error) {
    console.error('❌ ERRO:', error.message);
}