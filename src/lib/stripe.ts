import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock_secret_key";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-09-30.acacia" as any,
  appInfo: {
    name: "SocialPulse SaaS",
    version: "1.0.0",
  },
});

export const formatCurrency = (amount: number) => {
  return `$${amount}`;
};
