import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { jwt, sign } from 'hono/jwt';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';
import { db } from './db/index.js';
import { users, userJourneys, userLessons, lessonSubmissions, userProjects, courses, courseLessons, userCourseLessons, notifications, userGoals } from './db/schema.js';

dotenv.config();

const app = new Hono();

app.use('*', logger());

app.use('/*', cors());

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in your .env");
}

const api = app.basePath('/api');

let transporter: nodemailer.Transporter | null = null;
async function initMailer() {
  try {
    if (process.env.GMAIL_USERNAME && process.env.GMAIL_APP_PASSWORD) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USERNAME.trim(),
          pass: process.env.GMAIL_APP_PASSWORD.trim()
        }
      });
      console.log('Mailer initialized using Gmail with App Password');
    } else if (process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      console.log('Mailer initialized using Custom SMTP');
    } else {
      let testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Created Ethereal Test Account for Emails');
    }
  } catch (err) {
    console.error('Failed to init mailer', err);
  }
}
initMailer();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy_key_to_avoid_crash' });

api.post('/auth/register', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return c.json({ error: 'Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.' }, 400);
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
      count: sql<number>`count(distinct ${userJourneys.userId})`.mapWith(Number)
    }).from(userJourneys).groupBy(userJourneys.journeyId);

    return c.json({ stats });
  } catch (error) {
    console.error('Stats error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.get('/users/count', async (c) => {
  try {
    const [result] = await db.select({
      count: sql<number>`count(${users.id})`.mapWith(Number)
    }).from(users);
    return c.json({ count: result?.count || 0 });
  } catch (error) {
    console.error('Count users error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

const passwordResetCodes = new Map<string, string>();

api.post('/auth/forgot-password', async (c) => {
  try {
    const { email } = await c.req.json();
    if (!email) return c.json({ error: 'Email is required' }, 400);

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return c.json({ success: true, message: 'If the email exists, a reset link was sent.' });
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    passwordResetCodes.set(email, resetToken);

    if (transporter) {
      const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
      const info = await transporter.sendMail({
        from: `"Koddy" <${process.env.GMAIL_USERNAME || 'noreply@koddy.com'}>`,
        to: email,
        subject: "Password Reset Request",
        text: `Click the following link to reset your password: ${resetUrl}`,
        html: `<p>Click the following link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
      });
      console.log("Password reset email sent.");
    }

    return c.json({ success: true, message: 'If the email exists, a reset link was sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/auth/reset-password', async (c) => {
  try {
    const { email, token, newPassword } = await c.req.json();
    if (!email || !token || !newPassword) return c.json({ error: 'Missing fields' }, 400);

    const validToken = passwordResetCodes.get(email);
    if (!validToken || validToken !== token) {
      return c.json({ error: 'Invalid or expired token' }, 400);
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return c.json({ error: 'Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character.' }, 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ passwordHash }).where(eq(users.email, email));
    passwordResetCodes.delete(email);

    return c.json({ success: true, message: 'Password has been reset' });
  } catch (error) {
    console.error('Reset password error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.use('/user/*', jwt({ secret: JWT_SECRET, alg: 'HS256' }));
api.use('/admin/*', jwt({ secret: JWT_SECRET, alg: 'HS256' }));
api.use('/ai/*', jwt({ secret: JWT_SECRET, alg: 'HS256' }));

const getTodayAndYesterday = (localDateHeader?: string) => {
  let today = new Date();
  if (localDateHeader) {
    const parts = localDateHeader.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);
      today = new Date(year, month, day);
    }
  }

  const todayStr = localDateHeader || today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yyyy = yesterday.getFullYear();
  const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
  const dd = String(yesterday.getDate()).padStart(2, '0');
  const yesterdayStr = `${yyyy}-${mm}-${dd}`;

  return { todayStr, yesterdayStr };
};

const checkStreakDecay = async (user: any, localDate?: string) => {
  const { todayStr, yesterdayStr } = getTodayAndYesterday(localDate);
  if (user.lastActiveDate && user.lastActiveDate !== todayStr && user.lastActiveDate !== yesterdayStr) {
    const todayDate = new Date(todayStr);
    const lastActive = new Date(user.lastActiveDate);
    const diffTime = Math.abs(todayDate.getTime() - lastActive.getTime());
    const missedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

    if (user.streakFreezes >= missedDays) {
      await db.update(users).set({
        streakFreezes: user.streakFreezes - missedDays,
        lastActiveDate: yesterdayStr
      }).where(eq(users.id, user.id));
      user.streakFreezes -= missedDays;
      user.lastActiveDate = yesterdayStr;
    } else {
      await db.update(users).set({ streak: 0, doubleOrNothingStart: null }).where(eq(users.id, user.id));
      user.streak = 0;
      user.doubleOrNothingStart = null;
    }
  }
  return user;
};

const updateStreakOnActivity = async (user: any, localDate?: string) => {
  const { todayStr, yesterdayStr } = getTodayAndYesterday(localDate);
  let newStreak = user.streak;
  let activeDays: string[] = [];
  try {
    activeDays = JSON.parse(user.activeDays || '[]');
  } catch (e) { }

  if (!activeDays.includes(todayStr)) {
    activeDays.push(todayStr);
  }

  if (!user.lastActiveDate) {
    newStreak = 1;
  } else if (user.lastActiveDate === yesterdayStr) {
    newStreak += 1;
  } else if (user.lastActiveDate !== todayStr) {
    newStreak = 1;
  }

  await db.update(users).set({
    streak: newStreak,
    lastActiveDate: todayStr,
    activeDays: JSON.stringify(activeDays)
  }).where(eq(users.id, user.id));

  if (user.doubleOrNothingStart) {
    const startDate = new Date(user.doubleOrNothingStart);
    const todayDate = new Date(todayStr);
    const diffTime = Math.abs(todayDate.getTime() - startDate.getTime());
    const daysSince = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysSince >= 7) {
      await db.update(users).set({ tokens: user.tokens + 20, doubleOrNothingStart: null }).where(eq(users.id, user.id));
      user.tokens = (user.tokens || 0) + 20;
      await db.insert(notifications).values({
        userId: user.id,
        title: "Double or Nothing",
        message: "You maintained your 7-day streak!",
        reward: "+20 Tokens"
      });
      user.doubleOrNothingStart = null;
    }
  }

  return { streak: newStreak, lastActiveDate: todayStr, activeDays: JSON.stringify(activeDays), tokens: user.tokens, doubleOrNothingStart: user.doubleOrNothingStart };
};

const getUserRankAndLeague = async (userId: number) => {
  const allUsers = await db.select({
    id: users.id,
    xp: users.xp
  }).from(users).orderBy(sql`${users.xp} DESC`);

  let rank = -1;
  for (let i = 0; i < allUsers.length; i++) {
    if (allUsers[i].id === userId) {
      rank = i + 1;
      break;
    }
  }

  const LEAGUES = [
    { name: 'master', maxRank: 5 },
    { name: 'challenger', maxRank: 15 },
    { name: 'apprentice', maxRank: 30 },
    { name: 'rookie', maxRank: 50 },
    { name: 'explorer', maxRank: 100 },
    { name: 'starter', maxRank: Infinity }
  ];

  let league = 'starter';
  if (rank !== -1) {
    league = (LEAGUES.find(l => rank <= l.maxRank) || LEAGUES[5]).name;
  }

  return { rank, league };
};

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
    let [user] = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);
    if (!user) return c.json({ error: 'User not found' }, 404);

    const localDate = c.req.header('x-local-date');
    user = await checkStreakDecay(user, localDate);
    const { energy, lastEnergyUpdate } = await updateEnergy(user);

    const userJourneyRecords = await db.select().from(userJourneys).where(eq(userJourneys.userId, user.id));
    const journeys = Array.from(new Set(userJourneyRecords.map(j => j.journeyId)));

    const lessonRecords = await db.select().from(userLessons).where(eq(userLessons.userId, user.id));

    const { passwordHash, ...safeUser } = user;
    safeUser.energy = energy;
    safeUser.lastEnergyUpdate = lastEnergyUpdate;

    const { rank, league } = await getUserRankAndLeague(user.id);
    (safeUser as any).rank = rank;
    (safeUser as any).league = league;

    return c.json({ user: safeUser, journeys, lessons: lessonRecords });
  } catch (error) {
    console.error('Me error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/user/avatar', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const { avatar } = await c.req.json();

    if (typeof avatar !== 'string') {
      return c.json({ error: 'Invalid avatar data' }, 400);
    }

    await db.update(users).set({ avatar }).where(eq(users.id, payload.id));
    return c.json({ success: true, avatar });
  } catch (error) {
    console.error('Update avatar error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/user/contact', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const { type, message, context } = await c.req.json();

    if (!message) return c.json({ error: 'Message is required' }, 400);

    const [user] = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);

    if (transporter) {
      const info = await transporter.sendMail({
        from: `"Koddy App" <${process.env.GMAIL_USERNAME || 'noreply@koddy.com'}>`,
        to: "nurlankh888@gmail.com",
        subject: `New ${type || 'Support'} Request from ${user?.email || 'Unknown'}`,
        text: `Type: ${type}\nUser: ${user?.email}\nContext: ${context || 'N/A'}\n\nMessage:\n${message}`,
      });
      console.log("Contact email sent to Admin.");
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Contact error:', error);
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
      try {
        await db.insert(userJourneys).values({ userId: payload.id, journeyId });
      } catch (error) {
        // Ignore unique constraint violations due to concurrent requests
      }
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

async function updateDailyGoals(userId: number, xpEarned: number, exerciseCompleted: boolean, perfectCompletion: boolean, localDate?: string) {
  try {
    const today = localDate || new Date().toISOString().split('T')[0];

    let [goalsRow] = await db.select().from(userGoals).where(sql`${userGoals.userId} = ${userId} AND ${userGoals.date} = ${today}`).limit(1);

    if (!goalsRow) {
      [goalsRow] = await db.insert(userGoals).values({
        userId,
        date: today,
        goal1Current: 0,
        goal1Claimed: false,
        goal2Current: 0,
        goal2Claimed: false,
        goal3Current: 0,
        goal3Claimed: false
      }).returning();
    }

    let goal1Inc = perfectCompletion ? 1 : 0;
    let goal2Inc = exerciseCompleted ? 1 : 0;
    let goal3Inc = xpEarned;

    const newGoal1 = Math.min(2, goalsRow.goal1Current + goal1Inc);
    const newGoal2 = Math.min(5, goalsRow.goal2Current + goal2Inc);
    const newGoal3 = Math.min(70, goalsRow.goal3Current + goal3Inc);

    let goal1CompletedNow = false;
    let goal2CompletedNow = false;
    let goal3CompletedNow = false;

    if (newGoal1 >= 2 && !goalsRow.goal1Claimed) {
      goal1CompletedNow = true;
    }
    if (newGoal2 >= 5 && !goalsRow.goal2Claimed) {
      goal2CompletedNow = true;
    }
    if (newGoal3 >= 70 && !goalsRow.goal3Claimed) {
      goal3CompletedNow = true;
    }

    await db.update(userGoals).set({
      goal1Current: newGoal1,
      goal1Claimed: goalsRow.goal1Claimed || goal1CompletedNow,
      goal2Current: newGoal2,
      goal2Claimed: goalsRow.goal2Claimed || goal2CompletedNow,
      goal3Current: newGoal3,
      goal3Claimed: goalsRow.goal3Claimed || goal3CompletedNow
    }).where(eq(userGoals.id, goalsRow.id));

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return;

    let awardedTokens = 0;

    if (goal1CompletedNow) {
      const reward = Math.floor(Math.random() * 10) + 1;
      awardedTokens += reward;
      await db.insert(notifications).values({
        userId,
        title: "Daily Goal Completed!",
        message: `You completed: "Get 2 perfect completions"`,
        reward: `+${reward} Tokens`
      });
    }

    if (goal2CompletedNow) {
      const reward = Math.floor(Math.random() * 10) + 1;
      awardedTokens += reward;
      await db.insert(notifications).values({
        userId,
        title: "Daily Goal Completed!",
        message: `You completed: "Complete 5 exercises"`,
        reward: `+${reward} Tokens`
      });
    }

    if (goal3CompletedNow) {
      const reward = Math.floor(Math.random() * 10) + 1;
      awardedTokens += reward;
      await db.insert(notifications).values({
        userId,
        title: "Daily Goal Completed!",
        message: `You completed: "Earn 70 XP"`,
        reward: `+${reward} Tokens`
      });
    }

    if (awardedTokens > 0) {
      await db.update(users).set({
        tokens: user.tokens + awardedTokens
      }).where(eq(users.id, userId));
    }
  } catch (error) {
    console.error('Update daily goals error:', error);
  }
}

api.post('/user/lessons/complete', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const { journeyId, chapterId, lessonId, tokens, xp, consumedEnergy, noMistakes } = await c.req.json();

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

    let actualXpToGive = xp || 0;
    if (user.xpDoublerUntil && new Date(user.xpDoublerUntil) > new Date()) {
      actualXpToGive *= 2;
    }
    const newXp = user.xp + actualXpToGive;
    let newTokens = user.tokens + (tokens || 0);

    let streakVal = user.streak;
    let lastActiveDateVal = user.lastActiveDate;
    let activeDaysVal = user.activeDays;
    let doubleOrNothingStartVal = user.doubleOrNothingStart;

    const localDate = c.req.header('x-local-date');
    if (actualXpToGive > 0) {
      const streakUpdate = await updateStreakOnActivity(user, localDate);
      streakVal = streakUpdate.streak;
      lastActiveDateVal = streakUpdate.lastActiveDate;
      activeDaysVal = streakUpdate.activeDays;
      newTokens = streakUpdate.tokens !== undefined ? streakUpdate.tokens + (tokens || 0) : newTokens;
      doubleOrNothingStartVal = streakUpdate.doubleOrNothingStart;
    }

    await db.update(users).set({
      xp: newXp,
      tokens: newTokens,
      energy,
      lastEnergyUpdate,
      streak: streakVal,
      lastActiveDate: lastActiveDateVal,
      activeDays: activeDaysVal,
      doubleOrNothingStart: doubleOrNothingStartVal
    }).where(eq(users.id, user.id));

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

    await updateDailyGoals(payload.id, xp || 0, true, !!noMistakes, localDate);

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

api.get('/courses', async (c) => {
  try {
    const list = await db.select({
      id: courses.id,
      title: courses.title,
      language: courses.language,
      difficulty: courses.difficulty,
      createdAt: courses.createdAt,
      creatorId: courses.userId,
      creatorName: users.email
    }).from(courses).leftJoin(users, eq(courses.userId, users.id)).orderBy(sql`${courses.createdAt} DESC`);

    const formatted = list.map(item => ({
      id: item.id,
      title: item.title,
      language: item.language,
      difficulty: item.difficulty,
      createdAt: item.createdAt,
      creatorName: item.creatorName ? item.creatorName.split('@')[0] : 'Unknown'
    }));

    return c.json({ courses: formatted });
  } catch (error) {
    console.error('Fetch courses error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/courses', jwt({ secret: JWT_SECRET, alg: 'HS256' }), async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const { title, language, difficulty, lessons: lessonList } = await c.req.json();

    if (!title || !language || !difficulty || !lessonList || !Array.isArray(lessonList) || lessonList.length === 0) {
      return c.json({ error: 'Missing required fields or lessons are empty' }, 400);
    }

    const [insertedCourse] = await db.insert(courses).values({
      userId: payload.id,
      title,
      language,
      difficulty
    }).returning();

    for (let i = 0; i < lessonList.length; i++) {
      const les = lessonList[i];
      await db.insert(courseLessons).values({
        courseId: insertedCourse.id,
        title: les.title,
        description: les.description,
        expectedOutput: les.expectedOutput,
        order: i
      });
    }

    return c.json({ success: true, courseId: insertedCourse.id });
  } catch (error) {
    console.error('Create course error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.get('/courses/:id', jwt({ secret: JWT_SECRET, alg: 'HS256' }), async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const courseIdVal = parseInt(c.req.param('id'));

    const [course] = await db.select().from(courses).where(eq(courses.id, courseIdVal)).limit(1);
    if (!course) {
      return c.json({ error: 'Course not found' }, 404);
    }

    const lessonsList = await db.select().from(courseLessons).where(eq(courseLessons.courseId, courseIdVal)).orderBy(courseLessons.order);

    const userCompleted = await db.select().from(userCourseLessons).where(sql`${userCourseLessons.userId} = ${payload.id} AND ${userCourseLessons.courseId} = ${courseIdVal}`);

    const completedLessonIds = new Set(userCompleted.filter(l => l.passed).map(l => l.lessonId));

    const lessonsWithStatus = lessonsList.map(les => ({
      id: les.id,
      title: les.title,
      description: les.description,
      expectedOutput: les.expectedOutput,
      passed: completedLessonIds.has(les.id)
    }));

    return c.json({
      course: {
        id: course.id,
        title: course.title,
        language: course.language,
        difficulty: course.difficulty
      },
      lessons: lessonsWithStatus
    });
  } catch (error) {
    console.error('Fetch course error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/courses/lessons/:id/complete', jwt({ secret: JWT_SECRET, alg: 'HS256' }), async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const lessonIdVal = parseInt(c.req.param('id'));

    const [lesson] = await db.select().from(courseLessons).where(eq(courseLessons.id, lessonIdVal)).limit(1);
    if (!lesson) {
      return c.json({ error: 'Lesson not found' }, 404);
    }

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

    let xpToGive = 10;
    if (user.xpDoublerUntil && new Date(user.xpDoublerUntil) > new Date()) {
      xpToGive *= 2;
    }
    const tokensToGive = 1;
    const newXp = user.xp + xpToGive;
    let newTokens = user.tokens + tokensToGive;

    const localDate = c.req.header('x-local-date');
    const streakUpdate = await updateStreakOnActivity(user, localDate);
    const streakVal = streakUpdate.streak;
    const lastActiveDateVal = streakUpdate.lastActiveDate;
    const activeDaysVal = streakUpdate.activeDays;
    if (streakUpdate.tokens !== undefined) {
      newTokens = streakUpdate.tokens + tokensToGive;
    }
    const doubleOrNothingStartVal = streakUpdate.doubleOrNothingStart;

    await db.update(users).set({
      xp: newXp,
      tokens: newTokens,
      energy,
      lastEnergyUpdate,
      streak: streakVal,
      lastActiveDate: lastActiveDateVal,
      activeDays: activeDaysVal,
      doubleOrNothingStart: doubleOrNothingStartVal
    }).where(eq(users.id, user.id));

    const existingProgress = await db.select().from(userCourseLessons).where(sql`${userCourseLessons.userId} = ${payload.id} AND ${userCourseLessons.lessonId} = ${lessonIdVal}`).limit(1);

    if (existingProgress.length === 0) {
      await db.insert(userCourseLessons).values({
        userId: payload.id,
        courseId: lesson.courseId,
        lessonId: lessonIdVal,
        passed: true,
        passedAt: new Date()
      });
    }

    await updateDailyGoals(payload.id, xpToGive, true, true, localDate);

    return c.json({ success: true, energy, xp: newXp, tokens: newTokens });
  } catch (error) {
    console.error('Complete course lesson error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.get('/user/goals', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const localDate = c.req.header('x-local-date');
    const today = localDate || new Date().toISOString().split('T')[0];

    let [goalsRow] = await db.select().from(userGoals).where(sql`${userGoals.userId} = ${payload.id} AND ${userGoals.date} = ${today}`).limit(1);

    if (!goalsRow) {
      [goalsRow] = await db.insert(userGoals).values({
        userId: payload.id,
        date: today,
        goal1Current: 0,
        goal1Claimed: false,
        goal2Current: 0,
        goal2Claimed: false,
        goal3Current: 0,
        goal3Claimed: false
      }).returning();
    }

    return c.json({
      goals: [
        { title: "Get 2 perfect completions", current: goalsRow.goal1Current, total: 2, claimed: goalsRow.goal1Claimed },
        { title: "Complete 5 exercises", current: goalsRow.goal2Current, total: 5, claimed: goalsRow.goal2Claimed },
        { title: "Earn 70 XP", current: goalsRow.goal3Current, total: 70, claimed: goalsRow.goal3Claimed }
      ]
    });
  } catch (error) {
    console.error('Fetch daily goals error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.get('/user/notifications', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const list = await db.select().from(notifications).where(eq(notifications.userId, payload.id)).orderBy(sql`${notifications.createdAt} DESC`);
    return c.json({ notifications: list });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.get('/user/projects', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const projects = await db.select()
      .from(userProjects)
      .where(eq(userProjects.userId, payload.id))
      .orderBy(sql`${userProjects.updatedAt} DESC`);
    return c.json({ projects });
  } catch (error) {
    console.error('Fetch projects error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/user/projects', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const { title, description, language, code } = await c.req.json();

    if (!title || !language) return c.json({ error: 'Title and language are required' }, 400);

    const [project] = await db.insert(userProjects).values({
      userId: payload.id,
      title,
      description,
      language,
      code: code || ''
    }).returning();

    return c.json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.get('/user/projects/:id', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const projectId = parseInt(c.req.param('id'), 10);

    if (isNaN(projectId)) return c.json({ error: 'Invalid project ID' }, 400);

    const [project] = await db.select()
      .from(userProjects)
      .where(sql`${userProjects.id} = ${projectId} AND ${userProjects.userId} = ${payload.id}`)
      .limit(1);

    if (!project) return c.json({ error: 'Project not found' }, 404);

    return c.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.put('/user/projects/:id', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const projectId = parseInt(c.req.param('id'), 10);

    if (isNaN(projectId)) return c.json({ error: 'Invalid project ID' }, 400);

    const { code } = await c.req.json();

    const [project] = await db.update(userProjects)
      .set({ code, updatedAt: new Date() })
      .where(sql`${userProjects.id} = ${projectId} AND ${userProjects.userId} = ${payload.id}`)
      .returning();

    if (!project) return c.json({ error: 'Project not found' }, 404);

    return c.json({ project });
  } catch (error) {
    console.error('Update project error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/admin/award', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    if (!payload || payload.email !== 'nurlankh888@gmail.com') {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    const { username, type, amount } = await c.req.json();
    if (!username || !type || !amount || amount <= 0) {
      return c.json({ error: 'Invalid parameters' }, 400);
    }

    const targetEmail = username + '@';
    const allUsers = await db.select().from(users);
    const targetUser = allUsers.find(u => u.email.startsWith(targetEmail) || u.email === username);

    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (type === 'xp') {
      const newXp = (targetUser.xp || 0) + amount;
      await db.update(users).set({ xp: newXp }).where(eq(users.id, targetUser.id));
    } else if (type === 'tokens') {
      const newTokens = (targetUser.tokens || 0) + amount;
      await db.update(users).set({ tokens: newTokens }).where(eq(users.id, targetUser.id));
    } else {
      return c.json({ error: 'Invalid reward type' }, 400);
    }

    return c.json({ success: true, message: `Successfully awarded ${amount} ${type} to ${username}` });
  } catch (error) {
    console.error('Admin award error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.get('/user/leaderboard', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;

    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      xp: users.xp,
      avatar: users.avatar,
      activeTitle: users.activeTitle
    }).from(users).orderBy(sql`${users.xp} DESC`);

    let userRank = -1;
    let userLeague = 'starter';

    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].id === payload.id) {
        userRank = i + 1;
        break;
      }
    }

    if (userRank === -1) {
      return c.json({ error: 'User not found' }, 404);
    }

    const LEAGUES = [
      { name: 'master', maxRank: 5 },
      { name: 'challenger', maxRank: 15 },
      { name: 'apprentice', maxRank: 30 },
      { name: 'rookie', maxRank: 50 },
      { name: 'explorer', maxRank: 100 },
      { name: 'starter', maxRank: Infinity }
    ];

    let currentLeagueObj = LEAGUES.find(l => userRank <= l.maxRank) || LEAGUES[5];
    userLeague = currentLeagueObj.name;

    const leagueIndex = LEAGUES.findIndex(l => l.name === userLeague);
    const minRank = leagueIndex === 0 ? 1 : LEAGUES[leagueIndex - 1].maxRank + 1;
    const maxRank = currentLeagueObj.maxRank;

    let leagueUsers = allUsers.filter((_, index) => {
      const rank = index + 1;
      return rank >= minRank && rank <= maxRank;
    });

    if (userLeague === 'starter' && leagueUsers.length > 50) {
      const topStarters = leagueUsers.slice(0, 50);
      const isUserInTopStarters = topStarters.some(u => u.id === payload.id);
      if (!isUserInTopStarters) {
        const userInLeague = leagueUsers.find(u => u.id === payload.id);
        if (userInLeague) {
          topStarters.push(userInLeague);
        }
      }
      leagueUsers = topStarters;
    }

    const leaderboard = leagueUsers.map((u, index) => {
      const rank = allUsers.findIndex(au => au.id === u.id) + 1;
      const displayName = u.email.split('@')[0];
      return {
        id: u.id,
        username: displayName,
        xp: u.xp,
        rank,
        avatar: u.avatar,
        activeTitle: u.activeTitle
      };
    });

    return c.json({
      league: userLeague,
      rank: userRank,
      leaderboard
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.get('/user/search', async (c) => {
  try {
    const q = c.req.query('q') || '';
    if (!q) {
      return c.json({ users: [] });
    }

    const matchedUsers = await db.select({
      id: users.id,
      email: users.email,
      xp: users.xp,
      streak: users.streak,
      avatar: users.avatar,
      activeTitle: users.activeTitle
    }).from(users).where(sql`LOWER(${users.email}) LIKE ${'%' + q.toLowerCase() + '%'}`).limit(20);

    const results = [];
    for (const u of matchedUsers) {
      const { rank, league } = await getUserRankAndLeague(u.id);
      results.push({
        id: u.id,
        username: u.email.split('@')[0],
        xp: u.xp,
        streak: u.streak,
        league,
        rank,
        avatar: u.avatar,
        activeTitle: u.activeTitle
      });
    }

    return c.json({ users: results });
  } catch (error) {
    console.error('Search error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.get('/user/profile/:username', async (c) => {
  try {
    const username = c.req.param('username');

    const allUsers = await db.select().from(users);
    const user = allUsers.find(u => u.email.split('@')[0].toLowerCase() === username.toLowerCase());

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const { rank, league } = await getUserRankAndLeague(user.id);

    return c.json({
      id: user.id,
      username: username,
      avatar: user.avatar,
      xp: user.xp,
      streak: user.streak,
      league,
      rank,
      activeTitle: user.activeTitle
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/user/store/buy', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const { itemId, price } = await c.req.json();
    const [user] = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);
    if (!user) return c.json({ error: 'User not found' }, 404);

    if (user.tokens < price) return c.json({ error: 'Not enough tokens' }, 400);

    let updates: any = { tokens: user.tokens - price };

    if (itemId === 'streak-freeze') {
      updates.streakFreezes = user.streakFreezes + 1;
    } else if (itemId === 'double-or-nothing') {
      if (user.doubleOrNothingStart) return c.json({ error: 'Already active' }, 400);
      const localDate = c.req.header('x-local-date');
      const { todayStr } = getTodayAndYesterday(localDate);
      updates.doubleOrNothingStart = todayStr;
    } else if (itemId === 'xp-surge') {
      updates.xpDoublerUntil = new Date(Date.now() + 30 * 60 * 1000);
    } else if (itemId === 'refill-energy') {
      updates.energy = 5;
      updates.lastEnergyUpdate = new Date();
    } else if (itemId === 'title-box') {
      const allTitles = ['byte-master', 'algorithm-architect', 'coddy-innovator', 'code-oracle', 'quantum-coder'];
      let userTitles = [];
      try { userTitles = JSON.parse(user.titles); } catch (e) { }
      const available = allTitles.filter(t => !userTitles.includes(t));
      if (available.length === 0) return c.json({ error: 'You own all titles!' }, 400);
      const randomTitle = available[Math.floor(Math.random() * available.length)];
      userTitles.push(randomTitle);
      updates.titles = JSON.stringify(userTitles);
      await db.update(users).set(updates).where(eq(users.id, user.id));
      return c.json({ success: true, title: randomTitle });
    } else {
      let userTitles = [];
      try { userTitles = JSON.parse(user.titles); } catch (e) { }
      if (userTitles.includes(itemId)) return c.json({ error: 'Title already owned' }, 400);
      userTitles.push(itemId);
      updates.titles = JSON.stringify(userTitles);
    }

    await db.update(users).set(updates).where(eq(users.id, user.id));
    return c.json({ success: true });
  } catch (error) {
    console.error('Store buy error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/user/store/free-chest', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const [user] = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);
    if (!user) return c.json({ error: 'User not found' }, 404);

    if (user.freeChestLastOpened) {
      const lastOpened = new Date(user.freeChestLastOpened);
      if (Date.now() - lastOpened.getTime() < 24 * 60 * 60 * 1000) {
        return c.json({ error: 'Chest already opened today' }, 400);
      }
    }

    const rewardTokens = Math.floor(Math.random() * 6);
    const newTokens = user.tokens + rewardTokens;

    await db.update(users).set({
      tokens: newTokens,
      freeChestLastOpened: new Date()
    }).where(eq(users.id, user.id));

    if (rewardTokens > 0) {
      await db.insert(notifications).values({
        userId: user.id,
        title: "Free Chest",
        message: `You found ${rewardTokens} tokens in the chest!`,
        reward: `+${rewardTokens} Tokens`
      });
    }

    return c.json({ success: true, rewardTokens });
  } catch (error) {
    console.error('Free chest error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/user/set-title', async (c) => {
  try {
    const payload = c.get('jwtPayload') as any;
    const { titleId } = await c.req.json();
    const [user] = await db.select().from(users).where(eq(users.id, payload.id)).limit(1);
    if (!user) return c.json({ error: 'User not found' }, 404);

    let userTitles = [];
    try { userTitles = JSON.parse(user.titles); } catch (e) { }

    const freeTitles = ['bit-apprentice', 'code-crusader', 'loop-legend'];
    if (titleId && !userTitles.includes(titleId) && !freeTitles.includes(titleId)) {
      return c.json({ error: 'You do not own this title' }, 400);
    }

    await db.update(users).set({ activeTitle: titleId || null }).where(eq(users.id, user.id));
    return c.json({ success: true });
  } catch (error) {
    console.error('Set title error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

api.post('/ai/explain-challenge', async (c) => {
  try {
    const { code, challengeDescription, requiredOutput } = await c.req.json();
    
    const prompt = `You are an expert programming tutor. Explain this coding challenge and how to approach it.
    
Challenge Description:
${challengeDescription}

Starter Code:
\`\`\`
${code}
\`\`\`

Expected Output:
${requiredOutput}

Please provide a clear, encouraging, and helpful explanation of what the challenge asks for and the steps/logic needed to solve it. Do not write the full code solution for the user, but guide them on how to write it. Keep the explanation concise and formatted in Markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const explanation = response.text || 'Could not generate explanation.';
    return c.json({ explanation });
  } catch (error: any) {
    console.error('Explain challenge error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

api.post('/ai/explain-solution', async (c) => {
  try {
    const { solution, challengeDescription } = await c.req.json();
    
    const prompt = `You are an expert programming tutor. Explain this coding solution in a clear and educational way.
    
Challenge Description:
${challengeDescription}

Solution Code:
\`\`\`
${solution}
\`\`\`

Please explain step-by-step how this solution works, why it is correct, and any key concepts or programming patterns used in it. Keep the explanation concise and formatted in Markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const explanation = response.text || 'Could not generate explanation.';
    return c.json({ explanation });
  } catch (error: any) {
    console.error('Explain solution error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}...`);

serve({
  fetch: app.fetch,
  port
});
