# 🍽️ Wesley's Ambacht - Professional Catering Enhancement

## 🎯 Project Overview

A comprehensive enhancement of Wesley's Ambacht catering website, implementing CEO Intelligence orchestration with empathy-driven design patterns. This project demonstrates advanced UI/UX implementation with Dutch cultural localization, real-time booking systems, and enterprise-grade testing.

### 🏆 Current Status: Epic 1 - 50% Complete

**Completed Components:**

- ✅ Mobile-adaptive floating booking widget with accessibility compliance
- ✅ 3-step progressive booking modal with Dutch localization
- ✅ Comprehensive Playwright testing suite (6 scenarios, 5 browsers)
- ✅ CEO Intelligence memory system for context preservation
- ✅ **Notion integration for task tracking and project management** _(8/8 tasks synced successfully)_

**Next Implementation:** Quote Calculator with price transparency

### 🔗 **Live Notion Database**: [Wesley's Ambacht Task Tracker](https://notion.so/21df23ab1c8f80ef914effd0d37a5b43)

## 🔄 Notion Task Sync Integration

This project includes automated Notion synchronization for task tracking and project management. The sync happens at key workflow milestones to maintain project visibility.

### Configuration

1. **Set up environment variables** in `.env`:

```env
NOTION_API_KEY="your_notion_integration_token"
NOTION_DATABASE_ID="your_notion_database_id"
NOTION_SYNC_ENABLED="true"  # Set to false to disable
```

2. **GitHub Secrets** (for automated workflows):

   - Go to Repository Settings → Secrets and variables → Actions
   - Add: `NOTION_API_KEY` with your integration token
   - Add: `NOTION_DATABASE_ID` with your database ID

3. **Notion Database Requirements**:
   - Properties: `Task name`, `Summary`, `Description`, `Priority`, `Status`, `Task type`, `Effort level`
   - Status options: `Not started`, `In progress`, `Done`
   - Priority options: `Low`, `Medium`, `High`

### Usage

#### Manual Sync Commands

```bash
npm run sync:notion         # Sync all tasks
npm run sync:epic          # Sync only epics
npm run sync:story         # Sync only stories
npm run sync:task          # Sync individual tasks
```

#### Automatic Sync Triggers

1. **Git Commits**: Automatically syncs when commit messages match patterns:

   - `feat: complete task_001_1`
   - `fix: finish story implementation`
   - `feat: done epic 1`

2. **GitHub Actions**: Syncs on workflow dispatch:

   - Story completion workflow
   - Task sync workflow

3. **Command Line Options**:

```bash
# Sync specific task
node sync-to-notion.cjs --task=task_001_1 --status=done

# Update existing tasks
node sync-to-notion.cjs --update-status

# Sync from JSON file
node sync-to-notion.cjs --data=custom-task.json

# Filter by status
node sync-to-notion.cjs --status=done
```

### GitHub Workflow Integration

Trigger story/task completion workflows:

```bash
gh workflow run story-complete.yml \
  -f story_id="task_001" \
  -f story_title="Epic 1 - Enhanced Booking Foundation" \
  -f deployment_type="staging"
```

### ✅ Sync Status

**Last Successful Sync**: 8/8 tasks created successfully

- 🚀 Epic 1 - Enhanced Booking Foundation
- 📱 Floating Booking Widget Implementation
- 📅 Enhanced DateChecker Modal
- 💰 Preliminary Quote Calculator
- 🗄️ Booking Database Schema Enhancement
- 💰 Epic 2 - Transparent Pricing & Services
- 🏷️ Service Pricing Cards Enhancement
- ⭐ Tiered Service Options

### Troubleshooting

- **Sync not working**: Check API keys in `.env`
- **Rate limits**: Script includes retry logic and rate limiting
- **Disable sync**: Set `NOTION_SYNC_ENABLED=false`
- **Debug mode**: Check console output for detailed sync status
- **Test sync**: Run `npm run sync:notion` to verify connection

## Project info

**URL**: <https://lovable.dev/projects/a1023e3f-928d-4dd5-93a1-518a4fb99a1f>

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a1023e3f-928d-4dd5-93a1-518a4fb99a1f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a1023e3f-928d-4dd5-93a1-518a4fb99a1f) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

<!-- TASKMASTER_EXPORT_START -->

