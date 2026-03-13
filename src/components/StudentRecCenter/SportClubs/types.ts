export type Category = "Martial Arts" | "Court" | "Field" | "Water" | "Dance" | "Strategy" | "Fitness" | "Other";

export type TryoutData =
  | { kind: "info"; schedule: string; location: string; cost: string; notes?: string }
  | { kind: "form"; notes?: string };

export type Club = {
  id: string;
  name: string;
  href: string;
  img: string;
  desc: string;
  category: Category;
  tags: string[];
  tryout: TryoutData;
};
