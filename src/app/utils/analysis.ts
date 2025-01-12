import type {
  Analysis,
  AnalyzableIngredientMap,
  RecipeIngredientSummary,
} from '../model/types';
import { getLogger } from './logger';

const logger = getLogger({
  layer: 'controller',
  resource: 'recipe',
});

export function analyze(
  recipeIngredients: RecipeIngredientSummary[],
  usedIngredients: AnalyzableIngredientMap,
): Analysis {
  // Initialize the analysis object.
  const analysis: Analysis = {
    totalFat: 0.0,
    milkFat: 0.0,
    totalSolids: 0.0,
    totalSolidsNonfat: 0.0,
    milkSolidsNonfat: 0.0,
    water: 0.0,
    sugars: 0.0,
    totalMass: 0.0,
    pod: 0.0,
    pac: 0.0,
    stabilizers: 0.0,
  };

  // Intermediate calculations:
  let otherFat = 0.0;
  let otherSolidsNonfat = 0.0;

  for (const { name, quantity } of recipeIngredients) {
    // This name should look more scoped to ingredients somehow.
    // Either with a rename or a named '* as' import.
    const { data, category } = usedIngredients[name];

    // Exclude ingredients with these conditions from the analysis.
    if (!data || ['steeping', 'churning', 'drawing'].includes(category)) {
      logger.debug(`Skipping ingredient ${name} as irrelevant to analysis`);
      continue;
    }

    analysis.totalMass += quantity;

    if (data.pod) {
      analysis.pod += data.pod * quantity;
    }

    if (data.pac) {
      analysis.pac += data.pac * quantity;
    }

    if (data.milkFat) {
      analysis.milkFat += data.milkFat * quantity;
    }

    if (data.milkSolidsNonfat) {
      analysis.milkSolidsNonfat += data.milkSolidsNonfat * quantity;
    }

    if (data.water) {
      analysis.water += data.water * quantity;
    }

    if (data.sugars) {
      analysis.sugars += data.sugars * quantity;
    }

    if (data.stabilizers) {
      analysis.stabilizers += data.stabilizers * quantity;
    }

    if (data.otherFat) {
      otherFat += data.otherFat * quantity;
    }

    if (data.otherSolidsNonfat) {
      otherSolidsNonfat += data.otherSolidsNonfat * quantity;
    }
  }

  analysis.totalFat = otherFat + analysis.milkFat;
  analysis.totalSolidsNonfat =
    analysis.milkSolidsNonfat +
    otherSolidsNonfat +
    analysis.sugars +
    analysis.stabilizers;
  analysis.totalSolids = analysis.totalFat + analysis.totalSolidsNonfat;

  return analysis;
}
