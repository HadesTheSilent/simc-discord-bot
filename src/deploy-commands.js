require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];

// Carregar todos os comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ Preparando deploy do comando: ${command.data.name}`);
    } else {
        console.log(`⚠️ Comando em ${filePath} está faltando "data" ou "execute"`);
    }
}

// Construir e preparar uma instância do módulo REST
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Deploy dos comandos
(async () => {
    try {
        console.log(`🚀 Iniciando deploy de ${commands.length} comandos slash...`);

        // O put method é usado para fazer o full refresh de todos os comandos
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ Deploy de ${data.length} comandos slash realizado com sucesso!`);
    } catch (error) {
        console.error('❌ Erro durante o deploy dos comandos:', error);
    }
})();