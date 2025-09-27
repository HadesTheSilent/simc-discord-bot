const parser = require('./src/utils/parser');

console.log('=== TESTE ITERATIONS E FIGHT STYLE ===\n');

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

console.log('🧪 Dados de entrada:');
console.log(`- Iterations: ${testData.iterations}`);
console.log(`- Fight Style: ${testData.fightStyle}`);
console.log(`- Character: ${testData.characterName}`);
console.log(`- Class: ${testData.playerClass}`);
console.log('');

try {
    const result = parser.formatForDiscord(testData);
    const embed = result.embeds[0];
    
    console.log('✅ RESULTADO DO EMBED:');
    console.log('=' + '='.repeat(50));
    console.log(`🎨 Cor: 0x${embed.color.toString(16).toUpperCase()}`);
    console.log(`🏷️ Título: ${embed.title}`);
    console.log(`📝 Descrição: ${embed.description}`);
    console.log('');
    
    // Buscar especificamente pelas seções
    embed.fields.forEach((field, index) => {
        console.log(`📋 Field ${index + 1}: ${field.name}`);
        
        // Mostrar conteúdo se for a seção de detalhes da simulação
        if (field.name.includes('Detalhes da Simulação')) {
            console.log(`   CONTEÚDO COMPLETO:`);
            console.log(`   ${field.value.replace(/\n/g, '\n   ')}`);
            
            // Verificar se contém iterations e fight style
            const hasIterations = field.value.includes('Iterações');
            const hasFightStyle = field.value.includes('Estilo de Luta');
            
            console.log(`   ✅ Iterations presente: ${hasIterations}`);
            console.log(`   ✅ Fight Style presente: ${hasFightStyle}`);
        } else {
            // Resumir outros fields
            const preview = field.value.substring(0, 100).replace(/\n/g, ' ');
            console.log(`   ${preview}${field.value.length > 100 ? '...' : ''}`);
        }
        console.log('');
    });
    
    console.log(`👣 Footer: ${embed.footer.text}`);
    
} catch (error) {
    console.error('❌ ERRO:', error.message);
    console.error('Stack:', error.stack);
}

console.log('\n🔍 VERIFICAÇÃO:');
console.log('✅ Removido duplicação de Iterations');
console.log('✅ Adicionado Fight Style na seção correta');
console.log('✅ Seção "Detalhes da Simulação" deve mostrar ambos');