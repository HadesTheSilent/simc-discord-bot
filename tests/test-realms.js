const parser = require('./src/utils/parser');

console.log('=== TESTE DE DIFERENTES REALMS E REGIÕES ===\n');

const testCases = [
    {
        name: 'BR - Goldrinn',
        data: {
            characterName: 'Jullianxd',
            realm: 'goldrinn',
            playerClass: 'rogue',
            spec: 'subtlety',
            dps: 4571533,
            level: 80,
            race: 'human',
            itemLevel: 635,
            timestamp: new Date()
        }
    },
    {
        name: 'BR - Azralon',
        data: {
            characterName: 'Testchar',
            realm: 'azralon',
            playerClass: 'deathknight',
            spec: 'frost',
            dps: 3856742,
            level: 80,
            race: 'orc',
            itemLevel: 628,
            timestamp: new Date()
        }
    },
    {
        name: 'US - Tichondrius',
        data: {
            characterName: 'Arcanum',
            realm: 'tichondrius',
            playerClass: 'mage',
            spec: 'fire',
            dps: 4234892,
            level: 80,
            race: 'nightelf',
            itemLevel: 630,
            timestamp: new Date()
        }
    }
];

testCases.forEach((testCase, index) => {
    console.log(`🧪 TESTE ${index + 1}: ${testCase.name}`);
    console.log('=' + '='.repeat(50));
    
    try {
        const result = parser.formatForDiscord(testCase.data);
        const embed = result.embeds[0];
        
        console.log(`🏷️ Personagem: ${testCase.data.characterName}`);
        console.log(`🌍 Realm: ${testCase.data.realm}`);
        console.log(`🖼️ Avatar URL: ${embed.thumbnail?.url || 'Não definido'}`);
        console.log('✅ Embed gerado com sucesso!\n');
        
    } catch (error) {
        console.log(`❌ ERRO: ${error.message}\n`);
    }
});

console.log('💡 NOTAS IMPORTANTES:');
console.log('• URLs da Blizzard podem variar por região');
console.log('• Alguns realms brasileiros podem estar na região US');
console.log('• O sistema atual usa sempre "us" como região padrão');
console.log('• Para personagens que não existem, a URL ainda é gerada mas pode não funcionar');