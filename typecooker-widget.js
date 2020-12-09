//Copyright (c) 2015, Erik van Blokland
//All rights reserved.

// Modified by Johannes Ammon for use as iOS widget via scriptable.app
// Version 1.0

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:

// 1. Redistributions of source code must retain the above copyright notice, this
//    list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
// ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// The views and conclusions contained in the software and documentation are those
// of the authors and should not be interpreted as representing official policies,
// either expressed or implied, of the FreeBSD Project.



// Build widget

const refreshHours = 8;

  
const widgetSize = (config.widgetFamily ? config.widgetFamily : 'large');
const widget = await createWidget();


if (!config.runInWidget) {
  switch(widgetSize) {
	case 'small':
	await widget.presentSmall();
	break;

	case 'large':
	await widget.presentLarge();
	break;
	
	default:
	await widget.presentMedium();
  }
}

Script.setWidget(widget);
Script.complete();

async function createWidget() {
	const list = new ListWidget();
	const nextRefresh = Date.now() + (1000*60*60 * refreshHours);
	list.refreshAfterDate = new Date(nextRefresh);
	list.backgroundColor = new Color('#add8e6');
	
	switch(widgetSize) {
		case "medium":
			list.setPadding(20, 20, 20, 20);
			break;
		
		case "large":
			list.setPadding(20, 20, 20, 20);
			break;
		
		default:
	}
	
	const recipe = await getRecipe();
	
	if (widgetSize == 'large') {
		const headLine = ('Your daily TypeCooker recipe:');
		const header = list.addText(headLine);
		header.font = Font.boldSystemFont(14);
		list.addSpacer(20);
	}


	const body = list.addStack();
	body.layoutHorizontally();
	
	

	if (widgetSize == 'small') { // minimal version if small widgetSize
		
		
		bodyColumn = body.addStack();
		bodyColumn.layoutVertically();
		
		bodyColumn.addSpacer();
		
		// set max number of slots
		const maxSlots = 4;
		// set number of ingredients (limited to the available slots)
		let maxIngredients = (recipe.results.length <= maxSlots ? recipe.results.length : maxSlots);
		
		for (let i = 0; i < maxIngredients; i++) {
			const entry = recipe.results[i][0].toString();
			const choice = recipe.results[i][1].toString();
		
			const bodyItem = bodyColumn.addStack();
			bodyItem.layoutVertically();
			bodyItem.setPadding(5, 0, 0, 0);
			
			const entryBox = bodyItem.addStack();
			entryBox.backgroundColor = new Color('#695dad');
			entryBox.setPadding(2, 4, 2, 4);
			
			
			const entryPrint = entryBox.addText(entry.toUpperCase());
			entryPrint.font = Font.italicSystemFont(8);
			entryPrint.textColor = new Color('#ffffff');
			
			
			const choiceBox = bodyItem.addStack();
			choiceBox.backgroundColor = new Color('#d7ecf3');
			//choiceBox.cornerRadius = 3;
			choiceBox.setPadding(2, 4, 2, 4);
			
			const choicePrint = choiceBox.addText(choice.toUpperCase());
			choicePrint.font = Font.boldSystemFont(8);
			choicePrint.textColor = new Color('#485289');
			
		
		}
		
		bodyColumn.addSpacer();
		body.addSpacer();
	} 
	
	else { // for medium and large version do a multi column layout
		
		
		const bodyColumns = [];  
		bodyColumns[0] = body.addStack();
		body.addSpacer(20);
		bodyColumns[1] = body.addStack();
		
		if(widgetSize == 'medium'){
			body.addSpacer();
		}
		
		bodyColumns[0].layoutVertically();
		bodyColumns[1].layoutVertically();
		
		// set max number of slots
		const maxSlots = (widgetSize == 'large' ? 10 : 6);
		// set number of ingredients (limited to the available slots)
		let maxIngredients = (recipe.results.length <= maxSlots ? recipe.results.length : maxSlots);
		
		let col = 0;
		
		
		for (let i = 0; i < maxIngredients; i++) {
			const entry = recipe.results[i][0].toString();
			const choice = recipe.results[i][1].toString();
			
			const bodyItem = bodyColumns[col].addStack(); 
			
			col++;
			if (col > 1) col = 0;
			
			bodyItem.layoutVertically();
			bodyItem.setPadding((widgetSize == 'large' ? 15 : 10), 0, 0, 0);
			
			const bodyItemData = bodyItem.addStack();
			bodyItemData.layoutHorizontally();
			
			
			
			const entryBox = bodyItem.addStack();
			entryBox.backgroundColor = new Color('#695dad');
			entryBox.setPadding(2, 4, 2, 4);
			
			
			const entryPrint = entryBox.addText(entry.toUpperCase());
			entryPrint.font = Font.italicSystemFont(9);
			entryPrint.textColor = new Color('#ffffff');
			
			
			
			const choiceBox = bodyItem.addStack();
			choiceBox.backgroundColor = new Color('#d7ecf3');
			choiceBox.setPadding(2, 4, 2, 4);
			
			const choicePrint = choiceBox.addText(choice.toUpperCase());
			choicePrint.font = Font.boldSystemFont(9);
			choicePrint.textColor = new Color('#485289');
		}
		
	}
	
	list.addSpacer(widgetSize == 'large' ? 20 : 10);
	
	// add a footer in medium and large version 
	
	if (widgetSize == 'large') {
		
	list.addSpacer();
	
	const footer = list.addStack();
	footer.layoutHorizontally();

	const footerDate = footer.addText('Recipe from ' + recipe.date);
	footerDate.font = Font.regularSystemFont(7);

	footer.addSpacer();
	const footerSource = footer.addText('TypeCooker.com');
	footerSource.font = Font.italicSystemFont(7);
	footerSource.url = 'http://typecooker.com';
	}
	
	
	// final return statement
	
	return list;
}


