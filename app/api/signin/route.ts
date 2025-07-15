// ✅ CORRECT (has export)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Signed in' });
}
