/**
 * Qwen AI Co-Pilot API Integration
 * Connects to Alibaba DashScope compatible OpenAI API.
 */

export interface GenerateReplyParams {
  customerName: string;
  customerEmail: string;
  customerStatus: string;
  communicationStyle?: string;
  memorySummary?: string;
  emailSubject: string;
  emailBody: string;
  storeName?: string;
  ownerName?: string;
}

const DASHSCOPE_API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

/**
 * Helper function to strip markdown symbols, asterisks, hash titles, and unnecessary quotes
 * to keep the generated response neat, well-arranged, and professional.
 */
export function cleanAIResponse(text: string): string {
  if (!text) return "";
  let clean = text.trim();
  
  // Strip outer quotes if wrapped by model
  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.slice(1, -1);
  } else if (clean.startsWith("'") && clean.endsWith("'")) {
    clean = clean.slice(1, -1);
  }

  // Remove bold markdown asterisks (**bold** -> bold)
  clean = clean.replace(/\*\*(.*?)\*\*/g, "$1");
  // Remove italic markdown asterisks (*italic* -> italic)
  clean = clean.replace(/\*(.*?)\*/g, "$1");
  // Remove markdown headers (#, ##, ###)
  clean = clean.replace(/###\s+/g, "");
  clean = clean.replace(/##\s+/g, "");
  clean = clean.replace(/#\s+/g, "");

  return clean.trim();
}

/**
 * Generates an email response using the Qwen model.
 * If the API key is not configured, it will simulate a high-quality AI reply with a demo notice.
 */
export async function generateQwenEmailReply(params: GenerateReplyParams): Promise<string> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.VITE_BACKEND_URL;
  const storeName = params.storeName || "ShopWise";
  const ownerName = params.ownerName || "Mark";

  // Build a highly contextual prompt for Qwen
  const systemPrompt = `You are an expert AI business co-pilot for a retail store named "${storeName}". 
Your job is to draft email replies to customer inquiries on behalf of the store owner, "${ownerName}".

Key Guidelines:
- Adopt a professional, friendly, and helpful tone.
- Match the customer's preferred communication style if provided.
- Keep the response concise, clear, and action-oriented.
- Address the customer by name.
- Sign off as "${ownerName}" from "${storeName}".
- Output ONLY the body of the reply email. Do not include subject lines, placeholders like [Your Name], or metadata.
- Do NOT use Markdown formatting (NEVER use asterisks like ** or # for headings) or unnecessary symbols. Output completely clean, plain, and professional text suitable for direct email sending.

Context about the customer:
- Name: ${params.customerName}
- Email: ${params.customerEmail}
- Lifecycle Status: ${params.customerStatus}
${params.communicationStyle ? `- Communication Style: ${params.communicationStyle}` : ""}
${params.memorySummary ? `- Customer Context Memory: ${params.memorySummary}` : ""}`;

  const userContent = `Incoming Customer Email:
Subject: ${params.emailSubject}
Body:
${params.emailBody}

Please draft a response to this email.`;

  // Route through the Alibaba Cloud deployed backend if URL is configured
  const isServer = typeof window === "undefined";
  const useBackend = !isServer || (backendUrl && backendUrl !== "your_backend_url_here");

  if (useBackend) {
    try {
      const fetchUrl = isServer 
        ? `${backendUrl || "http://127.0.0.1:8080"}/api/qwen/reply` 
        : `/api/qwen/reply`;

      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ systemPrompt, userContent }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Backend API returned ${response.status}: ${errText}`);
      }

      const data = await response.json();
      return cleanAIResponse(data.reply);
    } catch (error) {
      console.error("Backend Qwen API error:", error);
      throw error;
    }
  }

  const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY || process.env.VITE_QWEN_API_KEY;
  const isDemoMode = !apiKey || apiKey === "your_qwen_api_key_here";

  if (isDemoMode) {
    // Simulate API delay (800ms)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulated reply based on email content
    if (params.emailSubject.toLowerCase().includes("where") || params.emailBody.toLowerCase().includes("shipping") || params.emailBody.toLowerCase().includes("package")) {
      return `Hi ${params.customerName},

Thank you for reaching out! I apologize for the delay in updates. 

I've looked into your order and it has been dispatched from our warehouse. The carrier tracking page should update shortly. I will monitor it and email you the direct link once the carrier reports the first scan.

If you have any other questions in the meantime, feel free to let me know!

Best regards,
${ownerName}
${storeName}`;
    }

    if (params.emailBody.toLowerCase().includes("bulk") || params.emailBody.toLowerCase().includes("corporate") || params.emailBody.toLowerCase().includes("wholesale")) {
      return `Hi ${params.customerName},

Thanks for your inquiry! We would love to support your bulk ordering needs.

For large quantities, we offer discounted tier pricing. We can also provide customizations such as custom packaging or engraving depending on the products selected. 

Could you let me know the specific items you are interested in and your target delivery date? I'd be happy to prepare a detailed quote for you.

Best,
${ownerName}
${storeName}`;
    }

    return `Hi ${params.customerName},

Thank you for your message! 

I've received your request and am looking into it right away. I want to make sure we get this resolved for you as quickly as possible. I'll follow up with you shortly with more details.

Please let me know if there's anything else I can assist with in the meantime.

Best,
${ownerName}
${storeName}`;
  }

  try {
    const response = await fetch(DASHSCOPE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-plus",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      throw new Error("No choices returned from Qwen API");
    }

    return cleanAIResponse(reply);
  } catch (error: any) {
    console.error("Qwen API error:", error);
    throw new Error(`Direct Qwen API call failed: ${error.message}. Note: Browser security (CORS) blocks direct API calls to DashScope from frontend. Please use the backend URL for production/real API calls.`);
  }
}

export interface GenerateComposeParams {
  customerName: string;
  customerEmail: string;
  customerContext?: string;
  prompt: string;
  storeName?: string;
  ownerName?: string;
}

export async function generateQwenEmailCompose(params: GenerateComposeParams): Promise<string> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.VITE_BACKEND_URL;
  const storeName = params.storeName || "ShopWise";
  const ownerName = params.ownerName || "Mark";

  const systemPrompt = `You are an expert AI business co-pilot for a retail store named "${storeName}". 
Your job is to draft outbound emails to customers on behalf of the store owner, "${ownerName}".

Key Guidelines:
- Adopt a professional, friendly, and helpful tone.
- Keep the response concise, clear, and action-oriented.
- Address the customer by name.
- Sign off as "${ownerName}" from "${storeName}".
- Output ONLY the body of the outbound email. Do not include subject lines or placeholders like [Your Name].
- Do NOT use Markdown formatting (NEVER use asterisks like ** or # for headings) or unnecessary symbols. Output completely clean, plain, and professional text suitable for direct email sending.

Context about the customer:
- Name: ${params.customerName}
- Email: ${params.customerEmail}
${params.customerContext ? `- Customer Context Memory: ${params.customerContext}` : ""}`;

  const userContent = `Write an outbound email to this customer based on the following instruction/prompt:
"${params.prompt}"`;

  // Route through the Alibaba Cloud deployed backend if URL is configured
  const isServer = typeof window === "undefined";
  const useBackend = !isServer || (backendUrl && backendUrl !== "your_backend_url_here");

  if (useBackend) {
    try {
      const fetchUrl = isServer 
        ? `${backendUrl || "http://127.0.0.1:8080"}/api/qwen/compose` 
        : `/api/qwen/compose`;

      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ systemPrompt, userContent }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Backend API returned ${response.status}: ${errText}`);
      }

      const data = await response.json();
      return cleanAIResponse(data.reply);
    } catch (error) {
      console.error("Backend Qwen Compose API error:", error);
      throw error;
    }
  }

  const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY || process.env.VITE_QWEN_API_KEY;
  const isDemoMode = !apiKey || apiKey === "your_qwen_api_key_here";

  if (isDemoMode) {
    await new Promise((resolve) => setTimeout(resolve, 850));

    const promptLower = params.prompt.toLowerCase();

    if (promptLower.includes("discount") || promptLower.includes("offer") || promptLower.includes("coupon") || promptLower.includes("loyalty")) {
      return `Hi ${params.customerName},\n\nI wanted to reach out personally to thank you for being a valued customer of ${storeName}.\n\nAs a token of our appreciation, I've created a special discount code just for you. Use code LOYAL15 at checkout to receive 15% off your next order. We have some exciting new arrivals in stock that I think you'll love!\n\nPlease let me know if you need help finding anything.\n\nBest regards,\n${ownerName}\n${storeName}`;
    }

    if (promptLower.includes("apologize") || promptLower.includes("sorry") || promptLower.includes("delay") || promptLower.includes("mistake")) {
      return `Hi ${params.customerName},\n\nI'm writing to sincerely apologize for the delay regarding your recent interaction with us.\n\nWe always strive to deliver the best experience possible, but in this instance, we fell short of our standards. I have personally looked into the situation and taken steps to ensure it doesn't happen again. As a gesture of goodwill, I've credited a $10 gift coupon to your account.\n\nThank you for your patience and understanding.\n\nWarm regards,\n${ownerName}\n${storeName}`;
    }

    if (promptLower.includes("feedback") || promptLower.includes("review") || promptLower.includes("survey")) {
      return `Hi ${params.customerName},\n\nI hope you are enjoying your recent purchase from ${storeName}!\n\nWe are constantly working to improve our products and service, and your feedback is incredibly important to us. Could you spare 2 minutes to share your thoughts on your experience? We'd love to know what we did well and how we can make things even better.\n\nThank you so much for your time and support!\n\nBest,\n${ownerName}\n${storeName}`;
    }

    return `Hi ${params.customerName},\n\nI hope this email finds you well.\n\nI wanted to follow up on our recent communications and see if there was anything else we could help you with. Our team is always here to make sure you have a great experience with our items.\n\nLet me know if you have any questions or if there is anything we can do for you!\n\nBest regards,\n${ownerName}\n${storeName}`;
  }

  try {
    const response = await fetch(DASHSCOPE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "qwen-plus",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`API returned ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      throw new Error("No choices returned from Qwen API");
    }

    return cleanAIResponse(reply);
  } catch (error: any) {
    console.error("Qwen API error in compose:", error);
    throw new Error(`Direct Qwen API call failed: ${error.message}. Note: Browser security (CORS) blocks direct API calls to DashScope from frontend. Please use the backend URL for production/real API calls.`);
  }
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export async function generateQwenChatResponse(userMessage: string, history: ChatMessage[]): Promise<string> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.VITE_BACKEND_URL;
  const storeName = "ShopWise";
  const ownerName = "Mark";

  const systemPrompt = `You are a helpful AI business co-pilot for a retail store named "${storeName}".
Your job is to answer queries from the store owner, "${ownerName}", regarding store metrics, customer inbox statuses, inventory reorders, and optimization opportunities.

Key Guidelines:
- Adopt a professional, friendly, and highly operational tone.
- Do NOT use Markdown formatting or symbols (such as asterisks ** for bolding, or # for headings). Output completely clean, plain, and professional text with clean lists and paragraphs.
- Draw insights from standard store data (e.g. Leather Wallets are running low, David/Sarah/Lisa have unread emails, Coffee Mug + Notebook is a potential bundle).`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-8).map(msg => ({ role: msg.role, content: msg.content })),
    { role: "user", content: userMessage }
  ];

  const isServer = typeof window === "undefined";
  const useBackend = !isServer || (backendUrl && backendUrl !== "your_backend_url_here");

  if (useBackend) {
    try {
      const fetchUrl = isServer 
        ? `${backendUrl || "http://127.0.0.1:8080"}/api/qwen/reply` 
        : `/api/qwen/reply`;

      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Backend API returned ${response.status}: ${errText}`);
      }

      const data = await response.json();
      return cleanAIResponse(data.reply);
    } catch (error) {
      console.error("Backend Qwen Chat API error:", error);
      throw error;
    }
  }

  const apiKey = process.env.NEXT_PUBLIC_QWEN_API_KEY || process.env.VITE_QWEN_API_KEY;
  const isDemoMode = !apiKey || apiKey === "your_qwen_api_key_here";

  if (!isDemoMode) {
    try {
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
        throw new Error(`API returned ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      return cleanAIResponse(content);
    } catch (error: any) {
      console.error("Client Qwen Chat API error:", error);
      throw new Error(`Direct Qwen API call failed: ${error.message}. Note: Browser security (CORS) blocks direct API calls to DashScope from frontend. Please use the backend URL for production/real API calls.`);
    }
  }

  // Simulated fallback responses
  await new Promise((resolve) => setTimeout(resolve, 800));
  const text = userMessage.toLowerCase();
  if (text.includes("focus") || text.includes("today")) {
    return `Based on current store activity, here are the top items requiring your focus:

1. Unread customer emails (3 high-priority) — David, Sarah, and Lisa have pending questions. Drafts are generated in the Inbox.
2. Inventory Reorder — Leather Wallets are running out in 5 days. Supplier Premium Leather Co. has a 7-day turnaround.
3. New opportunity — Suggest creating a 'Coffee Mug + Notebook' bundle. Co-purchase rate is 34%.`;
  }
  
  if (text.includes("opportunity") || text.includes("opportunities")) {
    return `I've detected 3 high-impact opportunities today:

- Inventory Reorders (+ $575/wk protected): Reorder Leather Wallets & Bamboo Cutting Boards.
- Upsell bundle (+ $890/mo): Coffee Mug + Notebook.
- Pricing Optimizer (+ $378/mo): Ceramic Planter from $34.99 to $36.99 (high margin index).`;
  }
  
  if (text.includes("performance") || text.includes("week")) {
    return `Weekly store summary (June 21 - June 27):

- Revenue: $31,585 (+12.5% vs previous week)
- Conversion Rate: 3.4% (+0.2%)
- Total Orders: 289 orders
- Average Order Value (AOV): $109.29
- Top category: Kitchen accessories & Stationery Journals.`;
  }

  return `I'm analyzing your store data now. ShopWise is calculating sales velocity, pending orders, and search metrics. Ask me about today's focus, opportunities, or recent performance!`;
}
