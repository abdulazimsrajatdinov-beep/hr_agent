import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const info = await prisma.companyInfo.findMany();
    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch company info" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const info = await prisma.companyInfo.create({
      data: {
        title: data.title,
        description: data.description,
        stats: data.stats ? JSON.stringify(data.stats) : null,
      }
    });
    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create company info" }, { status: 500 });
  }
}
