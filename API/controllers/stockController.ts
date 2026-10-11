import type { Request, Response } from 'express';
import prisma from '../db';

export const saveStock = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.id;
  const stockSymbol = (req.body as Record<string, unknown> | undefined)?.symbol;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (typeof stockSymbol !== 'string' || !stockSymbol) {
    return res.status(409).json('Stock is undefined or null');
  }

  try {
    await prisma.watchlist.upsert({
      where: { userId_stockSymbol: { userId, stockSymbol } },
      update: {},
      create: { userId, stockSymbol },
    });
    return res.status(200).json({ message: `Stock: ${stockSymbol} for user: ${userId} saved successfully` });
  } catch (err) {
    console.error(err);
    // Log server-side only — err.message can leak internals (constraint
    // names, driver details) that are none of the caller's business.
    return res.status(500).json({ message: 'An error occurred.' });
  }
};

export const removeStock = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.id;
  const stockSymbol = (req.body as Record<string, unknown> | undefined)?.symbol;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (typeof stockSymbol !== 'string' || !stockSymbol) {
    return res.status(409).json('Stock is undefined or null');
  }

  try {
    await prisma.watchlist.deleteMany({ where: { userId, stockSymbol } });
    return res.status(200).json({ message: `Stock: ${stockSymbol} for user: ${userId} removed successfully` });
  } catch (err) {
    console.error(err);
    // Log server-side only — err.message can leak internals (constraint
    // names, driver details) that are none of the caller's business.
    return res.status(500).json({ message: 'An error occurred.' });
  }
};

export const getStocks = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const stocks = await prisma.watchlist.findMany({
      where: { userId },
      select: { id: true, stockSymbol: true },
    });
    return res.status(200).json(stocks);
  } catch (err) {
    console.error('Error finding stocks:', err);
    // Log server-side only — err.message can leak internals (constraint
    // names, driver details) that are none of the caller's business.
    return res.status(500).json({ message: 'An error occurred.' });
  }
};
