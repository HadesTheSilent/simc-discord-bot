require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Criar client do Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Collection para armazenar comandos
client.commands = new Collection();

// Carregar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Comando carregado: ${command.data.name}`);
    } else {
        console.log(`⚠️ Comando em ${filePath} está faltando "data" ou "execute"`);
    }
}

// Event listener para quando o bot estiver pronto
client.once('clientReady', () => {
    console.log(`🚀 Bot logado como ${client.user.tag}!`);
    console.log(`📊 Servindo ${client.guilds.cache.size} servidores`);
    
    // Definir status do bot
    client.user.setActivity('SimulationCraft simulations', { type: 'PLAYING' });
});

// Event listener para interações (slash commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`❌ Comando não encontrado: ${interaction.commandName}`);
        return;
    }

    try {
        console.log(`📝 Executando comando: ${interaction.commandName} por ${interaction.user.tag}`);
        await command.execute(interaction);
    } catch (error) {
        console.error(`❌ Erro ao executar comando ${interaction.commandName}:`, error);
        
        const errorMessage = 'Houve um erro ao executar este comando!';
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
});

// Error handling
client.on('error', error => {
    console.error('❌ Discord client error:', error);
});

client.on('warn', warning => {
    console.warn('⚠️ Discord client warning:', warning);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Recebido SIGINT, desconectando bot...');
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Recebido SIGTERM, desconectando bot...');
    client.destroy();
    process.exit(0);
});

// Login do bot
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ DISCORD_TOKEN não encontrado no arquivo .env');
    process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
