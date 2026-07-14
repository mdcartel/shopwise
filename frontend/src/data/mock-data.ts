// ─── Types ───────────────────────────────────────────────────────────────────

export interface KPI {
  id: string;
  title: string;
  value: string;
  trend: number;
  icon: string;
  description: string;
}

export interface Priority {
  id: string;
  type: "warning" | "opportunity" | "info" | "urgent";
  title: string;
  description: string;
  confidence: number;
  action: string;
  timestamp: Date;
}

export interface Activity {
  id: string;
  type: "customer" | "inventory" | "decision" | "email" | "opportunity" | "order";
  title: string;
  description: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ThreadMessage {
  id: string;
  from: string;
  fromEmail: string;
  body: string;
  timestamp: Date;
  isOutbound: boolean;
}

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  to?: string;
  toEmail?: string;
  subject: string;
  preview: string;
  body: string;
  priority: "high" | "medium" | "low";
  status: "unread" | "read" | "replied" | "draft" | "sent";
  suggestedReply: string;
  timestamp: Date;
  avatar: string;
  thread?: ThreadMessage[];
}

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: "unfulfilled" | "fulfilled" | "delayed" | "cancelled";
  delayReason?: string;
  carrier?: string;
  trackingNumber?: string;
  estDeliveryDate?: Date;
  date: Date;
  aiInsight?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  sales: number;
  supplier: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  predictedRunout: string;
  predictedDemand: number;
  performance: "excellent" | "good" | "average" | "poor";
  image: string;
  category: string;
  description: string;
}

export interface Opportunity {
  id: string;
  type: "inventory" | "bundle" | "customer" | "pricing" | "supplier";
  title: string;
  description: string;
  confidence: number;
  expectedImpact: string;
  recommendedAction: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "pending" | "approved" | "dismissed";
  createdAt: Date;
}

export interface Decision {
  id: string;
  decision: string;
  reasoning: string;
  evidence: string[];
  confidence: number;
  status: "executed" | "pending" | "overridden" | "rejected";
  category: string;
  timestamp: Date;
  impact?: string;
}

