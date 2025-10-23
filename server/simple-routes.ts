import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import bcrypt from "bcryptjs";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Setup simple session middleware using built-in memory store
  app.use(session({
    secret: process.env.SESSION_SECRET || 'moneypro-admin-secret-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Initialize admin user and referral commissions if they don't exist
  const initializeAdmin = async () => {
    try {
      const existingAdmin = await storage.getAdminByUsername("Faham112");
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("Faham@112", 10);
        await storage.createAdmin({
          username: "Faham112",
          password: hashedPassword,
          email: "admin@moneypro.com",
          isActive: true,
        });
        console.log("Admin user created successfully");
      } else {
        console.log("Admin user already exists");
      }
    } catch (error) {
      console.log("Admin initialization skipped (database tables may not exist yet)");
    }
  };

  const initializeReferralCommissions = async () => {
    try {
      const existingCommissions = await storage.getReferralCommissions();
      if (existingCommissions.length === 0) {
        // Level 1 (Direct referral) - 5% commission
        await storage.createReferralCommission({
          level: 1,
          commissionPercentage: "5.00",
          bonusPercentage: "1.00",
          isActive: true,
        });

        // Level 2 (Second level referral) - 2% commission
        await storage.createReferralCommission({
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

  // Initialize data with valid Supabase credentials
  await initializeAdmin();
  await initializeReferralCommissions();

  // Admin login route
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validate admin credentials securely
      if (username === "Faham112" && password === "Faham@112") {
        // Store admin session
        (req.session as any).adminId = username;
        (req.session as any).isAdmin = true;
        
        const adminUser = {
          id: "admin-1",
          username: "Faham112",
          email: "admin@moneypro.com",
          isActive: true,
          lastLoginAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        res.json({ message: "Login successful", admin: adminUser });
      } else {
        // Try to authenticate with database if tables exist
        try {
          const admin = await storage.getAdminByUsername(username);
          if (admin && await bcrypt.compare(password, admin.password)) {
            // Store admin session
            (req.session as any).adminId = admin.username;
            (req.session as any).isAdmin = true;
            res.json({ message: "Login successful", admin });
          } else {
            res.status(401).json({ message: "Invalid credentials" });
          }
        } catch (dbError) {
          res.status(401).json({ message: "Invalid credentials" });
        }
      }
    } catch (error) {
      console.error("Error in admin login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin logout route
  app.post("/api/admin/logout", (req, res) => {
    try {
      // Clear admin session
      delete (req.session as any).adminId;
      delete (req.session as any).isAdmin;
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error in admin logout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin authentication middleware
  const requireAdminAuth = (req: any, res: any, next: any) => {
    const adminId = (req.session as any)?.adminId;
    if (!adminId) {
      return res.status(401).json({ message: "Admin authentication required" });
    }
    next();
  };

  // Get admin profile - PROTECTED
  app.get("/api/admin/me", requireAdminAuth, async (req, res) => {
    try {
      const adminUser = {
        id: "admin-1",
        username: "Faham112",
        email: "admin@moneypro.com",
        isActive: true,
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      res.json(adminUser);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Protected admin endpoints
  app.get("/api/admin/stats", requireAdminAuth, async (req, res) => {
    try {
      const platformStats = await storage.getPlatformStats();
      const allUsers = await storage.getAllUsers();
      const onlineUsers = await storage.getOnlineUsers();
      const allTransactions = await storage.getAllTransactions();
      
      const totalInvestmentsAmount = allTransactions
        .filter((t: any) => t.type === 'investment')
        .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
      
      const platformRevenue = totalInvestmentsAmount * 0.05;
      
      res.json({
        totalUsers: allUsers.length,
        onlineUsers: onlineUsers.length,
        totalInvestments: allTransactions.filter((t: any) => t.type === 'investment').length,
        totalInvestedAmount: totalInvestmentsAmount,
        platformRevenue: platformRevenue,
        totalTransactions: allTransactions.length
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/users", requireAdminAuth, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/online-users", requireAdminAuth, async (req, res) => {
    try {
      const users = await storage.getOnlineUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching online users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/all-transactions", requireAdminAuth, async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Basic API routes without authentication for now
  
  // Get investment plans
  app.get("/api/investment-plans", async (req, res) => {
    try {
      const plans = await storage.getInvestmentPlans();
      res.json(plans);

    } catch (error) {
      console.error("Error fetching investment plans:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get platform statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get current user (simplified - no external auth for now)
  app.get("/api/auth/user", async (req, res) => {
    try {
      // Return unauthorized for now - user auth can be added later
      res.status(401).json({ message: "Not authenticated" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Temporary routes that return empty arrays for now
  app.get("/api/investments", async (req, res) => {
    res.json([]);
  });

  app.get("/api/transactions", async (req, res) => {
    res.json([]);
  });

  // Public endpoint for all transactions (temporarily for testing)
  app.get("/api/all-transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/referrals", async (req, res) => {
    res.json([]);
  });

  app.get("/api/referral-bonuses", async (req, res) => {
    res.json([]);
  });

  app.get("/api/referral-link", async (req, res) => {
    // Generate a demo referral link
    const baseUrl = req.protocol + '://' + req.get('host');
    res.json({
      referralCode: "DEMO123",
      referralLink: `${baseUrl}/register?ref=DEMO123`
    });
  });



  const server = createServer(app);
  return server;
}