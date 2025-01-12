const sentencePattern = '^([A-Z].*[.!?] ?)+$';

export const name = {
  pattern: '^(([A-Z]|and)[^\\s]* ?)+[^\\s]$',
  minLength: 1,
  maxLength: 30,
};

export const description = {
  // This regex is not perfect but it should do for now.
  pattern: sentencePattern,
  minLength: 30,
  maxLength: 400,
};

export const ratio = {
  minimum: 0.0,
  maximum: 1.0,
};

export const instructionsList = {
  maxItems: 30,
  minItems: 1,
};

export const instruction = {
  pattern: sentencePattern,
  minLength: 10,
  maxLength: 300,
};

// TODO: it might make sense to define separate constraints for
// recipe and ingredients contexts. Some ingredients might have 1
// sub ingredients. Recipes should have a minimum of at least 3.
export const ingredientList = {
  maxItems: 20,
  minItems: 1,
};

export const quantity = {
  exclusiveMinimum: 0,
  maximum: 1000,
};

export const unit = {
  minLength: 1,
  maxLength: 20,
};
