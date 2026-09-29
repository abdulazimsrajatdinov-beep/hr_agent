import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      include: { vacancy: true },
      orderBy: { appliedAt: 'desc' }
    });
    return NextResponse.json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Check for cooldown / active application
    if (data.chatId) {
      const recentCandidate = await prisma.candidate.findFirst({
        where: { chatId: data.chatId },
        orderBy: { appliedAt: 'desc' }
      });

      if (recentCandidate) {
        const activeStatuses = ["Arza qaldırdı", "AI Intervyuda", "Bahalandı"];
        if (activeStatuses.includes(recentCandidate.status)) {
          return NextResponse.json({ error: "Sizdiń arzańız HR tárepinen kórip shıǵılmaqta. Iltimas, juwaptı kútiń!" }, { status: 400 });
        }
        
        // Cooldown period: 30 days
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
        if (new Date(recentCandidate.appliedAt) > oneMonthAgo) {
          return NextResponse.json({ error: "Siz jaqında ǵana arza tapsırǵansız. Iltimas, 1 aydan soń qayta urınıp kóriń." }, { status: 400 });
        }
      }
    }

    const candidate = await prisma.candidate.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        username: data.username,
        birthDate: data.birthDate,
        university: data.university,
        major: data.major,
        gradYear: data.gradYear,
        prevCompany: data.prevCompany,
        prevRole: data.prevRole,
        achievements: data.achievements,
        skills: data.skills ? JSON.stringify(data.skills) : null,
        portfolioUrl: data.portfolioUrl,
        resumeUrl: data.resumeUrl || null,
        vacancyId: data.vacancyId || null,
        status: data.status || "Arza qaldırdı",
        aiScore: data.aiScore || null,
        chatId: data.chatId || null,
      }
    });
    return NextResponse.json(candidate);
  } catch (error) {
    console.error("Error creating candidate:", error);
    return NextResponse.json({ error: "Failed to create candidate" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, status, aiScore } = data;
    const candidate = await prisma.candidate.update({
      where: { id },
      data: { status, aiScore }
    });

    // Send Telegram notification if hired
    if (status === "Qabıllandı" && candidate.chatId) {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      if (token) {
        const baseUrl = process.env.WEB_APP_URL || 'https://texnopos-hr-ai.vercel.app';
        const onboardingUrl = `${baseUrl}/onboarding/${candidate.id}`;
        const message = `🎉 Qutlıqlaymız, ${candidate.fullName}!\n\nSiz Diyar Market komandasına qabıllandıńız!\n\nTómendegi silteme arqalı jeke Onboarding (Adaptaciya) portalińizge kiriń hám wazıypalar menen tanısıń:\n\n👉 <a href="${onboardingUrl}">Onboarding Portalǵa Kiriw</a>`;
        
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: candidate.chatId,
            text: message,
            parse_mode: "HTML"
          })
        }).catch(err => console.error("Telegram send error:", err));
      }
    }

    return NextResponse.json(candidate);
  } catch (error) {
    console.error("Error updating candidate:", error);
    return NextResponse.json({ error: "Failed to update candidate" }, { status: 500 });
  }
}
