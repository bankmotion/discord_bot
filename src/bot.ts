import { Client, GatewayIntentBits, Role, TextChannel } from "discord.js";
import schedule from "node-schedule";
import dotenv from "dotenv";
import { config } from "./config";
dotenv.config();

// Define the type for holiday objects
interface Holiday {
  name: string;
  date: string;
  day: string;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

let lastMessageTime: Date | null = null;
let currentCooldownMinutes = 0;

if (!CHANNEL_ID) {
  console.error("CHANNEL_ID is not defined. Please set it in the .env file.");
  process.exit(1);
}

const isWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day >= 1 && day <= 5;
};

const isHoliday = (date: Date): boolean => {
  const today = date.toISOString().split("T")[0];
  return config.holidays.some((holiday: Holiday) => holiday.date === today);
};

const getRandomMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * config.message.length);
  return config.message[randomIndex];
};

// Function to get a random cooldown between 40 and 60 minutes
const getRandomCooldownMinutes = (): number => {
  return (
    Math.floor(
      Math.random() * (config.maxDurationTime - config.minDurationTime + 1)
    ) + config.minDurationTime
  );
};

const sendMessage = async (channel: TextChannel) => {
  const randomMessage = getRandomMessage();

  try {
    const role = channel.guild.roles.cache.get(config.roleID) as Role;
    if (!role) {
      console.log("Role not found.");
      return;
    }

    // Create the message with role mention
    const messageWithRole = `<@&${config.roleID}> ${randomMessage}`;

    // Send the message with the role mention
    const sentMessage = await channel.send(messageWithRole);
    console.log(`Message sent: ${messageWithRole}`);

    // delete function
    setTimeout(async () => {
      try {
        await sentMessage.delete();
        console.log(`Message deleted: ${messageWithRole}`);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }, config.deleteDuration * 60 * 1000);
  } catch (error) {
    console.error("Error fetching or sending role:", error);
  }

  currentCooldownMinutes = getRandomCooldownMinutes();
  lastMessageTime = new Date(); // Update last message time
  console.log(`New cooldown set to ${currentCooldownMinutes} minutes.`);
};

// Function to check if current time is within the allowed time range (9:30 AM to 4:00 PM EST)
const isWithinTimeRange = (now: Date): boolean => {
  // Get the current time in EST (Eastern Standard Time)
  const estTimeParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  }).formatToParts(now);

  // Extract the hour and minute from the parts
  const currentHour = parseInt(
    estTimeParts.find((part) => part.type === "hour")?.value || "0",
    10
  );
  const currentMinute = parseInt(
    estTimeParts.find((part) => part.type === "minute")?.value || "0",
    10
  );

  console.log({ currentHour, currentMinute });

  // Convert current time, start time, and end time into minutes
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const startTimeInMinutes = config.startHour * 60 + config.startMin;
  const endTimeInMinutes = config.endHour * 60 + config.endMin;

  // Check if the current time is within the specified range
  return (
    currentTimeInMinutes >= startTimeInMinutes &&
    currentTimeInMinutes < endTimeInMinutes
  );
};

// Function to check if enough time has passed since the last message
const isCooldownOver = (now: Date): boolean => {
  if (!lastMessageTime) return true;
  const diff = (now.getTime() - lastMessageTime.getTime()) / (1000 * 60); // Difference in minutes
  return diff >= currentCooldownMinutes;
};

// Schedule messages every 10 seconds between 9:30 AM - 4:00 PM EST
const scheduleMessages = () => {
  const job = schedule.scheduleJob("*/120 * * * * *", async () => {
    const now = new Date();

    // Check if today is a weekday, not a holiday, within time range, and cooldown is over
    if (
      isWeekday(now) &&
      !isHoliday(now) &&
      isWithinTimeRange(now) &&
      isCooldownOver(now)
    ) {
      try {
        const channel = (await client.channels.fetch(
          CHANNEL_ID
        )) as TextChannel;
        await sendMessage(channel);
        lastMessageTime = new Date(); // Update last message time
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.log(
        `Skipping message at ${now}: Not a weekday, it's a holiday, or outside of time range`
      );
    }
  });
};

// Bot ready event
client.once("ready", () => {
  console.log("Bot is online and ready!");
  scheduleMessages(); // Start scheduling messages
});

// Log in to Discord
if (DISCORD_TOKEN) {
  client.login(DISCORD_TOKEN);
} else {
  console.error("Please provide a Discord token in the .env file.");
}
