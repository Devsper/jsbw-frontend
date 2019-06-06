//import { Card } from "./card";

// Model/Interface for deck 
export interface Deck {
    // Questionmark after variable makes it optional
    _id?: string;
    name: string;
    isPublic: boolean;
    created?: Date;
    cards?: {}[];
    createdBy: string;
}