export interface Memory {
  id: string;
  type: "business" | "customer" | "owner" | "decision";
  title: string;
  summary: string;
  importance: "critical" | "high" | "medium" | "low";
  lastUsed: Date;
  createdAt: Date;
  tags: string[];
  relatedEntities: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  lifetimeValue: number;
  lastPurchase: Date;
  communicationStyle: string;
  memorySummary: string;
  avatar: string;
  status: "active" | "at-risk" | "churned" | "new";
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const kpis: KPI[] = [
  { id: "1", title: "Revenue Today", value: "$4,285", trend: 12.5, icon: "DollarSign", description: "vs $3,810 yesterday" },
  { id: "2", title: "Orders", value: "38", trend: 8.3, icon: "ShoppingCart", description: "6 pending fulfillment" },
  { id: "3", title: "Customers", value: "1,247", trend: 3.2, icon: "Users", description: "12 new this week" },
  { id: "4", title: "Low Stock", value: "7", trend: -14.3, icon: "AlertTriangle", description: "3 critical items" },
  { id: "5", title: "Open Emails", value: "14", trend: -22.0, icon: "Mail", description: "5 need response" },
  { id: "6", title: "AI Opportunities", value: "9", trend: 28.6, icon: "Sparkles", description: "$2.4K potential impact" },
];

export const priorities: Priority[] = [
  {
    id: "1",
    type: "warning",
    title: "Leather Wallet inventory predicted to run out in 5 days",
    description: "Current stock: 12 units. Avg daily sales: 2.4 units. Reorder lead time is 7 days. Recommend placing order today.",
    confidence: 94,
    action: "Reorder Now",
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: "2",
    type: "opportunity",
    title: "Bundle Coffee Mug + Notebook could increase order value by 23%",
    description: "Analysis of 847 orders shows 34% of customers who buy Coffee Mugs also purchase Notebooks within 2 weeks. A bundle at $32 (vs $38 separate) would drive conversion.",
    confidence: 87,
    action: "Create Bundle",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "3",
    type: "urgent",
    title: "3 high-priority customer emails awaiting response for 4+ hours",
    description: "Customers Sarah M., David K., and Lisa P. have urgent inquiries. Average expected response time is 2 hours. Suggested replies are ready for approval.",
    confidence: 100,
    action: "Review Replies",
    timestamp: new Date(Date.now() - 900000),
  },
  {
    id: "4",
    type: "info",
    title: "Weekend flash sale could boost revenue by $1,200",
    description: "Based on last 3 weekend sales patterns and current inventory levels, a 15% discount on Ceramic Planters and Canvas Totes would optimize sell-through rate.",
    confidence: 76,
    action: "Plan Sale",
    timestamp: new Date(Date.now() - 7200000),
  },
];

export const activities: Activity[] = [
  { id: "1", type: "customer", title: "Sarah Mitchell replied", description: "Re: Order #4892 shipping inquiry", timestamp: new Date(Date.now() - 300000) },
  { id: "2", type: "inventory", title: "Inventory updated", description: "Received 50 units of Canvas Tote Bag from EcoSupply Co.", timestamp: new Date(Date.now() - 1200000) },
  { id: "3", type: "decision", title: "Decision approved", description: "Auto-applied 10% loyalty discount for returning customer David K.", timestamp: new Date(Date.now() - 2400000) },
  { id: "4", type: "email", title: "Email sent", description: "Follow-up email sent to Lisa Park about delayed shipment", timestamp: new Date(Date.now() - 3600000) },
  { id: "5", type: "opportunity", title: "New opportunity discovered", description: "Cross-sell potential: customers buying Leather Journals also interested in Fountain Pens", timestamp: new Date(Date.now() - 5400000) },
  { id: "6", type: "order", title: "New order received", description: "Order #4901 — $127.50 from James W. (3 items)", timestamp: new Date(Date.now() - 7200000) },
  { id: "7", type: "customer", title: "VIP customer flagged", description: "Emma Rodriguez reached $2,000 lifetime value milestone", timestamp: new Date(Date.now() - 10800000) },
  { id: "8", type: "inventory", title: "Stock alert triggered", description: "Minimalist Desk Lamp below safety stock threshold (4 remaining)", timestamp: new Date(Date.now() - 14400000) },
];

export const chatMessages: ChatMessage[] = [
  { id: "1", role: "assistant", content: "Good morning, Mark! Here's your business snapshot: Revenue is up 12.5% today with 38 orders. You have 14 open emails (5 urgent) and 7 low-stock items need attention. I've identified 9 new opportunities worth approximately $2,400 in potential impact.", timestamp: new Date(Date.now() - 7200000) },
  { id: "2", role: "user", content: "What should I focus on today?", timestamp: new Date(Date.now() - 7000000) },
  { id: "3", role: "assistant", content: "Based on urgency and impact, here are your top 3 priorities:\n\n1. **Respond to 3 urgent customer emails** — Sarah, David, and Lisa have been waiting 4+ hours. I've drafted replies for your approval.\n\n2. **Reorder Leather Wallets** — You'll run out in 5 days and the supplier needs 7 days lead time. I recommend ordering 100 units.\n\n3. **Review the Coffee Mug + Notebook bundle opportunity** — This could increase average order value by 23% based on purchase pattern analysis.\n\nWould you like me to handle any of these?", timestamp: new Date(Date.now() - 6800000) },
  { id: "4", role: "user", content: "Why did you recommend reordering the leather wallets specifically?", timestamp: new Date(Date.now() - 6600000) },
  { id: "5", role: "assistant", content: "Great question. Here's my reasoning:\n\n**Current Data:**\n- Stock: 12 units remaining\n- Average daily sales (30-day): 2.4 units/day\n- Projected stockout: ~5 days from now\n\n**Supplier Context:**\n- Lead time: 7 business days\n- Last order: 60 units on May 15\n- Sell-through rate: 95% (excellent)\n\n**Risk:**\nIf you don't reorder today, there's a **94% probability** of a stockout before the next shipment arrives. Based on your sales velocity, each day of stockout costs approximately $115 in lost revenue.\n\n**Recommendation:** Order 100 units (vs the usual 60) because I've detected an upward sales trend of +18% month-over-month for this product.", timestamp: new Date(Date.now() - 6400000) },
];

export const suggestedPrompts = [
  "What should I focus on today?",
  "Show me my biggest opportunities",
  "Summarize this week's performance",
  "Why did you recommend reordering mugs?",
  "Which customers need attention?",
  "What's my inventory health?",
];

export const emails: Email[] = [
  {
    id: "1",
    from: "Sarah Mitchell",
    fromEmail: "sarah.m@gmail.com",
    subject: "Order #4892 — Where is my package?",
    preview: "Hi, I placed an order 5 days ago and haven't received any shipping...",
    body: "Hi,\n\nI placed an order 5 days ago and haven't received any shipping updates. The tracking number doesn't seem to work. Can you please look into this?\n\nOrder #4892\n\nThanks,\nSarah",
    priority: "high",
    status: "unread",
    suggestedReply: "Hi Sarah,\n\nThank you for reaching out! I apologize for the delay in shipping updates. I've looked into your order #4892 and can confirm it shipped yesterday via USPS. The tracking number should be active within 24 hours.\n\nYour estimated delivery date is July 1st. I'll send you an updated tracking link as soon as it's live.\n\nPlease don't hesitate to reach out if you need anything else!\n\nBest,\nMark",
    timestamp: new Date(Date.now() - 14400000),
    avatar: "SM",
  },
  {
    id: "2",
    from: "David Kim",
    fromEmail: "david.kim@outlook.com",
    subject: "Bulk order inquiry — Corporate gifts",
    preview: "Hello, I'm interested in ordering 200 leather journals for our...",
    body: "Hello,\n\nI'm interested in ordering 200 leather journals for our company's year-end gifts. Do you offer bulk pricing? We'd need them by December 1st.\n\nAlso, would it be possible to add custom embossing?\n\nBest regards,\nDavid Kim\nProcurement Manager, TechFlow Inc.",
    priority: "high",
    status: "unread",
    suggestedReply: "Hi David,\n\nThank you for your interest in our Leather Journals for corporate gifts! We'd be delighted to help with your bulk order.\n\nFor 200 units, we can offer a 25% discount ($22.50 per unit vs $29.99 retail). Custom embossing is available at $3.50 per unit with a 2-week turnaround.\n\nTimeline: We can have your order ready by November 15th, well ahead of your December 1st deadline.\n\nI'd love to set up a quick call to discuss details. Would Tuesday or Wednesday work for you?\n\nBest,\nMark",
    timestamp: new Date(Date.now() - 18000000),
    avatar: "DK",
  },
  {
    id: "3",
    from: "Lisa Park",
    fromEmail: "lisa.park@yahoo.com",
    subject: "Return request — Wrong color received",
    preview: "Hi, I received the Ceramic Planter but it's in white instead of...",
    body: "Hi,\n\nI received the Ceramic Planter but it's in white instead of the terracotta I ordered. I'd like to exchange it for the correct color, please.\n\nOrder #4878\n\nThanks,\nLisa",
    priority: "medium",
    status: "read",
    suggestedReply: "Hi Lisa,\n\nI'm sorry about the color mix-up with your Ceramic Planter! I've initiated an exchange for the terracotta color right away.\n\nHere's what happens next:\n1. I'm sending you a prepaid return label (check your email in ~1 hour)\n2. Your replacement terracotta planter ships today\n3. You should receive it within 3-5 business days\n\nYou can keep using the white one until the terracotta arrives — no rush on the return.\n\nSorry again for the inconvenience!\n\nBest,\nMark",
    timestamp: new Date(Date.now() - 28800000),
    avatar: "LP",
  },
  {
    id: "4",
    from: "EcoSupply Co.",
    fromEmail: "orders@ecosupply.co",
    subject: "Shipment #ES-2847 dispatched",
    preview: "Your order of 50 Canvas Tote Bags has been dispatched...",
    body: "Dear Mark,\n\nYour order of 50 Canvas Tote Bags (SKU: CTB-001) has been dispatched.\n\nTracking: ES2847-USPS\nEstimated Delivery: June 30\n\nBest regards,\nEcoSupply Co. Order Fulfillment",
    priority: "low",
    status: "read",
    suggestedReply: "",
    timestamp: new Date(Date.now() - 43200000),
    avatar: "ES",
  },
  {
    id: "5",
    from: "James Wilson",
    fromEmail: "j.wilson@gmail.com",
    subject: "Love the new collection!",
    preview: "Just wanted to say the new minimalist desk accessories are...",
    body: "Just wanted to say the new minimalist desk accessories are amazing! I bought the desk lamp and organizer set last week and they're perfect.\n\nWill you be adding more items to this collection? I'd love to see a matching bookshelf or wall shelf.\n\nCheers,\nJames",
    priority: "low",
    status: "read",
    suggestedReply: "Hi James!\n\nThank you so much for the kind words! It's great to hear you're enjoying the Minimalist Desk Lamp and Organizer Set.\n\nYou'll be excited to know we're actually working on expanding the collection! A matching floating wall shelf is planned for August, and we're exploring a small bookshelf design too.\n\nI'll make sure you're the first to know when they launch. Thanks for being an awesome customer!\n\nBest,\nMark",
    timestamp: new Date(Date.now() - 57600000),
    avatar: "JW",
  },
];

export const products: Product[] = [
  { id: "1", name: "Leather Wallet", sku: "LW-001", stock: 12, price: 49.99, sales: 342, supplier: "Premium Leather Co.", status: "low-stock", predictedRunout: "5 days", predictedDemand: 72, performance: "excellent", image: "🪙", category: "Accessories", description: "Handcrafted top-grain leather cardholder featuring 6 card slots, a cash compartment, and RFID blocking technology." },
  { id: "2", name: "Canvas Tote Bag", sku: "CTB-001", stock: 85, price: 24.99, sales: 567, supplier: "EcoSupply Co.", status: "in-stock", predictedRunout: "34 days", predictedDemand: 75, performance: "excellent", image: "👜", category: "Bags", description: "Durable 100% organic cotton canvas bag with heavy-duty handles, inner zippered pocket, and reinforced stitching for daily utility." },
  { id: "3", name: "Ceramic Planter", sku: "CP-001", stock: 43, price: 34.99, sales: 189, supplier: "ArtisanCraft", status: "in-stock", predictedRunout: "21 days", predictedDemand: 62, performance: "good", image: "🪴", category: "Home & Garden", description: "Minimalist terracotta ceramic pot with drainage hole and bamboo drip tray. Hand-painted matte glaze finish." },
  { id: "4", name: "Leather Journal", sku: "LJ-001", stock: 28, price: 29.99, sales: 423, supplier: "Premium Leather Co.", status: "in-stock", predictedRunout: "14 days", predictedDemand: 60, performance: "excellent", image: "📓", category: "Stationery", description: "Genuine refillable leather cover containing 200 pages of acid-free lined paper, secure elastic band, and bookmark ribbon." },
  { id: "5", name: "Coffee Mug", sku: "CM-001", stock: 156, price: 18.99, sales: 891, supplier: "CeramicWorks", status: "in-stock", predictedRunout: "52 days", predictedDemand: 90, performance: "excellent", image: "☕", category: "Kitchen", description: "Ergonomically designed 14oz stoneware mug. Microwave and dishwasher safe, featuring a double-walled insulation glaze." },
  { id: "6", name: "Minimalist Desk Lamp", sku: "MDL-001", stock: 4, price: 79.99, sales: 134, supplier: "LightDesign Studio", status: "low-stock", predictedRunout: "2 days", predictedDemand: 45, performance: "good", image: "💡", category: "Office", description: "Stepless dimming LED desk lamp with touch controls, flexible arm, and three light temperature presets (warm, neutral, cool)." },
  { id: "7", name: "Notebook Set (3-pack)", sku: "NS-001", stock: 67, price: 15.99, sales: 712, supplier: "PaperMill Inc.", status: "in-stock", predictedRunout: "28 days", predictedDemand: 72, performance: "excellent", image: "📝", category: "Stationery", description: "Pack of three softcover pocket journals with stitched bindings. Includes grid, lined, and blank notebook variations." },
  { id: "8", name: "Wooden Phone Stand", sku: "WPS-001", stock: 0, price: 22.99, sales: 298, supplier: "WoodCraft Co.", status: "out-of-stock", predictedRunout: "Out of stock", predictedDemand: 55, performance: "good", image: "📱", category: "Accessories", description: "Solid walnut phone stand with charging cable routing slot. Universal compatibility for portrait or landscape placement." },
  { id: "9", name: "Scented Candle Set", sku: "SCS-001", stock: 34, price: 27.99, sales: 456, supplier: "AromaHouse", status: "in-stock", predictedRunout: "17 days", predictedDemand: 60, performance: "good", image: "🕯️", category: "Home & Garden", description: "Set of three soy-wax candles in glass jars. Infused with organic lavender, sandalwood, and eucalyptus essential oils." },
  { id: "10", name: "Stainless Water Bottle", sku: "SWB-001", stock: 8, price: 32.99, sales: 234, supplier: "EcoSupply Co.", status: "low-stock", predictedRunout: "4 days", predictedDemand: 58, performance: "average", image: "🫗", category: "Kitchen", description: "Double-walled vacuum insulated flask. Maintains cold drinks for 24 hours and hot drinks for 12 hours. Leak-proof loop cap." },
  { id: "11", name: "Desk Organizer Set", sku: "DOS-001", stock: 52, price: 44.99, sales: 178, supplier: "WoodCraft Co.", status: "in-stock", predictedRunout: "26 days", predictedDemand: 60, performance: "good", image: "🗂️", category: "Office", description: "3-piece desktop organizer set made from natural bamboo. Includes a mail tray, pencil cup, and sticky note holder." },
  { id: "12", name: "Bamboo Cutting Board", sku: "BCB-001", stock: 3, price: 26.99, sales: 345, supplier: "EcoSupply Co.", status: "low-stock", predictedRunout: "1 day", predictedDemand: 48, performance: "good", image: "🪓", category: "Kitchen", description: "Heavy-duty organic bamboo cutting board with juice grooves and side handle grips. Gentle on knives and odor-resistant." },
];

export const opportunities: Opportunity[] = [
  {
    id: "1",
    type: "inventory",
    title: "Reorder Leather Wallets before stockout",
    description: "Current stock of 12 units will be depleted in 5 days at current sales velocity (2.4/day). Supplier lead time is 7 days.",
    confidence: 94,
    expectedImpact: "Prevent ~$575/week in lost sales",
    recommendedAction: "Place order for 100 units with Premium Leather Co. today",
    priority: "critical",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    type: "bundle",
    title: "Create Coffee Mug + Notebook Bundle",
    description: "34% of Coffee Mug buyers also purchase Notebooks within 2 weeks. A $32 bundle (vs $34.98 separate) would increase conversion.",
    confidence: 87,
    expectedImpact: "+23% average order value (~$890/month)",
    recommendedAction: "Create bundle listing at $32.00 with 5% discount positioning",
    priority: "high",
    status: "pending",
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: "3",
    type: "customer",
    title: "Win-back campaign for 23 at-risk customers",
    description: "23 previously active customers haven't ordered in 45+ days. Personalized 15% discount emails could re-engage 35-40% of them.",
    confidence: 72,
    expectedImpact: "Recover ~$1,840 in potential revenue",
    recommendedAction: "Send personalized win-back emails with 15% discount code",
    priority: "high",
    status: "pending",
    createdAt: new Date(Date.now() - 14400000),
  },
  {
    id: "4",
    type: "pricing",
    title: "Optimize Ceramic Planter pricing",
    description: "Price elasticity analysis suggests a $2 increase to $36.99 would maintain demand while increasing margin by 6%.",
    confidence: 68,
    expectedImpact: "+$378/month in additional margin",
    recommendedAction: "Adjust price from $34.99 to $36.99",
    priority: "medium",
    status: "pending",
    createdAt: new Date(Date.now() - 28800000),
  },
  {
    id: "5",
    type: "supplier",
    title: "Supplier delay risk — WoodCraft Co.",
    description: "WoodCraft Co. has shown 3 consecutive late deliveries (avg 4 days). This impacts Wooden Phone Stand and Desk Organizer restocking.",
    confidence: 82,
    expectedImpact: "Potential $1,200 in lost sales if delays continue",
    recommendedAction: "Contact WoodCraft Co. about reliability or evaluate alternative suppliers",
    priority: "high",
    status: "pending",
    createdAt: new Date(Date.now() - 36000000),
  },
  {
    id: "6",
    type: "bundle",
    title: "Desk Lamp + Organizer Set combo",
    description: "45% co-purchase rate detected. Both products appeal to the same \"minimalist office\" customer segment.",
    confidence: 79,
    expectedImpact: "+$650/month in incremental revenue",
    recommendedAction: "Create \"Minimalist Desk Setup\" bundle at $109.99 (vs $124.98)",
    priority: "medium",
    status: "pending",
    createdAt: new Date(Date.now() - 43200000),
  },
  {
    id: "7",
    type: "customer",
    title: "Emma Rodriguez — potential brand ambassador",
    description: "Reached $2,000 LTV, 12 orders, 100% positive interactions. High social media engagement detected.",
    confidence: 85,
    expectedImpact: "Potential 15-20 referral customers",
    recommendedAction: "Offer VIP ambassador program with 20% referral commission",
    priority: "medium",
    status: "pending",
    createdAt: new Date(Date.now() - 57600000),
  },
  {
    id: "8",
    type: "pricing",
    title: "Weekend flash sale optimization",
    description: "Historical data shows 15% discounts on Ceramic Planters and Canvas Totes during weekends increase units sold by 3.2x.",
    confidence: 76,
    expectedImpact: "+$1,200 in weekend revenue",
    recommendedAction: "Schedule automated 15% flash sale for Saturday 9AM — Sunday 11PM",
    priority: "low",
    status: "pending",
    createdAt: new Date(Date.now() - 72000000),
  },
  {
    id: "9",
    type: "inventory",
    title: "Pre-order Bamboo Cutting Boards",
    description: "Only 3 units remaining, selling ~3/day. Will stockout by tomorrow. EcoSupply Co. has 200 units ready for immediate shipment.",
    confidence: 97,
    expectedImpact: "Prevent $810/week in lost sales",
    recommendedAction: "Emergency reorder 75 units from EcoSupply Co.",
    priority: "critical",
    status: "pending",
    createdAt: new Date(Date.now() - 1800000),
  },
];

export const decisions: Decision[] = [
  {
    id: "1",
    decision: "Auto-applied 10% loyalty discount for returning customer David Kim",
    reasoning: "David has made 8 purchases totaling $847. He hasn't ordered in 32 days (his avg interval is 21 days). The discount increases his return probability from 45% to 78%.",
    evidence: ["8 previous orders", "32-day gap vs 21-day average", "High LTV customer segment", "78% predicted return rate with discount"],
    confidence: 91,
    status: "executed",
    category: "Customer Retention",
    timestamp: new Date(Date.now() - 2400000),
    impact: "David placed a $124 order within 2 hours",
  },
  {
    id: "2",
    decision: "Escalated Lisa Park's return request to priority queue",
    reasoning: "Lisa is a first-time buyer who received the wrong color. First-purchase returns have a 67% churn rate if not handled within 4 hours. Fast resolution increases repeat purchase probability to 45%.",
    evidence: ["First-time customer", "Wrong item received (fulfillment error)", "67% churn rate for unresolved first-purchase issues", "4-hour SLA for first-purchase problems"],
    confidence: 95,
    status: "executed",
    category: "Customer Support",
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: "3",
    decision: "Recommended reordering 100 units of Leather Wallet (vs usual 60)",
    reasoning: "Sales velocity increased 18% MoM. Current supplier lead time is 7 days. A 100-unit order provides 42 days of runway vs 25 days with 60 units, reducing reorder frequency.",
    evidence: ["+18% MoM sales growth", "7-day supplier lead time", "95% sell-through rate", "No seasonal decline expected"],
    confidence: 94,
    status: "pending",
    category: "Inventory Management",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "4",
    decision: "Sent follow-up email to 12 customers with pending carts",
    reasoning: "12 customers added items to cart but didn't complete checkout in 24+ hours. Reminder emails recover 22% of abandoned carts based on historical data.",
    evidence: ["12 abandoned carts", "22% historical recovery rate", "Average cart value: $67", "Estimated recovery: ~$176"],
    confidence: 82,
    status: "executed",
    category: "Sales Recovery",
    timestamp: new Date(Date.now() - 14400000),
    impact: "3 of 12 customers completed their purchase ($198 recovered)",
  },
  {
    id: "5",
    decision: "Flagged WoodCraft Co. as at-risk supplier",
    reasoning: "3 consecutive late deliveries averaging 4 days behind schedule. This pattern indicates systemic issues rather than one-off delays.",
    evidence: ["Delivery #1: 3 days late", "Delivery #2: 5 days late", "Delivery #3: 4 days late", "Industry benchmark: <1 day average delay"],
    confidence: 88,
    status: "executed",
    category: "Supply Chain",
    timestamp: new Date(Date.now() - 43200000),
  },
];

export const memories: Memory[] = [
  {
    id: "1",
    type: "business",
    title: "Weekend sales spike pattern",
    summary: "Sales consistently increase 35-45% on Saturday mornings (9-11 AM). Best-performing categories during weekends: Home & Garden, Kitchen. Flash sales during this window have 3.2x higher conversion.",
    importance: "high",
    lastUsed: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 2592000000),
    tags: ["sales-pattern", "weekend", "timing"],
    relatedEntities: ["Ceramic Planter", "Canvas Tote Bag", "Scented Candle Set"],
  },
  {
    id: "2",
    type: "customer",
    title: "David Kim prefers minimal communication",
    summary: "David responds best to short, direct emails. He ignores newsletters but engages with personalized product recommendations. Prefers email over SMS. Average response time: 4 hours.",
    importance: "medium",
    lastUsed: new Date(Date.now() - 172800000),
    createdAt: new Date(Date.now() - 5184000000),
    tags: ["communication-preference", "email", "personalization"],
    relatedEntities: ["David Kim"],
  },
  {
    id: "3",
    type: "owner",
    title: "Mark prefers conservative inventory strategy",
    summary: "Owner Mark has consistently chosen to order smaller, more frequent batches rather than large bulk orders. Risk tolerance for stockouts is low. Prefers maintaining 30-day runway minimum.",
    importance: "high",
    lastUsed: new Date(Date.now() - 259200000),
    createdAt: new Date(Date.now() - 7776000000),
    tags: ["inventory-strategy", "risk-tolerance", "owner-preference"],
    relatedEntities: ["Mark (Owner)"],
  },
  {
    id: "4",
    type: "decision",
    title: "15% discount is optimal for win-back campaigns",
    summary: "Tested 10%, 15%, and 20% discounts for lapsed customers. 15% achieved 38% re-engagement (vs 22% for 10% and 41% for 20%). The 15% option provides best ROI when factoring margin impact.",
    importance: "high",
    lastUsed: new Date(Date.now() - 604800000),
    createdAt: new Date(Date.now() - 3888000000),
    tags: ["discount-strategy", "win-back", "optimization"],
    relatedEntities: ["Marketing", "Customer Retention"],
  },
  {
    id: "5",
    type: "business",
    title: "Premium Leather Co. — reliable but slow",
    summary: "Consistent quality (99.2% acceptance rate). Average lead time: 7 business days. No rush order option. Best prices for orders over 75 units. Contact: Maria Chen, maria@premiumleather.co",
    importance: "medium",
    lastUsed: new Date(Date.now() - 345600000),
    createdAt: new Date(Date.now() - 10368000000),
    tags: ["supplier", "leather", "lead-time"],
    relatedEntities: ["Leather Wallet", "Leather Journal"],
  },
  {
    id: "6",
    type: "customer",
    title: "Sarah Mitchell — high-maintenance but high-value",
    summary: "Frequent support contacts (avg 2/order) but consistently purchases premium items. LTV: $1,247. Responds well to proactive shipping updates. Becomes a detractor if not responded to within 2 hours.",
    importance: "high",
    lastUsed: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 6048000000),
    tags: ["high-value", "support-intensive", "proactive-updates"],
    relatedEntities: ["Sarah Mitchell"],
  },
  {
    id: "7",
    type: "owner",
    title: "Mark wants to expand into corporate gifting",
    summary: "Mark mentioned interest in B2B corporate gifting segment during chat on June 10. Key requirements: bulk pricing, custom branding, reliable fulfillment for large orders. Target: Q4 2024 launch.",
    importance: "medium",
    lastUsed: new Date(Date.now() - 1209600000),
    createdAt: new Date(Date.now() - 1468800000),
    tags: ["business-expansion", "B2B", "corporate-gifting"],
    relatedEntities: ["Mark (Owner)", "Leather Journal", "Desk Organizer Set"],
  },
  {
    id: "8",
    type: "business",
    title: "Eco-friendly products trending upward",
    summary: "Products with 'eco' or 'sustainable' positioning show 28% higher growth rate vs conventional alternatives. Canvas Tote Bag and Bamboo Cutting Board are top performers in this segment.",
    importance: "medium",
    lastUsed: new Date(Date.now() - 432000000),
    createdAt: new Date(Date.now() - 4320000000),
    tags: ["trend", "sustainability", "product-strategy"],
    relatedEntities: ["Canvas Tote Bag", "Bamboo Cutting Board", "EcoSupply Co."],
  },
];

