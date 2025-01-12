import { describe, expect, test } from '@jest/globals';
import { analyze } from '../../src/app/utils';
import { getIngredientMap } from '../helpers';
import { recipes } from '../test-data';

describe('analysis', () => {
  // The Vanilla recipe exercises the basic components.
  test('vanilla', () => {
    const recipe = recipes.vanilla;
    const recipeIngredients = recipe.ingredients;
    const usedIngredients = getIngredientMap(recipe);
    const analysis = analyze(recipeIngredients, usedIngredients);

    expect(analysis.totalFat).toBeCloseTo(139.68, 5);
    expect(analysis.milkFat).toBeCloseTo(139.68, 5);
    expect(analysis.totalSolids).toBeCloseTo(383.136, 5);
    expect(analysis.totalSolidsNonfat).toBeCloseTo(243.456, 5);
    expect(analysis.milkSolidsNonfat).toBeCloseTo(120.456, 5);
    expect(analysis.water).toBeCloseTo(611.246, 5);
    expect(analysis.sugars).toBeCloseTo(120, 5);
    expect(analysis.totalMass).toBeCloseTo(1000, 5);
    expect(analysis.stabilizers).toBeCloseTo(1.5, 5);
    expect(Math.round(analysis.pod)).toBe(114);
    expect(Math.round(analysis.pac)).toBe(232);
  });

  // The Butter Pecan recipe includes ingredients that should be
  // excluded from the analysis.
  test('butter pecan', () => {
    const recipe = recipes.butterPecan;
    const recipeIngredients = recipe.ingredients;
    const usedIngredients = getIngredientMap(recipe);
    const analysis = analyze(recipeIngredients, usedIngredients);

    expect(analysis.totalFat).toBeCloseTo(140.07, 5);
    expect(analysis.milkFat).toBeCloseTo(136.62, 5);
    expect(analysis.totalSolids).toBeCloseTo(386.688, 5);
    expect(analysis.totalSolidsNonfat).toBeCloseTo(246.618, 5);
    expect(analysis.milkSolidsNonfat).toBeCloseTo(119.568, 5);
    expect(analysis.water).toBeCloseTo(608.689, 5);
    expect(analysis.sugars).toBeCloseTo(120, 5);
    expect(analysis.totalMass).toBeCloseTo(1000, 5);
    expect(analysis.stabilizers).toBeCloseTo(1.5, 5);
    expect(Math.round(analysis.pod)).toBe(114);
    expect(Math.round(analysis.pac)).toBe(232);
  });
});
