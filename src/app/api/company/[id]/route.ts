import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const info = await prisma.companyInfo.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        stats: data.stats ? JSON.stringify(data.stats) : null,
      }
    });
    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update company info" }, { status: 500 });
  }
}
