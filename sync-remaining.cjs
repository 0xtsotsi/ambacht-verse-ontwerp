#!/usr/bin/env node

const https = require("https");
const API_KEY = "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";
const DB_ID = "21df23ab1c8f80ef914effd0d37a5b43";

const createTask = (taskData) => {
  const postData = JSON.stringify({
    parent: { database_id: DB_ID },
    properties: {
      "Task name": {
        title: [{ text: { content: taskData.title } }],
      },
      Summary: {
        rich_text: [{ text: { content: taskData.summary } }],
      },
      Description: {
        rich_text: [{ text: { content: taskData.description } }],
      },
      Priority: {
        select: { name: taskData.priority },
      },
      Status: {
        status: { name: taskData.status },
      },
      "Task type": {
        multi_select: taskData.types.map((type) => ({ name: type })),
      },
      "Effort level": {
        select: { name: taskData.effort },
      },
    },
  });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "api.notion.com",
        path: "/v1/pages",
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on("end", () => {
          console.log(
            `${taskData.title}: ${res.statusCode === 200 ? "✅ SUCCESS" : "❌ FAILED"}`,
          );
          if (res.statusCode !== 200) {
            console.log(`Error: ${data.substring(0, 200)}`);
          }
          resolve();
        });
      },
    );
    req.on("error", (e) => console.log(`❌ ${taskData.title}: ${e.message}`));
    req.write(postData);
    req.end();
  });
};

// Remaining tasks
const remainingTasks = [
  // Continue Epic 2
  {
    title: "🍽️ Interactive Menu System",
    summary: "Menu system with dietary filters and PDF generation",
    description:
      "Build menu system with dietary filters, PDF generation, and visual presentation with professional food photography",
    priority: "Medium",
    status: "Not started",
    types: ["Menu", "Interactive", "PDF"],
    effort: "Medium",
  },
  {
    title: "🌟 Seasonal Specials Section",
    summary: "Dynamic seasonal specials showcase",
    description:
      "Create dynamic seasonal specials showcase with current offerings, special pricing, and admin content management",
    priority: "Low",
    status: "Not started",
    types: ["Seasonal", "Content", "Admin"],
    effort: "Low",
  },
  // Epic 3
  {
    title: "🏆 Epic 3 - Professional Trust Signals",
    summary: "Establish credibility through awards and testimonials",
    description:
      "Establish Wesley Ambacht as a credible, professional catering service through awards, testimonials, and supplier partnerships. This epic builds the confidence and trust necessary for premium market positioning.",
    priority: "Medium",
    status: "Not started",
    types: ["Epic", "Trust", "Branding"],
    effort: "Medium",
  },
  {
    title: "🏅 Awards and Certifications Section",
    summary: "Professional certifications and quality badges",
    description:
      "Display professional certifications, quality assurance badges, industry memberships, and achievement statistics",
    priority: "Medium",
    status: "Not started",
    types: ["Awards", "Certifications", "Display"],
    effort: "Low",
  },
  {
    title: "💬 Enhanced Testimonials Carousel",
    summary: "Auto-rotating testimonials with client details",
    description:
      "Build auto-rotating testimonials carousel with client details, ratings, filtering, and social proof statistics",
    priority: "Medium",
    status: "Not started",
    types: ["Testimonials", "Carousel", "Social"],
    effort: "Medium",
  },
  {
    title: "🌱 Local Supplier Partnership Showcase",
    summary: "Supplier partnership showcase with heritage stories",
    description:
      "Create supplier partnership showcase featuring heritage stories for cheese, bakery, fish, and organic suppliers",
    priority: "Medium",
    status: "Not started",
    types: ["Suppliers", "Partnership", "Stories"],
    effort: "Low",
  },
  {
    title: "📞 Professional Contact Enhancement",
    summary: "Enhanced contact options with business hours",
    description:
      "Enhance contact options with memorable phone display, business hours, emergency contact, and multi-method presentation",
    priority: "Medium",
    status: "Not started",
    types: ["Contact", "Professional", "Display"],
    effort: "Low",
  },
  // Epic 4
  {
    title: "📡 Epic 4 - Communication & Integration",
    summary: "Professional communication and multi-language support",
    description:
      "Enable professional communication capabilities and multi-language support to serve diverse clientele and provide immediate customer assistance. This epic completes the professional platform transformation.",
    priority: "Medium",
    status: "Not started",
    types: ["Epic", "Communication", "Integration"],
    effort: "Medium",
  },
  {
    title: "📱 WhatsApp Business Integration",
    summary: "WhatsApp Business API with chat analytics",
    description:
      "Integrate WhatsApp Business API with floating chat button, automated welcome messages, and chat analytics",
    priority: "High",
    status: "Not started",
    types: ["WhatsApp", "Integration", "Chat"],
    effort: "Medium",
  },
  {
    title: "🌍 Multi-Language Support System",
    summary: "Dutch/English language toggle with SEO",
    description:
      "Implement Dutch/English language toggle with formal tone, session persistence, and SEO optimization",
    priority: "Medium",
    status: "Not started",
    types: ["I18n", "Languages", "SEO"],
    effort: "Medium",
  },
  {
    title: "📈 Enhanced Analytics and Conversion Tracking",
    summary: "Google Analytics 4 with conversion funnel tracking",
    description:
      "Set up Google Analytics 4, conversion funnel tracking, A/B testing capability, and performance monitoring",
    priority: "Medium",
    status: "Not started",
    types: ["Analytics", "Conversion", "Tracking"],
    effort: "Low",
  },
  {
    title: "⚡ Performance Optimization and PWA Features",
    summary: "PWA manifest with service worker and optimization",
    description:
      "Implement PWA manifest, service worker, image optimization, lazy loading, and Lighthouse score optimization",
    priority: "Low",
    status: "Not started",
    types: ["PWA", "Performance", "Optimization"],
    effort: "Low",
  },
];

async function syncRemainingToNotion() {
  console.log("🚀 Syncing remaining Task Master tasks to Notion...");
  console.log("===============================================");

  for (let i = 0; i < remainingTasks.length; i++) {
    const task = remainingTasks[i];
    console.log(`\n${i + 1}/${remainingTasks.length}: Creating task...`);
    await createTask(task);

    // Rate limiting
    if (i < remainingTasks.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("\n✅ All remaining tasks synced to Notion!");
  console.log(`📊 Total tasks in Notion: ${8 + remainingTasks.length}`);
}

syncRemainingToNotion().catch(console.error);
