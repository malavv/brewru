/// <reference path="../../../src/defs/d3/d3.d.ts" />
/// <reference path="../../../src/defs/polymer/polymer.ts" />

/// <reference path="../../../src/recipe.ts" />
/// <reference path="../../../src/base/eventBus.ts" />


class RecipeGraph extends Polymer.DomModule {
  recipe:Recipe;
  svg:any;
  size:{width:number; height:number};
  reactorWidth:number;
  nodeOffset:number;
  vMargin:number;

  // Lifecycles
  ready() {
    this.nodeOffset = 80;
    this.vMargin = 30;
    this.size = {width:-1, height:-1}
    bus.suscribe(MessageType.RecipeChanged, this.recipeChanged, this);
  }

  attached() {
     this.async(() => {
       this.svg = d3.select(this.$$('svg'));
       this.onResize();
     }, 1);
  }

  // Events
  recipeChanged() {
		if (this.recipe === undefined) return;
	  this.drawReactors();
	}

  // on iron-resize
  onResize() {
    if (this.svg === undefined) return;
    var bbox = this.$$('svg').getBoundingClientRect();
    this.size.width = bbox.width;
    this.size.height = bbox.height - this.vMargin * 2;
    this.reactorWidth = bbox.width / this.recipe.reactors.length;
    // Remove old
    this.svg.selectAll("*").remove();
    // Redraw
    this.drawReactors();
  }

  // Methods
  drawReactors() {
    if (this.svg === undefined)
      return;

    var reactorGroup = this.svg.selectAll('g')
  		.data(this.recipe.reactors)
  		.enter()
  		.append('g')
      .attr("transform", (d:any, idx:number) => {
        return 'translate(' + ((idx * this.reactorWidth) + this.reactorWidth / 2.0) + ', 0)';
      });

  	// Start
    this.recipe.reactors
      .forEach((reactor) => {
      	reactorGroup
      		.append("rect")
      		.attr("x", -1.5)
      		.attr('y', 0)
      		.attr('width', 3)
      		.attr('height', this.size.height);

        reactor.steps.forEach((step, idx) => {
          switch(step.type.id) {
            case StepType.start.id: return this.drawStart(reactorGroup);
            case StepType.addIngredient.id: return this.drawIngredient(step, reactorGroup, idx * this.nodeOffset);
            case StepType.heating.id: return this.drawHeating(step, reactorGroup, idx * this.nodeOffset);
            default:
              console.log('Unrecognized Step Type', step);
              break;
          }
        });
      });
	}

  drawStart(g:any) {
  	g.append('circle')
  		.attr('r', '10')
  		.attr('fill', 'white')
  		.attr('stroke', 'black');
    g.append('text')
      .attr("x", -8)
      .attr("y",  7)
      .attr("font-size", "1.2em")
      .text('\u2605');
  }

  drawIngredient(step:Step, g:any, localOffset:number) {
    g.append('circle')
      .attr('r', '10')
      .attr('cy', localOffset)
      .attr('fill', 'white')
      .attr('stroke', 'black');
    g.append('text')
      .attr("x", -5)
      .attr("y", localOffset + 5)
      .text('\u2726');
  }

  drawHeating(step:Step, g:any, localOffset:number) {
    g.append('circle')
      .attr('r', '10')
      .attr('cy', localOffset)
      .attr('fill', 'white')
      .attr('stroke', 'black');
    g.append('text')
      .attr("x", -8)
      .attr("y", localOffset + 5)
      .text('\ud83d\udd25');
  }

  drawStep(g:any, offset:number, step:Step, index:number) {
    switch(step.type.id) {
      case StepType.start.id: return this.drawStart(g);
      case StepType.addIngredient.id: return this.drawIngredient(step, g, index * offset);
      case StepType.heating.id: return this.drawHeating(step, g, index * offset);
      default:
        console.log('Unrecognized Step Type', step);
        break;
    }
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeGraph.prototype, {
  is: 'recipe-graph',

  properties: {
    recipe: {
      type: Recipe,
      observer: 'recipeChanged'
    },
    size: Object
  },
  behaviors: [
    Polymer.IronResizableBehavior
  ],
  listeners: {
    'iron-resize': 'onResize'
  }
}));