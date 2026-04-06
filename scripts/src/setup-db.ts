import { pool, db, tasksTable, habitsTable, goalsTable, businessMetricsTable } from "@workspace/db";
import { logger } from "../../artifacts/api-server/src/lib/logger";

async function setupAndSeed() {
  const client = await pool.connect();
  try {
    logger.info("Creating tables...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT false,
        category TEXT NOT NULL DEFAULT 'today',
        priority TEXT NOT NULL DEFAULT 'medium',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS habits (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL DEFAULT 'Zap',
        completed_today BOOLEAN NOT NULL DEFAULT false,
        streak INTEGER NOT NULL DEFAULT 0,
        last_completed_date TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL DEFAULT 'longterm',
        progress INTEGER NOT NULL DEFAULT 0,
        target INTEGER NOT NULL DEFAULT 100,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS business_metrics (
        id SERIAL PRIMARY KEY,
        category TEXT NOT NULL DEFAULT 'agency',
        name TEXT NOT NULL,
        value REAL NOT NULL DEFAULT 0,
        unit TEXT NOT NULL DEFAULT '',
        change REAL NOT NULL DEFAULT 0,
        period TEXT NOT NULL DEFAULT 'this month',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    logger.info("Tables created. Seeding data...");

    // Seed tasks
    const existingTasks = await db.select().from(tasksTable);
    if (existingTasks.length === 0) {
      await db.insert(tasksTable).values([
        { title: "Review morning emails", category: "today", priority: "high", completed: true },
        { title: "Write 500 words of content", category: "today", priority: "medium", completed: false },
        { title: "Record YouTube video", category: "today", priority: "medium", completed: false },
        { title: "Client call at 3pm", category: "today", priority: "high", completed: false },
        { title: "Plan content calendar for next month", category: "weekly", priority: "high", completed: false },
        { title: "Follow up with 3 leads", category: "weekly", priority: "medium", completed: true },
        { title: "Agency financial review", category: "weekly", priority: "medium", completed: false },
        { title: "Launch personal brand website", category: "longterm", priority: "high", completed: false },
        { title: "Write first book chapter", category: "longterm", priority: "medium", completed: false },
        { title: "Build team of 5 people", category: "longterm", priority: "high", completed: false },
      ]);
      logger.info("Tasks seeded");
    }

    // Seed habits
    const existingHabits = await db.select().from(habitsTable);
    if (existingHabits.length === 0) {
      await db.insert(habitsTable).values([
        { name: "Morning reading", icon: "BookOpen", completedToday: true, streak: 12 },
        { name: "Daily journaling", icon: "PenLine", completedToday: true, streak: 7 },
        { name: "Guitar practice", icon: "Music", completedToday: false, streak: 4 },
        { name: "Evening walk", icon: "Footprints", completedToday: false, streak: 22 },
        { name: "Meditation", icon: "Sparkles", completedToday: true, streak: 31 },
      ]);
      logger.info("Habits seeded");
    }

    // Seed goals
    const existingGoals = await db.select().from(goalsTable);
    if (existingGoals.length === 0) {
      await db.insert(goalsTable).values([
        { title: "Grow YouTube to 10K subscribers", type: "longterm", target: 10000, progress: 3200, description: "Consistent content creation and community building" },
        { title: "Generate 5 Lakh monthly revenue", type: "longterm", target: 500000, progress: 175000, description: "Agency + content income combined" },
        { title: "Publish 4 blog posts this week", type: "weekly", target: 4, progress: 2 },
        { title: "Reach out to 10 new clients", type: "weekly", target: 10, progress: 6 },
        { title: "Learn to play 3 new guitar songs", type: "longterm", target: 3, progress: 1 },
      ]);
      logger.info("Goals seeded");
    }

    // Seed business metrics
    const existingMetrics = await db.select().from(businessMetricsTable);
    if (existingMetrics.length === 0) {
      await db.insert(businessMetricsTable).values([
        { category: "agency", name: "Monthly Revenue", value: 175000, unit: "INR", change: 12.5, period: "April 2025" },
        { category: "agency", name: "Active Clients", value: 7, unit: "clients", change: 2, period: "April 2025" },
        { category: "agency", name: "Projects Delivered", value: 12, unit: "projects", change: 4, period: "April 2025" },
        { category: "content", name: "Total Posts", value: 48, unit: "posts", change: 6, period: "April 2025" },
        { category: "content", name: "Reels Published", value: 12, unit: "reels", change: 3, period: "April 2025" },
        { category: "content", name: "Follower Growth", value: 2800, unit: "followers", change: 18.3, period: "April 2025" },
      ]);
      logger.info("Business metrics seeded");
    }

    logger.info("Setup complete!");
  } finally {
    client.release();
    await pool.end();
  }
}

setupAndSeed().catch((e) => {
  logger.error(e, "Setup failed");
  process.exit(1);
});
