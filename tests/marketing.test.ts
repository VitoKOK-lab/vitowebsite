import { describe, expect, it } from 'vitest';
import { buildBrief, estimateCapacity, servicePlans, type ServiceKey } from '../lib/marketing';
describe('visitor capacity estimate', () => {
  it('estimates four weeks of recoverable capacity without presenting project ROI', () => {
    expect(estimateCapacity(20, 300, 50)).toEqual({ savedHours: 40, capacityValue: 12000, remainingHours: 40 });
  });
  it('supports fractional capacity and full or zero automation', () => {
    expect(estimateCapacity(1, 300, 30)).toEqual({ savedHours: 1.2, capacityValue: 360, remainingHours: 2.8 });
    expect(estimateCapacity(20, 300, 0).savedHours).toBe(0);
    expect(estimateCapacity(20, 300, 100).remainingHours).toBe(0);
  });
  it('bounds invalid values to finite, nonnegative estimates', () => {
    expect(estimateCapacity(-20, Infinity, NaN)).toEqual({ savedHours: 0, capacityValue: 0, remainingHours: 0 });
    expect(estimateCapacity(20, -100, 120)).toEqual({ savedHours: 80, capacityValue: 0, remainingHours: 0 });
  });
});
describe('contact brief', () => {
  it('keeps each service matched to its actual first delivery', () => {
    for (const key of Object.keys(servicePlans) as ServiceKey[]) {
      const brief = buildBrief('品牌／電商', key, '每週三則貼文');
      expect(brief).toContain(servicePlans[key].label);
      expect(brief).toContain(servicePlans[key].first);
      expect(brief).toContain('產業：品牌／電商');
      expect(brief).toContain('每週三則貼文');
    }
  });
  it('does not require a free-text entry or erase user punctuation', () => {
    expect(buildBrief('其他產業', 'video', '  ')).toContain('希望先聊聊適合的做法');
    expect(buildBrief('其他產業', 'video', 'A&B\n中文？')).toContain('A&B\n中文？');
  });
});