> 🎯 **Taskmaster Export** - 2025-06-28 09:11:19 UTC
> 📋 Export: with subtasks • Status filter: none
> 🔗 Powered by [Task Master](https://task-master.dev?utm_source=github-readme&utm_medium=readme-export&utm_campaign=ambacht-verse-ontwerp&utm_content=task-export-link)

```
╭─────────────────────────────────────────────────────────╮╭─────────────────────────────────────────────────────────╮
│                                                         ││                                                         │
│   Project Dashboard                                     ││   Dependency Status & Next Task                         │
│   Tasks Progress: ░░░░░░░░░░░░░░░░░░░░ 0%    ││   Dependency Metrics:                                   │
│   0%                                                   ││   • Tasks with no dependencies: 2                      │
│   Done: 0  In Progress: 0  Pending: 4  Blocked: 0     ││   • Tasks ready to work on: 2                          │
│   Deferred: 0  Cancelled: 0                             ││   • Tasks blocked by dependencies: 2                    │
│                                                         ││   • Most depended-on task: #NaN (2 dependents)           │
│   Subtasks Progress: ░░░░░░░░░░░░░░░░░░░░     ││   • Avg dependencies per task: 0.8                      │
│   0% 0%                                               ││                                                         │
│   Completed: 0/16  In Progress: 0  Pending: 16      ││   Next Task to Work On:                                 │
│   Blocked: 0  Deferred: 0  Cancelled: 0                 ││   ID: task_001 - Epic 1 - Enhanced Booking Foundation     │
│                                                         ││   Priority: high  Dependencies: None                    │
│   Priority Breakdown:                                   ││   Complexity: N/A                                       │
│   • High priority: 2                                   │╰─────────────────────────────────────────────────────────╯
│   • Medium priority: 2                                 │
│   • Low priority: 0                                     │
│                                                         │
╰─────────────────────────────────────────────────────────╯
┌───────────┬──────────────────────────────────────┬─────────────────┬──────────────┬───────────────────────┬───────────┐
│ ID        │ Title                                │ Status          │ Priority     │ Dependencies          │ Complexi… │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_001  │ Epic 1 - Enhanced Booking Foundation │ ○ pending       │ high         │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_001.task_001_1       │ └─ Floating Booking Widget Implement │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_001.task_001_2       │ └─ Enhanced DateChecker Modal        │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_001.task_001_3       │ └─ Preliminary Quote Calculator      │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_001.task_001_4       │ └─ Booking Database Schema Enhanceme │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_002  │ Epic 2 - Transparent Pricing & Servi │ ○ pending       │ high         │ task_001              │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_002.task_002_1       │ └─ Service Pricing Cards Enhancement │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_002.task_002_2       │ └─ Tiered Service Options            │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_002.task_002_3       │ └─ Interactive Menu System           │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_002.task_002_4       │ └─ Seasonal Specials Section         │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_003  │ Epic 3 - Professional Trust Signals  │ ○ pending       │ medium       │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_003.task_003_1       │ └─ Awards and Certifications Section │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_003.task_003_2       │ └─ Enhanced Testimonials Carousel    │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_003.task_003_3       │ └─ Local Supplier Partnership Showca │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_003.task_003_4       │ └─ Professional Contact Enhancement  │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_004  │ Epic 4 - Communication & Integration │ ○ pending       │ medium       │ task_001, task_002    │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_004.task_004_1       │ └─ WhatsApp Business Integration     │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_004.task_004_2       │ └─ Multi-Language Support System     │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_004.task_004_3       │ └─ Enhanced Analytics and Conversion │ ○ pending       │ -            │ None                  │ N/A       │
├───────────┼──────────────────────────────────────┼─────────────────┼──────────────┼───────────────────────┼───────────┤
│ task_004.task_004_4       │ └─ Performance Optimization and PWA  │ ○ pending       │ -            │ None                  │ N/A       │
└───────────┴──────────────────────────────────────┴─────────────────┴──────────────┴───────────────────────┴───────────┘
```

╭────────────────────────────────────────────── ⚡ RECOMMENDED NEXT TASK ⚡ ──────────────────────────────────────────────╮
│ │
│ 🔥 Next Task to Work On: #task_001 - Epic 1 - Enhanced Booking Foundation │
│ │
│ Priority: high Status: ○ pending │
│ Dependencies: None │
│ │
│ Description: Establish the core booking experience that positions Wesley's Ambacht as a professional, accessible catering service. This epic delivers the fundamental infrastructure for improved conversion rates through streamlined booking access and enhanced date/time selection capabilities. │
│ │
│ Subtasks: │
│ task_001.task_001_1 [pending] Floating Booking Widget Implementation │
│ task_001.task_001_2 [pending] Enhanced DateChecker Modal │
│ task_001.task_001_3 [pending] Preliminary Quote Calculator │
│ task_001.task_001_4 [pending] Booking Database Schema Enhancement │
│ │
│ Start working: task-master set-status --id=task_001 --status=in-progress │
│ View details: task-master show task_001 │
│ │
╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

╭──────────────────────────────────────────────────────────────────────────────────────╮
│ │
│ Suggested Next Steps: │
│ │
│ 1. Run task-master next to see what to work on next │
│ 2. Run task-master expand --id=<id> to break down a task into subtasks │
│ 3. Run task-master set-status --id=<id> --status=done to mark a task as complete │
│ │
╰──────────────────────────────────────────────────────────────────────────────────────╯

> 📋 **End of Taskmaster Export** - Tasks are synced from your project using the `sync-readme` command.

<!-- TASKMASTER_EXPORT_END -->
