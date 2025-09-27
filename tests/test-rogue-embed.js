const parser = require('./src/utils/parser');

console.log('=== TESTE DO EMBED PARA ROGUE ===');

// Dados de exemplo de um Rogue Subtlety
const testData = {
    characterName: 'Jullianxd',
    playerClass: 'rogue',
    spec: 'subtlety',
    dps: 4571533,
    level: 80,
    race: 'human',
    simulationId: 'test-rogue-123',
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
    console.log('É amarelo/dourado (Rogue)?', embed.color === 0xFFD700 ? 'SIM ✅' : 'NÃO ❌');
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