import { NextResponse } from 'next/server';

// In-memory subscription store for local Next.js runtime demo
let activeSubscription = {
  has_active_subscription: true,
  plan_id: 'pro_monthly',
  plan_name: 'Professional',
  starts_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  features: {
    max_employees: 500,
    has_multi_face: true,
    has_liveness: true,
    has_geofencing: true,
    has_erp_integration: false,
    has_multi_site: false,
  }
};

export async function GET(req: Request) {
  return NextResponse.json(activeSubscription);
}

export async function POST(req: Request) {
  try {
    const { plan_id = 'pro_monthly' } = await req.json();
    const isEnterprise = plan_id === 'enterprise_monthly';
    const isPro = plan_id === 'pro_monthly';

    activeSubscription = {
      has_active_subscription: true,
      plan_id,
      plan_name: isEnterprise ? 'Enterprise' : (isPro ? 'Professional' : 'Starter'),
      starts_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      features: {
        max_employees: isEnterprise ? -1 : (isPro ? 500 : 50),
        has_multi_face: isEnterprise || isPro,
        has_liveness: isEnterprise || isPro,
        has_geofencing: isEnterprise || isPro,
        has_erp_integration: isEnterprise,
        has_multi_site: isEnterprise,
      }
    };

    return NextResponse.json({ success: true, subscription: activeSubscription });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
