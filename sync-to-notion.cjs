#!/usr/bin/env node

const https = require("https");
const fs = require("fs");
const path = require("path");

// Configuration - can be overridden by environment variables
const API_KEY =
  process.env.NOTION_API_KEY ||
  "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";
const DB_ID =
  process.env.NOTION_DATABASE_ID || "21df23ab1c8f80ef914effd0d37a5b43";

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};
args.forEach((arg) => {
  const [key, value] = arg.split("=");
  if (key.startsWith("--")) {
    options[key.substring(2)] = value || true;
  }
});

// Function to validate environment
const validateEnvironment = () => {
  if (!API_KEY || API_KEY === "your_notion_api_key_here") {
    console.error("❌ Error: NOTION_API_KEY not configured");
    console.error("Please set NOTION_API_KEY in environment or .env file");
    process.exit(1);
  }

  if (!DB_ID || DB_ID === "your_notion_database_id_here") {
    console.error("❌ Error: NOTION_DATABASE_ID not configured");
    console.error("Please set NOTION_DATABASE_ID in environment or .env file");
    process.exit(1);
  }

  // Check if sync is disabled
  if (process.env.NOTION_SYNC_ENABLED === "false") {
    console.log("ℹ️  Notion sync is disabled (NOTION_SYNC_ENABLED=false)");
    process.exit(0);
  }
};

// Function to search for existing page by title
const searchExistingPage = (title) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      filter: {
        property: "Task name",
        title: {
          contains: title.replace(/[✅📋🚀💰⭐]/g, "").trim(),
        },
      },
    });

    const req = https.request(
      {
        hostname: "api.notion.com",
        path: `/v1/databases/${DB_ID}/query`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            if (result.results && result.results.length > 0) {
              resolve(result.results[0].id);
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      },
    );

    req.on("error", () => resolve(null));
    req.write(postData);
    req.end();
  });
};

