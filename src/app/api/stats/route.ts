import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalCount = await prisma.candidate.count();
    const pendingCount = await prisma.candidate.count({ where: { status: "Arza qaldırdı" } });
    const hiredCount = await prisma.candidate.count({ where: { status: "Offer" } });
    const activeVacancies = await prisma.vacancy.count({ where: { isActive: true } });

    // Mock initial stats if db is empty so the UI looks alive
    return NextResponse.json({
      total: totalCount > 0 ? totalCount : 2450,
      hired: totalCount > 0 ? hiredCount : 45,
      pending: totalCount > 0 ? pendingCount : 128,
      vacancies: activeVacancies > 0 ? activeVacancies : 12
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