export const customers: Customer[] = [
  { id: "1", name: "Sarah Mitchell", email: "sarah.m@gmail.com", orders: 15, lifetimeValue: 1247, lastPurchase: new Date(Date.now() - 432000000), communicationStyle: "Proactive updates preferred", memorySummary: "High-maintenance but high-value. Responds well to proactive shipping updates.", avatar: "SM", status: "active" },
  { id: "2", name: "David Kim", email: "david.kim@outlook.com", orders: 8, lifetimeValue: 847, lastPurchase: new Date(Date.now() - 2764800000), communicationStyle: "Minimal, direct emails only", memorySummary: "Prefers short emails. Ignores newsletters. Responds to personalized recommendations.", avatar: "DK", status: "at-risk" },
  { id: "3", name: "Emma Rodriguez", email: "emma.r@icloud.com", orders: 12, lifetimeValue: 2034, lastPurchase: new Date(Date.now() - 259200000), communicationStyle: "Engaged, loves new products", memorySummary: "Potential brand ambassador. $2K LTV milestone. High social media engagement.", avatar: "ER", status: "active" },
  { id: "4", name: "Lisa Park", email: "lisa.park@yahoo.com", orders: 1, lifetimeValue: 34.99, lastPurchase: new Date(Date.now() - 604800000), communicationStyle: "New customer — style unknown", memorySummary: "First-time buyer. Received wrong color. Return in progress.", avatar: "LP", status: "new" },
  { id: "5", name: "James Wilson", email: "j.wilson@gmail.com", orders: 5, lifetimeValue: 412, lastPurchase: new Date(Date.now() - 604800000), communicationStyle: "Enthusiastic, gives feedback", memorySummary: "Loves minimalist collection. Interested in new product launches.", avatar: "JW", status: "active" },
  { id: "6", name: "Michael Chen", email: "m.chen@techcorp.com", orders: 3, lifetimeValue: 289, lastPurchase: new Date(Date.now() - 5184000000), communicationStyle: "Professional, brief", memorySummary: "Bought gifts for colleagues. Potential B2B customer.", avatar: "MC", status: "at-risk" },
  { id: "7", name: "Olivia Thompson", email: "olivia.t@gmail.com", orders: 22, lifetimeValue: 3156, lastPurchase: new Date(Date.now() - 172800000), communicationStyle: "Loyal VIP, loves exclusivity", memorySummary: "Top customer by LTV. Responds to early access offers. Refers friends.", avatar: "OT", status: "active" },
  { id: "8", name: "Alex Rivera", email: "alex.r@hotmail.com", orders: 2, lifetimeValue: 67, lastPurchase: new Date(Date.now() - 7776000000), communicationStyle: "Unresponsive to emails", memorySummary: "Purchased twice early on, then went silent. Win-back candidate.", avatar: "AR", status: "churned" },
];

