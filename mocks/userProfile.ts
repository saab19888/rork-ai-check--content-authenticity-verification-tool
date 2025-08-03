import { UserProfile } from "@/types";

export const mockUserProfile: UserProfile = {
  id: "user123",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  subscription: {
    plan: "basic",
    expiresAt: "2025-09-03",
    checksRemaining: 42
  }
};