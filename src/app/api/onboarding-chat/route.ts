import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';

export const maxDuration = 60; // Allow Vercel up to 60 seconds

export async function POST(req: Request) {
  try {
    const { messages, candidateId } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { text: "Keshirersiz, sistemada AI API gilti sazlanbag'an." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    let candidateContext = "";
    if (candidateId) {
       const candidate = await prisma.candidate.findUnique({ 
         where: { id: candidateId },
         include: { vacancy: true }
       });
       if (candidate) {
          candidateContext = `Kandidat (jańa xızmetker) atı: ${candidate.fullName || 'Belgisiz'}.`;
          if (candidate.vacancy) {
            candidateContext += ` Lawazımı: ${candidate.vacancy.title}.`;
          }
       }
    }

    const [tasks, sops, companyList] = await Promise.all([
      prisma.onboardingTask.findMany({ orderBy: { order: 'asc' } }),
      prisma.sOP.findMany({ orderBy: { order: 'asc' } }),
      prisma.companyInfo.findMany({ take: 1 })
    ]);

    const tasksText = tasks.length > 0 ? tasks.map((t, i) => `${i + 1}. ${t.title}`).join('\n') : 'Kórsetilmegen';
    const sopsText = sops.length > 0 ? sops.map(s => `- ${s.title}: ${s.content}`).join('\n') : 'Kórsetilmegen';
    const companyText = companyList[0] ? `${companyList[0].title}: ${companyList[0].description}` : 'Real Education — zamanagóy tálim, shet tilleri, IT hám kásip-óner orayı.';

    const systemPrompt = `
      Sen Real HR — Real Education zamanagóy tálim orayınıń "Onboarding (Adaptaciya)" boyınsha professional HR AI Asistentisań.
      Jumısqa jańa qabıl etilgen komanda aǵzası (oqıtıwshı, administrator yamasa mánedjer) menen sáwbetlesip atırsań.
      Xızmetker maǵlıwmatı: ${candidateContext}
      Kompaniya haqqında: ${companyText}
      Birinshi háptelik wazıypalar:
      ${tasksText}
      SOP hám İshki qaǵıydalar:
      ${sopsText}
      
      Seniń wazıypań:
      1. Xızmetkerdi Real Education komandasına qabıllanǵanı menen qızǵın qutlıqlaw hám onıń sorawlarına juwap beriw.
      2. Oray qaǵıydaları, sabaq/jumıs keste tártibi, wazıypalar hám jámáát haqqındaǵı sorawlarǵa túsiniwli, doslarsha hám ápiwayı tilde juwap beriw.
      3. Tek Qaraqalpaq tilinde sóyles (yamasa xızmetker basqa tilde jazsa, sol tilge maslas).
      4. Hár bir xabarıń qısqa hám anıq bolsın. Kóp qatar jazba.
      5. Eger xızmetker barlıǵın túsingenin aytsa, oǵan áwmet tile hám sáwbetti juwmaqla.
    `;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      systemInstruction: systemPrompt 
    });

    const historyMessages = messages.slice(0, -1);
    const validHistory = historyMessages[0]?.sender === 'ai' ? historyMessages.slice(1) : historyMessages;
    
    const formattedHistory = validHistory.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const lastMessage = messages[messages.length - 1].text;
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("AI Onboarding Error:", error);
    return NextResponse.json({ error: "Failed to generate AI response: " + (error.message || String(error)) }, { status: 500 });
  }
}
