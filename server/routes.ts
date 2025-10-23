import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabaseStorage } from "./supabase-storage";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Admin routes - temporarily disabled during migration

  // Initialize admin user and referral commissions if they don't exist
  const initializeAdmin = async () => {
    try {
      const existingAdmin = await supabaseStorage.getAdminByUsername("Faham112");
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("Faham@112", 10);
        await supabaseStorage.createAdmin({
          username: "Faham112",
          password: hashedPassword,
          email: "admin@moneypro.com",
          isActive: true,
        });
        console.log("Admin user created successfully");
      }
    } catch (error) {
      console.error("Error initializing admin:", error);
    }
  };

  const initializeReferralCommissions = async () => {
    try {
      const existingCommissions = await supabaseStorage.getReferralCommissions();
      if (existingCommissions.length === 0) {
        // Level 1 (Direct referral) - 5% commission
        await supabaseStorage.createReferralCommission({
          level: 1,
          commission_percentage: "5.00",
          bonus_percentage: "1.00",
          is_active: true,
        });

        // Level 2 (Second level referral) - 2% commission
        await supabaseStorage.createReferralCommission({
          level: 2,
          commissionPercentage: "2.00",
          bonusPercentage: "0.50",
          isActive: true,
        });

        console.log("Default referral commissions created successfully");
      }
    } catch (error) {
      console.error("Error initializing referral commissions:", error);
    }
  };

  await initializeAdmin();
  await initializeReferralCommissions();

  // Admin Authentication Routes
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin || !admin.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last login
      await storage.updateAdminLogin(admin.id);

      // Store admin session
      (req.session as any).adminId = admin.id;
      (req.session as any).adminUsername = admin.username;

      res.json({ 
        id: admin.id, 
        username: admin.username, 
        email: admin.email,
        message: "Login successful" 
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get('/api/admin/me', isAdminAuthenticated, async (req: any, res) => {
    try {
      const admin = await storage.getAdminByUsername(req.session.adminUsername);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.json({ 
        id: admin.id, 
        username: admin.username, 
        email: admin.email 
      });
    } catch (error) {
      console.error("Error fetching admin:", error);
      res.status(500).json({ message: "Failed to fetch admin details" });
    }
  });

  // Supabase Auth routes
  app.get('/api/auth/user', async (req, res) => {
    try {
      // Check if Authorization header exists (Supabase token)
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        // Handle Supabase authentication
        const token = authHeader.split(' ')[1];
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.VITE_SUPABASE_URL || 'https://nhuawcuzhathicibdgny.supabase.co',
          process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odWF3Y3V6aGF0aGljaWJkZ255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5NTQzNjIsImV4cCI6MjA1NTUzMDM2Mn0.cBQm67kD0lbHRL6uXQAinz6MUTHGdAM65_jd5mEveTA'
        );
        
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
          return res.status(401).json({ message: "Invalid Supabase token" });
        }
        
        // Get or create user in our database
        let dbUser = await storage.getUser(user.id);
        if (!dbUser) {
          // Create new user from Supabase data
          const userData = {
            id: user.id,
            email: user.email || '',
            firstName: user.user_metadata?.first_name || '',
            lastName: user.user_metadata?.last_name || '',
            balance: 0,
            referralCode: Math.random().toString(36).substring(2, 15),
            totalInvested: 0,
            totalEarned: 0,
            isActive: true
          };
          dbUser = await storage.createUser(userData);
        }
        
        // Update user activity
        await storage.updateUserActivity(user.id);
        
        return res.json(dbUser);
      } else {
        return res.status(401).json({ message: "Authentication required" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Investment Plans
  app.get('/api/investment-plans', async (req, res) => {
    try {
      const plans = await storage.getInvestmentPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching investment plans:", error);
      res.status(500).json({ message: "Failed to fetch investment plans" });
    }
  });

  app.post('/api/investment-plans', isSupabaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const planData = insertInvestmentPlanSchema.parse(req.body);
      const plan = await storage.createInvestmentPlan(planData);
      res.json(plan);
    } catch (error) {
      console.error("Error creating investment plan:", error);
      res.status(500).json({ message: "Failed to create investment plan" });
    }
  });

  // User Investments
  app.get('/api/investments', isSupabaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const investments = await storage.getUserInvestments(userId);
      res.json(investments);
    } catch (error) {
      console.error("Error fetching investments:", error);
      res.status(500).json({ message: "Failed to fetch investments" });
    }
  });

  app.post('/api/investments', isSupabaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const investmentData = insertInvestmentSchema.parse({
        ...req.body,
        userId,
        currentValue: req.body.amount,
        maturityDate: new Date(Date.now() + (req.body.duration || 30) * 24 * 60 * 60 * 1000),
      });

      const investment = await storage.createInvestment(investmentData);
      
      // Create corresponding transaction
      await storage.createTransaction({
        userId,
        type: "deposit",
        amount: req.body.amount,
        status: "completed",
        description: "Investment deposit",
        referenceId: investment.id.toString(),
      });

      // Process referral bonus if user was referred
      const user = await storage.getUser(userId);
      if (user?.referredBy) {
        await storage.processReferralBonus(userId, user.referredBy, req.body.amount);
      }

      res.json(investment);
    } catch (error) {
      console.error("Error creating investment:", error);
      res.status(500).json({ message: "Failed to create investment" });
    }
  });

  // Transactions
  app.get('/api/transactions', isSupabaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactions = await storage.getUserTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get('/api/all-transactions', isSupabaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post('/api/transactions', isSupabaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const transactionData = insertTransactionSchema.parse({
        ...req.body,
        userId,
      });

      const transaction = await storage.createTransaction(transactionData);
      res.json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Platform Statistics
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      res.status(500).json({ message: "Failed to fetch platform stats" });
    }
  });

  // Admin Routes
  app.get('/api/admin/users', isAdminAuthenticated, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/online-users', isAdminAuthenticated, async (req: any, res) => {
    try {
      const onlineUsers = await storage.getOnlineUsers();
      res.json(onlineUsers);
    } catch (error) {
      console.error("Error fetching online users:", error);
      res.status(500).json({ message: "Failed to fetch online users" });
    }
  });

  app.get('/api/admin/stats', isAdminAuthenticated, async (req: any, res) => {
    try {
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.put('/api/admin/users/:userId/balance', isAdminAuthenticated, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const { balance } = req.body;

      const updatedUser = await storage.updateUserBalance(userId, balance);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user balance:", error);
      res.status(500).json({ message: "Failed to update user balance" });
    }
  });

  app.get('/api/admin/all-transactions', isAdminAuthenticated, async (req: any, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Referral System Routes
  app.get('/api/referrals', isSupabaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const referrals = await storage.getUserReferrals(userId);
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  app.get('/api/referral-bonuses', isSupabaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bonuses = await storage.getUserReferralBonuses(userId);
      res.json(bonuses);
    } catch (error) {
      console.error("Error fetching referral bonuses:", error);
      res.status(500).json({ message: "Failed to fetch referral bonuses" });
    }
  });

  app.get('/api/referral-link', isSupabaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get base URL from request headers
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const host = req.headers.host || 'localhost:5000';
      const baseUrl = `${protocol}://${host}`;
      const referralLink = `${baseUrl}?ref=${user.referralCode}`;
      
      res.json({ 
        referralCode: user.referralCode,
        referralLink,
        totalReferrals: (await storage.getUserReferrals(userId)).length
      });
    } catch (error) {
      console.error("Error generating referral link:", error);
      res.status(500).json({ message: "Failed to generate referral link" });
    }
  });

  app.post('/api/join-with-referral', async (req, res) => {
    try {
      const { referralCode, userEmail } = req.body;
      
      if (!referralCode) {
        return res.status(400).json({ message: "Referral code is required" });
      }

      const referrer = await storage.getUserByReferralCode(referralCode);
      if (!referrer) {
        return res.status(404).json({ message: "Invalid referral code" });
      }

      // This endpoint would be called during user registration
      // The actual user creation happens in the auth callback
      res.json({ 
        message: "Valid referral code",
        referrerId: referrer.id,
        referrerName: `${referrer.firstName || ''} ${referrer.lastName || ''}`.trim()
      });
    } catch (error) {
      console.error("Error processing referral join:", error);
      res.status(500).json({ message: "Failed to process referral" });
    }
  });

  // Admin: Referral Commission Management
  app.get('/api/admin/referral-commissions', isAdminAuthenticated, async (req: any, res) => {
    try {
      const commissions = await storage.getReferralCommissions();
      res.json(commissions);
    } catch (error) {
      console.error("Error fetching referral commissions:", error);
      res.status(500).json({ message: "Failed to fetch referral commissions" });
    }
  });

  app.post('/api/admin/referral-commissions', isAdminAuthenticated, async (req: any, res) => {
    try {
      const commissionData = req.body;
      const commission = await storage.createReferralCommission(commissionData);
      res.json(commission);
    } catch (error) {
      console.error("Error creating referral commission:", error);
      res.status(500).json({ message: "Failed to create referral commission" });
    }
  });

  // Profit Calculator
  app.post('/api/calculate-profit', async (req, res) => {
    try {
      const { planId, amount } = req.body;
      const plan = await storage.getInvestmentPlan(planId);
      
      if (!plan) {
        return res.status(404).json({ message: "Investment plan not found" });
      }

      const principal = parseFloat(amount);
      const rate = parseFloat(plan.interestRate.toString()) / 100;
      const duration = plan.duration;

      const totalReturn = principal * (1 + rate);
      const netProfit = totalReturn - principal;
      const dailyProfits = netProfit / duration;
      const totalPercent = rate * 100;

      res.json({
        totalPercent: totalPercent.toFixed(2),
        dailyProfits: dailyProfits.toFixed(2),
        netProfit: netProfit.toFixed(2),
        totalReturn: totalReturn.toFixed(2),
      });
    } catch (error) {
      console.error("Error calculating profit:", error);
      res.status(500).json({ message: "Failed to calculate profit" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
