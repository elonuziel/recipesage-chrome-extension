/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 92:
/***/ (function (__unused_webpack_module, exports) {

        (function (global, factory) {
          true ? factory(exports) :
            0;
        })(this, (function (exports) {
          'use strict';

          const generateConfig = options => {
            // Default structure
            const config = {
              window: null,
              options: {
                window: null,
                mlDisable: null,
                mlModelEndpoint: null,
                mlClassifyEndpoint: null
              }
            }; // Window-based options

            /* istanbul ignore next */

            try {
              if (window) {
                config.window = window;
                config.options.window = window;
                config.options.mlDisable = window.RC_ML_DISABLE || null;
                config.options.mlModelEndpoint = window.RC_ML_MODEL_ENDPOINT || null;
                config.options.mlClassifyEndpoint = window.RC_ML_CLASSIFY_ENDPOINT || null;
              }
            } catch (_) {// Do nothing
            } // Argument-based options


            if (options) {
              config.window = options.window || config.window;
              config.options = {
                ...config.options,
                ...options
              };
            }

            return config;
          };

          const generalBadWords = ['instructions', 'directions', 'procedure', 'preparation', 'method', 'you will need', 'how to make it', 'ingredients', 'total time', 'active time', 'prep time', 'time', 'yield', 'servings', 'notes', 'select all ingredients', 'select all', 'הוראות', 'אופן הכנה', 'מצרכים', 'חומרים', 'בחר הכל', 'הדפס'];
          const allRecipesBadWords = ['ingredient checklist', 'instructions checklist', 'decrease serving', 'increase serving', 'adjust', 'the ingredient list now reflects the servings specified', 'footnotes', 'i made it  print', 'add all ingredients to shopping list'];
          const tastyRecipesBadWords = ['scale 1x2x3x'];
          const hebrewBadWords = ['הוראות הכנה', 'אופן ההכנה', 'רכיבים', 'זמן ההכנה'];
          const badWords = [generalBadWords, allRecipesBadWords, tastyRecipesBadWords, hebrewBadWords].flat();

          const matchYield = /(serves|servings|yield|yields|makes|מנות|יחידות|כמות):?\s*\d+/i;
          const matchActiveTime = /(active time|prep time|זמן הכנה|זמן עבודה):?\s*((?:(?:(?:\d+(?:\.\d+|\/\d+)?|חצי|רבע)\s*(?:d(?:s?)|day(?:s?)|hour(?:s?)|hr(?:s?)|minute(?:s?)|min(?:s?)|דקות|דק'|דק|שעות|שעה|שעתיים|ימים|יום)?)|(?:d(?:s?)|day(?:s?)|hour(?:s?)|hr(?:s?)|minute(?:s?)|min(?:s?)|דקות|דק'|דק|שעות|שעה|שעתיים|ימים|יום))\s*(?:and|ו)?\s*)+/i;
          const matchTotalTime = /(total time|זמן כולל|זמן אפייה|זמן בישול):?\s*((?:(?:(?:\d+(?:\.\d+|\/\d+)?|חצי|רבע)\s*(?:d(?:s?)|day(?:s?)|hour(?:s?)|hr(?:s?)|minute(?:s?)|min(?:s?)|דקות|דק'|דק|שעות|שעה|שעתיים|ימים|יום)?)|(?:d(?:s?)|day(?:s?)|hour(?:s?)|hr(?:s?)|minute(?:s?)|min(?:s?)|דקות|דק'|דק|שעות|שעה|שעתיים|ימים|יום))\s*(?:and|ו)?\s*)+/i; // step 4:

          const matchStep = /^(step *)?\d+:?$/i; // 1x, 1 x

          const matchScale = /^\d+ *x?$/i; // total time:

          const matchFieldTitles = /^(total time|prep time|active time|yield|servings|serves|זמן כולל|זמן הכנה|זמן אפייה|זמן בישול|זמן עבודה|מנות|יחידות|כמות):? ?/i;
          const matchSpecialChracters = /[^a-zA-Z0-9 \u0590-\u05FF\u200f\u200e]/g;
          const ingredientSectionHeader = /^(ingredients|you will need|ingredient checklist|ingredient list|מצרכים|חומרים|רכיבים|מה צריך)\s*:?/gi;
          const instructionSectionHeader = /^(instructions|instructions checklist|instruction list|how to make it|preparation|steps|method|procedure|directions|הוראות|אופן הכנה|אופן ההכנה|הוראות הכנה|שלבי הכנה|שלבים)\s*:?/gi;

          const getLongestString = strings => strings.reduce((acc, el) => el.length > acc.length ? el : acc, '');
          const capitalizeEachWord = textBlock => textBlock.split(' ').map(word => `${word.charAt(0).toUpperCase()}${word.substring(1)}`).join(' ');
          const removeSpecialCharacters = line => line.replace(matchSpecialChracters, '').trim(); // Undesired words

          const isBadWord = line => badWords.includes(removeSpecialCharacters(line).toLowerCase()); // Digits and steps that sit on their own lines

          const isStep = line => removeSpecialCharacters(line).match(matchStep); // Scale buttons/interface that was picked up accidentally (4x)

          const isScale = line => removeSpecialCharacters(line).match(matchScale);
          const removeFieldTitles = line => line.replace(matchFieldTitles, '').trim(); // Format capitalized lines "HEADER:" as [Header] or "for the xyz" as [For The Xyz]

          const formatHeaders = line => line.trim().match(/^([A-Z] *)+:?$/) || line.trim().match(/^for the ([a-z] *)+:?$/i) ? `[${capitalizeEachWord(line.trim().toLowerCase()).replace(':', '')}]` : line;
          const cleanKnownWords = textBlock => textBlock.split('\n').map(line => line.trim()).filter(line => removeSpecialCharacters(line).length).filter(line => !isBadWord(line)).filter(line => !isStep(line)).filter(line => !isScale(line)).map(line => removeFieldTitles(line)).map(line => formatHeaders(line)).join('\n');
          const format = {
            imageURL: val => val.trim(),
            title: val => capitalizeEachWord(val.trim().toLowerCase()),
            description: val => val.length > 300 ? '' : cleanKnownWords(val),
            source: val => val.trim(),
            yield: val => val.length > 30 ? '' : capitalizeEachWord(cleanKnownWords(val).trim().toLowerCase()),
            activeTime: val => val.length > 30 ? '' : capitalizeEachWord(cleanKnownWords(val).trim().toLowerCase()),
            totalTime: val => val.length > 30 ? '' : capitalizeEachWord(cleanKnownWords(val).trim().toLowerCase()),
            ingredients: val => cleanKnownWords(val),
            instructions: val => cleanKnownWords(val),
            notes: val => cleanKnownWords(val)
          };

          const getInnerText = element => element.innerText || element.textContent;

          const getClassNamesMatching = (window, classNamePartial) => {
            const classRegExp = new RegExp(`class="((\\w|\\s|-)*${classNamePartial}(\\w|\\s|-)*)"`, 'gi');
            const matches = window.document.body.innerHTML.matchAll(classRegExp);
            return Array.from(new Set(Array.from(matches, match => match[1])));
          };
          const getClassNamesContaining = (window, className) => {
            const classRegExp = new RegExp(`class="(([\\w-\\s]*\\s)?${className}(\\s[\\w-\\s]*)?)"`, 'gi');
            const matches = window.document.body.innerHTML.matchAll(classRegExp);
            return Array.from(new Set(Array.from(matches, match => match[1])));
          };
          const softMatchElementsByClass = (window, classNamePartial) => {
            const classNames = getClassNamesMatching(window, classNamePartial);
            return classNames.map(className => Array.from(window.document.getElementsByClassName(className))).flat();
          };
          const matchElementsByClass = (window, classNameFull) => {
            const classNames = getClassNamesContaining(window, classNameFull);
            return classNames.map(className => Array.from(window.document.getElementsByClassName(className))).flat();
          };
          const applyLIBlockStyling = element => {
            Array.from(element.querySelectorAll('li')).forEach(li => {
              li.style.display = 'block';
            });
            return element;
          };
          const grabLongestMatchByClasses = (window, preferredClassNames, fuzzyClassNames) => {
            const exactMatches = preferredClassNames.map(className => matchElementsByClass(window, className)).flat();
            const fuzzyMatches = fuzzyClassNames.map(className => softMatchElementsByClass(window, className)).flat();
            return (exactMatches.length > 0 ? exactMatches : fuzzyMatches).map(element => applyLIBlockStyling(element)).map(element => getInnerText(element).trim()).reduce((max, match) => match.length > max.length ? match : max, '');
          };
          const isImg = element => element.tagName.toLowerCase().trim() === 'img';
          const isPicture = element => element.tagName.toLowerCase().trim() === 'picture';
          const getAttrIfExists = (el, attrName) => {
            if (el.attributes[attrName]) return el.attributes[attrName].value;
            return '';
          };
          const getSrcFromImage = img => {
            if (!img) return '';
            const closestSrc = getAttrIfExists(img, 'data-src') || getAttrIfExists(img, 'data-lazy-src') || img.currentSrc || img.src;
            return closestSrc || '';
          };
          const isValidImage = element => isImg(element) && !!getSrcFromImage(element) && element.complete // Filter images that haven't completely loaded
            && element.naturalWidth > 0 // Filter images that haven't loaded correctly
            && element.naturalHeight > 0;
          const getImageDimensions = element => {
            const parent = element.parentNode;
            const isParentPicture = parent && isPicture(parent);
            const offsetHeight = isParentPicture ? Math.max(element.offsetHeight, parent.offsetHeight) : element.offsetHeight;
            const offsetWidth = isParentPicture ? Math.max(element.offsetWidth, parent.offsetWidth) : element.offsetWidth;
            return {
              offsetHeight,
              offsetWidth
            };
          };
          const grabLargestImage = window => {
            const matches = window.document.querySelectorAll('img');
            return [...matches].filter(element => isValidImage(element)).reduce((max, element) => {
              const {
                offsetWidth,
                offsetHeight
              } = getImageDimensions(element); // Do not use images smaller than 200x200

              if (offsetWidth < 200 && offsetHeight < 200) return max;
              const elTotalPx = offsetHeight * offsetWidth;
              const maxTotalPx = max ? max.offsetHeight * max.offsetWidth : 0;
              return elTotalPx > maxTotalPx ? element : max;
            }, null);
          };
          const closestToRegExp = (window, regExp) => {
            const {
              body
            } = window.document;
            const match = getInnerText(body).match(regExp);
            if (!match) return '';
            return match[0];
          };
          const grabRecipeTitleFromDocumentTitle = window => window.document.title.split(/ - |\|/)[0].trim();
          const grabSourceFromDocumentTitle = window => (window.document.title.split(/ - |\|/)[1] || '').trim();

          // Class matchers are sorted by field. Each field contains a set of exact matchers,
          // and a set of fuzzy fallback matchers
          // For example:
          // imageURL: [ [exact], [fuzzy fallback] ]
          // Clipper will search for exact matchers _exactly_ within the document
          // Clipper will search for any element that has a class that contains the fuzzy name
          const classMatchers = {
            imageURL: [['wprm-recipe-image', // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
              'tasty-recipes-image', // TastyRecipes recipe embed tool - https://sallysbakingaddiction.com/quiche-recipe/
              'hero-photo', // AllRecipes - https://www.allrecipes.com/recipe/231244/asparagus-mushroom-bacon-crustless-quiche/
              'o-RecipeLead__m-RecipeMedia', // FoodNetwork - https://www.foodnetwork.com/recipes/paula-deen/spinach-and-bacon-quiche-recipe-2131172
              'recipe-lede-image', // Delish - https://www.delish.com/cooking/recipe-ideas/a25648042/crustless-quiche-recipe/
              'recipe-body', // Generic, idea from Delish - https://www.delish.com/cooking/recipe-ideas/a25648042/crustless-quiche-recipe/
              'recipe__hero', // Food52 - https://food52.com/recipes/81867-best-quiche-recipe
              'content' // Generic, recognize content-body if matched directly
            ], ['recipe-image', 'hero', 'recipe-content', // Generic, search for largest image within any recipe content block
              'recipe-body', // Generic, search for largest image within any recipe content block
              'recipe-intro', // Generic, search for largest image within any recipe content block
              'recipe-' // Generic, search for largest image within any recipe content block
            ]],
            title: [['wprm-recipe-name' // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
            ], ['recipename', 'recipe-name', 'recipetitle', 'recipe-title']],
            description: [['wprm-recipe-summary' // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
            ], []],
            yield: [['recipe-yield', 'recipe-servings', 'yield', 'servings'], ['yield', 'servings']],
            activeTime: [['activeTime', 'active-time', 'prep-time', 'time-active', 'time-prep'], ['activeTime', 'active-time', 'prep-time', 'time-active', 'time-prep']],
            totalTime: [['totalTime', 'total-time', 'time-total'], ['totalTime', 'total-time', 'time-total']],
            ingredients: [['wprm-recipe-ingredients-container', // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
              'wprm-recipe-ingredients', // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
              'tasty-recipes-ingredients', // Tasty recipes embed tool - https://myheartbeets.com/paleo-tortilla-chips/
              'o-Ingredients', // FoodNetwork - https://www.foodnetwork.com/recipes/paula-deen/spinach-and-bacon-quiche-recipe-2131172
              'recipe-ingredients', 'recipe-ingredients-section', // Taste.com.au - https://www.taste.com.au/recipes/healthy-feta-mint-beef-patties-griled-vegies-hummus-recipe/pxacqmfu?r=recipes/dinnerrecipesfortwo&c=1j53ce29/Dinner%20recipes%20for%20two
              'mntl-sc-block-ingredients', 'ingredient-name', 'recipe-ingredients__list', 'list-ingredients', 'ingredients-list', // Modern additions
              'ingredientlist', 'ingredient-list'], ['ingredients', 'ingredientlist', 'ingredient-list', 'mntl-sc-block-ingredients', 'ingredient-name', 'recipe-ingredients__list', 'list-ingredients', 'ingredients-list']],
            instructions: [['wprm-recipe-instructions', // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
              'tasty-recipes-instructions', // Tasty recipes embed tool - https://myheartbeets.com/paleo-tortilla-chips/
              'recipe-directions__list', // AllRecipes - https://www.allrecipes.com/recipe/231244/asparagus-mushroom-bacon-crustless-quiche/
              'o-Method', // FoodNetwork - https://www.foodnetwork.com/recipes/paula-deen/spinach-and-bacon-quiche-recipe-2131172
              'steps-area', // Bon Appetit - https://www.bonappetit.com/recipe/chocolate-babka
              'recipe-method-section', // Taste.com.au - https://www.taste.com.au/recipes/healthy-feta-mint-beef-patties-griled-vegies-hummus-recipe/pxacqmfu?r=recipes/dinnerrecipesfortwo&c=1j53ce29/Dinner%20recipes%20for%20two
              'recipe__list--steps', // Food52.com - https://food52.com/recipes/81867-best-quiche-recipe
              'recipesteps', // BettyCrocker.com - https://www.bettycrocker.com/recipes/ultimate-chocolate-chip-cookies/77c14e03-d8b0-4844-846d-f19304f61c57
              'recipe-steps', // Generic
              'instructionlist', // Generic
              'instruction-list', // Bon Appetit - https://www.bonappetit.com/recipe/extra-corny-cornbread-muffins
              'directionlist', // Generic
              'direction-list', // https://leitesculinaria.com/10114/recipes-portuguese_sausage_frittata.html
              'preparationsteps', // Generic
              'preparation-steps', // https://www.maangchi.com/recipe/kimchi-bokkeumbap
              'prepsteps', // Generic
              'prep-steps', // https://tasty.co/recipe/one-pan-baby-back-ribs
              'recipeinstructions', // Generic
              'recipe-instructions', // Generic
              'recipemethod', // Generic
              'recipe-method', // Generic
              'directions', // Generic
              'instructions', // Generic
              'mntl-sc-block-instruction', 'recipe-directions__step', 'recipe-method__list', 'instruction-step', 'directions-list', 'instructions-list' // Modern additions
            ], ['directionlist', 'direction-list', 'recipesteps', 'recipe-steps', 'recipemethod', 'recipe-method', 'directions', 'instructions', 'mntl-sc-block-instruction', 'recipe-directions__step', 'recipe-method__list', 'instruction-step', 'directions-list', 'instructions-list', 'instructions', 'preparationsteps']],
            notes: [['notes', // Generic
              'recipenotes', // Generic
              'recipe-notes', // Generic
              'recipefootnotes', // Generic
              'recipe-footnotes', // Generic
              'recipe__tips', // King Arthur Flour - https://www.kingarthurflour.com/recipes/chocolate-cake-recipe
              'wprm-recipe-notes-container' // Wordpress recipe embed tool - https://panlasangpinoy.com/leche-flan/
            ], ['recipenotes', 'recipe-notes', 'recipefootnotes', 'recipe-footnotes']]
          };

          // Self import for mock
          const getDocumentContent = config => {
            const {
              body
            } = config.window.document;
            applyLIBlockStyling(body);
            return getInnerText(body).split('\n').map(line => line.trim()).filter(line => line);
          };
          const findPotentialSetsByHeader = (config, headerRegexp) => {
            const content = getDocumentContent(config);
            return content.filter(line => line.match(headerRegexp)).map(line => content.slice(content.indexOf(line) + 1));
          };
          const loadModel = async config => {
            const modelUrl = config.options.mlModelEndpoint;
            if (!modelUrl) throw new Error('You must provide window.RC_ML_MODEL_ENDPOINT or options.mlModelEndpoint to use local classification');
            return config.window.tf.loadLayersModel(modelUrl);
          };
          const mlClassifyLocal = async (config, lines) => {
            const model = await loadModel(config);
            const useModel = await config.window.use.load();
            const predictions = [];

            for (let i = 0; i < lines.length; i += 1) {
              // eslint-disable-next-line no-await-in-loop
              const encodedData = await useModel.embed([lines[i]]);
              const prediction = model.predict(encodedData).dataSync();
              predictions.push(prediction);
            }

            return predictions;
          };
          const mlClassifyRemote = async (config, lines) => {
            const remote = config.options.mlClassifyEndpoint;
            if (!remote) throw new Error('You must provide window.RC_ML_CLASSIFY_ENDPOINT or options.mlClassifyEndpoint to use remote classification');
            return new Promise((resolve, reject) => {
              chrome.runtime.sendMessage(
                {
                  type: "FETCH_API",
                  url: remote,
                  options: {
                    method: 'POST',
                    body: JSON.stringify({ sentences: lines }),
                    headers: { 'Content-Type': 'application/json' }
                  }
                },
                (response) => {
                  if (response && response.success) {
                    resolve(response.data);
                  } else {
                    reject(new Error(response?.error || 'Failed to fetch from background'));
                  }
                }
              );
            });
          };
          const mlClassify = async (config, lines) => {
            const isTFJSAvailable = config.window.tf && config.window.tf.loadLayersModel;
            const isUSEAvailable = config.window.use && config.window.use.load;
            if (isTFJSAvailable && isUSEAvailable) return mlClassifyLocal(config, lines);
            return mlClassifyRemote(config, lines);
          };
          const mlFilter = async (config, lines, type) => {
            const predictions = await mlClassify(config, lines);
            let lastType = -1;
            const filteredOutput = [];

            for (let i = 0; i < lines.length; i += 1) {
              const predictedType = predictions[i].indexOf(Math.max(...predictions[i])) + 1; // Allow one line of error to be included
              // (say, an ingredient header or a stray bit of formatting)
              // Also allow some non-ingredient text at the very start (say, a section header)

              if (predictedType === type || lastType === type || i === 0) {
                filteredOutput.push(lines[i]);
                lastType = predictedType;
              } else {
                break;
              }
            } // Remove last element if it is not of the desired type
            // (consider our allowed buffer above may insert one undesired item at end)


            if (filteredOutput.length > 0 && lastType !== type) {
              filteredOutput.pop();
            }

            return filteredOutput;
          };
          const findFullSearch = async (config, type) => {
            const content = getDocumentContent(config);
            const predictions = await mlClassify(config, content);
            const {
              groups,
              workingGroup
            } = content.reduce((acc, line, idx) => {
              const predictedType = predictions[idx].indexOf(Math.max(...predictions[idx])) + 1;
              const lastType = acc.workingGroup && acc.workingGroup.length > 0 ? acc.workingGroup[acc.workingGroup.length - 1].type : -1; // Allow one line of error to be included in group
              // (say, an ingredient header or a stray bit of formatting)
              // Also allow some non-ingredient text at the very start (say, a section header)

              if (predictedType === type || lastType === type || idx === 0) {
                acc.workingGroup = acc.workingGroup || [];
                acc.workingGroup.push({
                  text: line,
                  type: predictedType
                });
              } else {
                // Group is considered complete
                if (acc.workingGroup && acc.workingGroup.length > 0) acc.groups.push(acc.workingGroup);
                acc.workingGroup = null;
              }

              return acc;
            }, {
              workingGroup: null,
              groups: []
            }); // If leftover working group (if ingredients/instructions end at very end of page)

            if (workingGroup) groups.push(workingGroup);
            groups.forEach(group => {
              // Remove last element if it is not of the desired type
              // (consider our allowed buffer above may insert one undesired item at end)
              if (group.length > 0 && group[group.length - 1].type !== type) {
                group.pop();
              }
            });
            return groups.map(group => group.map(item => item.text)).map(group => group.join('\n')).reduce((a, b) => a.length > b.length ? a : b, '');
          };
          const findByHeader = async (config, type) => {
            const headerRegexp = type === 1 ? ingredientSectionHeader : instructionSectionHeader;
            const potentialSets = findPotentialSetsByHeader(config, headerRegexp);
            const sets = [];

            for (let i = 0; i < potentialSets.length; i += 1) {
              const potentialSet = potentialSets[i]; // eslint-disable-next-line no-await-in-loop

              const set = await mlFilter(config, potentialSet, type);
              sets.push(set);
            }

            return sets.map(set => set.join('\n')).reduce((a, b) => a.length > b.length ? a : b, '');
          }; // Type 1 for ingredients
          // Type 2 for instructions
          // Others to be implemented in future...

          const grabByMl = async (config, type) => {
            if (config.options.mlDisable) return '';
            const result = (await findByHeader(config, type)) || (await findFullSearch(config, type));
            return result;
          };

          const getRecipeSchemasFromDocument = window => {
            const schemas = [...window.document.querySelectorAll('script[type="application/ld+json"]')].map(schema => {
              try {
                return JSON.parse(getInnerText(schema));
              } catch (e) {// Do nothing
              }

              return null;
            }).filter(e => e);
            const recipeSchemas = schemas.map(schema => {
              // Schemas that evaluate to a graph
              if (schema['@graph']) {
                return schema['@graph'].find(subSchema => subSchema['@type'] === 'Recipe');
              } // Schemas that are directly embedded


              if (schema['@type'] === 'Recipe') return schema; // Schemas that evaluate to an array

              if (schema.length && schema[0]) {
                return schema.find(subSchema => subSchema['@type'] === 'Recipe');
              }

              return null;
            }).filter(e => e);
            return recipeSchemas;
          };
          const getPropertyFromSchema = (window, propName) => {
            if (!window.parsedSchemas) window.parsedSchemas = getRecipeSchemasFromDocument(window);
            const foundSchema = window.parsedSchemas.find(schema => schema[propName]) || {};
            return foundSchema[propName] || null;
          };
          const getImageSrcFromSchema = window => {
            const images = getPropertyFromSchema(window, 'image');
            if (!images) return '';
            let imageSrc;
            if (typeof images === 'string') imageSrc = images; else if (typeof images.url === 'string') imageSrc = images.url; else if (typeof images[0] === 'string') [imageSrc] = images; else if (images[0] && typeof images[0].url === 'string') imageSrc = images[0].url;

            if (imageSrc) {
              try {
                const url = new URL(imageSrc);
                if (url.protocol === 'http:' || url.protocol === 'https:') return imageSrc;
              } catch (_) {// Do nothing
              }
            }

            return '';
          };
          const getTitleFromSchema = window => {
            const title = getPropertyFromSchema(window, 'name');
            if (typeof title === 'string') return title;
            return '';
          };
          const getDescriptionFromSchema = window => {
            const description = getPropertyFromSchema(window, 'description');
            if (typeof description === 'string') return description;
            return '';
          };
          const getYieldFromSchema = window => {
            const recipeYield = getPropertyFromSchema(window, 'recipeYield');
            if (!recipeYield) return '';
            if (typeof recipeYield === 'string') return recipeYield;
            if (typeof recipeYield[0] === 'string') return getLongestString(recipeYield);
            return '';
          };
          /**
           * Useful for breaking down:
           * Recipe.recipeIngredient (https://schema.org/recipeIngredient)
           * Recipe.recipeInstructions (https://schema.org/recipeInstructions)
           * Which can both often be provided as a string, array, or list of more objects within.
           */

          const getTextFromSchema = schema => {
            if (!schema) return '';
            if (typeof schema === 'string') return schema;

            if (Array.isArray(schema)) {
              return schema.map(item => getTextFromSchema(item)).filter(el => el).join('\n');
            }

            if (typeof schema === 'object') {
              if (schema.text) return getTextFromSchema(schema.text);
              if (schema.itemListElement) return getTextFromSchema(schema.itemListElement);
              if (schema['@type'] === 'HowToStep' || schema['@type'] === 'HowToSection') {
                const parts = [];
                if (schema.name) parts.push(schema.name);
                if (schema.description) parts.push(schema.description);
                if (parts.length > 0) return parts.join('\n');
              }
            }

            return '';
          };
          const getInstructionsFromSchema = window => {
            const instructions = getPropertyFromSchema(window, 'recipeInstructions');
            if (!instructions) return '';
            return getTextFromSchema(instructions);
          };
          const getIngredientsFromSchema = window => {
            const ingredients = getPropertyFromSchema(window, 'recipeIngredient');
            if (!ingredients) return '';
            return getTextFromSchema(ingredients);
          };

          // Parse ISO 8601 duration strings (e.g. "PT1H30M") into human-readable text
          // Pass lang='he' to get Hebrew unit labels (e.g. "10 דקות" instead of "10 Minutes")
          const parseISO8601Duration = (duration, lang) => {
            if (!duration || typeof duration !== 'string') return '';
            const match = duration.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
            if (!match) return '';
            const days = parseInt(match[1] || 0);
            const hours = parseInt(match[2] || 0);
            const minutes = parseInt(match[3] || 0);
            const isHebrew = lang === 'he';
            const parts = [];
            if (days) parts.push(days + ' ' + (isHebrew ? (days === 1 ? 'יום' : 'ימים') : (days === 1 ? 'Day' : 'Days')));
            if (hours) parts.push(hours + ' ' + (isHebrew ? (hours === 1 ? 'שעה' : 'שעות') : (hours === 1 ? 'Hour' : 'Hours')));
            if (minutes) parts.push(minutes + ' ' + (isHebrew ? 'דקות' : (minutes === 1 ? 'Minute' : 'Minutes')));
            return parts.join(isHebrew ? ' ו-' : ' ');
          };

          const getActiveTimeFromSchema = window => {
            const lang = (window.document.documentElement && window.document.documentElement.lang) || '';
            const prepTime = getPropertyFromSchema(window, 'prepTime');
            if (prepTime && typeof prepTime === 'string') return parseISO8601Duration(prepTime, lang);
            return '';
          };
          const getTotalTimeFromSchema = window => {
            const lang = (window.document.documentElement && window.document.documentElement.lang) || '';
            const totalTime = getPropertyFromSchema(window, 'totalTime');
            if (totalTime && typeof totalTime === 'string') {
              const parsed = parseISO8601Duration(totalTime, lang);
              if (parsed) return parsed;
            }
            const cookTime = getPropertyFromSchema(window, 'cookTime');
            if (cookTime && typeof cookTime === 'string') return parseISO8601Duration(cookTime, lang);
            return '';
          };

          const getLongestTextForQueries = (window, queries) => {
            const vals = queries.map(query => [...window.document.querySelectorAll(query)]).flat().map(el => getInnerText(el));
            return getLongestString(vals);
          };
          const getActiveTimeFromMicrodata = window => getLongestTextForQueries(window, ['[itemProp=prepTime]']);
          const getTotalTimeFromMicrodata = window => getLongestTextForQueries(window, ['[itemProp=totalTime]']);
          const getYieldFromMicrodata = window => getLongestTextForQueries(window, ['[itemProp=recipeYield]']);
          const getIngredientsFromMicrodata = window => getLongestTextForQueries(window, ['[itemProp=recipeIngredients]', '[itemProp=ingredients]']);

          // DOM-based label+sibling extractor: finds labeled time fields where label and value are siblings
          const hebrewTimeLabelMap = [
            { labels: ['זמן הכנה', 'prep time', 'active time', 'זמן עבודה'], type: 'active' },
            { labels: ['זמן כולל', 'total time', 'זמן אפייה', 'זמן בישול'], type: 'total' },
          ];
          const getTimeFromLabelSibling = (window, type) => {
            const allElements = Array.from(window.document.querySelectorAll('p, span, div, dt, th, label, strong, b'));
            const entry = hebrewTimeLabelMap.find(e => e.type === type);
            if (!entry) return '';
            for (const el of allElements) {
              const text = getInnerText(el).trim().toLowerCase();
              if (el.children.length > 0) continue; // skip containers, only leaf nodes
              if (!entry.labels.some(lbl => text === lbl.toLowerCase())) continue;
              // Try next sibling, parent's next sibling, or sibling nodes within same parent
              const tryEl = el.nextElementSibling ||
                (el.parentElement && el.parentElement.nextElementSibling);
              if (tryEl) {
                const val = getInnerText(tryEl).trim();
                if (val && val.length > 0 && val.length < 50) return val;
              }
              // Also check siblings inside same parent
              if (el.parentElement) {
                const siblings = Array.from(el.parentElement.children).filter(c => c !== el);
                for (const sib of siblings) {
                  const val = getInnerText(sib).trim();
                  if (val && val.length > 0 && val.length < 50) return val;
                }
              }
            }
            return '';
          };

          const grabByHeaderDOM = (config, type) => {
            const headerRegexp = type === 1 ? ingredientSectionHeader : instructionSectionHeader;
            const headers = Array.from(config.window.document.querySelectorAll('h1, h2, h3, h4, h5, h6, b, strong, div')).filter(el => {
                 let text = getInnerText(el).trim();
                 return text.length > 0 && text.length < 50 && text.match(headerRegexp);
            });
            if (headers.length === 0) return '';
            
            let headerElement = headers[headers.length - 1]; // Assume the last matched header is the actual recipe one
            
            let current = headerElement;
            while (current && current !== config.window.document.body) {
              let nextSibling = current.nextElementSibling;
              
              while (nextSibling && getInnerText(nextSibling).trim().length === 0) {
                  nextSibling = nextSibling.nextElementSibling;
              }

              if (nextSibling) {
                if (nextSibling.tagName === 'UL' || nextSibling.tagName === 'OL') {
                  return getInnerText(nextSibling);
                }
                
                const listInside = nextSibling.querySelector('ul, ol');
                if (listInside) return getInnerText(listInside);
                
                const paragraphs = nextSibling.tagName === 'P' ? [nextSibling] : Array.from(nextSibling.querySelectorAll('p'));
                if (paragraphs.length > 0) {
                    let text = paragraphs.map(p => getInnerText(p).trim()).filter(t => t).join('\n');
                    if(text) return text;
                }
                
                let rawText = getInnerText(nextSibling).trim();
                if (rawText.length > 20) return rawText;
              }
              current = current.parentElement;
            }
            return '';
          };

          const clipImageURL = config => format.imageURL(getImageSrcFromSchema(config.window) || getSrcFromImage(grabLargestImage(config.window)));
          const clipTitle = config => format.title(getTitleFromSchema(config.window) || grabLongestMatchByClasses(config.window, ...classMatchers.title) || grabRecipeTitleFromDocumentTitle(config.window));
          const clipDescription = config => format.description(getDescriptionFromSchema(config.window) || grabLongestMatchByClasses(config.window, ...classMatchers.description));
          const clipSource = config => format.source(grabSourceFromDocumentTitle(config.window) || config.window.location.hostname);
          const clipYield = config => format.yield(getYieldFromSchema(config.window) || getYieldFromMicrodata(config.window) || grabLongestMatchByClasses(config.window, ...classMatchers.yield) || closestToRegExp(config.window, matchYield).replace('\n', ''));
          const clipActiveTime = config => format.activeTime(getActiveTimeFromSchema(config.window) || getActiveTimeFromMicrodata(config.window) || grabLongestMatchByClasses(config.window, ...classMatchers.activeTime) || closestToRegExp(config.window, matchActiveTime).replace('\n', '') || getTimeFromLabelSibling(config.window, 'active'));
          const clipTotalTime = config => format.totalTime(getTotalTimeFromSchema(config.window) || getTotalTimeFromMicrodata(config.window) || grabLongestMatchByClasses(config.window, ...classMatchers.totalTime) || closestToRegExp(config.window, matchTotalTime).replace('\n', '') || getTimeFromLabelSibling(config.window, 'total'));
          const clipIngredients = async config => format.ingredients(getIngredientsFromSchema(config.window) || getIngredientsFromMicrodata(config.window) || grabLongestMatchByClasses(config.window, ...classMatchers.ingredients)) || format.ingredients(grabByHeaderDOM(config, 1)) || format.ingredients(await grabByMl(config, 1));
          const clipInstructions = async config => format.instructions(getInstructionsFromSchema(config.window) || getInstructionsFromMicrodata(config.window) || grabLongestMatchByClasses(config.window, ...classMatchers.instructions)) || format.instructions(grabByHeaderDOM(config, 2)) || format.instructions(await grabByMl(config, 2));
          const clipNotes = config => format.notes(grabLongestMatchByClasses(config.window, ...classMatchers.notes));

          const clipRecipe = async options => {
            const config = generateConfig(options);
            return {
              imageURL: clipImageURL(config),
              title: clipTitle(config),
              description: clipDescription(config),
              source: clipSource(config),
              yield: clipYield(config),
              activeTime: clipActiveTime(config),
              totalTime: clipTotalTime(config),
              ingredients: await clipIngredients(config),
              instructions: await clipInstructions(config),
              notes: clipNotes(config)
            };
          };

          exports.clipRecipe = clipRecipe;

          Object.defineProperty(exports, '__esModule', { value: true });

        }));
        //# sourceMappingURL=recipe-clipper.umd.js.map


        /***/
      })

    /******/
  });
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
      /******/
    }
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
      /******/
    };
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    const RecipeClipper = __webpack_require__(92);
    var extensionContainerId = "recipeSageBrowserExtensionRootContainer";

    if (window[extensionContainerId]) {
      // Looks like a popup already exists. Try to trigger it
      try {
        if (!document.getElementById(extensionContainerId)) {
          // Element was detached by SPA routing, we must recreate it
          delete window[extensionContainerId];
        } else {
          window.recipeSageBrowserExtensionRootTrigger();
          return;
        }
      } catch (e) {
        // Do nothing
      }
    }
    
    // At this point, we've determined that the popup does not exist

    window[extensionContainerId] = true; // Mark as loading so that we don't create duplicate popups

    console.log("Loading RecipeSage Browser Extension");

      const fetchToken = () => {
        return new Promise((resolve) => {
          chrome.storage.local.get(["token"], (result) => {
            resolve(result.token);
          });
        });
      };

      let shadowRootContainer = document.createElement("div");
      shadowRootContainer.id = extensionContainerId;
      let shadowRoot = shadowRootContainer.attachShadow({ mode: "closed" });
      document.body.appendChild(shadowRootContainer);

      let styles = document.createElement("link");
      styles.href = chrome.runtime.getURL("inject/clipTool.css");
      styles.rel = "stylesheet";
      styles.type = "text/css";
      shadowRoot.appendChild(styles);

      let ionIcons = document.createElement("link");
      ionIcons.href = chrome.runtime.getURL("inject/ionicons.min.css");
      ionIcons.rel = "stylesheet";
      ionIcons.type = "text/css";
      document.head.appendChild(ionIcons);
      shadowRoot.appendChild(ionIcons.cloneNode());

      // Grab our preferences
      chrome.storage.local.get(["disableAutoSnip"], (preferences) => {
        let autoSnipPendingContainer;
        let autoSnipPromise = Promise.resolve();
        if (!preferences.disableAutoSnip) {
          autoSnipPendingContainer = document.createElement("div");
          autoSnipPendingContainer.className = "rs-autoSnipPendingContainer";
          shadowRoot.appendChild(autoSnipPendingContainer);

          let autoSnipPending = document.createElement("div");
          autoSnipPending.className = "autoSnipPending";
          autoSnipPending.innerText = "Grabbing Recipe Content...";
          autoSnipPendingContainer.appendChild(autoSnipPending);

          autoSnipPromise = fetchToken().then((token) => {
            window.RC_ML_CLASSIFY_ENDPOINT =
              "https://api.recipesage.com/proxy/ingredient-instruction-classifier?token=" +
              token;

            return RecipeClipper.clipRecipe().catch(() => {
              alert(
                "Error while attempting to automatically clip recipe from page"
              );
            });
          });
        }

        autoSnipPromise.then((autoSnipResults) => {
          autoSnipResults = autoSnipResults || {};

          if (autoSnipPendingContainer) {
            setTimeout(() => {
              // Timeout so that overlay doesn't flash in the case of instant (local only) autosnip
              shadowRoot.removeChild(autoSnipPendingContainer);
            }, 250);
          }

          let snippersByField = {};

          let container;
          let currentSnip = {
            url: window.location.href,
          };
          if (!preferences.disableAutoSnip)
            currentSnip = { ...currentSnip, ...autoSnipResults };
          let isDirty = false;
          let imageURLInput;

          const savePreferences = (cb) => {
            chrome.storage.local.set(preferences, cb);
          };

          let setField = (field, val) => {
            currentSnip[field] = val;
            isDirty = true;
          };

          let snip = (field, formatCb) => {
            var selectedText = window.getSelection().toString();
            if (formatCb) selectedText = formatCb(selectedText); // Allow for interstitial formatting
            setField(field, selectedText);
            return selectedText;
          };

          let hide = () => {
            isDirty = false;
            if (container) container.style.display = "none";
          };

          let show = () => {
            if (!container) init();
            // Wait for DOM paint
            setTimeout(() => {
              container.style.display = "block";
            });
          };

          let isDragging = false;
          let currentX = 0;
          let currentY = 0;
          let initialX = 0;
          let initialY = 0;
          let xOffset = 0;
          let yOffset = 0;

          let moveTo = (x, y) => {
            container.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          };

          let moveDrag = (e) => {
            if (isDragging) {
              e.preventDefault();
              currentX = e.clientX - initialX;
              currentY = e.clientY - initialY;

              // Prevent dragging the *grab handle* outside the viewport
              // The grab handle is on the left side, so we ensure the left edge
              // of the container stays between 0 and window.innerWidth - 40px (approx handle width).
              // The top of the container must stay >= 0 and <= window.innerHeight - 40px.
              const minDragX = -container.offsetLeft;
              const maxDragX = window.innerWidth - container.offsetLeft - 40;
              const minDragY = -container.offsetTop;
              const maxDragY = window.innerHeight - container.offsetTop - 40;

              if (currentX < minDragX) {
                currentX = minDragX;
              } else if (currentX > maxDragX) {
                currentX = maxDragX;
              }

              if (currentY < minDragY) {
                currentY = minDragY;
              } else if (currentY > maxDragY) {
                currentY = maxDragY;
              }

              xOffset = currentX;
              yOffset = currentY;

              moveTo(currentX, currentY);
            }
          };

          let stopDrag = () => {
            isDragging = false;
            window.removeEventListener("mouseup", stopDrag);
            window.removeEventListener("mousemove", moveDrag);
          };

          let startDrag = (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
            window.addEventListener("mouseup", stopDrag);
            window.addEventListener("mousemove", moveDrag);
          };

          let init = () => {
            container = document.createElement("div");
            container.className = "rs-chrome-container";
            container.style.display = "none";
            shadowRoot.appendChild(container);

            let headline = document.createElement("div");
            headline.className = "headline";
            container.appendChild(headline);

            let leftHeadline = document.createElement("div");
            leftHeadline.className = "headline-left";
            leftHeadline.onmousedown = startDrag;
            headline.appendChild(leftHeadline);

            let moveButton = document.createElement("i");
            moveButton.className = "icon ion-md-move";
            leftHeadline.appendChild(moveButton);

            let logoLink = document.createElement("a");
            logoLink.href = "https://recipesage.com";
            logoLink.onmousedown = (e) => e.stopPropagation();
            leftHeadline.appendChild(logoLink);

            let logo = document.createElement("img");
            logo.src = chrome.runtime.getURL("images/recipesage-black-trimmed.png");
            logo.className = "logo";
            logo.draggable = false;
            logoLink.appendChild(logo);

            let closeButton = document.createElement("button");
            closeButton.innerText = "CLOSE";
            closeButton.onclick = hide;
            closeButton.onmousedown = (e) => e.stopPropagation();
            closeButton.className = "close clear";
            headline.appendChild(closeButton);

            let tipContainer = document.createElement("div");
            tipContainer.className = "tip";
            tipContainer.onmousedown = (e) => e.stopPropagation();
            container.appendChild(tipContainer);

            let tipText = document.createElement("a");
            tipText.innerText = "Open Tutorial";
            tipText.href = "https://docs.recipesage.com";
            tipText.target = "_blank";
            tipContainer.appendChild(tipText);

            let preferencesContainer = document.createElement("div");
            preferencesContainer.className = "preferences-container";
            tipContainer.appendChild(preferencesContainer);

            let autoSnipToggle = document.createElement("input");
            autoSnipToggle.className = "enable-autosnip";
            autoSnipToggle.checked = !preferences.disableAutoSnip;
            autoSnipToggle.type = "checkbox";
            autoSnipToggle.onchange = () => {
              preferences.disableAutoSnip = !autoSnipToggle.checked;
              savePreferences();
              displayAlert(
                "Preferences saved!",
                `Please reload the page for these changes to take effect`,
                4000
              );
            };
            preferencesContainer.appendChild(autoSnipToggle);

            let autoSnipToggleLabel = document.createElement("span");
            autoSnipToggleLabel.innerText = "Enable Auto Field Detection";
            autoSnipToggleLabel.className = "enable-autosnip-label";
            preferencesContainer.appendChild(autoSnipToggleLabel);

            imageURLInput = createSnipper(
              "Image URL",
              "imageURL",
              false,
              currentSnip.imageURL,
              true
            ).input;
            createSnipper("Title", "title", false, currentSnip.title);
            createSnipper(
              "Description",
              "description",
              false,
              currentSnip.description,
              false
            );
            createSnipper("Yield", "yield", false, currentSnip.yield, false);
            createSnipper(
              "Active Time",
              "activeTime",
              false,
              currentSnip.activeTime
            );
            createSnipper("Total Time", "totalTime", false, currentSnip.totalTime);
            createSnipper("Source", "source", false, currentSnip.source);
            createSnipper("Source URL", "url", false, currentSnip.url, true);
            createSnipper(
              "Ingredients",
              "ingredients",
              true,
              currentSnip.ingredients
            );
            createSnipper(
              "Instructions",
              "instructions",
              true,
              currentSnip.instructions
            );
            createSnipper("Notes", "notes", true, currentSnip.notes);

            let translateBtn = document.createElement("button");
            translateBtn.innerText = "Translate to Hebrew";
            translateBtn.onclick = translateRecipe;
            translateBtn.onmousedown = (e) => e.stopPropagation();
            translateBtn.className = "translate";
            container.appendChild(translateBtn);

            let save = document.createElement("button");
            save.innerText = "Save";
            save.onclick = submit;
            save.onmousedown = (e) => e.stopPropagation();
            save.className = "save";
            container.appendChild(save);

            window.addEventListener("beforeunload", function (e) {
              if (!isDirty) return undefined;

              var confirmationMessage = `You've made changes in the RecipeSage editor.
          If you leave before saving, your changes will be lost.`;

              (e || window.event).returnValue = confirmationMessage; //Gecko + IE
              return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
            });
          };

          let createSnipper = (
            title,
            field,
            isTextArea,
            initialValue,
            disableSnip,
            formatCb
          ) => {
            let label = document.createElement("label");
            label.onmousedown = (e) => e.stopPropagation();
            container.appendChild(label);

            if (!disableSnip) {
              let button = document.createElement("button");
              button.className = "icon-button";
              button.onclick = () => {
                input.value = snip(field, formatCb);
              };
              label.appendChild(button);

              let buttonIcon = document.createElement("i");
              buttonIcon.className = "icon ion-md-cut";
              button.appendChild(buttonIcon);
            }

            let input = document.createElement(isTextArea ? "textarea" : "input");
            input.placeholder = title;
            if (initialValue)
              input.value = isTextArea
                ? initialValue
                : initialValue.replace(/\n/g, " ");
            input.oninput = () => {
              setField(field, input.value);
            };
            label.appendChild(input);

            let snipper = {
              input: input,
              label: label,
            };

            snippersByField[field] = snipper;

            return snipper;
          };

          chrome.runtime.onMessage.addListener(function (request) {
            if (request.action === "show") show();
            if (request.action === "hide") hide();
            if (request.action === "snipImage") {
              show();
              imageURLInput.value = request.event.srcUrl;
              setField("imageURL", request.event.srcUrl);
            }
          });

          // =========== Alerts ============

          let alertShadowRootContainer, alertContainer;
          let initAlert = () => {
            alertShadowRootContainer = document.createElement("div");
            let shadowRoot = alertShadowRootContainer.attachShadow({
              mode: "closed",
            });
            document.body.appendChild(alertShadowRootContainer);

            let alertStyles = document.createElement("link");
            alertStyles.href = chrome.runtime.getURL("inject/alert.css");
            alertStyles.rel = "stylesheet";
            alertStyles.type = "text/css";
            shadowRoot.appendChild(alertStyles);

            alertContainer = document.createElement("div");
            alertContainer.className = "alert";
            shadowRoot.appendChild(alertContainer);
          };

          const destroyAlert = () => {
            if (alertShadowRootContainer) {
              document.body.removeChild(alertShadowRootContainer);
            }
            alertShadowRootContainer = null;
            alertContainer = null;
          };

          let alertTimeout;
          let displayAlert = (title, body, hideAfter, bodyLink) => {
            if (alertShadowRootContainer || alertContainer) destroyAlert();

            initAlert();

            let headline = document.createElement("div");
            headline.className = "headline";
            alertContainer.appendChild(headline);

            let alertImg = document.createElement("img");
            alertImg.src = chrome.runtime.getURL(
              "icons/android-chrome-512x512.png"
            );
            headline.appendChild(alertImg);

            let alertTitle = document.createElement("h3");
            alertTitle.innerText = title;
            headline.appendChild(alertTitle);

            let alertBody = document.createElement("span");
            if (!bodyLink) {
              alertBody.innerText = body;
            } else {
              let alertBodyLink = document.createElement("a");
              alertBodyLink.target = "_blank";
              alertBodyLink.href = bodyLink;
              alertBodyLink.innerText = body;
              alertBody.appendChild(alertBodyLink);
            }
            alertContainer.appendChild(alertBody);

            // Wait for DOM paint
            setTimeout(() => {
              alertContainer.style.display = "block";

              if (alertTimeout) clearTimeout(alertTimeout);
              alertTimeout = setTimeout(() => {
                destroyAlert();
              }, hideAfter || 6000);
            });
          };

          let translateRecipe = async (e) => {
            const btn = e.target;
            const originalText = btn.innerText;
            btn.innerText = "Translating...";
            btn.disabled = true;

            const fieldsToTranslate = ["title", "description", "yield", "activeTime", "totalTime", "ingredients", "instructions", "notes"];
            
            for (const field of fieldsToTranslate) {
              const text = currentSnip[field];
              if (!text || text.trim().length === 0) continue;
              
              try {
                const response = await new Promise((resolve, reject) => {
                  chrome.runtime.sendMessage(
                    { type: "TRANSLATE_TEXT", text: text, targetLang: "he" },
                    (res) => {
                      if (res && res.success) {
                        resolve(res.data);
                      } else {
                        reject(new Error(res?.error || "Translation failed"));
                      }
                    }
                  );
                });
                
                if (response && response.translatedText) {
                    currentSnip[field] = response.translatedText;
                    if (snippersByField[field] && snippersByField[field].input) {
                        snippersByField[field].input.value = response.translatedText;
                    }
                }
              } catch (err) {
                console.error("Failed to translate field:", field, err);
              }
            }
            
            isDirty = true;
            btn.innerText = originalText;
            btn.disabled = false;
          };

          let submit = async () => {
            try {
              const token = await fetchToken();

              let imageId;
              if (currentSnip.imageURL) {
                try {
                  const uploadResponse = await new Promise((resolve, reject) => {
                    chrome.runtime.sendMessage(
                      { type: "UPLOAD_IMAGE_FROM_URL", url: currentSnip.imageURL, token: token },
                      (res) => {
                        if (res && res.success) {
                          resolve(res.data);
                        } else {
                          reject(new Error(res?.error || "Image upload failed"));
                        }
                      }
                    );
                  });
                  imageId = uploadResponse.id;
                } catch (e) {
                  console.error("Error creating image", e);
                }
              }

              const { imageURL, ...recipeSnip } = currentSnip;

              const recipeCreateResponse = await new Promise((resolve) => {
                chrome.runtime.sendMessage(
                  {
                    type: "FETCH_API",
                    url: `https://api.recipesage.com/recipes?token=${token}`,
                    options: {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        ...recipeSnip,
                        imageIds: imageId ? [imageId] : [],
                      }),
                    }
                  },
                  (res) => {
                    if (res && res.success) {
                      resolve({ ok: true, json: () => Promise.resolve(res.data) });
                    } else {
                      resolve({ ok: false, status: res?.status || 500 });
                    }
                  }
                );
              });

              if (recipeCreateResponse.ok) {
                recipeCreateResponse.json().then((data) => {
                  hide();
                  displayAlert(
                    `Recipe Saved!`,
                    `Click to open`,
                    4000,
                    `https://recipesage.com/#/recipe/${data.id}`
                  );
                });
              } else {
                switch (recipeCreateResponse.status) {
                  case 401:
                    chrome.storage.local.set({ token: null }, () => {
                      displayAlert(
                        "Please Login",
                        `It looks like you're logged out. Please click the RecipeSage icon to login again.`,
                        4000
                      );
                    });
                    break;
                  case 412:
                    displayAlert(
                      `Could Not Save Recipe`,
                      `A recipe title is required.`,
                      4000
                    );
                    break;
                  case 415:
                    displayAlert(
                      `Could Not Save Recipe`,
                      `We could not fetch the specified image URL. Please try another image URL, or try uploading the image after creating the recipe.`,
                      6000
                    );
                    break;
                  default:
                    displayAlert(
                      "Could Not Save Recipe",
                      "An error occurred while saving the recipe. Please try again.",
                      4000
                    );
                    break;
                }
              }
            } catch (e) {
              displayAlert(
                "Could Not Save Recipe",
                "An error occurred while saving the recipe. Please try again.",
                4000
              );
              console.error(e);
            }
          };

          window.recipeSageBrowserExtensionRootTrigger = show;
          show();
        });
      });
  })();

  /******/
})()
  ;