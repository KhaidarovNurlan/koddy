import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { jwt, sign } from 'hono/jwt';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { db } from './db/index.js';
import { users, userJourneys, userLessons, lessonSubmissions } from './db/schema.js';

dotenv.config();

const app = new Hono();

app.use('*', logger());

app.use('/*', cors());

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in your .env");
}

const api = app.basePath('/api');

api.post('/auth/register', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return c.json({ error: 'Email already exists' }, 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [newUser] = await db.insert(users).values({ email, passwordHash }).returning();

    const payload = { id: newUser.id, email: newUser.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 };
    const token = await sign(payload, JWT_SECRET);

    return c.json({ token, user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const payload = { id: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 };
    const token = await sign(payload, JWT_SECRET);

    return c.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.get('/journeys/stats', async (c) => {
  try {
    const stats = await db.select({
      journeyId: userJourneys.journeyId,
      count: sql<number>`count(${userJourneys.id})`.mapWith(Number)
    }).from(userJourneys).groupBy(userJourneys.journeyId);

    return c.json({ stats });
  } catch (error) {
    console.error('Stats error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.use('/user/*', jwt({ secret: JWT_SECRET, alg: 'HS256' }));

const updateEnergy = async (user: any) => {
  let { energy, lastEnergyUpdate } = user;
  if (energy < 5) {
    const now = new Date();
    const diff = now.getTime() - new Date(lastEnergyUpdate).getTime();
    const energyToAdd = Math.floor(diff / (2 * 60 * 1000));
    if (energyToAdd > 0) {
      energy = Math.min(5, energy + energyToAdd);
      lastEnergyUpdate = new Date(new Date(lastEnergyUpdate).getTime() + energyToAdd * 2 * 60 * 1000);
      if (energy === 5) {
        lastEnergyUpdate = now;
      }
      await db.update(users).set({ energy, lastEnergyUpdate }).where(eq(users.id, user.id));
    }
  }
  return { energy, lastEnergyUpdate };
};

api.get('/user/me', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const [user] = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);
    if (!user) return c.json({ error: 'User not found' }, 404);

    const { energy, lastEnergyUpdate } = await updateEnergy(user);

    const userJourneyRecords = await db.select().from(userJourneys).where(eq(userJourneys.userId, user.id));
    const journeys = Array.from(new Set(userJourneyRecords.map(j => j.journeyId)));

    const lessonRecords = await db.select().from(userLessons).where(eq(userLessons.userId, user.id));

    const { passwordHash, ...safeUser } = user;
    safeUser.energy = energy;
    safeUser.lastEnergyUpdate = lastEnergyUpdate;

    return c.json({ user: safeUser, journeys, lessons: lessonRecords });
  } catch (error) {
    console.error('Me error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/user/journeys', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const { journeyId } = await c.req.json();

    if (!journeyId) return c.json({ error: 'journeyId is required' }, 400);

    const existing = await db.select().from(userJourneys).where(sql`${userJourneys.userId} = ${payload.id} AND ${userJourneys.journeyId} = ${journeyId}`).limit(1);

    if (existing.length === 0) {
      await db.insert(userJourneys).values({ userId: payload.id, journeyId });
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Add journey error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/user/lessons/submit', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const { journeyId, lessonId, taskId, code, passed } = await c.req.json();

    const [submission] = await db.insert(lessonSubmissions).values({
      userId: payload.id,
      journeyId,
      lessonId,
      taskId,
      code,
      passed
    }).returning();

    return c.json({ submission });
  } catch (error) {
    console.error('Submit task error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/user/lessons/complete', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const { journeyId, chapterId, lessonId, tokens, xp, consumedEnergy } = await c.req.json();

    const [user] = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);
    if (!user) return c.json({ error: 'User not found' }, 404);

    let { energy, lastEnergyUpdate } = await updateEnergy(user);

    if (consumedEnergy && energy > 0) {
      energy -= 1;
      if (energy === 4) {
        lastEnergyUpdate = new Date();
      }
    } else if (consumedEnergy && energy <= 0) {
      return c.json({ error: 'Not enough energy' }, 400);
    }

    const newXp = user.xp + (xp || 0);
    const newTokens = user.tokens + (tokens || 0);

    await db.update(users).set({ xp: newXp, tokens: newTokens, energy, lastEnergyUpdate }).where(eq(users.id, user.id));

    const existingLesson = await db.select().from(userLessons).where(sql`${userLessons.userId} = ${payload.id} AND ${userLessons.journeyId} = ${journeyId} AND ${userLessons.lessonId} = ${lessonId} AND ${userLessons.chapterId} = ${chapterId}`).limit(1);

    if (existingLesson.length === 0) {
      await db.insert(userLessons).values({
        userId: payload.id,
        journeyId,
        chapterId,
        lessonId,
        passed: true,
        passedAt: new Date()
      });
    }

    return c.json({ success: true, energy, xp: newXp, tokens: newTokens });
  } catch (error) {
    console.error('Complete lesson error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/user/energy/consume', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const [user] = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);
    if (!user) return c.json({ error: 'User not found' }, 404);

    let { energy, lastEnergyUpdate } = await updateEnergy(user);

    const body = await c.req.json().catch(() => ({}));
    const amount = typeof body.amount === 'number' ? body.amount : 1;

    if (amount <= 0) {
      return c.json({ success: true, energy });
    }

    if (energy < amount) {
      return c.json({ error: 'Not enough energy' }, 400);
    }

    const prevEnergy = energy;
    energy -= amount;
    if (energy < 5 && prevEnergy >= 5) {
      lastEnergyUpdate = new Date();
    }

    await db.update(users).set({ energy, lastEnergyUpdate }).where(eq(users.id, user.id));
    return c.json({ success: true, energy });
  } catch (error) {
    console.error('Consume energy error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

async function runCode(language: string, code: string, apiKey: string, apiHost: string, apiUrl: string) {
  const lang = language.toLowerCase();

  const getMainFileName = (l: string) => {
    switch (l) {
      case 'python': return 'main.py';
      case 'javascript': return 'main.js';
      case 'java': return 'Main.java';
      case 'cpp': return 'main.cpp';
      case 'c': return 'main.c';
      case 'csharp': return 'main.cs';
      case 'lua': return 'main.lua';
      case 'php': return 'main.php';
      case 'go': return 'main.go';
      case 'dart': return 'main.dart';
      case 'rust': return 'main.rs';
      case 'r': return 'main.r';
      case 'ruby': return 'main.rb';
      case 'swift': return 'main.swift';
      default: return 'main.txt';
    }
  };

  const requestBody = {
    language: lang,
    stdin: "",
    files: [
      {
        name: getMainFileName(lang),
        content: code
      }
    ]
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': apiHost
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`RapidAPI responded with status: ${response.status}`);
  }

  const body = await response.json() as any;
  const stdout = body.stdout || '';
  const stderr = body.stderr || '';

  return { stdout, stderr };
}

api.post('/user/code/run', async (c) => {
  try {
    const { language, code } = await c.req.json();
    if (!language || !code) {
      return c.json({ error: 'Language and code are required' }, 400);
    }

    const apiKey = process.env.RAPIDAPI_KEY ?? "";
    const apiHost = process.env.RAPIDAPI_HOST ?? "";
    const apiUrl = process.env.RAPIDAPI_URL ?? "";

    let result: { stdout: string; stderr: string };

    console.log("DEBUG: Target URL is ->", apiUrl);

    try {
      result = await runCode(language, code, apiKey, apiHost, apiUrl);
      return c.json(result);
    } catch (err: any) {
      console.error('RapidAPI run failed, trying local fallback:', err);
    }

  } catch (error: any) {
    console.error('Run code error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

api.get('/user/lessons/submissions/:lessonId', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const lessonId = c.req.param('lessonId');

    const submissions = await db.select()
      .from(lessonSubmissions)
      .where(sql`${lessonSubmissions.userId} = ${payload.id} AND ${lessonSubmissions.lessonId} = ${lessonId}`)
      .orderBy(sql`${lessonSubmissions.submittedAt} DESC`);

    return c.json({ submissions });
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}...`);

serve({
  fetch: app.fetch,
  port
});
