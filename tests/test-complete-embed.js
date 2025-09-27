const parser = require('./src/utils/parser');

console.log('=== TESTE DO EMBED COMPLETO ===');

// Dados completos de um personagem real
const testData = {
    characterName: 'Jullianxd',
    playerClass: 'rogue',
    spec: 'subtlety',
    dps: 4571533,
    level: 80,
    race: 'human',
    realm: 'goldrinn',
    itemLevel: 635,
    fightStyle: 'patchwerk',
    iterations: 1000,
    simulationId: 'test-complete-123',
    timestamp: new Date(),
    fromCache: false
};

console.log('Dados de entrada:', testData);
console.log('');

try {
    const result = parser.formatForDiscord(testData);
    const embed = result.embeds[0]; // Pegar o primeiro embed
    
    console.log('=== RESULTADO DO EMBED COMPLETO ===');
    console.log('🎨 Cor do embed:', '0x' + embed.color.toString(16).toUpperCase());
    console.log('🏷️ Título:', embed.title);
    console.log('📝 Descrição:', embed.description);
    console.log('🖼️ Thumbnail:', embed.thumbnail?.url || 'Não definido');
    console.log('📊 Fields:', embed.fields.length);
    console.log('');
    
    // Mostrar todos os fields
    embed.fields.forEach((field, index) => {
        console.log(`📋 Field ${index + 1}: ${field.name}`);
        console.log(`   ${field.value.substring(0, 150).replace(/\n/g, ' ')}...`);
        console.log('');
    });
    
    console.log('👣 Footer:', embed.footer.text);
    
} catch (error) {
    console.error('Erro na formatação:', error.message);
    console.error('Stack:', error.stack);
}