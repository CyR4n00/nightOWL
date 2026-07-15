import { describe, it, expect, beforeEach } from 'vitest';
import { RevenueCatService } from './RevenueCatService';

describe('RevenueCatService', () => {
    let service: RevenueCatService;

    beforeEach(() => {
        service = new RevenueCatService();
    });

    it('should throw an error when getOfferings is called without initialization', async () => {
        await expect(service.getOfferings()).rejects.toThrow('RevenueCat not initialized');
    });

    it('should initialize and return offerings', async () => {
        await service.initialize('test-api-key');

        const offerings = await service.getOfferings();

        expect(offerings).toBeDefined();
        expect(offerings).toHaveLength(1);
        expect(offerings[0]).toEqual({
            id: 'premium_monthly',
            title: 'NightOwl Premium (Monthly)',
            price: '¥500'
        });
    });

    it('should return true for purchasePackage mock', async () => {
        const result = await service.purchasePackage('premium_monthly');
        expect(result).toBe(true);
    });

    it('should return false for checkPremiumStatus mock', async () => {
        const result = await service.checkPremiumStatus();
        expect(result).toBe(false);
    });
});
