import { User } from "./user";

export interface Comment {
    id: number;
    content: string;
    author: User;
    created_at: string;
    updated_at: string;
}

export interface Rating {
    id: number;
    rating: number;
    author: User;
    created_at: string;
}