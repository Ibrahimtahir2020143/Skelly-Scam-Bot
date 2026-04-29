const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === "!mod") {

    const allowedRoles = ["Owner 👑", "Mods"];

    if (!message.member.roles.cache.some(role => allowedRoles.includes(role.name))) {
      return message.reply("❌ You don't have permission to use this command.");
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('resend')
        .setLabel('Resend Mod')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('works')
        .setLabel('It Works')
        .setStyle(ButtonStyle.Success)
    );

    await message.channel.send({
      content: `This is your Fake Skelly Mod.

⚠️ This mod only works in Donut SMP.
📌 Only works in version 1.21.11.

If this mod doesn't work, click the **Resend Mod** button below.

If it works, click **It Works** to support us 👍`,
      files: ["./Pickles_to_skelles.jar"],
      components: [row]
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'resend') {
    await interaction.reply({
      content: `🔄 New Mod Sent!

It looks like the previous version didn’t work, so here’s another one for you.

Only works in version 1.21.11.

Give it a try and see if this one works better.`,
      files: ["./Pickles_to_Skellys_fixed.jar"],
    });
  }

  if (interaction.customId === 'works') {
    await interaction.reply({
      content: `✅ Glad it worked!

Thanks for confirming 🙌  
Your support helps us improve and provide better mods.

Enjoy it 💯`,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);