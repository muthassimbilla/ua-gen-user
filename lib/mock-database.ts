// Mock database implementation for when Supabase is not available
export interface MockUser {
  id: string
  email: string
  status: "pending" | "approved" | "rejected" | "suspended"
  created_at: string
  access_key?: string
  user_name?: string
  is_active?: boolean
  last_login?: string
  full_name?: string
  role?: "user" | "admin" | "super_admin"
  user_agent_limit?: number
}

export interface MockGeneration {
  id: string
  access_key: string
  user_name: string
  generated_data: any
  platform: string
  created_at: string
}

export interface MockUserAgent {
  id: string
  user_agent: string
  hash: string
  reason: string
  created_at: string
}

class MockDatabase {
  private users: MockUser[] = []
  private generations: MockGeneration[] = []
  private blacklistedUserAgents: MockUserAgent[] = []
  private deviceModels: any[] = []
  private iosVersions: any[] = []
  private appVersions: any[] = []

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    // Initialize with sample data
    this.users = [
      {
        id: "1",
        email: "admin@example.com",
        status: "approved",
        created_at: new Date().toISOString(),
        access_key: "demo-key-123",
        user_name: "Admin User",
        full_name: "Admin User",
        is_active: true,
        role: "admin",
        user_agent_limit: 100,
      },
      {
        id: "2",
        email: "pending@example.com",
        status: "pending",
        created_at: new Date().toISOString(),
        access_key: "pending-key-456",
        user_name: "Pending User",
        full_name: "Pending User",
        is_active: true,
        role: "user",
        user_agent_limit: 10,
      },
    ]

    this.deviceModels = [
      { id: "1", model_name: "iPhone 14 Pro", created_date: new Date().toISOString() },
      { id: "2", model_name: "iPhone 14", created_date: new Date().toISOString() },
      { id: "3", model_name: "iPhone 13 Pro Max", created_date: new Date().toISOString() },
      { id: "4", model_name: "iPhone 13", created_date: new Date().toISOString() },
      { id: "5", model_name: "iPhone 12 Pro", created_date: new Date().toISOString() },
    ]

    this.iosVersions = [
      { id: "1", version: "16.6", webkit_version: "605.1.15", build_number: "20G75" },
      { id: "2", version: "16.5", webkit_version: "605.1.15", build_number: "20F66" },
      { id: "3", version: "16.4", webkit_version: "605.1.15", build_number: "20E247" },
    ]

