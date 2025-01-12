import {
  IngredientCategory,
  IngredientPrototype,
  RecipePrototype,
} from '../../src/app/model/types';

export const recipes: Record<string, RecipePrototype> = {
  vanilla: {
    name: 'Vanilla',
    subtitle: 'Simple and elegant',
    description:
      'Vanilla is one of the most complex spices in the world, yet few things are as paradoxically simple as a classic Vanilla ice cream. Smooth, creamy, and delicious - it will never get old!',
    estimatedMass: 945,
    base: 'Vanilla',
    instructions: [
      'Measure out and mix together all of the solids.',
      'Add the dairy to a medium-sized, heavy-bottomed pot.',
      'Heat the dairy on the stove until warm, around 90° F.',
      'Slowly add the solids to the pot, whisking as your pour to dissolve the solids. Continue whisking until dissolved.',
      'Prepare an ice bath by nesting a metal mixing bowl into a larger bowl that is filled with ice and water.',
      'Continue cooking the dairy, whisking occasionally. Cook until the temperature reaches 165° F.',
      'Once the mixture is at temperature, pour through a fine mesh strainer into the bowl in the ice bath.',
      'Whisk occasionally while the mixture cools. Once the temperature is below 80° F, add the finishing ingredients.',
      'Cover the bowl or transfer the mixture to a container. Store in the fridge to age, at least 4 hours and up to overnight.',
      "Churn in an ice cream machine according to the manufacture's instructions, about 15-20 minutes.",
      'Draw ice cream from the machine and into a freezer-safe container. Store in the freezer.',
    ],
    ingredients: [
      {
        name: 'Whole Milk',
        quantity: 470,
        unit: 'g',
      },
      {
        name: 'Heavy Cream',
        quantity: 341,
        unit: 'g',
      },
      {
        name: 'Sugar',
        quantity: 63,
        unit: 'g',
      },
      {
        name: 'Dextrose',
        quantity: 57,
        unit: 'g',
      },
      {
        name: 'Milk Powder',
        quantity: 60,
        unit: 'g',
      },
      {
        name: 'Stabilizer Blend',
        quantity: 1.5,
        unit: 'g',
      },
      {
        name: 'Salt',
        quantity: 1.5,
        unit: 'g',
      },
      {
        name: 'Vanilla Extract',
        quantity: 6,
        unit: 'g',
      },
    ],
  },
  butterPecan: {
    name: 'Butter Pecan',
    subtitle: 'Candied pecans mixed into brown butter and molasses ice cream',
    description:
      'This is a decadent, buttery ice cream filled with salty-sweet pecans that is a far cry from a standard vanilla with some pecans thrown in!',
    estimatedMass: 935,
    base: 'Butter Pecan', // Note: this could (maybe should?) change to TMS or BB one day.
    instructions: [
      'Measure out and mix together all of the solids.',
      'Add the dairy to a medium-sized, heavy-bottomed pot.',
      'Heat the dairy on the stove until warm, around 90° F.',
      'Slowly add the solids to the pot, whisking as your pour to dissolve the solids. Continue whisking until dissolved. If not all the toasted milk powder dissolves right away, that is okay. Keep going.',
      'Prepare an ice bath by nesting a metal mixing bowl into a larger bowl that is filled with ice and water.',
      'Temper the egg yolks by whisking them in a bowl, then whisking in about a half cup of warm dairy a little bit at a time.',
      'Add the egg mixture back to the pot, scraping the sides with a rubber spatula.',
      'Continue cooking the mixture, whisking frequently to prevent scrambling the eggs. Cook until the temperature reaches 165° F.',
      'Once the mixture is at temperature, pour through a fine mesh strainer into the bowl in the ice bath.',
      'Whisk occasionally while the mixture cools. Once the temperature is below 80° F, add the finishing ingredients.',
      'Measure the final weight of the mixture and transfer into a container. Use the final weight to determine the amount of pecans to mix in while churning.',
      'Store in the fridge to age, at least 4 hours and up to overnight.',
      "Churn in an ice cream machine according to the manufacture's instructions, about 15-20 minutes.",
      'Once the ice cream is nearly done churning, slowly add the pecans to the churner so that they disperse through the ice cream.',
      'Draw ice cream from the machine and into a freezer-safe container. Store in the freezer.',
    ],
    ingredients: [
      {
        name: 'Whole Milk',
        quantity: 465,
        unit: 'g',
      },
      {
        name: 'Heavy Cream',
        quantity: 333,
        unit: 'g',
      },
      {
        name: 'Sugar',
        quantity: 27,
        unit: 'g',
      },
      {
        name: 'Brown Sugar',
        quantity: 35,
        unit: 'g',
      },
      {
        name: 'Dextrose',
        quantity: 58,
        unit: 'g',
      },
      {
        name: 'Milk Powder',
        quantity: 35,
        unit: 'g',
      },
      {
        name: 'Toasted Milk Powder',
        quantity: 25,
        unit: 'g',
      },
      {
        name: 'Egg Yolks',
        quantity: 15,
        unit: 'g',
      },
      {
        name: 'Stabilizer Blend',
        quantity: 1.5,
        unit: 'g',
      },
      {
        name: 'Salt',
        quantity: 1.5,
        unit: 'g',
      },
      {
        name: 'Vanilla Extract',
        quantity: 4,
        unit: 'g',
      },
      {
        name: 'Candied Pecans',
        quantity: 9,
        unit: '% of final weight',
      },
    ],
  },
};

