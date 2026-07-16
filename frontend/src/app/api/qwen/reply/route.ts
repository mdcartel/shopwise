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
        const response = await fetch("http://127.0.0.1:8080/api/qwen/reply", {
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
      const messagesStr = JSON.stringify(messages).toLowerCase();
      let reply = "Hi, thank you for reaching out! We have received your query and are looking into it. We will get back to you shortly. Best regards, ShopWise Support (Demo Mode)";
      if (messagesStr.includes("shipping") || messagesStr.includes("package") || messagesStr.includes("where")) {
        reply = "Hi, your order has been dispatched from our warehouse. The carrier tracking page should update shortly. Best regards, ShopWise Support (Demo Mode)";
      } else if (messagesStr.includes("bulk") || messagesStr.includes("wholesale") || messagesStr.includes("corporate")) {
        reply = "Hi, thanks for your inquiry! We offer discounted pricing tiers for bulk and wholesale orders. Please let us know the quantity you need, and we will get back to you with a custom quote. Best regards, ShopWise Support (Demo Mode)";
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
    console.error("Next.js Route Handler error in reply:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
