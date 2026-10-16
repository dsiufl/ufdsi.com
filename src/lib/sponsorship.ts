// Sponsorship packages, shared by the sponsors page and the symposium page.

export const SPONSOR_EMAIL = "dsiufl@gmail.com";

export const tiers = [
  { name: "Silver", price: "$500" },
  { name: "Gold", price: "$1,000" },
  { name: "Diamond", price: "$2,000" },
] as const;

// `from` is the lowest tier that includes the benefit (0 Silver, 1 Gold, 2 Diamond).
export const benefits: { text: string; from: 0 | 1 | 2 }[] = [
  { text: "Logo on ufdsi.com", from: 0 },
  { text: "Instagram sponsor shoutout", from: 0 },
  { text: "Event promotion on LinkedIn, Instagram and Discord", from: 0 },
  { text: "Your opportunities in our newsletter (300+ subscribers)", from: 0 },
  { text: "Guest lecture, promoted and organized by DSI", from: 1 },
  { text: "Promotion and an optional speaking slot at the DSI symposium", from: 1 },
  { text: "Access to the DSI resume bank", from: 1 },
  { text: "Logo on DSI T-shirts and merchandise", from: 2 },
  { text: "Co-hosted sponsored workshops, such as the NVIDIA Deep Learning series", from: 2 },
  { text: "Logo on all DSI event signage", from: 2 },
];
