import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const sops = await prisma.sOP.findMany({
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(sops);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch SOPs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const sop = await prisma.sOP.create({
      data: {
        title: data.title,
        content: data.content,
        order: data.order || 0
      }
    });
    return NextResponse.json(sop);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create SOP" }, { status: 500 });
  }
}
