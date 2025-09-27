const parser = require('./src/utils/parser');

console.log('=== TESTE DO EMBED PARA DEATH KNIGHT ===');

// Dados de exemplo de um Death Knight Frost
const testData = {
    characterName: 'TestDK',
    playerClass: 'deathknight',
    spec: 'frost',
    dps: 4000000,
    level: 80,
    race: 'human',
    simulationId: 'test-dk-123',
    timestamp: new Date(),
    fromCache: false
};

console.log('Dados de entrada:', testData);
console.log('');

try {
    const result = parser.formatForDiscord(testData);
    const embed = result.embeds[0]; // Pegar o primeiro embed
    
    console.log('=== RESULTADO DO EMBED ===');
    console.log('Cor do embed:', '0x' + embed.color.toString(16).toUpperCase());
    console.log('É ciano (Death Knight)?', embed.color === 0x17A2B8 ? 'SIM ✅' : 'NÃO ❌');
    console.log('Título:', embed.title);
    console.log('Fields:', embed.fields.length);
    
    // Mostrar alguns fields
    embed.fields.forEach((field, index) => {
        if (index < 3) {
            console.log(`Field ${index + 1}: ${field.name} - ${field.value.substring(0, 100)}...`);
        }
    });
    
} catch (error) {
    console.error('Erro na formatação:', error.message);
    console.error('Stack:', error.stack);
}