import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import schedule from "node-schedule";
import dotenv from "dotenv";
import fs from "fs";
import { holidays } from "./config";
dotenv.config();

// Define the type for holiday objects
interface Holiday {
  name: string;
  date: string;
  day: string;
}

// Initialize Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Pre-written messages to be sent
const messages = [
  "Align your decisions with your values—start the 4-Step Process now.",
  "Focus on what matters most. Are you practicing the 4-Steps today?",
  "Remember why you started. Take a moment for the 4-Step Sound Psych Process.",
  "Your values are your compass—use the 4-Steps to navigate your day.",
  "Strengthen your focus, reinforce your values—time for the 4-Steps.",
  "Honor your commitments to yourself—do the 4-Steps now.",
  "One step closer to balance—take time for the 4-Step Process.",
  "Have you checked in with your values today? Do the 4-Steps.",
  "A small effort now leads to big gains later—work the 4-Steps.",
  "Let your actions reflect your priorities—engage in the 4-Step Process.",
  "Your future self will thank you—start the 4 Steps today.",
  "Remember, consistency builds mastery—do the 4-Steps.",
  "Stay true to your values—commit to the 4-Step Process.",
  "Your best decisions come from a clear mind—take time for the 4-Steps.",
  "Keep your goals in sight—use the 4-Steps to stay on track.",
  "Success is built on small, consistent actions—do the 4-Steps.",
  "Your values guide your path—let the 4 steps lead the way.",
  "Pause, reflect, and act—time for the 4-Step Process.",
  "Let your actions today reflect the person you want to become—start with the 4 steps.",
  "Balance your life, balance your trading—practice the 4-Steps.",
  "Are your decisions aligning with your values? Take a moment for the 4-Steps.",
  "Prioritize what matters—use the 4-Steps to guide your day.",
  "Small steps, big impact—work through the 4 Steps.",
  "Focus on your values, focus on the 4-Step Process.",
  "The best decisions are value-driven—take time for the 4-Steps.",
  "Remember your why—start with the 4-Step Sound Psych Process.",
  "Consistency breeds success—commit to the 4-Steps.",
  "Align your actions with your aspirations—do the 4 steps.",
  "Stay grounded in your values—practice the 4-Steps.",
  "Your values are the foundation of your decisions—use the 4-Steps.",
  "Strength comes from within—nurture it with the 4-Step Process.",
  "Stay focused, stay committed—start the 4-Steps today.",
  "Your values deserve your attention—take time for the 4-Steps.",
  "The 4-Steps are your pathway to clarity—use them wisely.",
  "Prioritize your well-being—engage in the 4-Step Process.",
  "Let today’s decisions reflect your deepest values—start with the 4-Steps.",
  "Mindful actions lead to meaningful outcomes—practice the 4-Steps.",
  "Your success is rooted in your values—do the 4-Steps.",
  "Ground yourself in what matters most—begin the 4-Step Process.",
  "Align your life with your values—use the 4 Steps as your guide.",
  "Your values are the bedrock of your decisions—commit to the 4-Steps.",
  "Clear your mind, focus your energy—take time for the 4-Steps.",
  "Let your decisions today reflect your values—start the 4-Steps.",
  "Stay true to your path—use the 4 steps to stay aligned.",
  "Your values are your anchor—practice the 4-Step Process.",
  "Consistency is key—commit to the 4-Steps today.",
  "Stay focused on what matters—take time for the 4-Step Sound Psych Process.",
  "Let your values guide your actions—start with the 4 steps.",
  "Reinforce your values with mindful decisions—practice the 4-Steps.",
  "Align your trading with your life’s values—take time for the 4-Steps.",
  "Keep your priorities straight—do the 4-Steps now.",
  "The 4-Steps are your roadmap to balanced decisions—use them.",
  "Stay grounded in your values—take a moment for the 4-Step Process.",
  "Reflect, realign, and act—engage in the 4-Steps.",
  "Your decisions shape your future—make them count with the 4-Steps.",
  "Stay true to your values—commit to the 4-Step Sound Psych Process.",
  "Consistency builds resilience—practice the 4-Steps today.",
  "Your best decisions come from a calm mind—use the 4-Steps.",
  "Keep your values front and center—start the 4-Steps now.",
  "Small actions lead to big changes—commit to the 4-Steps.",
  "Stay aligned with your values—practice the 4-Step Process.",
  "Remember what matters—take time for the 4-Steps.",
  "Your values are your guide—use the 4-Steps to stay on course.",
  "Stay focused, stay aligned—commit to the 4-Steps.",
  "Let your values guide your actions—practice the 4-Step Process.",
  "Your decisions reflect your priorities—make them count with the 4-Steps.",
  "Reinforce your values with every decision—use the 4-Steps.",
  "Stay true to your path—practice the 4 Steps today.",
  "Let your deepest values guide your actions today—start with the 4 steps.",
  "Your values are your compass—use the 4-Steps to navigate your day.",
  "Stay committed to your values—do the 4-Steps now.",
  "Consistency leads to mastery—practice the 4-Steps.",
  "Let your values drive your decisions—take time for the 4-Step Process.",
  "Small steps, big impact—engage in the 4-Steps.",
  "Stay aligned with your values—use the 4 Steps as your guide.",
  "Your decisions today shape your tomorrow—commit to the 4-Steps.",
  "Stay focused on your values—take time for the 4-Step Sound Psych Process.",
  "Your values are your foundation—practice the 4-Steps now.",
  "Stay true to your principles—use the 4-Steps to stay grounded.",
  "Your best decisions come from a clear mind—engage in the 4-Step Process.",
  "Let your actions reflect your priorities—commit to the 4-Steps.",
  "Stay focused on what matters most—practice the 4-Steps today.",
  "Your values deserve your attention—take time for the 4-Step Process.",
  "Small, consistent actions lead to big results—commit to the 4-Steps.",
  "Your values are your anchor—stay grounded with the 4-Steps.",
  "Let your decisions reflect your deepest values today—start the 4-Step Process.",
  "Stay true to your values—commit to the 4-Steps now.",
  "Your actions today shape your future—make them count with the 4-Steps.",
  "Stay aligned with your values—practice the 4-Step Sound Psych Process.",
  "Your best decisions come from a place of clarity—use the 4-Steps.",
  "Let your values guide your path—commit to the 4-Steps.",
  "Stay focused, stay true—practice the 4-Step Process today.",
  "Your values are your compass—use the 4-Steps to stay on course.",
  "Consistency builds success—engage in the 4-Steps now.",
  "Let your decisions reflect your principles—commit to the 4-Steps.",
  "Stay aligned with your values—take time for the 4-Step Process.",
  "Your actions today reflect your priorities—make them count with the 4-Steps.",
  "Let your values guide your decisions—practice the 4-Step Sound Psych Process.",
  "Stay true to your path—commit to the 4 steps now.",
  "Your future self will thank you—take time for the 4-Step Process today.",
  // Add as many messages as you'd like
];

