import { Client, GatewayIntentBits, TextChannel, Role } from "discord.js";
import dotenv from "dotenv";
import schedule from "node-schedule";
import moment from "moment-timezone";

dotenv.config();

// Define constants from environment variables
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID!; // Target channel where the bot will send messages
const ROLE_ID = "1206860573375987762"; // The role ID to mention in the message
const EST_TIMEZONE = "America/New_York";
const HOLIDAYS = [
  "2024-01-01", // Example holiday (New Year's Day)
  "2024-01-15",
  "2024-02-19",
  "2024-05-27",
  "2024-06-19",
  "2024-07-04",
  "2024-09-02",
  "2024-10-14",
  "2024-11-11",
  "2024-11-28",
  "2024-12-25", // Christmas
];

// Messages to be sent randomly
const MESSAGES = [
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
];

// Initialize Discord client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    // GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.MessageContent,
  ],
});

// Function to check if today is a holiday
function isHoliday(): boolean {
  const today = moment().tz(EST_TIMEZONE).format("YYYY-MM-DD");
  return HOLIDAYS.includes(today);
}

// Function to check if today is a weekend
function isWeekend(): boolean {
  const day = moment().tz(EST_TIMEZONE).day();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

// Function to get a random message
function getRandomMessage(): string {
  const randomIndex = Math.floor(Math.random() * MESSAGES.length);
  return MESSAGES[randomIndex];
}

// Function to delete a message after 15 minutes
function deleteMessageAfterTime(message: any, delay: number) {
  setTimeout(() => {
    message
      .delete()
      .then(() =>
        console.log(`Message deleted after ${delay / 60000} minutes.`)
      )
      .catch((err: any) => console.error("Failed to delete message:", err));
  }, delay);
}

// Function to schedule random messages between 9:30 AM and 4:00 PM EST
function scheduleMessages() {
  const sendMessageTimes = generateRandomTimes(5); // Generate 5 random times

  sendMessageTimes.forEach((time) => {
    schedule.scheduleJob(time, async () => {
      // Check again if it's a weekend or holiday
      if (isWeekend() || isHoliday()) return;

      const channel = client.channels.cache.get(CHANNEL_ID) as TextChannel;
      if (!channel) return;

      // Get the role
      const role = channel.guild.roles.cache.get(ROLE_ID) as Role;
      if (!role) {
        console.log("Role not found.");
        return;
      }

      // Create the message with role mention
      const randomMessage = getRandomMessage();
      const messageWithRole = `<@&${ROLE_ID}> ${randomMessage}`; // Role mention

      // Send the message with the role mention
      const sentMessage = await channel.send(messageWithRole);
      console.log(`Message sent: ${messageWithRole}`);

      // Delete the message after 15 minutes (900000 milliseconds)
      deleteMessageAfterTime(sentMessage, 15 * 60 * 1000);
    });
  });
}

// Function to generate random times between 9:30 AM and 4:00 PM EST with 40-minute intervals
function generateRandomTimes(count: number): Date[] {
  const times: Date[] = [];
  const startTime = moment.tz("09:30", "HH:mm", EST_TIMEZONE);
  const endTime = moment.tz("16:00", "HH:mm", EST_TIMEZONE);

  while (times.length < count) {
    const randomMinutes = Math.floor(
      Math.random() * endTime.diff(startTime, "minutes")
    );
    const candidateTime = startTime
      .clone()
      .add(randomMinutes, "minutes")
      .toDate();

    // Ensure that the time is spaced by at least 40 minutes
    if (times.every((t) => moment(candidateTime).diff(t, "minutes") >= 40)) {
      times.push(candidateTime);
    }
  }

  return times;
}

// Event handler when the bot is ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);

  // Schedule messages only on weekdays
  if (!isWeekend() && !isHoliday()) {
    scheduleMessages();
  }

  // Recheck every day at midnight to schedule messages for the next day
  schedule.scheduleJob("0 0 * * *", () => {
    if (!isWeekend() && !isHoliday()) {
      scheduleMessages();
    }
  });
});

// Login to Discord with your app's token
client.login(TOKEN);
