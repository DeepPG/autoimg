const { AttachmentBuilder, SlashCommandBuilder, REST, Routes, Client, Collection, Events, GatewayIntentBits, PermissionsBitField, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
const fs = require('fs')


const http = require('http');
const https = require('https');

client.on('ready', () => {
    console.log('bot is ready')
})

const downloadImageToUrl = (url, filename) => {

    let client = http;
    if (url.toString().indexOf("https") === 0) {
        client = https;
    }
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            res.pipe(fs.createWriteStream(filename))
                .on('error', reject)
                .once('close', () => resolve(filename))
        })
    })
};


let channels = ['1096739833621266442'] // CHAAAAAAAAAAAAAAANNNNEEELLLL ID
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (channels.includes(message.channel.id)) {
        if (message.attachments.size === 1) {
            message.attachments.forEach(async (Attachment) => {
                await downloadImageToUrl(Attachment.url, __dirname + `/images/${ Attachment.name }.png`)

                const attachment = new AttachmentBuilder(`./src/images/${ Attachment.name }.png`, { name: 'image1.png' });

                let embed = new EmbedBuilder()
                    .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL(), })
                    .setURL(message.author.displayAvatarURL())
                    .setImage(`attachment://${ attachment.name }`);
                message.delete()
                message.channel.send({ files: [attachment], embeds: [embed] }).then(msg => {
                    msg.channel.send({ files: ['./src/images/1065273003241373746t.png'] })
                    fs.unlinkSync(__dirname + `/images/${ Attachment.name }.png`);
                })
            })
        }
    }
})


client.login('TOKEN') // BOOOOOOOOOOOOOOOOOOOOOOT TOKEN!!!!!!!!