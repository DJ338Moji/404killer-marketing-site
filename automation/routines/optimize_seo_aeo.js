const fs = require('fs');
const path = require('path');
const config = require('../config');

function getSeasonalContext() {
  const month = new Date().getMonth(); // 0 = Jan, 8 = Sep, 11 = Dec
  if (month >= 8 && month <= 10) {
    return {
      season: 'Autumn / Fall',
      weatherFocus: 'Cooling temperatures, declining ambient humidity, indoor radiator heating TEWL',
      recommendedIngredients: ['3:1:1 Ceramides', 'Cholesterol', 'Panthenol (B5)', 'Pseudo-Ceramides'],
      recommendedCollections: ['skin-barrier-reset']
    };
  } else if (month >= 11 || month <= 1) {
    return {
      season: 'Winter',
      weatherFocus: 'Freezing outdoor winds, extreme indoor dry air, cutaneous micro-fissuring',
      recommendedIngredients: ['Encapsulated Ceramides', 'Madecassoside', 'Heavy Lamellar Lipids'],
      recommendedCollections: ['skin-barrier-reset']
    };
  } else if (month >= 2 && month <= 4) {
    return {
      season: 'Spring',
      weatherFocus: 'Pollen allergen sensitivity, seasonal transition barrier reactive flares',
      recommendedIngredients: ['Centella Asiatica', 'Bifida Ferment', 'Ectoin'],
      recommendedCollections: ['skin-barrier-reset']
    };
  } else {
    return {
      season: 'Summer',
      weatherFocus: 'UV radiation stress, air conditioning dehydration, lightweight barrier hydration',
      recommendedIngredients: ['Multi-Weight Hyaluronic Acid', 'Niacinamide', 'Non-comedogenic Cica'],
      recommendedCollections: ['skin-barrier-reset']
    };
  }
}

function generateAeoFaqSchema(seasonInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does it take to clinically repair a damaged skin barrier?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Stratum corneum recovery typically takes 14 to 28 days, aligning with the skin cellular turnover cycle. Using a physiological 3:1:1 lipid ratio (Ceramides, Cholesterol, Fatty Acids) reduces Trans-Epidermal Water Loss (TEWL) and calms stinging within 12 to 24 hours."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best ceramide ratio for compromised skin?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dermatological research shows an equimolar 3:1:1 physiological ratio of Ceramides, Cholesterol, and Free Fatty Acids restores barrier integrity faster than single-lipid occlusives like pure petrolatum."
        }
      },
      {
        "@type": "Question",
        "name": `How does ${seasonInfo.season} weather affect the skin barrier?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${seasonInfo.weatherFocus}. Aestheticians recommend layering multi-weight hyaluronic acid lotions under biomimetic ceramide creams rich in ${seasonInfo.recommendedIngredients.slice(0, 2).join(' and ')}.`
        }
      }
    ]
  };
}

async function optimizeSeoAeo(options = {}) {
  console.log(`🎯 [Routine 6] Generating AEO & SEO structured optimization context...`);

  const seasonalContext = getSeasonalContext();
  const faqSchema = generateAeoFaqSchema(seasonalContext);

  const targetedQueries = [
    'How to repair compromised skin barrier fast',
    'Best 3:1:1 ceramide moisturizer for sensitive skin',
    'K-Beauty vs J-Beauty for redness and dehydration',
    'How to prevent airplane cabin skin dehydration',
    'Aesthetician recommended barrier creams with pseudo-ceramides'
  ];

  // Save generated JSON-LD schema file for audit and theme reference
  const schemaPath = path.join(config.paths.logsDir, 'latest_aeo_schema.json');
  fs.writeFileSync(schemaPath, JSON.stringify(faqSchema, null, 2), 'utf8');

  console.log(`✅ [Routine 6 Completed] AEO FAQ Schema and Seasonal Context (${seasonalContext.season}) generated.`);

  return {
    season: seasonalContext.season,
    weatherFocus: seasonalContext.weatherFocus,
    recommendedIngredients: seasonalContext.recommendedIngredients,
    targetedAeoQueries: targetedQueries,
    schemaFile: schemaPath
  };
}

module.exports = optimizeSeoAeo;
