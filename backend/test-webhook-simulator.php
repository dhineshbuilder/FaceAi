<?php
/**
 * FaceAI - Interactive Local Webhook & Payment Simulator
 * Company: SBS Technologies
 * Open in browser: http://localhost:8000/test-webhook-simulator.php
 */
require_once __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FaceAI - Razorpay Payment & Webhook Simulator</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen py-10 px-4 font-sans">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
            <div>
                <h1 class="text-2xl font-bold text-blue-400">⚡ FaceAI Local Payment Simulator</h1>
                <p class="text-sm text-slate-400 mt-1">SBS Technologies • Test Mode & Webhook Verifier</p>
            </div>
            <span class="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs rounded-full font-semibold">
                Localhost 8000
            </span>
        </div>

        <!-- 3-Step Simulation Grid -->
        <div class="grid md:grid-cols-2 gap-6">
            <!-- Simulator Controls -->
            <div class="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
                    <span>💳</span> 1-Click Payment Simulation
                </h2>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 mb-1">SELECT PLAN TO SIMULATE</label>
                        <select id="simPlan" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm">
                            <option value="starter_monthly">Starter (₹9,471 / $99)</option>
                            <option value="pro_monthly" selected>Professional (₹28,605 / $299)</option>
                            <option value="enterprise_monthly">Enterprise (₹76,440 / $799)</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-400 mb-1">CURRENCY</label>
                        <div class="flex gap-3">
                            <label class="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="currency" value="INR" checked class="accent-blue-500"> INR (₹)
                            </label>
                            <label class="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="radio" name="currency" value="USD" class="accent-blue-500"> USD ($)
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-slate-400 mb-1">SIMULATED PAYMENT APP</label>
                        <select id="simMethod" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm">
                            <option value="UPI_GPAY">Google Pay (GPay UPI)</option>
                            <option value="UPI_PHONEPE">PhonePe UPI</option>
                            <option value="UPI_PAYTM">Paytm UPI</option>
                            <option value="UPI_WHATSAPP">WhatsApp Pay</option>
                            <option value="CREDIT_CARD">Credit / Debit Card (Visa/Mastercard)</option>
                        </select>
                    </div>

                    <button onclick="runSimulation()" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg shadow-blue-500/20">
                        🚀 Simulate Order Creation & Payment Webhook
                    </button>
                </div>
            </div>

            <!-- Live Output Logs -->
            <div class="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-sm font-bold text-slate-300">Live Execution Logs</h3>
                        <span id="statusBadge" class="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">Idle</span>
                    </div>
                    <pre id="logOutput" class="text-xs font-mono text-emerald-400 bg-slate-900/60 p-4 rounded-lg overflow-x-auto h-64 border border-slate-800/80">Ready to test. Click the button on the left to simulate a full payment & webhook lifecycle...</pre>
                </div>

                <div class="pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                    <span>HMAC-SHA256: <strong class="text-slate-300">Active</strong></span>
                    <span>Database: <strong class="text-slate-300">faceai_billing</strong></span>
                </div>
            </div>
        </div>
    </div>

    <script>
        async function runSimulation() {
            const planId = document.getElementById('simPlan').value;
            const currency = document.querySelector('input[name="currency"]:checked').value;
            const method = document.getElementById('simMethod').value;
            const log = document.getElementById('logOutput');
            const badge = document.getElementById('statusBadge');

            badge.className = 'text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 animate-pulse';
            badge.textContent = 'Executing...';
            log.textContent = `[1/3] Step 1: Initializing Order for ${planId} (${currency})...\n`;

            try {
                // Step 1: Create Order
                const res1 = await fetch('create-order.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plan_id: planId, currency: currency, user_id: 1 })
                });
                const orderData = await res1.json();
                log.textContent += `[2/3] Order Created:\n` + JSON.stringify(orderData, null, 2) + `\n\n`;

                // Step 2: Simulate Razorpay signed webhook
                log.textContent += `[3/3] Simulating Razorpay order.paid Webhook (App: ${method})...\n`;
                const webhookPayload = {
                    event: "order.paid",
                    event_id: "evt_sim_" + Math.random().toString(36).substring(2, 9),
                    payload: {
                        payment: {
                            entity: {
                                id: "pay_sim_" + Math.random().toString(36).substring(2, 9),
                                order_id: orderData.order_id,
                                method: method,
                                amount: orderData.amount,
                                currency: currency,
                                status: "captured"
                            }
                        }
                    }
                };

                const res2 = await fetch('webhook.php?simulate=true', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(webhookPayload)
                });
                const webhookRes = await res2.json();
                log.textContent += `Webhook Response:\n` + JSON.stringify(webhookRes, null, 2) + `\n\n`;

                // Step 3: Verify access
                const res3 = await fetch('check-access.php?user_id=1');
                const accessData = await res3.json();
                log.textContent += `SUCCESS! Live Subscription in MySQL:\n` + JSON.stringify(accessData, null, 2);

                badge.className = 'text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold';
                badge.textContent = 'SUCCESS (Active)';
            } catch (err) {
                log.textContent += `\nError: ` + err.message;
                badge.className = 'text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300';
                badge.textContent = 'FAILED';
            }
        }
    </script>
</body>
</html>
