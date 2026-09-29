import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const vacancies = await prisma.vacancy.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(vacancies);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vacancies" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const vacancy = await prisma.vacancy.create({
      data: {
        title: data.title,
        department: data.department,
        type: data.type,
        location: data.location,
        salary: data.salary,
        description: data.description,
        isActive: data.isActive ?? true,
      }
    });
    return NextResponse.json(vacancy);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create vacancy" }, { status: 500 });
  }
}
