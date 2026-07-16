import { NextResponse } from "next/server";

const DASHSCOPE_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let messages = body.messages;
    if (!messages && body.systemPrompt && body.userContent) {
      messages = [
        { role: "system", content: body.systemPrompt },
        { role: "user", content: body.userContent }
      ];
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Missing or invalid 'messages' array" }, { status: 400 });
    }

    // 1. Try to delegate to the local backend on port 8080 if it is active (local dev scenario)
    try {
      const backendHealth = await fetch("http://127.0.0.1:8080/health", { signal: AbortSignal.timeout(800) });
      if (backendHealth.ok) {
        const response = await fetch("http://127.0.0.1:8080/api/qwen/compose", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      }
    } catch (e) {
      // Local backend is not running or unreachable, fall back to self-handling
    }

    // 2. Self-handling: read key from env (Vercel or frontend/.env)
    const apiKey = process.env.QWEN_API_KEY || process.env.NEXT_PUBLIC_QWEN_API_KEY;
    const isDemoMode = !apiKey || apiKey === "your_qwen_api_key_here" || apiKey === "your_dashscope_api_key_here";

    if (isDemoMode) {
      const promptStr = JSON.stringify(messages).toLowerCase();
      let reply = "Hi, this is a mock outbound email drafted by the ShopWise Co-Pilot. Configure QWEN_API_KEY in the backend to generate real AI replies. Best regards, ShopWise Support (Demo Mode)";
      if (promptStr.includes("discount") || promptStr.includes("offer") || promptStr.includes("coupon")) {
        reply = "Hi, we appreciate you being a valued customer! Use coupon code LOYAL15 at checkout to receive 15% off your next order. Best regards, ShopWise Support (Demo Mode)";
      } else if (promptStr.includes("feedback") || promptStr.includes("review") || promptStr.includes("survey")) {
        reply = "Hi, we hope you are enjoying your recent purchase! Could you spare 2 minutes to share your feedback with us? It helps us improve our service. Best regards, ShopWise Support (Demo Mode)";
      }
      return NextResponse.json({
        reply,
        choices: [{ message: { content: reply } }],
        mock: true
      });
    }

    // 3. Make direct API call to Alibaba DashScope from server side (bypassing CORS)
    const response = await fetch(DASHSCOPE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-plus",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `DashScope returned ${response.status}: ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({
      reply: reply.trim(),
      ...data
    });
  } catch (err: any) {
    console.error("Next.js Route Handler error in compose:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
