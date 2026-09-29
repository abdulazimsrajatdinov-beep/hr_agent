import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const sop = await prisma.sOP.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        order: data.order
      }
    });
    return NextResponse.json(sop);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update SOP" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.sOP.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete SOP" }, { status: 500 });
  }
}
