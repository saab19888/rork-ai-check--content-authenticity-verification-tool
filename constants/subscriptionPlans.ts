import { SubscriptionPlan } from "@/types";

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free-trial",
    name: "Free Trial",
    price: 0,
    yearlyPrice: null,
    features: [
      "7-day access",
      "5 document checks",
      "Basic report format",
      "Text input only"
    ],
    checksPerMonth: 5
  },
  {
    id: "basic",
    name: "Basic Plan",
    price: 14.99,
    yearlyPrice: 149.99,
    features: [
      "50 document checks/month",
      "Detailed reports",
      "Text & file support",
      "Download reports"
    ],
    checksPerMonth: 50,
    isFeatured: true
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 29.99,
    yearlyPrice: 299.99,
    features: [
      "200 checks/month",
      "Priority processing",
      "Advanced analytics",
      "Highlighted suspicious sections"
    ],
    checksPerMonth: 200
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: 0,
    yearlyPrice: null,
    features: [
      "Unlimited checks",
      "API access",
      "Team dashboard",
      "Dedicated support"
    ],
    checksPerMonth: -1
  }
];