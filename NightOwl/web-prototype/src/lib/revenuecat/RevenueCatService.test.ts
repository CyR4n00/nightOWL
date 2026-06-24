import { describe, it, expect, beforeEach } from 'vitest';
import { RevenueCatService } from './RevenueCatService';

describe('RevenueCatService', () => {
    let service: RevenueCatService;

    beforeEach(() => {
        service = new RevenueCatService();
    });

    describe('getOfferings', () => {
        it('throws an error if getOfferings is called before initialization', async () => {
            await expect(service.getOfferings()).rejects.toThrow('RevenueCat not initialized');
        });

        it('returns offerings after successful initialization', async () => {
            await service.initialize('test-api-key');
            const offerings = await service.getOfferings();
            expect(offerings).toBeDefined();
            expect(offerings.length).toBeGreaterThan(0);
            expect(offerings[0].id).toBe('premium_monthly');
        });
    });

    describe('purchasePackage', () => {
        it('returns true on mock purchase', async () => {
            const result = await service.purchasePackage('test-package');
            expect(result).toBe(true);
        });
    });

    describe('checkPremiumStatus', () => {
        it('returns false by default', async () => {
            const status = await service.checkPremiumStatus();
            expect(status).toBe(false);
        });
    });
});
