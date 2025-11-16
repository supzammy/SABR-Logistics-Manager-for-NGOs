import type { InventoryItem, ShelterNeed, AiMatch, DonationSuggestion } from '../types';

// The GoogleGenAI import and initialization have been commented out to disable the AI feature for debugging.
// import { GoogleGenAI, Type } from "@google/genai";
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateMatchingRecommendations = async (inventory: InventoryItem[], needs: ShelterNeed[]): Promise<AiMatch[]> => {
    console.log("AI feature enabled: Returning mock recommendations.");
    // This is now a mock implementation that returns sample data for demonstration.
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    const appleInventory = inventory.find(i => i.name === 'Apples');
    const beansInventory = inventory.find(i => i.name === 'Canned Beans');
    
    const shelterANeed = needs.find(n => n.shelterName === 'Anbu Illam' && n.itemName === 'Apples');
    const communityKitchenNeed = needs.find(n => n.shelterName === 'Akshaya Patra Kitchen');
    
    const recommendations: AiMatch[] = [];

    if (appleInventory && shelterANeed) {
        recommendations.push({
            inventoryId: appleInventory.id,
            needId: shelterANeed.id,
            quantity: Math.min(appleInventory.quantity, shelterANeed.quantityNeeded),
            reason: "High nutritional value and directly requested by Anbu Illam."
        });
    }

    if (beansInventory && communityKitchenNeed) {
        recommendations.push({
            inventoryId: beansInventory.id,
            needId: communityKitchenNeed.id,
            quantity: 50,
            reason: "Provides essential protein for community meals and meets their gluten-free requirement."
        });
    }

    return Promise.resolve(recommendations);
};

export const generateDonationSuggestions = async (needs: ShelterNeed[]): Promise<DonationSuggestion[]> => {
    console.log("AI feature enabled: Returning mock donation suggestions.");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    return Promise.resolve([
        { itemName: 'Rice', reason: 'A versatile staple that is in high demand at community kitchens.' },
        { itemName: 'Cooking Oil', reason: 'Essential for preparing a wide variety of meals for large groups.' },
        { itemName: 'Lentils (Dal)', reason: 'A great source of protein, highly requested by multiple shelters.' }
    ]);
};