// Function to update existing page
const updatePage = (pageId, taskData) => {
  const properties = {
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
      select: { name: taskData.effort || "Medium" },
    },
  };

  // Temporarily comment out incompatible fields until Notion database is updated
  // TODO: Add these fields to Notion database schema:
  // - Assignee (as People field, not Select)
  // - Start Date (Date field)
  // - Due Date (Date field)
  // - Estimated Hours (Number field)
  // - Actual Hours (Number field)
  // - Completion Comments (Rich Text field)

  // Append completion comments to existing Description field if available
  if (taskData.completionComment) {
    const existingDescription = taskData.description || "";
    const enhancedDescription =
      existingDescription +
      (existingDescription ? "\n\n---\n" : "") +
      `📝 COMPLETION: ${taskData.completionComment}`;

    properties["Description"] = {
      rich_text: [
        {
          text: {
            content: enhancedDescription,
          },
        },
      ],
    };
  }

  const postData = JSON.stringify({ properties });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: "api.notion.com",
        path: `/v1/pages/${pageId}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on("end", () => {
          console.log(
            `${taskData.title}: ${res.statusCode === 200 ? "✅ UPDATED" : "❌ UPDATE FAILED"}`,
          );
          if (res.statusCode !== 200) {
            console.log(`Error: ${data.substring(0, 200)}`);
          }
          resolve(res.statusCode === 200);
        });
      },
    );

    req.on("error", (e) => {
      console.log(`❌ ${taskData.title}: ${e.message}`);
      resolve(false);
    });
    req.write(postData);
    req.end();
  });
};

// Function to create new page
const createTask = (taskData) => {
  const properties = {
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
      select: { name: taskData.effort || "Medium" },
    },
  };

  // Temporarily comment out incompatible fields until Notion database is updated
  // TODO: Add these fields to Notion database schema:
  // - Assignee (as People field, not Select)
  // - Start Date (Date field)
  // - Due Date (Date field)
  // - Estimated Hours (Number field)
  // - Actual Hours (Number field)
  // - Completion Comments (Rich Text field)

  // Append completion comments to existing Description field if available
  if (taskData.completionComment) {
    const existingDescription = taskData.description || "";
    const enhancedDescription =
      existingDescription +
      (existingDescription ? "\n\n---\n" : "") +
      `📝 COMPLETION: ${taskData.completionComment}`;

    properties["Description"] = {
      rich_text: [
        {
          text: {
            content: enhancedDescription,
          },
        },
      ],
    };
  }

  const postData = JSON.stringify({
    parent: { database_id: DB_ID },
    properties,
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
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on("end", () => {
          console.log(
            `${taskData.title}: ${res.statusCode === 200 ? "✅ CREATED" : "❌ FAILED"}`,
          );
          if (res.statusCode !== 200) {
            console.log(`Error: ${data.substring(0, 200)}`);
          }
          resolve(res.statusCode === 200);
        });
      },
    );

    req.on("error", (e) => {
      console.log(`❌ ${taskData.title}: ${e.message}`);
      resolve(false);
    });
    req.write(postData);
    req.end();
  });
};

// Function to create or update task
const syncTask = async (taskData) => {
  if (options["update-status"] || options.update) {
    // Try to find existing page
    const existingPageId = await searchExistingPage(taskData.title);
    if (existingPageId) {
      console.log(`Found existing page for: ${taskData.title}`);
      return await updatePage(existingPageId, taskData);
    }
  }

  // Create new page
  return await createTask(taskData);
};

// Load Task Master tasks if integration requested
const loadTaskMasterTasks = async () => {
  const taskMasterPath = path.join(
    process.cwd(),
    ".taskmaster",
    "tasks",
    "tasks.json",
  );

  if (!fs.existsSync(taskMasterPath)) {
    console.log("⚠️  Task Master not found, using default tasks");
    return null;
  }

  try {
    const tasksFileData = JSON.parse(fs.readFileSync(taskMasterPath, "utf8"));
    const tasksData = tasksFileData.master || tasksFileData; // Handle nested structure
    const tasks = [];

    // Filter tasks based on options
    const filterType = options.type;
    const filterStatus = options.status;
    const filterTask = options.task;

    const processTask = (task, parentTask = null) => {
      // Apply filters
      if (filterTask && task.id !== filterTask) return;
      if (filterStatus && task.status !== filterStatus) return;

      // Map Task Master format to Notion format
      const isEpic =
        task.id.indexOf(".") === -1 &&
        task.title.toLowerCase().includes("epic");
      const isStory = task.title.toLowerCase().includes("story");
      const isSubtask = task.id.indexOf(".") > -1;

      if (filterType === "epic" && !isEpic) return;
      if (filterType === "story" && !isStory) return;
      if (filterType === "task" && (isEpic || isStory)) return;

      const taskType = isEpic
        ? "Epic"
        : isStory
          ? "Story"
          : isSubtask
            ? "Subtask"
            : "Task";

      tasks.push({
        title: `${task.status === "done" ? "✅" : "📋"} ${task.id} - ${task.title}`,
        summary: task.description || "No summary available",
        description: `Task ID: ${task.id}\nStatus: ${task.status}\nPriority: ${task.priority || "Medium"}\n\n${task.description || ""}`,
        priority: task.priority || "Medium",
        status:
          task.status === "done"
            ? "Done"
            : task.status === "in-progress"
              ? "In progress"
              : "Not started",
        types: ["Task Master", taskType],
        effort:
          typeof task.complexity === "number"
            ? task.complexity <= 3
              ? "Low"
              : task.complexity <= 6
                ? "Medium"
                : "High"
            : "Medium",
        assignee: task.assignee || "Unassigned",
        startDate: task.startDate || null,
        dueDate: task.dueDate || null,
        estimatedHours: task.estimatedHours || null,
        actualHours: task.actualHours || null,
        completionComment: task.completionComment || null,
      });

      // Process subtasks if they exist
      if (task.subtasks && Array.isArray(task.subtasks)) {
        task.subtasks.forEach((subtask) => processTask(subtask, task));
      }
    };

    tasksData.tasks.forEach((task) => processTask(task));

    return tasks;
  } catch (e) {
    console.error("❌ Failed to load Task Master tasks:", e.message);
    return null;
  }
};

// Default tasks with emojis (fallback if no dynamic data)
const defaultTasks = [
  // Epic 1
  {
    title: "🚀 Epic 1 - Enhanced Booking Foundation",
    summary: "Core booking experience infrastructure",
    description:
      "Establish the core booking experience that positions Wesley Ambacht as a professional, accessible catering service. This epic delivers the fundamental infrastructure for improved conversion rates through streamlined booking access and enhanced date/time selection capabilities.",
    priority: "High",
    status: "Not started",
    types: ["Epic", "Booking", "UI"],
    effort: "High",
  },
  {
    title: "📱 Floating Booking Widget Implementation",
    summary: "Floating Check Your Date button with responsive design",
    description:
      "Create a floating Check Your Date button that appears in bottom-right corner on all pages, with responsive design and accessibility features",
    priority: "High",
    status: "Not started",
    types: ["UI", "Component", "Mobile"],
    effort: "Medium",
  },
  {
    title: "📅 Enhanced DateChecker Modal",
    summary: "Calendar modal with time slots and availability",
    description:
      "Develop modal with calendar component, time slot selection (10:00-20:00), guest count input, and real-time availability checking",
    priority: "High",
    status: "Not started",
    types: ["UI", "Calendar", "Booking"],
    effort: "Medium",
  },
  {
    title: "💰 Preliminary Quote Calculator",
    summary: "Pricing calculator with service type selection",
    description:
      "Build pricing calculator with service type selection and per-person pricing display (€12.50-€27.50 range)",
    priority: "Medium",
    status: "Not started",
    types: ["Pricing", "Calculator", "UI"],
    effort: "Medium",
  },
  {
    title: "🗄️ Booking Database Schema Enhancement",
    summary: "Enhanced Supabase schema with real-time subscriptions",
    description:
      "Create enhanced Supabase schema with bookings, availability_slots, and quotes tables including real-time subscriptions",
    priority: "High",
    status: "Not started",
    types: ["Database", "Backend", "Schema"],
    effort: "Low",
  },
  // Epic 2
  {
    title: "💰 Epic 2 - Transparent Pricing & Services",
    summary: "Transform service presentation with transparent pricing",
    description:
      "Transform service presentation to build customer confidence through transparent pricing and professional service descriptions. This epic establishes Wesley Ambacht as a premium service provider with clear value propositions.",
    priority: "High",
    status: "Not started",
    types: ["Epic", "Pricing", "Services"],
    effort: "High",
  },
  {
    title: "🏷️ Service Pricing Cards Enhancement",
    summary: "Transparent per-person costs for all service types",
    description:
      "Create pricing cards with transparent per-person costs for Corporate (€12.50), Social (€27.50), Wedding (€22.50), and Custom services",
    priority: "High",
    status: "Not started",
    types: ["Pricing", "UI", "Cards"],
    effort: "Medium",
  },
  {
    title: "⭐ Tiered Service Options",
    summary: "3-tier system (Essential, Premium, Luxury)",
    description:
      "Implement 3-tier system (Essential, Premium, Luxury) for each service category with interactive pricing updates",
    priority: "Medium",
    status: "Not started",
    types: ["Pricing", "Tiers", "Interactive"],
    effort: "Medium",
  },
];

async function syncToNotion() {
  console.log("🚀 Syncing tasks to Notion...");
  console.log("===============================================");

  // Validate environment first
  validateEnvironment();

  let tasks = [];

  // Load tasks based on options
  if (options.data) {
    // Load from specified JSON file
    try {
      const dataPath = path.resolve(process.cwd(), options.data);
      const taskData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
      tasks = Array.isArray(taskData) ? taskData : [taskData];
      console.log(`📄 Loaded ${tasks.length} task(s) from ${options.data}`);
    } catch (e) {
      console.error(`❌ Failed to load data file: ${options.data}`);
      console.error(e.message);
      process.exit(1);
    }
  } else if (options.taskmaster !== false) {
    // Try to load from Task Master
    const taskMasterTasks = await loadTaskMasterTasks();
    if (taskMasterTasks && taskMasterTasks.length > 0) {
      tasks = taskMasterTasks;
      console.log(`📋 Loaded ${tasks.length} task(s) from Task Master`);
    } else {
      // Fallback to default tasks
      tasks = defaultTasks;
      console.log("📝 Using default task list");
    }
  } else {
    // Use default tasks
    tasks = defaultTasks;
    console.log("📝 Using default task list");
  }

  // Sync tasks with retry logic
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    console.log(`\n${i + 1}/${tasks.length}: Syncing task...`);

    let success = false;
    let retries = 3;

    while (!success && retries > 0) {
      success = await syncTask(task);
      if (!success && retries > 1) {
        console.log(`⏳ Retrying... (${retries - 1} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      retries--;
    }

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Rate limiting
    if (i < tasks.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("\n===============================================");
  console.log(
    `✅ Sync complete! Success: ${successCount}, Failed: ${failCount}`,
  );

  // Exit with error code if any failures
  process.exit(failCount > 0 ? 1 : 0);
}

// Help text
if (options.help || options.h) {
  console.log(`
Notion Sync Tool - Sync tasks to Notion database

Usage: node sync-to-notion.cjs [options]

Options:
  --help, -h              Show this help message
  --data=<file>           Load task data from JSON file
  --type=<type>           Filter by type (epic, story, task)
  --status=<status>       Filter by status (done, in-progress, pending)
  --task=<id>             Sync specific task by ID
  --update-status         Update existing tasks instead of creating new ones
  --taskmaster=false      Disable Task Master integration

Environment Variables:
  NOTION_API_KEY          Notion integration token (required)
  NOTION_DATABASE_ID      Target database ID (required)
  NOTION_SYNC_ENABLED     Set to 'false' to disable sync

Examples:
  node sync-to-notion.cjs                          # Sync all tasks
  node sync-to-notion.cjs --type=epic             # Sync only epics
  node sync-to-notion.cjs --status=done           # Sync completed tasks
  node sync-to-notion.cjs --data=task.json        # Sync from JSON file
  node sync-to-notion.cjs --task=task_001_1       # Sync specific task
  node sync-to-notion.cjs --update-status         # Update existing tasks
`);
  process.exit(0);
}

// Run sync
syncToNotion().catch(console.error);