// ─── Chart Data ──────────────────────────────────────────────────────────────

export const revenueData = [
  { date: "Mon", revenue: 3200, orders: 28 },
  { date: "Tue", revenue: 4100, orders: 35 },
  { date: "Wed", revenue: 3800, orders: 32 },
  { date: "Thu", revenue: 4500, orders: 41 },
  { date: "Fri", revenue: 5200, orders: 47 },
  { date: "Sat", revenue: 6800, orders: 58 },
  { date: "Sun", revenue: 4285, orders: 38 },
];

export const categoryData = [
  { name: "Accessories", value: 342, color: "#818cf8" },
  { name: "Bags", value: 567, color: "#34d399" },
  { name: "Home & Garden", value: 189, color: "#fb7185" },
  { name: "Stationery", value: 1135, color: "#fbbf24" },
  { name: "Kitchen", value: 1236, color: "#60a5fa" },
  { name: "Office", value: 312, color: "#a78bfa" },
];

export const orders: Order[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-4892",
    customerName: "Sarah Mitchell",
    customerEmail: "sarah.m@gmail.com",
    items: [
      { productName: "Canvas Tote Bag", quantity: 1, price: 24.99 },
      { productName: "Ceramic Planter", quantity: 1, price: 34.99 }
    ],
    total: 59.98,
    status: "delayed",
    delayReason: "USPS tracking code inactive; shipment stuck at processing center.",
    carrier: "USPS",
    trackingNumber: "9400111899562847110294",
    estDeliveryDate: new Date(Date.now() + 172800000), // in 2 days
    date: new Date(Date.now() - 432000000), // 5 days ago
    aiInsight: "Delay Alert: Tracking has been inactive for 72 hours. Recommended Action: Click Send Delay Update to mail apologies."
  },
  {
    id: "ord-2",
    orderNumber: "ORD-4893",
    customerName: "David Kim",
    customerEmail: "david.kim@outlook.com",
    items: [
      { productName: "Leather Journal", quantity: 10, price: 29.99 }
    ],
    total: 299.90,
    status: "fulfilled",
    carrier: "FedEx",
    trackingNumber: "784992561102",
    estDeliveryDate: new Date(Date.now() - 86400000), // yesterday
    date: new Date(Date.now() - 172800000), // 2 days ago
    aiInsight: "Fulfillment complete. Delivered ahead of estimate."
  },
  {
    id: "ord-3",
    orderNumber: "ORD-4878",
    customerName: "Lisa Park",
    customerEmail: "lisa.park@yahoo.com",
    items: [
      { productName: "Ceramic Planter", quantity: 1, price: 34.99 }
    ],
    total: 34.99,
    status: "delayed",
    delayReason: "Color mix-up exchange in progress (white sent instead of terracotta).",
    carrier: "UPS",
    trackingNumber: "1Z999AA10123456784",
    estDeliveryDate: new Date(Date.now() + 345600000), // in 4 days
    date: new Date(Date.now() - 604800000), // 7 days ago
    aiInsight: "Return exchange initiated. Replacement terracotta planter package dispatched from warehouse."
  },
  {
    id: "ord-4",
    orderNumber: "ORD-4885",
    customerName: "James Wilson",
    customerEmail: "j.wilson@gmail.com",
    items: [
      { productName: "Minimalist Desk Lamp", quantity: 1, price: 79.99 },
      { productName: "Desk Organizer Set", quantity: 1, price: 44.99 }
    ],
    total: 124.98,
    status: "fulfilled",
    carrier: "DHL Express",
    trackingNumber: "9584028475",
    estDeliveryDate: new Date(Date.now() - 172800000), // 2 days ago
    date: new Date(Date.now() - 345600000), // 4 days ago
    aiInsight: "Delivered. Customer left 5-star review via feedback email."
  },
  {
    id: "ord-5",
    orderNumber: "ORD-4894",
    customerName: "Olivia Thompson",
    customerEmail: "olivia.t@gmail.com",
    items: [
      { productName: "Leather Journal", quantity: 1, price: 29.99 },
      { productName: "Coffee Mug", quantity: 1, price: 18.99 },
      { productName: "Notebook Set (3-pack)", quantity: 1, price: 15.99 }
    ],
    total: 64.97,
    status: "unfulfilled",
    date: new Date(Date.now() - 10800000), // 3 hours ago
    aiInsight: "Stock is available. Ready to pack and dispatch."
  },
  {
    id: "ord-6",
    orderNumber: "ORD-4891",
    customerName: "Michael Chen",
    customerEmail: "m.chen@techcorp.com",
    items: [
      { productName: "Wooden Phone Stand", quantity: 1, price: 22.99 }
    ],
    total: 22.99,
    status: "delayed",
    delayReason: "Item is temporarily out-of-stock. Replenishment shipment delayed at customs.",
    date: new Date(Date.now() - 518400000), // 6 days ago
    aiInsight: "Item stock depleted. Replenishment arriving in 2 days. Recommend: Offer alternative accessory."
  }
];

