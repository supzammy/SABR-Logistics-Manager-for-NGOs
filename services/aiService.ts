import type { InventoryItem, ShelterNeed, AiMatch, DonationSuggestion } from '../types';

/**
 * Generates intelligent, data-driven matching recommendations based on inventory and needs.
 * This mock service applies logical rules to prioritize matches.
 */
export const generateMatchingRecommendations = async (inventory: InventoryItem[], needs: ShelterNeed[]): Promise<AiMatch[]> => {
    console.log("AI feature enabled: Returning dynamic mock recommendations.");
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay

    const recommendations: AiMatch[] = [];
    const inventoryMap = new Map(inventory.map(i => [i.id, i]));

    // Rule 1: Prioritize high-priority needs with direct matches
    const highPriorityNeeds = needs.filter(n => n.priority === 'High');
    for (const need of highPriorityNeeds) {
        const availableItems = inventory.filter(item => item.name === need.itemName && item.quantity > 0);
        if (availableItems.length > 0) {
            const bestItem = availableItems.sort((a, b) => a.quantity - b.quantity)[0]; // Use the smallest available batch
            recommendations.push({
                inventoryId: bestItem.id,
                needId: need.id,
                quantity: Math.min(bestItem.quantity, need.quantityNeeded),
                reason: `Fulfills a high-priority request from ${need.shelterName}.`
            });
        }
    }

    // Rule 2: Prevent waste by matching items expiring soon
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringItems = inventory.filter(item => 
        new Date(item.expiryDate) < sevenDaysFromNow && 
        item.quantity > 0 &&
        !recommendations.some(r => r.inventoryId === item.id) // Avoid re-recommending
    );

    for (const item of expiringItems) {
        // Find a need that can take this item (direct match or 'Anything')
        const suitableNeed = needs.find(n => (n.itemName === item.name || n.itemName === 'Anything') && !recommendations.some(r => r.needId === n.id));
        if (suitableNeed) {
            recommendations.push({
                inventoryId: item.id,
                needId: suitableNeed.id,
                quantity: Math.min(item.quantity, suitableNeed.quantityNeeded),
                reason: `Prevents waste by using ${item.name} which expires on ${new Date(item.expiryDate).toLocaleDateString()}.`
            });
        }
    }

    // Rule 3: Fulfill general ('Anything') needs with abundant stock
    if (recommendations.length < 3) {
        const anythingNeeds = needs.filter(n => n.itemName === 'Anything' && !recommendations.some(r => r.needId === n.id));
        const abundantItems = inventory.filter(i => i.quantity > 200 && !recommendations.some(r => r.inventoryId === i.id));

        if (anythingNeeds.length > 0 && abundantItems.length > 0) {
            recommendations.push({
                inventoryId: abundantItems[0].id,
                needId: anythingNeeds[0].id,
                quantity: Math.min(abundantItems[0].quantity, anythingNeeds[0].quantityNeeded, 100), // Cap at 100 units
                reason: `${abundantItems[0].name} is available in high quantity and can fulfill the general need of ${anythingNeeds[0].shelterName}.`
            });
        }
    }
    
    // Return a unique set of recommendations, capped at 3
    const uniqueRecs = Array.from(new Map(recommendations.map(r => [`${r.inventoryId}-${r.needId}`, r])).values());
    return Promise.resolve(uniqueRecs.slice(0, 3));
};

/**
 * Generates dynamic donation suggestions based on the most frequent and highest-priority needs.
 */
export const generateDonationSuggestions = async (needs: ShelterNeed[]): Promise<DonationSuggestion[]> => {
    console.log("AI feature enabled: Returning dynamic mock donation suggestions.");
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    if (!needs || needs.length === 0) {
        return Promise.resolve([]);
    }

    const itemDemand = new Map<string, { count: number; isHighPriority: boolean }>();

    for (const need of needs) {
        if (need.itemName === 'Anything') continue;

        const demand = itemDemand.get(need.itemName) || { count: 0, isHighPriority: false };
        demand.count++;
        if (need.priority === 'High') {
            demand.isHighPriority = true;
        }
        itemDemand.set(need.itemName, demand);
    }

    const sortedDemand = Array.from(itemDemand.entries()).sort(([, a], [, b]) => {
        if (a.isHighPriority !== b.isHighPriority) return a.isHighPriority ? -1 : 1;
        return b.count - a.count;
    });

    const suggestions = sortedDemand.slice(0, 3).map(([itemName, demand]) => {
        let reason = `Requested by ${demand.count} partner${demand.count > 1 ? 's' : ''}.`;
        if (demand.isHighPriority) {
            reason = `A high-priority item requested by ${demand.count} partner${demand.count > 1 ? 's' : ''}.`;
        }
        return { itemName, reason };
    });

    // Add a default suggestion if none are generated
    if (suggestions.length === 0) {
        return Promise.resolve([
            { itemName: 'Rice', reason: 'A versatile staple that is always in high demand at community kitchens.' },
            { itemName: 'Cooking Oil', reason: 'Essential for preparing a wide variety of meals for large groups.' },
        ]);
    }

    return Promise.resolve(suggestions);
};
