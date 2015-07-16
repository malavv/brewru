/// <reference path="../../../src/base/polymer.d.ts" />
/// <reference path="../../../src/recipe.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/defs/d3/d3.d.ts" />

class RecipeGraph {
  is:string = 'recipe-graph';
  svg:any;
  shadowRoot: any;

  properties:any = {
    recipe: {
      type: Recipe,
      value: undefined
    }
  }

  ready() {
    bus.suscribe(MessageType.RecipeChanged, this.onRecipeChanged, this);
  }

  onRecipeChanged() {
    this.recipeChanged();
  }

  recipeChanged() {
		if (this.properties.recipe === undefined) return;
	  this.drawReactors();
	}

  drawReactors() {
		this.svg = d3.select(this.shadowRoot).select('svg');
    this.svg.selectAll("*").remove();
		var dataset = this.properties.recipe.reactors;
		var bbox = this.svg.node().getBoundingClientRect();
		var width = bbox.width / dataset.length;
		var height = bbox.height;
		var halfWidth = width / 2.0;

    var reactorGroup = this.svg.selectAll('g')
  		.data(dataset)
  		.enter()
  		.append('g')
  		.attr("transform", function(d:any, i:any) {
  			return 'translate(' + ((i * width) + halfWidth) + ', 30)';
  		});

  	// Draw Line
  	reactorGroup
  		.append("rect")
  		.attr("x", -1.5)
  		.attr('y', 0)
  		.attr('width', 3)
  		.attr('height', height);

  	// Start
  	//this.drawStart(reactorGroup);
    this.properties.recipe.reactors.forEach(this.drawSteps.bind(this, d3, reactorGroup), this);
	}
	drawStart(group:any) {
      	// g.append('circle')
      	// 	.attr('r', '10')
      	// 	.attr('fill', 'white')
      	// 	.attr('stroke', 'black');
		    // g.append('circle')
    		//   .attr('r', '3');
	}
  drawSteps(d3:any, g:any, reactor:any) {
    reactor.steps.forEach(this.drawStep.bind(this, g, 80), this);
  }
  drawStep(g:any, offset:any, step:Step, index:any) {
    switch(step.type.id) {
      case StepType.start.id:
      	g.append('circle')
      		.attr('r', '10')
      		.attr('fill', 'white')
      		.attr('stroke', 'black');
        g.append('text')
          .attr("x", -8)
          .attr("y",  7)
          .attr("font-size", "1.2em")
          .text('\u2605');
        break;
      case StepType.addIngredient.id:
        g.append('circle')
          .attr('r', '10')
          .attr('cy', index * offset)
          .attr('fill', 'white')
          .attr('stroke', 'black');
        g.append('text')
          .attr("x", -5)
          .attr("y", (index * offset) + 5)
          .text('\u2726');
        break;
      case StepType.heating.id:
        g.append('circle')
          .attr('r', '10')
          .attr('cy', index * offset)
          .attr('fill', 'white')
          .attr('stroke', 'black');
        g.append('text')
          .attr("x", -8)
          .attr("y", (index * offset) + 5)
          .text('\ud83d\udd25');
        break;
      default:
        console.log('Unrecognized Step Type', step);
        break;
    }
  }
}