// This is the TypeCooker part – where the magic happens. Thanks, Erik! 

async function getRecipe() {
	
	 const parameterData = {
			  
		  application: [
		  {
			url: 'parameters.html#intendedapplication',
			level: 3,
			name: 'unknown',
			weight: 2,
			description: 'It is not clear how this typeface is to be used.'
		  },
		  {
			url: 'parameters.html#intendedapplication',
			level: 3,
			name: 'multi-purpose',
			weight: 10,
			description: 'This typeface must do well in all sorts of sizes and media.'
		  },
		  {
			url: 'parameters.html#intendedapplication',
			level: 3,
			name: 'newsprint',
			weight: 10,
			description: 'This typeface must work well on rough paper.'
		  },
		  {
			url: 'parameters.html#intendedapplication',
			level: 3,
			name: 'smooth offset printing',
			weight: 10,
			description: 'This typeface must work well on smooth paper.'
		  },
		  {
			url: 'parameters.html#intendedapplication',
			level: 4,
			name: 'engraving',
			weight: 5,
			description: 'This typeface needs to be engraved into something.'
		  },
		  {
			url: 'parameters.html#intendedapplication',
			level: 3,
			name: 'signage',
			weight: 10,
			description: 'This typeface will be used on signage.'
		  },
		  {
			url: 'parameters.html#intendedapplication',
			level: 4,
			name: 'packaging',
			weight: 5,
			description: 'This typeface will be used on packaging.'
		  },
		  {
			url: 'parameters.html#intendedapplication',
			level: 5,
			name: 'subtitles on television',
			weight: 2,
			description: 'This typeface will be used on television.'
		  },
		  {
			url: 'parameters.html#intendedapplication',
			level: 5,
			name: 'antialiased bitmaps',
			weight: 2,
			description: 'This typeface will be used as antialiased bitmaps.'
		  },
		  {
			url: 'parameters.html#intendedapplication',
			level: 5,
			name: 'rubber stamps',
			weight: 2,
			description: 'This typeface will be used on rubber stamps.'
		  }
		  ],
		  weight: [
		  {
			url: 'parameters.html#strokeweight',
			level: 4,
			name: 'hairline',
			weight: 2,
			description: 'All strokes are as thin as possible.'
		  },
		  {
			url: 'parameters.html#strokeweight',
			level: 4,
			name: 'very thin',
			weight: 3,
			description: 'All strokes are very thin.'
		  },
		  {
			url: 'parameters.html#strokeweight',
			level: 3,
			name: 'thin',
			weight: 4,
			description: 'All strokes are thin.'
		  },
		  {
			url: 'parameters.html#strokeweight',
			level: 3,
			name: 'extra light',
			weight: 5,
			description: 'All strokes are light, but not extremely.'
		  },
		  {
			url: 'parameters.html#strokeweight',
			level: 1,
			name: 'light',
			weight: 5,
			description: 'All strokes are light, but not extremely.'
		  },
		  {
			url: 'parameters.html#strokeweight',
			level: 2,
			name: 'book',
			weight: 6,
			description: 'All strokes are such that they\'re readable at arms\' length.'
		  },
		  {
			url: 'parameters.html#strokeweight',
			level: 1,
			name: 'plain',
			weight: 7,
			description: 'All strokes are plain. Not too light, not too heavy.'
		  },
		  {
			url: 'parameters.html#strokeweight',
			level: 3,
			name: 'medium',
			weight: 6,
			description: 'All strokes are heavier than normal, not bold.'
		  },
		  {
			url: 'parameters.html#strokeweight',
			level: 3,
			name: 'semi bold',
			weight: 5,
			description: 'All strokes are heavier than normal, not bold.'
		  },
		  {
			url: 'parameters.html#strokeweight',
			level: 1,
			name: 'bold',
			weight: 4,
			description: 'All strokes are heavy.'
		  },
		  {
			url: 'parameters.html#strokeweight',
			description: 'All strokes are heavier than bold.',
			name: 'extra bold',
			weight: 3,
			level: 3
		  },
		  {
			url: 'parameters.html#strokeweight',
			level: 4,
			name: 'black',
			weight: 2,
			description: 'All strokes are as heavy as they can be.'
		  }
		  ],
		  keys: [
		  'width',
		  'weight',
		  'construction',
		  'stroke endings',
		  'ascender',
		  'descender',
		  'contrast type',
		  'contrast amount',
		  'stems',
		  'application',
		  'size',
		  'special',
		  'also'
		  ],
		  'stroke endings': [
		  {
			url: 'parameters.html#strokeendings',
			level: 1,
			name: 'straight, no serif',
			weight: 10,
			description: 'The strokes do not end in serifs.'
		  },
		  {
			url: 'parameters.html#strokeendings',
			level: 1,
			name: 'serifs',
			weight: 10,
			description: 'The strokes end in serifs.'
		  },
		  {
			url: 'parameters.html#strokeendings',
			level: 3,
			name: 'rounded, no serif',
			weight: 5,
			description: 'The strokes are rounded at the end.'
		  },
		  {
			url: 'parameters.html#strokeendings',
			level: 3,
			name: 'bracketed serif',
			weight: 5,
			description: 'The strokes end in bracketed serifs.'
		  },
		  {
			url: 'parameters.html#strokeendings',
			level: 4,
			name: 'asymmetric serif',
			weight: 5,
			description: 'The strokes end in asymmetric serifs.'
		  },
		  {
			url: 'parameters.html#strokeendings',
			level: 4,
			name: 'wedge serif',
			weight: 10,
			description: 'The strokes end in triangular serifs.'
		  },
		  {
			url: 'parameters.html#strokeendings',
			level: 3,
			name: 'slab serif',
			weight: 5,
			description: 'The strokes end in rectangular serifs.'
		  }
		  ],
		  ascender: [
		  {
			url: 'parameters.html#ascender',
			level: 3,
			name: 'longer than normal',
			weight: 5,
			description: 'The ascenders should be longer than normal. But what is normal?'
		  },
		  {
			url: 'parameters.html#ascender',
			level: 3,
			name: 'shorter than normal',
			weight: 5,
			description: 'The ascenders should be shorter than normal. But what is normal?'
		  },
		  {
			url: 'parameters.html#ascender',
			level: 4,
			name: 'much shorter than normal',
			weight: 2,
			description: 'The ascenders should be much shorter than normal. But what is normal?'
		  },
		  {
			url: 'parameters.html#ascender',
			level: 4,
			name: 'much longer than normal',
			weight: 2,
			description: 'The ascenders should be much longer than normal. But what is normal?'
		  },
		  {
			url: 'parameters.html#ascender',
			level: 5,
			name: 'none at all',
			weight: 1,
			description: 'There is no room for ascenders.'
		  }
		  ],
		  construction: [
		  {
			url: 'parameters.html#construction',
			level: 1,
			name: 'roman',
			weight: 10,
			description: 'Construct the letters as lowercase romans.'
		  },
		  {
			url: 'parameters.html#construction',
			level: 1,
			name: 'capitals',
			weight: 10,
			description: 'Construct the letters as capitals.'
		  },
		  {
			url: 'parameters.html#construction',
			level: 2,
			name: 'italic',
			weight: 10,
			description: 'Construct the letters as cursive italics.'
		  },
		  {
			url: 'parameters.html#construction',
			level: 4,
			name: 'caps and smallcaps',
			weight: 2,
			description: 'Construct the letters with an initial capital, then followed by smallcaps.'
		  },
		  {
			url: 'parameters.html#construction',
			level: 3,
			name: 'roman + capitals',
			weight: 5,
			description: 'Construct the letters with an initial capital, then followed by lowercase roman.'
		  },
		  {
			url: 'parameters.html#construction',
			level: 3,
			name: 'italic + capitals',
			weight: 5,
			description: 'Construct the letters with an initial capital, then followed by lowercase italic.'
		  },
		  {
			url: 'parameters.html#construction',
			level: 3,
			name: 'proportional oldstyle figures',
			weight: 2,
			description: 'Old style (non-lining) figures with proportional widths.'
		  },
		  {
			url: 'parameters.html#construction',
			level: 3,
			name: 'tabular oldstyle figures',
			weight: 2,
			description: 'Old style (non-lining) figures with tabular widths.'
		  },
		  {
			url: 'parameters.html#construction',
			level: 3,
			name: 'proportional lining figures',
			weight: 2,
			description: 'Lining figures with proportional widths.'
		  },
		  {
			url: 'parameters.html#construction',
			level: 3,
			name: 'tabular lining figures',
			weight: 2,
			description: 'Lining figures with tabular widths.'
		  },
		  {
			url: 'parameters.html#construction',
			level: 3,
			name: 'smallcaps figures',
			weight: 2,
			description: 'Figures fitting to smallcap size. Add a regular capital to get a sense of the proportions.'
		  }
		  ],
		  stems: [
		  {
			url: 'parameters.html#stems',
			level: 3,
			name: 'straight',
			weight: 10,
			description: 'The stems are perfectly straight.'
		  },
		  {
			url: 'parameters.html#stems',
			level: 3,
			name: 'slightly concave',
			weight: 10,
			description: 'The stems are slightly curved inward. Reversed entasis.'
		  },
		  {
			url: 'parameters.html#stems',
			level: 4,
			name: 'visibly concave',
			weight: 10,
			description: 'The stems are visibly curved inward. Reversed entasis.'
		  },
		  {
			url: 'parameters.html#stems',
			level: 4,
			name: 'flaring',
			weight: 10,
			description: 'The stems are very much curved inward. Might involve serifs.'
		  },
		  {
			url: 'parameters.html#stems',
			level: 5,
			name: 'convex',
			weight: 2,
			description: 'The stems are very much curved outward. Entasis.'
		  }
		  ],
		  special: [
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'only straight lines',
			weight: 5,
			description: 'Use no curves. Curves are overrated.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'curves as octagonals',
			weight: 5,
			description: 'Eight segments to make an oval.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'rough contours',
			weight: 2,
			description: 'The contours are rought. Should not be that difficult.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'casual',
			weight: 2,
			description: 'Displays a casual approach to construction and finish.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'sketchy',
			weight: 2,
			description: 'Letters appear sketchy.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'cut as a stencil',
			weight: 5,
			description: 'Make sure the contours do not drop out.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'at least 1 ligature',
			weight: 8,
			description: 'Two letters must form a ligature.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'at least 2 ligatures',
			weight: 8,
			description: 'Two pairs of letters must form a ligature.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'inktraps for white corners',
			weight: 4,
			description: 'Open sharp white corners a bit.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'inktraps for black corners',
			weight: 4,
			description: 'Prevent sharp black corners from rounding.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'initial and final swashes',
			weight: 5,
			description: 'Add unnecessary but pretty frivolities to first and last letters.'
		  }
		  ],
		  'contrast type': [
		  {
			url: 'parameters.html#contrasttype',
			level: 2,
			name: 'translation',
			weight: 5,
			description: 'The contrast produced by a broad nib pen.'
		  },
		  {
			url: 'parameters.html#contrasttype',
			level: 2,
			name: 'expansion',
			weight: 5,
			description: 'The contrast produced by a flexible or pointed nib pen.'
		  },
		  {
			url: 'parameters.html#contrasttype',
			level: 4,
			name: 'transitional',
			weight: 5,
			description: 'A historical mix of broad nib and pointed nib influences.'
		  },
		  {
			url: 'parameters.html#contrasttype',
			level: 4,
			name: 'between translation and transitional',
			weight: 5,
			description: 'A historical mix of broad nib and pointed nib influences.'
		  },
		  {
			url: 'parameters.html#contrasttype',
			level: 4,
			name: 'between expansion and transitional',
			weight: 5,
			description: 'A historical mix of broad nib and pointed nib influences.'
		  },
		  {
			url: 'parameters.html#contrasttype',
			level: 4,
			name: 'speedball',
			weight: 2,
			description: 'Very low contrast as produced by the Speedball pen.'
		  },
		  {
			url: 'parameters.html#contrasttype',
			level: 4,
			name: 'brush',
			weight: 2,
			description: 'Largely translation, but incorporating rotation and pressure.'
		  },
		  {
			url: 'parameters.html#contrasttype',
			level: 5,
			name: 'can\'t be determined',
			weight: 2,
			description: 'The contrast is rather difficult to identify. That does not mean is has no contrast!'
		  }
		  ],
		  also: [
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'as a bold',
			weight: 2,
			description: 'As defined by the other parameters, but then also some letters as a bold.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'as a hairline',
			weight: 2,
			description: 'As defined by the other parameters, but then also some letters as a hairline.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'as a black',
			weight: 2,
			description: 'As defined by the other parameters, but then also some letters as a black.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'as reversed contrast',
			weight: 1,
			description: 'As defined by the other parameters, but then also some letters with reversed contrast.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'as an italic',
			weight: 1,
			description: 'As defined by the other parameters, but then also some italic letters.'
		  },
		  {
			url: 'parameters.html#special',
			level: 4,
			name: 'with some smallcaps',
			weight: 1,
			description: 'As defined by the other parameters, but then also some smallcaps.'
		  }
		  ],
		  descender: [
		  {
			url: 'parameters.html#descender',
			level: 3,
			name: 'longer than normal',
			weight: 5,
			description: 'The descenders should be longer than normal. But what is normal?'
		  },
		  {
			url: 'parameters.html#descender',
			level: 3,
			name: 'shorter than normal',
			weight: 5,
			description: 'The descenders should be shorter than normal. But what is normal?'
		  },
		  {
			url: 'parameters.html#descender',
			level: 4,
			name: 'much shorter than normal',
			weight: 2,
			description: 'The descenders should be much shorter than normal. But what is normal?'
		  },
		  {
			url: 'parameters.html#descender',
			level: 5,
			name: 'none',
			weight: 1,
			description: 'There is no room for descenders.'
		  }
		  ],
		  'contrast amount': [
		  {
			url: 'parameters.html#contrastamount',
			level: 5,
			name: 'inverted',
			weight: 10,
			description: 'Thicks are thins and thins are thick.'
		  },
		  {
			url: 'parameters.html#contrastamount',
			level: 5,
			name: 'slightly inverted',
			weight: 10,
			description: 'Thicks are thins and thins are thick. But try to be subtle.'
		  },
		  {
			url: 'parameters.html#contrastamount',
			level: 4,
			name: 'no contrast at all',
			weight: 10,
			description: 'Thick equals thin. There is no contrast, even when you really need it.'
		  },
		  {
			url: 'parameters.html#contrastamount',
			level: 3,
			name: 'not visible',
			weight: 10,
			description: 'Thick looks like thin. There appears to be no contrast.'
		  },
		  {
			url: 'parameters.html#contrastamount',
			level: 3,
			name: 'very low',
			weight: 10,
			description: 'Thicks are similar to thins.'
		  },
		  {
			url: 'parameters.html#contrastamount',
			level: 1,
			name: 'low',
			weight: 10,
			description: 'Thicks are similar to thins.'
		  },
		  {
			url: 'parameters.html#contrastamount',
			level: 1,
			name: 'some',
			weight: 10,
			description: 'Thicks are similar to thins but you can tell the difference.'
		  },
		  {
			url: 'parameters.html#contrastamount',
			level: 2,
			name: 'visible',
			weight: 10,
			description: 'Thicks are visibly thicker than the thins.'
		  },
		  {
			url: 'parameters.html#contrastamount',
			level: 2,
			name: 'quite some contrast',
			weight: 10,
			description: 'Thicks are visibly thicker than the thins.'
		  },
		  {
			url: 'parameters.html#contrastamount',
			level: 1,
			name: 'a lot',
			weight: 10,
			description: 'Thicks are a lot thicker than the thins.'
		  },
		  {
			url: 'parameters.html#contrastamount',
			level: 2,
			name: 'high',
			weight: 10,
			description: 'A lot of difference between the thicks and the thins.'
		  },
		  {
			url: 'parameters.html#contrastamount',
			level: 4,
			name: 'very high',
			weight: 10,
			description: 'A lot of difference between the thicks and the thins.'
		  },
		  {
			url: 'parameters.html#contrastamount',
			level: 5,
			name: 'extreme',
			weight: 10,
			description: 'The thicks and thins are as different as you can make them.'
		  }
		  ],
		  width: [
		  {
			url: 'parameters.html#width',
			level: 4,
			name: 'compressed',
			weight: 2,
			description: 'The overall width is as small as possible.'
		  },
		  {
			url: 'parameters.html#width',
			level: 3,
			name: 'extra condensed',
			weight: 3,
			description: 'The overall width is really small, almost no room for counters.'
		  },
		  {
			level: 2,
			name: 'condensed',
			weight: 3,
			description: 'The overall width is small, but not uncomfortably so.'
		  },
		  {
			url: 'parameters.html#width',
			level: 1,
			name: 'narrow',
			weight: 4,
			description: 'Not much overall width.'
		  },
		  {
			url: 'parameters.html#width',
			level: 1,
			name: 'normal',
			weight: 5,
			description: 'A normal width.'
		  },
		  {
			url: 'parameters.html#width',
			level: 1,
			name: 'extended',
			weight: 4,
			description: 'The overall width is larger than normal. (But what is normal)'
		  },
		  {
			url: 'parameters.html#width',
			level: 2,
			name: 'wide',
			weight: 3,
			description: 'The overall width is definitely wide.'
		  },
		  {
			url: 'parameters.html#width',
			level: 2,
			name: 'very wide',
			weight: 2,
			description: 'The overall width is very large.'
		  },
		  {
			url: 'parameters.html#width',
			level: 3,
			name: 'extremely wide',
			weight: 1,
			description: 'Draw something really wide. Then make it twice as wide again.'
		  },
		  {
			url: 'parameters.html#width',
			level: 4,
			name: 'monospaced',
			weight: 2,
			description: 'All letters have the same width'
		  },
		  {
			url: 'parameters.html#width',
			level: 4,
			name: 'monospaced condensed',
			weight: 2,
			description: 'All letters have the same, narrow, width'
		  }
		  ],
		  size: [
		  {
			url: 'parameters.html#intendedsize',
			level: 4,
			name: 'agate',
			weight: 2,
			description: 'Really small, really legible.'
		  },
		  {
			url: 'parameters.html#intendedsize',
			level: 4,
			name: 'reading',
			weight: 4,
			description: 'Really legible at arms length.'
		  },
		  {
			url: 'parameters.html#intendedsize',
			level: 4,
			name: 'phone reading',
			weight: 8,
			description: 'Anticipating contemporary web design, the type will be too small. Can the font help?'
		  },
		  {
			url: 'parameters.html#intendedsize',
			level: 4,
			name: 'laptop reading',
			weight: 8,
			description: 'Reading continuous text on a laptop screen.'
		  },
		  {
			url: 'parameters.html#intendedsize',
			level: 4,
			name: 'wall television reading',
			weight: 8,
			description: 'Reading text on a wall mounted television.'
		  },
		  {
			url: 'parameters.html#intendedsize',
			level: 4,
			name: 'very large sizes',
			weight: 4,
			description: 'Huge text on a wall.'
		  },
		  {
			url: 'parameters.html#intendedsize',
			level: 4,
			name: 'most sizes',
			weight: 4,
			description: 'Can\'t be too specialised, it has to work well on a range of sizes.'
		  }
		  ],
		  variable: [
		  {
			url: 'parameters.html#variable',
			level: 4,
			name: 'make width axis variations',
			weight: 2,
			description: 'Draw wider and narrower variations.'
		  },
		  {
			url: 'parameters.html#variable',
			level: 4,
			name: 'make weight axis variations',
			weight: 2,
			description: 'Draw lighter and heavier variations.'
		  },
		  {
			url: 'parameters.html#variable',
			level: 4,
			name: 'make optical axis variations',
			weight: 2,
			description: 'Draw variations for normal and smaller sizes.'
		  },
		  {
			url: 'parameters.html#variable',
			level: 5,
			name: 'make optical axis variations',
			weight: 2,
			description: 'Draw variations for normal and larger sizes.'
		  },
		  {
			url: 'parameters.html#variable',
			level: 5,
			name: 'make optical axis variations',
			weight: 2,
			description: 'Draw variations for smaller and larger sizes.'
		  }
		  ]
	  };
	  

	// set selectionLevel depending on widget size
	
	let selectionLevel = 2;
	
	switch (widgetSize) {
		case 'small':
			selectionLevel = 1;
			break;
		case 'medium':
			selectionLevel = 2;
			break;
		case 'large':
			selectionLevel = 3;
			break;
		default:
			selectionLevel = 2;
	}

	

	let data = {};
	let current = {}; // holds the generated parameter - value pairs
	
	
	
	// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	function shuffle(array) {
	  let currentIndex = array.length, temporaryValue, randomIndex ;
	
	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {
	
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
	
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	  }
	  return array;
	}
		
	//http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			res = regex.exec(location.search);
		return res === null ? 2 : decodeURIComponent(res[1].replace(/\+/g, " "));
	}
	
	// json loaded and no url has provided, make a new randomized selection
	function makeSelection(level, data){
		
		const selectedItems = [];
		let parameterNames = [];
		for(let key in data){
			parameterNames.push(key);
		}	
	
		parameterNames = shuffle(parameterNames);
		var finalRecipe = [];
	
		for(let i=0;i<parameterNames.length;i++){
		const thisName = parameterNames[i];
		const optionsForThisName = [];
		const obj = data[thisName];
		
		for(let j=0;j<obj.length;j++){
			const b = obj[j];
			if(b.level>level){
				// above our pay grade, skip.
				continue;
			}
			for(let t=0;t<=b.weight;t++){
				// add this option according to weight
				optionsForThisName.push(b);
			}
		}
		if(optionsForThisName.length>0){
			const selection = optionsForThisName[Math.floor(Math.random()*optionsForThisName.length)];
			const pair = [[thisName],[selection.name]] 
			finalRecipe.push(pair);
			current[thisName] = selection.name;
		}
		}
		return finalRecipe;
	}
	

	const results = makeSelection(selectionLevel, parameterData);
	const lastResfreshDate = new Date();
	
	return {
	  "date": lastResfreshDate.toLocaleDateString("de-DE") + " – " + lastResfreshDate.getHours() + ":" + lastResfreshDate.getMinutes(),
	  "results": results,
	}

}



