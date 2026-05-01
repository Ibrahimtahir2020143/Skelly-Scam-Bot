const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔒 Track users who already clicked "It Works"
const usedWorks = new Set();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === "!mod") {

    const allowedRoles = ["Owner 👑", "Mods"];

    if (!message.member.roles.cache.some(role => allowedRoles.includes(role.name))) {
      return message.reply("❌ You don't have permission to use this command.");
    }

    // FIRST MESSAGE BUTTONS
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

  // SECOND MESSAGE BUTTON (ONLY WORKS)
  const worksOnlyRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('works')
      .setLabel('It Works')
      .setStyle(ButtonStyle.Success)
  );

  if (interaction.customId === 'resend') {

    await interaction.reply({
      content: `🔄 New Mod Sent!

It looks like the previous version didn’t work, so here’s another one for you.

Only works in version 1.21.11.

Give it a try and see if this one works better.`,
      files: ["./Pickles_to_Skellys_fixed.jar"],
      components: [worksOnlyRow]
    });
  }

  if (interaction.customId === 'works') {

    const userId = interaction.user.id;

    // ❌ If already clicked before
    if (usedWorks.has(userId)) {
      return interaction.reply({
        content: "❌ You have already supported us 👍",
        ephemeral: true
      });
    }

    // ✅ First time click
    usedWorks.add(userId);

    const vouchChannelId = "1497861898073407559";
    const vouchChannel = interaction.client.channels.cache.get(vouchChannelId);

    if (vouchChannel) {
      await vouchChannel.send({
        content: `💬 **New Vouch!**

<@${userId}> used our mod and it worked ✅

🔥 Thanks for the support!`
      });
    }

    // PUBLIC message (not ephemeral)
    await interaction.reply({
      content: `✅ Glad it worked!

Thanks for confirming 🙌  
Your support helps us improve and provide better mods.

Enjoy it 💯`
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
