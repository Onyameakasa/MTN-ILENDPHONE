const { Telegraf } = require("telegraf");
const fetch = require("node-fetch");

// ===== CONFIGURATION =====
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8883385216:AAFj6cjQmV9kd7-wf6EZcSnlhuvLlO-PI88";
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "8889432014";
const KV_STORE_URL = process.env.KV_STORE_URL || "https://kvstore.manus.im";
// ===== END CONFIGURATION =====

const bot = new Telegraf(BOT_TOKEN);

// Function to update payment status in KV store
async function updatePaymentStatus(paymentId, status) {
    try {
        const response = await fetch(`${KV_STORE_URL}/set/${paymentId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: status, ttl: 3600 }) // Store for 1 hour
        });
        if (!response.ok) {
            throw new Error(`KV Store update failed: ${response.statusText}`);
        }
        console.log(`Payment ${paymentId} status updated to ${status} in KV store.`);
    } catch (error) {
        console.error(`Error updating KV store for payment ${paymentId}:`, error);
    }
}

bot.action(/approve_(.+)/, async (ctx) => {
    const paymentId = ctx.match[1];
    await updatePaymentStatus(paymentId, "approved");
    ctx.editMessageText(`✅ Payment ID ${paymentId} has been <b>APPROVED</b>.`, { parse_mode: "HTML" });
    console.log(`Payment ${paymentId} approved.`);
});

bot.action(/decline_(.+)/, async (ctx) => {
    const paymentId = ctx.match[1];
    await updatePaymentStatus(paymentId, "declined");
    ctx.editMessageText(`❌ Payment ID ${paymentId} has been <b>DECLINED</b>.`, { parse_mode: "HTML" });
    console.log(`Payment ${paymentId} declined.`);
});

bot.launch();
console.log("Telegram bot bridge started.");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
