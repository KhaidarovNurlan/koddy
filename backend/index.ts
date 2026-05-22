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

app.use('*', logger())

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
    
    // Omit passwordHash
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
        if (energy === 4) { // It just dropped from 5, start the timer
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
        
        if (energy <= 0) {
            return c.json({ error: 'Not enough energy' }, 400);
        }

        energy -= 1;
        if (energy === 4) {
            lastEnergyUpdate = new Date();
        }

        await db.update(users).set({ energy, lastEnergyUpdate }).where(eq(users.id, user.id));
        return c.json({ success: true, energy });
    } catch (error) {
        console.error('Consume energy error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}...`);

serve({
  fetch: app.fetch,
  port
});
