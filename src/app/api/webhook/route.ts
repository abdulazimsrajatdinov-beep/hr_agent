import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const webAppUrl = process.env.WEB_APP_URL || 'https://real-hr-ai.vercel.app';

    if (!token) {
      return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN is missing' }, { status: 500 });
    }

    // Check if it's a message
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text;

      if (text === '/start') {
        // Send welcome message
        const responseUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        await fetch(responseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: "Sálem! Real HR — Real Education AI Recruitment platformasına xosh keldińiz.\n\nTómendegi túymeni basıp, vakansiyalar menen tanısıń hám arza qaldırıń:",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🚀 Arza tapsırıw", web_app: { url: webAppUrl } }]
              ]
            }
          })
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
