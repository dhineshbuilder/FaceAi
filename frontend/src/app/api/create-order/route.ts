import { NextResponse } from 'next/server';

const PLANS_DATA: Record<string, { name: string; inr: number; usd: number; max_emp: number }> = {
  starter_monthly: { name: 'Starter', inr: 9471, usd: 99, max_emp: 50 },
  pro_monthly: { name: 'Professional', inr: 28605, usd: 299, max_emp: 500 },
  enterprise_monthly: { name: 'Enterprise', inr: 76440, usd: 799, max_emp: -1 },
};

export async function POST(req: Request) {
  try {
    const { plan_id, currency = 'INR', user_id = 1 } = await req.json();
    const plan = PLANS_DATA[plan_id] || PLANS_DATA.pro_monthly;

    const amount = currency === 'USD' ? plan.usd : plan.inr;
    const amountSubunits = Math.round(amount * 100);
    const internalOrderId = `ORD_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const gatewayOrderId = `order_sim_${Math.random().toString(36).substring(2, 12)}`;

    return NextResponse.json({
      success: true,
      order_id: gatewayOrderId,
      internal_order_id: internalOrderId,
      plan_id,
      plan_name: plan.name,
      amount: amountSubunits,
      display_amount: amount,
      currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_51NgExampleKey',
      company_name: 'SBS Technologies - FaceAI'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