// Load environment variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

// Ensure CHANNEL_ID is available
if (!CHANNEL_ID) {
  console.error("CHANNEL_ID is not defined. Please set it in the .env file.");
  process.exit(1); // Exit the process if CHANNEL_ID is not defined
}

// Variables to track message sending
let lastMessageTime: Date | null = null; // Last message sent time
let currentCooldownMinutes = 1; // Minimum cooldown between messages in minutes

// Discord role ID for tagging
//const ROLE_ID = "1206860573375987762"; // Use the provided role ID
const ROLE_ID = "1206860573375987762";

// Function to check if today is a weekday
const isWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // 1 = Monday, 5 = Friday
};

// Function to check if today is a federal holiday
const isHoliday = (date: Date): boolean => {
  const today = date.toISOString().split("T")[0]; //Format: YYYY-MM-DD
  return holidays.some((holiday: Holiday) => holiday.date === today);
};

// Function to get a random message from the list
const getRandomMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

// Function to get a random cooldown between 40 and 60 minutes
const getRandomCooldownMinutes = (): number => {
  return Math.floor(Math.random() * (60 - 40 + 1)) + 40; // Random between 40 and 60
};

const sendMessage = async (channel: TextChannel) => {
  const randomMessage = getRandomMessage();

  try {
    const role = await channel.guild.roles.fetch(ROLE_ID);
    if (!role) {
      console.log("Role not found.");
      return;
    }

    // Check if the role is mentionable
    if (!role.mentionable) {
      await role.edit({ mentionable: true });
      console.log("Role is not mentionable.");
      return;
    }

    // Create the message with role mention
    const messageWithRole = `<@&${ROLE_ID}> ${randomMessage}`;

    // Send the message with the role mention
    const sentMessage = await channel.send(messageWithRole);
    console.log(`Message sent: ${messageWithRole}`);

    // Schedule message deletion after 20 minutes
    setTimeout(async () => {
      try {
        await sentMessage.delete();
        console.log(`Message deleted: ${messageWithRole}`);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }, 1 * 60 * 1000); // 20 minutes delete

    // After sending the message, revert the role mentionable status
    if (!role.mentionable) {
      await role.edit({ mentionable: false });
      console.log("Reverted the role mentionable status.");
    }
  } catch (error) {
    console.error("Error fetching or sending role:", error);
  }

  // const sentMessage = await channel.send(randomMessage);
  // console.log(`Message sent: ${randomMessage}`);

  // // Schedule message deletion after 20 minutes
  // setTimeout(async () => {
  //   try {
  //     await sentMessage.delete();
  //     console.log(`Message deleted: ${randomMessage}`);
  //   } catch (error) {
  //     console.error("Error deleting message:", error);
  //   }
  // }, 1 * 60 * 1000); // 20 minutes

  // Set a new random cooldown after sending the message
  currentCooldownMinutes = getRandomCooldownMinutes();
  lastMessageTime = new Date(); // Update last message time
  console.log(`New cooldown set to ${currentCooldownMinutes} minutes.`);
};

// Function to check if current time is within the allowed time range (9:30 AM to 4:00 PM EST)
const isWithinTimeRange = (now: Date): boolean => {
  //return true;
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

  // Time range (in EST)
  const startHour = 1;
  const startMinute = 30;
  const endHour = 16; // 4:00 PM
  const endMinute = 0;

  // Convert current time, start time, and end time into minutes
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;

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
  const job = schedule.scheduleJob("*/30 * * * * *", async () => {
    const now = new Date();

    // Check if today is a weekday, not a holiday, within time range, and cooldown is over
    if (
      isWeekday(now) &&
      !isHoliday(now) &&
      isWithinTimeRange(now)
      //isCooldownOver(now)
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
