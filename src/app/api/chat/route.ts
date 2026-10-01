import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';

export const maxDuration = 60; // Allow Vercel up to 60 seconds for Gemini API response

// Initialize Gemini SDK. Wait until API handles the request to read process.env to ensure it's loaded.
export async function POST(req: Request) {
  try {
    const { messages, candidateId } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { text: "Keshirersiz, sistemada AI API gilti sazlanbag'an (.env da GEMINI_API_KEY joq)." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Fetch candidate info to personalize the prompt
    let candidateContext = "";
    let vacancyContext = "";
    
    if (candidateId) {
       const candidate = await prisma.candidate.findUnique({ 
         where: { id: candidateId },
         include: { vacancy: true }
       });
       if (candidate) {
          candidateContext = `Kandidat atı: ${candidate.fullName || 'Belgisiz'}. Qánigeligi: ${candidate.major || candidate.prevRole || 'Belgisiz'}. Jetiskenlikleri: ${candidate.achievements || 'Joq'}. Kónlikpeleri: ${candidate.skills || 'Joq'}`;
          if (candidate.vacancy) {
            vacancyContext = `Vakansiya atamasí: ${candidate.vacancy.title}. Talapları: ${candidate.vacancy.description || 'Kórsetilmegen'}.`;
          }
       }
    }

    const systemPrompt = `
      Sen Real HR — Real Education zamanagóy tálim orayınıń professional HR AI Asistentisań.
      Kandidattı komandaǵa qabıllaw ushın professional intervyu alıp atırsań.
      Kandidat haqqında formadan alınǵan maǵlıwmatlar: ${candidateContext}
      ${vacancyContext ? `\nKandidat mına vakansiyaǵa arza tapsırǵan: ${vacancyContext}\nSeniń wazıypań usı vakansiya talaplarına mas keletuǵın arnawlı sorawlar beriw (Mısalı: eger "Oqıtıwshı/Mentor" bolsa, pedagogikalıq metodika, studentler menen islesiw hám pán biliwin sora. Eger "Administrator" bolsa, studentler hám ata-analar menen qarım-qatnas, esap-kitap hám intizamdı sora. Eger "Satıw/Menedjer" bolsa, kurslardı tanıstırıw hám kommunikaciyanı sora. Eger "IT/Dástúrlew" bolsa, ámeliy tájiriybeni sora).` : ''}
      
      Kórsetpeler:
      1. Kandidattıń juwabına qarap mánisli, qıtqı hám pikirlewdi talap etetuǵın qosımsha sorawlar ber.
      2. Mútajlik bolsa kandidattıń arnawlı bilimlerin (situatsiya berip yamasa tarawǵa tiyisli sorawlar arqalı) teksere alasań.
      3. Tek Qaraqalpaq tilinde sóyles (yamasa kandidat basqa tilde jazsa, sol tilge maslas).
      4. Hár bir xabarıń qısqa hám anıq bolsın. Kóp qatar jazba.
      5. Eger intervyunı juwmaqlaw waqtı keldi dep tapsań (ádette 3-4 ret almasıwdan soń yamasa kandidat barin aytıp boldım dese), kandidattıń ulıwma bilimlerin 0 den 100 ge shekem bahala hám óz tekstingdiń eń aqırına mına formatta jaz: [SCORE:85] (mısal ushın 85 ball). Bul arqalı sistema intervyunı toqtatadı.
    `;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      systemInstruction: systemPrompt 
    });

    // Format history for Gemini (history must start with 'user' and alternate)
    const historyMessages = messages.slice(0, -1);
    // Skip the first message if it's from AI (the initial greeting)
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

    // Check if score is given
    const scoreMatch = text.match(/\[SCORE:(\d+)\]/);
    let finalScore = null;
    let cleanText = text;

    if (scoreMatch) {
      finalScore = parseInt(scoreMatch[1], 10);
      cleanText = text.replace(scoreMatch[0], '').trim();
    }

    // Save chat history to DB
    if (candidateId) {
      const fullMessages = [...messages, { sender: 'ai', text: cleanText }];
      const updateData: any = { interviewChat: JSON.stringify(fullMessages) };
      
      if (scoreMatch) {
        updateData.aiScore = finalScore;
        updateData.status = "Bahalandı";
      }

      await prisma.candidate.update({
        where: { id: candidateId },
        data: updateData
      });
    }

    return NextResponse.json({ text: cleanText, isFinished: !!scoreMatch, score: finalScore });

  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to generate AI response: " + (error.message || String(error)) }, { status: 500 });
  }
}