    this.appVersions = [
      { id: "1", version: "430.0", build_number: "123456789", fbrv: "800000000" },
      { id: "2", version: "429.0", build_number: "123456788", fbrv: "799000000" },
      { id: "3", version: "428.0", build_number: "123456787", fbrv: "798000000" },
    ]
  }

  // User operations
  async findUserByEmail(email: string): Promise<MockUser | null> {
    return this.users.find((user) => user.email === email) || null
  }

  async findUserByAccessKey(accessKey: string): Promise<MockUser | null> {
    return this.users.find((user) => user.access_key === accessKey && user.is_active) || null
  }

  async createUser(userData: Partial<MockUser>): Promise<MockUser> {
    const newUser: MockUser = {
      id: Date.now().toString(),
      email: userData.email || "",
      status: userData.status || "pending",
      created_at: new Date().toISOString(),
      access_key: userData.access_key,
      user_name: userData.user_name,
      full_name: userData.full_name,
      is_active: userData.is_active || true,
      role: userData.role || "user",
      user_agent_limit: userData.user_agent_limit || 10,
    }
    this.users.push(newUser)
    return newUser
  }

  async updateUser(id: string, updates: Partial<MockUser>): Promise<MockUser | null> {
    const userIndex = this.users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null

    this.users[userIndex] = { ...this.users[userIndex], ...updates }
    return this.users[userIndex]
  }

  async getUsers(limit = 100): Promise<MockUser[]> {
    return this.users.slice(0, limit)
  }

  async approveUser(userId: string): Promise<MockUser | null> {
    return this.updateUser(userId, {
      status: "approved",
      // Add approved_at timestamp if needed
    })
  }

  async rejectUser(userId: string, reason?: string): Promise<MockUser | null> {
    return this.updateUser(userId, {
      status: "rejected",
      // Add rejection_reason if needed
    })
  }

  async suspendUser(userId: string): Promise<MockUser | null> {
    return this.updateUser(userId, {
      status: "suspended",
      // Add suspended_at timestamp if needed
    })
  }

  // Generation operations
  async createGeneration(generationData: Partial<MockGeneration>): Promise<MockGeneration> {
    const newGeneration: MockGeneration = {
      id: Date.now().toString(),
      access_key: generationData.access_key || "",
      user_name: generationData.user_name || "",
      generated_data: generationData.generated_data || {},
      platform: generationData.platform || "",
      created_at: new Date().toISOString(),
    }
    this.generations.push(newGeneration)
    return newGeneration
  }

  async getUserGenerations(accessKey: string, limit = 50): Promise<MockGeneration[]> {
    return this.generations
      .filter((gen) => gen.access_key === accessKey)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  }

  async getAllGenerations(limit = 100): Promise<MockGeneration[]> {
    return this.generations
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  }

  // Blacklist operations
  async addToBlacklist(userAgent: string, reason: string): Promise<MockUserAgent> {
    const hash = this.generateHash(userAgent)
    const existing = this.blacklistedUserAgents.find((ua) => ua.hash === hash)

    if (existing) {
      return existing
    }

    const newBlacklistEntry: MockUserAgent = {
      id: Date.now().toString(),
      user_agent: userAgent,
      hash,
      reason,
      created_at: new Date().toISOString(),
    }

    this.blacklistedUserAgents.push(newBlacklistEntry)
    return newBlacklistEntry
  }

  async getBlacklistedUserAgents(limit = 100): Promise<MockUserAgent[]> {
    return this.blacklistedUserAgents.slice(0, limit)
  }

  async removeFromBlacklist(id: string): Promise<boolean> {
    const index = this.blacklistedUserAgents.findIndex((ua) => ua.id === id)
    if (index === -1) return false

    this.blacklistedUserAgents.splice(index, 1)
    return true
  }

  // Device data operations
  async getDeviceModels(limit = 100): Promise<any[]> {
    return this.deviceModels.slice(0, limit)
  }

  async getIOSVersions(limit = 100): Promise<any[]> {
    return this.iosVersions.slice(0, limit)
  }

  async getAppVersions(limit = 100): Promise<any[]> {
    return this.appVersions.slice(0, limit)
  }

  // Utility methods
  private generateHash(userAgent: string): string {
    let hash = 0
    for (let i = 0; i < userAgent.length; i++) {
      const char = userAgent.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16)
  }

  // Statistics
  async getStats() {
    return {
      totalUsers: this.users.length,
      approvedUsers: this.users.filter((u) => u.status === "approved").length,
      pendingUsers: this.users.filter((u) => u.status === "pending").length,
      rejectedUsers: this.users.filter((u) => u.status === "rejected").length,
      suspendedUsers: this.users.filter((u) => u.status === "suspended").length,
      totalGenerations: this.generations.length,
      blacklistedUserAgents: this.blacklistedUserAgents.length,
      todayGenerations: this.generations.filter((g) => {
        const today = new Date()
        const genDate = new Date(g.created_at)
        return genDate.toDateString() === today.toDateString()
      }).length,
    }
  }
}

// Singleton instance
export const mockDB = new MockDatabase()

// Helper functions to use mock database when Supabase is not available
export const getMockDatabase = () => {
  return {
    // User operations
    findUserByEmail: (email: string) => mockDB.findUserByEmail(email),
    findUserByAccessKey: (accessKey: string) => mockDB.findUserByAccessKey(accessKey),
    createUser: (userData: Partial<MockUser>) => mockDB.createUser(userData),
    updateUser: (id: string, updates: Partial<MockUser>) => mockDB.updateUser(id, updates),
    getUsers: (limit?: number) => mockDB.getUsers(limit),

    approveUser: (userId: string) => mockDB.approveUser(userId),
    rejectUser: (userId: string, reason?: string) => mockDB.rejectUser(userId, reason),
    suspendUser: (userId: string) => mockDB.suspendUser(userId),

    // Generation operations
    createGeneration: (data: Partial<MockGeneration>) => mockDB.createGeneration(data),
    getUserGenerations: (accessKey: string, limit?: number) => mockDB.getUserGenerations(accessKey, limit),
    getAllGenerations: (limit?: number) => mockDB.getAllGenerations(limit),

    // Blacklist operations
    addToBlacklist: (userAgent: string, reason: string) => mockDB.addToBlacklist(userAgent, reason),
    getBlacklistedUserAgents: (limit?: number) => mockDB.getBlacklistedUserAgents(limit),
    removeFromBlacklist: (id: string) => mockDB.removeFromBlacklist(id),

    // Device data
    getDeviceModels: (limit?: number) => mockDB.getDeviceModels(limit),
    getIOSVersions: (limit?: number) => mockDB.getIOSVersions(limit),
    getAppVersions: (limit?: number) => mockDB.getAppVersions(limit),

    // Statistics
    getStats: () => mockDB.getStats(),
  }
}
