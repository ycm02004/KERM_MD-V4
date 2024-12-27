const { tlang, cmd, getBuffer } = require('../command');
const Config = require('../config');
const axios = require('axios');

var nicetitle = '𝐒𝚫𝚳 𝚸𝚫𝚴𝐃𝚵𝐄';
var nicebody = "|| ◁ㅤ❚❚ㅤ▷||ㅤ ↻";
var niceurl = 'https://github.com/SamPandey001/Secktor-Md';
const nicepic = 'https://wallpapercave.com/wp/wp9556281.jpg';

const data = [ 
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221018-WA0204.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221018-WA0206.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221018-WA0207.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221018-WA0208.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221018-WA0230.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221018-WA0231.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221018-WA0233.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221018-WA0232.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221018-WA0235.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221018-WA0236.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221106-WA0269.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221106-WA0270.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221106-WA0271.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221106-WA0272.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221106-WA0273.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221106-WA0274.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221106-WA0275.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221106-WA0276.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221106-WA0277.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221106-WA0278.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221106-WA0279.mp3?raw=true',
    'https://github.com/SamPandey001/Secktor-Plugins/blob/main/plugins/bgm/AUD-20221106-WA0280.mp3?raw=true',
];

cmd({
    pattern: "mentionpreview",
    desc: "No-Desc",
    category: "No-cat",         
    react: "😐"
}, async (R, B, O, K) => {
    if (B.body && B.body.includes('@' + R.id.split('@')[0])) {
        let t = data[Math.floor(Math.random() * data.length)];
        const Z = await getBuffer(nicepic);
        let u = {
            'audio': {
                'url': t
            },
            'mimetype': 'audio/mpeg',
            'ptt': true,
            'waveform': [0x63, 0x4b, 0x19, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x5, 0x19, 0x32, 0x4b, 0x63, 0x4b, 0x32, 0x19, 0x0],
            'headerType': 1,
            'contextInfo': {
                'forwardingScore': 999,
                'isForwarded': false,
                'externalAdReply': {
                    'title': nicetitle,
                    'body': nicebody,
                    'renderLargerThumbnail': true,
                    'thumbnail': Z,
                    'mediaUrl': '',
                    'mediaType': 1,
                    'sourceUrl': niceurl,
                    'showAdAttribution': true
                }
            }
        };
        await R.sendMessage(B.fid, u);
    }
});