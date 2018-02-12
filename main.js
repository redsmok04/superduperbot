const { Client } = require('discord.js');
const { TOKEN, PREFIX } = require('./config');
const ytdl = require('ytdl-core');

const client = new Client({ disableEveryone: true });

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Yo this ready!'));

client.on('Disconnect', () => console.log('Im just disconnected,brb'));

client.on('Reconnecting', () => console.log('I am reconnecting now'));

client.on('message', async msg => {
    if(msg.author.bot) return undefined;
    if(!msg.content.startsWith(PREFIX)) return undefined;
    const args = msg.content.split(' ');


    if (msg.content.startsWith(`${PREFIX}play`)) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('No one in voice channel.')
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            return msg.channel.send('I cant connect voice channel check permissions');
        }
    if (!permissions.has('SPEAK')) {
        return msg.channel.send('I cannot speak in this voice channel!');
    }

        try {
            var connection = await voiceChannel.join();
        } catch (error) {
             console.error(`i cannot join voice channel: ${error}`);
            return msg.channel.send(`i cannot join voice channel: ${error}`);
        }

    }

    const dispacther = connection.playStream(ytdl(args[1]))
        .on('end', () => {
            console.log('song ended');
            voiceChannel.leave();
        })
        .on('error', error => {
            console.error(error);
        })

    dispacther.setVolumeLogarithmic(5 / 5);
});
client.login(TOKEN);