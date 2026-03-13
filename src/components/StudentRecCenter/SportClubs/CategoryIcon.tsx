import * as React from "react";
import { GiPunchingBag, GiSoccerBall, GiChessKing, GiTrophy, GiMusicalNotes } from "react-icons/gi";
import { MdSportsTennis, MdPool, MdFitnessCenter } from "react-icons/md";
import type { Category } from "./types";

const iconMap: Record<Category, React.ElementType> = {
  "Martial Arts": GiPunchingBag,
  Court:   MdSportsTennis,
  Field:   GiSoccerBall,
  Water:   MdPool,
  Dance:   GiMusicalNotes,
  Strategy:    GiChessKing,
  Fitness: MdFitnessCenter,
  Other:   GiTrophy,
};

export default function CategoryIcon({
  category,
  size = 14,
  style,
}: {
  category: Category;
  size?: number;
  style?: React.CSSProperties;
}) {
  const Icon = iconMap[category];
  return <Icon size={size} style={style} />;
}
