/// <reference path="../../../src/recipe.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
/// <reference path="../../../src/d3.d.ts" />

var Polymer:Function = Polymer || function () {}

class RecipeGraph {
  
  recipe: Recipe;
  svg: ID3Selection;
  shadowRoot: any;
  
  ready() {
    bus.suscribe(MessageType.RecipeChanged, this.onRecipeChanged, this);
  }
  
  onRecipeChanged(data) {
    this.recipeChanged();
    console.log('onRecipeChanged');
  }
  
  recipeChanged() {
		if (this.recipe === undefined) return;
	  this.drawReactors.bind(this);
	}
  
  drawReactors(d3) {
		this.svg = d3.select(this.shadowRoot).select('svg');
    this.svg.selectAll("*").remove();
		var dataset = this.recipe.reactors;
		var bbox = this.svg.node().getBoundingClientRect();
		var width = bbox.width / dataset.length;
		var height = bbox.height;
		var halfWidth = width / 2.0;

    var reactorGroup = this.svg.selectAll('g')
  		.data(dataset)
  		.enter()
  		.append('g')
  		.attr("transform", function(d, i) {
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
  	this.drawStart(d3, reactorGroup);
    this.recipe.reactors.forEach(this.drawSteps.bind(this, d3, reactorGroup), this);
	}
	drawStart(d3, group) {
		group.append('circle')
    		.attr('r', '10')
    		.attr('fill', 'white')
    		.attr('stroke', 'black');
		group.append('circle')
    		.attr('r', '3');
	}
  drawSteps(d3, g, reactor) {
    reactor.steps.forEach(this.drawStep.bind(this, g, 80), this);
  }
  drawStep(g, offset, step, index) {
    switch(step.type) {
      case 'start':
        break;
      case 'Add Ingredient':
        g.append('circle')
          .attr('r', '10')
          .attr('cy', index * offset)
          .attr('fill', 'white')
          .attr('stroke', 'black');
        g.append('text')
          .attr("x", -5)
          .attr("y", (index * offset) + 5)
          .text('+');
        break;
      default:
        console.log('Unrecognized Step Type', step);
        break;
    }
  }
}

Polymer(RecipeGraph.prototype);