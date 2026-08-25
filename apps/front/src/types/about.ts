import { ElementType } from "react";

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface ValueCard {
  icon: ElementType;
  title: string;
  description: string;
}
