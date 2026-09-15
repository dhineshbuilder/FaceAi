import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    return NextResponse.json({
      success: true,
      status: 'subscription_activated',
      event: payload.event || 'order.paid'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