export const ingredients: Record<string, IngredientPrototype> = {
  milk: {
    name: 'Whole Milk',
    description:
      "Good ol' cow's milk. The backbone of ice cream. When balancing a recipe and there are gaps to fill, use milk.",
    data: {
      pac: 0.04,
      pod: 0.0067,
      milkFat: 0.036,
      milkSolidsNonfat: 0.088,
      water: 0.873,
    },
    category: IngredientCategory.Dairy,
  },
  cream: {
    name: 'Heavy Cream',
    description:
      'Heavy whipping cream. Adds fat, creaminess, and richness to ice cream. Using different ratios between cream and milk adjusts the fat content of your ice cream.',
    data: {
      pac: 0.035,
      pod: 0.0005,
      milkFat: 0.36,
      milkSolidsNonfat: 0.056,
      water: 0.58,
    },
    category: IngredientCategory.Dairy,
  },
  sugar: {
    name: 'Sugar',
    description:
      'Normal table sugar, aka "sucrose". Adds sweetness and reduces the freezing point.',
    data: {
      pac: 1,
      pod: 1,
      sugars: 1,
    },
    category: IngredientCategory.Solids,
  },
  dextrose: {
    name: 'Dextrose',
    description:
      'One half of of the sucrose molecule. Considerably reduces the freezing point and is not very sweet. Ideal for making ice cream soft and smooth without making it too sweet.',
    data: {
      pac: 1.9,
      pod: 0.75,
      sugars: 1,
    },
    category: IngredientCategory.Solids,
  },
  milkPowder: {
    name: 'Milk Powder',
    description:
      "The solids found in milk, including lactose and milk proteins. Essentially, everything in milk that isn't water or milk fat. Helps to balance the solids-to-water ratio in ice cream.",
    data: {
      pod: 0.08,
      pac: 0.5,
      milkSolidsNonfat: 1,
    },
    category: IngredientCategory.Solids,
  },
  eggYolks: {
    name: 'Egg Yolks',
    description:
      'Egg yolks are emulsifiers and stabilizers that assist with the texture and lend a custard flavor to ice cream. I typically use no more than 1-2 in recipes, and only when they pair well with the flavor of the ice cream.',
    data: {
      otherFat: 0.23,
      otherSolidsNonfat: 0.27,
      water: 0.5,
    },
    category: IngredientCategory.Other,
  },
  stabilizerBlend: {
    name: 'Stabilizer Blend',
    description:
      'Stabilizers significantly improve the texture and longevity of ice cream. They may spook some people but they are all natural and nothing to be afraid of!',
    data: {
      stabilizers: 1,
    },
    preparation: {
      ingredients: [
        {
          name: 'Locust bean gum',
          quantity: 8,
          unit: 'g',
        },
        {
          name: 'Guar gum',
          quantity: 4,
          unit: 'g',
        },
        {
          name: 'Lambda carageenan',
          quantity: 2,
          unit: 'g',
        },
      ],
      instructions: [
        'Mix together until thoroughly combined.',
        'Store in a sealed container or plastic bag at room temperature.',
      ],
      description:
        'My go-to stabilizer blend, taken from the UnderBelly blog. Makes enough for ~10 batches of ice cream. Can likely be replaced by most commercial stabilizer blends.',
    },
    category: IngredientCategory.Solids,
  },
  salt: {
    name: 'Salt',
    description:
      'You know it, you love it. The mineral that makes all other flavors pop! It would be silly to make ice cream without it.',
    data: {
      otherSolidsNonfat: 1,
    },
    category: IngredientCategory.Solids,
  },
  vanillaExtract: {
    name: 'Vanilla Extract',
    description:
      'Extraction of vanilla bean into a blend of water and alcohol. Use something high quality! May be substituted with vanilla paste for a stronger bean flavor, if desired.',
    data: {
      water: 0.526,
    },
    category: IngredientCategory.Finishing,
  },
  toastedMilkPowder: {
    name: 'Toasted Milk Powder',
    description:
      'Toasting milk solids is my favorite way to add brown butter flavor to an ice cream. It lends sweet, nutty notes that can present as brown butter, graham cracker, or shortbread depending on the application. Be careful of using too much - it shines at or below a certain threshold (around 2.5-3% of the total mass).',
    data: {
      pod: 0.08,
      pac: 0.5,
      milkSolidsNonfat: 1,
    },
    preparation: {
      ingredients: [
        {
          name: 'Milk Powder',
          quantity: 50,
          unit: 'g',
        },
      ],
      instructions: [
        'Preheat the oven to 300° F.',
        'Spread out milk powder on sheet pan lined with parchment paper or aluminum foil.',
        'Toast in oven for 12 minutes, pulling out to stir halfway through.',
        'Remove and remove the paper/foil from the pan and place somewhere to cool down.',
        'Store in a sealed container in a cool, dry place. It should keep fairly well.',
      ],
      description:
        'Toasting milk solids is exactly what happens when you brown butter. This replicates those flavors, without the milkfat.',
    },
    category: IngredientCategory.Solids,
  },
  brownSugar: {
    name: 'Brown Sugar',
    description:
      'Sugar, but with some molasses hanging around. Can add a subtle caramel-like flavor to ice cream.',
    data: {
      pac: 1,
      pod: 1,
      sugars: 1,
    },
    category: IngredientCategory.Solids,
  },
  candiedPecans: {
    name: 'Candied Pecans',
    description:
      'Pecans toasted with sugar and butter, to be used as a mix-in.',
    preparation: {
      ingredients: [
        {
          name: 'Chopped pecans',
          quantity: 100,
          unit: 'g',
        },
        {
          name: 'Unsalted butter',
          quantity: 20,
          unit: 'g',
        },
        {
          name: 'Brown Sugar',
          quantity: 20,
          unit: 'g',
        },
        {
          name: 'Water',
          quantity: 20,
          unit: 'g',
        },
        {
          name: 'Salt',
          quantity: 2,
          unit: 'g',
        },
      ],
      instructions: [
        'Add sugar, water, and butter to large saucepan.',
        'Cook on medium-low and stir to melt the butter and dissolve the sugar.',
        'Once the mixture is just starting to bubble, add the chopped pecans and salt and stir to coat the nuts in the mixture.',
        "Cook until the pecans become fragrant. It should just take a minute or two. Don't overcook them - if they smell good, they're done.",
        'Transfer to a plate to cool, then transfer to a sealed container.',
        'Store in the fridge.',
      ],
      description:
        'Butter and pecans are a match made in heaven. Sugar and salt help the flavor to pop once frozen in ice cream. Toasting brings out the flavor of the nuts but be careful not to overcook them!',
    },
    category: IngredientCategory.Churning,
  },
};