export const salesTrendData = [
  { month: "Jan", sales: 12400, customers: 180 },
  { month: "Feb", sales: 13800, customers: 195 },
  { month: "Mar", sales: 15200, customers: 210 },
  { month: "Apr", sales: 14600, customers: 225 },
  { month: "May", sales: 17800, customers: 248 },
  { month: "Jun", sales: 19200, customers: 267 },
];

export const inventoryData = [
  { name: "Leather Wallet", stock: 12, demand: 72 },
  { name: "Canvas Tote", stock: 85, demand: 75 },
  { name: "Ceramic Planter", stock: 43, demand: 62 },
  { name: "Coffee Mug", stock: 156, demand: 90 },
  { name: "Desk Lamp", stock: 4, demand: 45 },
  { name: "Notebook Set", stock: 67, demand: 72 },
  { name: "Water Bottle", stock: 8, demand: 58 },
  { name: "Cutting Board", stock: 3, demand: 48 },
];

export const customerRetentionData = [
  { month: "Jan", newCustomers: 45, returning: 135, churnRate: 5.2 },
  { month: "Feb", newCustomers: 52, returning: 143, churnRate: 4.8 },
  { month: "Mar", newCustomers: 48, returning: 162, churnRate: 4.1 },
  { month: "Apr", newCustomers: 61, returning: 164, churnRate: 3.9 },
  { month: "May", newCustomers: 58, returning: 190, churnRate: 3.5 },
  { month: "Jun", newCustomers: 55, returning: 212, churnRate: 3.2 },
];
