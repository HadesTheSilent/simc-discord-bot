const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function testSimcString() {
    console.log('🧪 Testando fluxo completo do comando /simc...');
    
    const simcString = `# Jullianxd - Subtlety - 2025-09-27 13:11 - US/Goldrinn
# SimC Addon 11.2.0-03
# WoW 11.2.0.63305, TOC 110200
# Requires SimulationCraft 1000-01 or newer

rogue="Jullianxd"
level=80
race=human
region=us
server=goldrinn
role=attack
professions=leatherworking=65/skinning=100
spec=subtlety

talents=CUQAA0tw2gAD7pPTLoW5IGZDeAAM2mBAAAAAgZZMWmGzYMmZGjZ8AzMjhxsNLGjttxMmZmxgxysNAAAAmZwAYMbGGYgZRL0iNYA

# Hood of the Sudden Eclipse (710)
head=,id=237664,bonus_id=6652/12921/12231/12676/12355/1520/10255
# Momma's Mega Medallion (704)
neck=,id=251880,gem_id=213743/213458,bonus_id=10390/6652/10383/10879/10396/12297/1553/10255
# Deathbound Shoulderpads (710)
shoulder=,id=237552,bonus_id=6652/12239/10355/12355/1520/10255
# Reshii Wraps (730)
back=,id=235499,enchant_id=7403,gem_id=238046,bonus_id=12401/9893/12256
# Tactical Vest of the Sudden Eclipse (720)
chest=,id=237667,enchant_id=7364,bonus_id=6652/10390/12229/12676/12360/1530/10255
# Rune-Branded Armbands (704)
wrist=,id=219334,enchant_id=7385,gem_id=213473,bonus_id=10421/9633/8902/9627/12052/11109/8960/8791/12050/12922,crafted_stats=36/49,crafting_quality=5
# Deathgrips of the Sudden Eclipse (710)
hands=,id=237665,bonus_id=6652/10390/12230/12675/12355/1520/10255
# Shadow Congregant's Belt (710)
waist=,id=221134,gem_id=213491,bonus_id=10390/40/12365/12239/10383/12355/3202/10255
# Pants of the Sudden Eclipse (710)
legs=,id=237663,enchant_id=7601,bonus_id=12232/6652/12676/12355/1520/10255
# Kinetic Dunerunners (710)
feet=,id=237565,enchant_id=7424,bonus_id=6652/12239/10355/12355/1520/10255
# High Nerubian Signet (704)
finger1=,id=221141,enchant_id=7352,gem_id=213473/213473,bonus_id=6652/10383/11215/12297/3196/10255/10879/10396
# Radiant Necromancer's Band (710)
finger2=,id=221200,enchant_id=7352,gem_id=213473/213473,bonus_id=10390/6652/10383/12355/3202/10255/10879/10396
# Unyielding Netherprism (704)
trinket1=,id=242396,bonus_id=6652/10354/12297/1514/10255
# Astral Antenna (710)
trinket2=,id=242395,bonus_id=6652/10355/12355/1520/10255
# Everforged Stabber (720)
main_hand=,id=222438,enchant_id=7463,bonus_id=10421/9633/8902/9627/8794/12050/12053/10520/8960,crafted_stats=32/40,crafting_quality=5
# Prodigious Gene Splicer (710)
off_hand=,id=237729,enchant_id=7439,bonus_id=6652/10355/12355/1520/10255

# Checksum: 239e1f9c`;

    try {
        console.log('1️⃣ Gerando ID de simulação...');
        const simulationId = uuidv4();
        console.log('🆔 ID:', simulationId);
        
        console.log('2️⃣ Salvando string em arquivo temporário...');
        const tempPath = path.join(__dirname, 'temp', `${simulationId}.simc`);
        await fs.promises.writeFile(tempPath, simcString, 'utf8');
        console.log('💾 Arquivo salvo em:', tempPath);
        
        console.log('3️⃣ Verificando se arquivo foi criado...');
        const fileExists = fs.existsSync(tempPath);
        console.log('📁 Arquivo existe:', fileExists);
        
        if (fileExists) {
            const fileSize = fs.statSync(tempPath).size;
            console.log('📏 Tamanho do arquivo:', fileSize, 'bytes');
            
            console.log('4️⃣ Conteúdo das primeiras linhas:');
            const content = await fs.promises.readFile(tempPath, 'utf8');
            const lines = content.split('\n').slice(0, 10);
            lines.forEach((line, i) => console.log(`   ${i+1}: ${line}`));
        }
        
        console.log('✅ Teste de preparação concluído com sucesso!');
        console.log('🎯 O arquivo está pronto para ser usado pelo SimulationCraft');
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

testSimcString();