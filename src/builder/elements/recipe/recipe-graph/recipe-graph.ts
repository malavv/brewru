/// <reference path="../../../lib/d3/d3.d.ts" />
/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

/** Draws the diagram of the reactor's step. */
class RecipeGraph extends Polymer.DomModule {
  private static vMargin : number = 15;
  private static minStepsHeight : number = 10;

  /** Space between node on the diagram. */
  private _verticalOffset : number;
  /** Space between reactors line on the diagram. */
  private _horizontalOffset : number;

  private recipe: Recipe;
  private svg: any;
  private size: { width:number; height:number };

  // Lifecycles
  private ready() {
    this.size = {width:-1, height:-1}
    bus.suscribe(MessageType.RecipeChanged, this.recipeChanged, this);
  }

  private attached() {
     this.async(() => {
       this.svg = d3.select(this.$$('svg'));
       this.onResize();
     }, 1);
  }

  // Events
  private recipeChanged() {
		if (this.recipe === undefined || this.svg === undefined) return;
    // Remove old
    this.svg.selectAll("*").remove();
	  this._drawReactors();
	}

  private onResize() {
    if (this.svg === undefined) return; // Not yet loaded.

    this._updateSize();
    this._verticalOffset = this.size.height / Math.max(this._getMaxNumberOfSteps(), RecipeGraph.minStepsHeight);
    this._horizontalOffset = this.size.width / this.recipe.reactors.length;

    if (this.size.width === 0) return; // Switched out of view.
    // Remove old
    this.svg.selectAll("*").remove();
    // Redraw
    this._drawReactors();
  }

  private _drawReactors() {
    if (this.svg === undefined)
      return;

    var reactorGroup = this.svg.selectAll('g')
  		.data(this.recipe.reactors)
  		.enter()
  		.append('g')
      .attr("transform", (d:any, idx:number) => {
        return 'translate(' + ((idx * this._horizontalOffset) + this._horizontalOffset / 2.0) + ', 0)';
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
          var stepGroup = reactorGroup.append('g')
            .classed('step', true)
            .attr("transform", 'translate(0, ' + idx * this._verticalOffset + ')');
          this._drawStep(step, stepGroup);
        });
      });
	}

  private _drawStep(step:Step, g:any) {
    switch(step.type.ref) {
      case StepType.start.ref: return this._drawStart(g);
      case StepType.addIngredient.ref: return this._drawIngredient(step, g);
      case StepType.heating.ref: return this._drawHeating(step, g);
      default:
        console.log('Unrecognized Step Type', step);
        break;
    }
  }

  private _drawStart(group:any) {
  	group.append('circle')
  		.attr('r', '10')
      .attr('cy', 10)
  		.attr('fill', 'white')
  		.attr('stroke', 'black');
    group.append('text')
      .attr("x", -8)
      .attr("y",  16)
      .attr("font-size", "1.2em")
      .text('\u2605');
  }

  private _drawIngredient(step:Step, g:any) {
    g.append('circle')
      .attr('r', '10')
      .attr('fill', 'white')
      .attr('stroke', 'black');
    g.append('text')
      .attr("x", -6)
      .attr("y", 6)
      .text('\u2726');

    g.on('mouseover', function(d:any) { d3.select(this).select('.bubble').style({opacity:'1'}); });
    this._drawBubble(g, step.name);
  }

  private _drawBubble(g: any, txt: string) {
    var bubbleGroup = g.append('g')
      .classed('bubble', true)
      .style("opacity", 0);
    bubbleGroup.append('rect')
      .attr("x", -this.size.width / 2)
      .attr("y", - 15 / 2)
  		.attr('width', this.size.width)
  		.attr('height', 15)
      .attr("fill", '#dfdfdf')
      .style("text-anchor", "middle");
    bubbleGroup.append('text')
      .attr("y", 5)
      .style("text-anchor", "middle")
      .text(txt);
     bubbleGroup.on('mouseout', function(d:any) {
       d3.select(this).style({opacity:'0.0',})
     });
  }

  private _drawHeating(step:Step, g:any) {
    g.append('circle')
      .attr('r', '10')
      .attr('fill', 'white')
      .attr('stroke', 'black');
    g.append('text')
      .attr("x", -8)
      .attr("y", 5)
      .text('\ud83d\udd25');

    g.on('mouseover', function(d:any) { d3.select(this).select('.bubble').style({opacity:'1'}); });
    this._drawBubble(g, step.name);
  }

  private _getMaxNumberOfSteps() : number {
    return Math.max.apply(null, this.recipe.reactors.map(r => r.steps.length));
  }

  private _updateSize() {
    var bbox = this.$$('svg').getBoundingClientRect();
    this.size.width = bbox.width;
    this.size.height = bbox.height - RecipeGraph.vMargin * 2;
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