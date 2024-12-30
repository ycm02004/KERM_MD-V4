const config = require('../config');
const { cmd } = require('../command');
const os = require('os');
const { runtime } = require('../lib/functions');
const disk = require('disk-space');
const moment = require('moment');

cmd({
    pattern: "system2", // Command name
    react: "⚡", // Reaction when command is executed
    alias: ["uptime2", "status2", "runtime2", "stats"], // Alternative command names
    desc: "Display comprehensive system statistics", // Description of the command
    category: "main", // Command category
    filename: __filename // Path to the file
},
    async (conn, mek, m, {
        from,
        quoted,
        isOwner,
        reply
    }) => {
        try {
            // CPU usage
            const loadAvg = os.loadavg(); // Load averages for 1, 5, 15 minutes
            const cpuUsage = process.cpuUsage(); // Current CPU usage
            const cpuPercent = ((cpuUsage.user + cpuUsage.system) / (os.cpus().length * 1000000)).toFixed(2);

            // Network information
            const networkInterfaces = os.networkInterfaces();
            const primaryInterface = Object.values(networkInterfaces)[0]?.[0] || { address: 'N/A' };

            // Uptime
            const uptimeTotal = process.uptime();
            const uptimeDays = Math.floor(uptimeTotal / (24 * 60 * 60));
            const uptimeHours = Math.floor((uptimeTotal % (24 * 60 * 60)) / (60 * 60));
            const uptimeMinutes = Math.floor((uptimeTotal % (60 * 60)) / 60);

            // Disk usage
            const diskUsage = await new Promise((resolve) => {
                disk.check('/', (err, result) => {
                    resolve(result || { free: 0, total: 0 });
                });
            });
            const diskTotal = (diskUsage.total / (1024 * 1024 * 1024)).toFixed(2);
            const diskFree = (diskUsage.free / (1024 * 1024 * 1024)).toFixed(2);
            const diskUsed = (diskTotal - diskFree).toFixed(2);

            // Memory usage
            const heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            const totalMemory = (os.totalmem() / 1024 / 1024).toFixed(2);

            // Bot system status message
            const status = `*╭────── SYSTEM STATUS ───────*
            
_KERM_MD-V4 STATISTICS_
⏰ *Uptime:* ${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m
📊 *Memory Usage:* ${heapUsed}MB / ${totalMemory}MB
💾 *Disk Space:* ${diskUsed}GB used of ${diskTotal}GB
🔋 *CPU Load:* ${cpuPercent}%
📈 *Load Average:* ${loadAvg[0].toFixed(2)} (1m), ${loadAvg[1].toFixed(2)} (5m)
💻 *System:*
├ OS: ${os.type()} ${os.release()}
├ Architecture: ${os.arch()}
├ Platform: ${os.platform()}
├ Hostname: ${os.hostname()}
└ IP Address: ${primaryInterface.address || 'N/A'}

🤖 *Bot Information:*
├ *Owner:* Kg Tech
├ *Last Restart:* ${moment().format('YYYY-MM-DD HH:mm:ss')}
├ *Node Version:* ${process.version}
└ *Active Since:* ${moment().subtract(uptimeTotal, 'seconds').format('YYYY-MM-DD HH:mm:ss')}
╰──────────────────────────*`;

            // Send the message with an image and the status caption
            await conn.sendMessage(from, {
                image: { url: config.ALIVE_IMG },
                caption: status,
                contextInfo: {
                    externalAdReply: {
                        title: "Kerm Bot Status",
                        body: "System Statistics & Performance Metrics",
                        mediaType: 1,
                        thumbnail: { url: config.ALIVE_IMG },
                        mediaUrl: config.WEBSITE_URL,
                        sourceUrl: config.WEBSITE_URL
                    }
                }
            }, { quoted: mek });

        } catch (e) {
            console.error('System status error:', e);
            reply(`❌ Error fetching system status: ${e.message}`);
        }
    });