/// <reference path="../../../lib/d3/d3.d.ts" />
/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/** Draws the diagram of the reactor's step. */
var RecipeGraph = (function (_super) {
    __extends(RecipeGraph, _super);
    function RecipeGraph() {
        _super.apply(this, arguments);
    }
    // Lifecycles
    RecipeGraph.prototype.ready = function () {
        this.size = { width: -1, height: -1 };
        bus.suscribe(MessageType.RecipeChanged, this.recipeChanged, this);
    };
    RecipeGraph.prototype.attached = function () {
        var _this = this;
        this.async(function () {
            _this.svg = d3.select(_this.$$('svg'));
            _this.onResize();
        }, 1);
    };
    // Events
    RecipeGraph.prototype.recipeChanged = function () {
        if (this.recipe === undefined || this.svg === undefined)
            return;
        // Remove old
        this.svg.selectAll("*").remove();
        this._drawReactors();
    };
    RecipeGraph.prototype.onResize = function () {
        if (this.svg === undefined)
            return; // Not yet loaded.
        this._updateSize();
        this._verticalOffset = this.size.height / Math.max(this._getMaxNumberOfSteps(), RecipeGraph.minStepsHeight);
        this._horizontalOffset = this.size.width / this.recipe.reactors.length;
        if (this.size.width === 0)
            return; // Switched out of view.
        // Remove old
        this.svg.selectAll("*").remove();
        // Redraw
        this._drawReactors();
    };
    RecipeGraph.prototype._drawReactors = function () {
        var _this = this;
        if (this.svg === undefined)
            return;
        var reactorGroup = this.svg.selectAll('g')
            .data(this.recipe.reactors)
            .enter()
            .append('g')
            .attr("transform", function (d, idx) {
            return 'translate(' + ((idx * _this._horizontalOffset) + _this._horizontalOffset / 2.0) + ', 0)';
        });
        // Start
        this.recipe.reactors
            .forEach(function (reactor) {
            reactorGroup
                .append("rect")
                .attr("x", -1.5)
                .attr('y', 0)
                .attr('width', 3)
                .attr('height', _this.size.height);
            reactor.steps.forEach(function (step, idx) {
                var stepGroup = reactorGroup.append('g')
                    .classed('step', true)
                    .attr("transform", 'translate(0, ' + idx * _this._verticalOffset + ')');
                _this._drawStep(step, stepGroup);
            });
        });
    };
    RecipeGraph.prototype._drawStep = function (step, g) {
        switch (step.type.ref) {
            case StepType.start.ref: return this._drawStart(g);
            case StepType.addIngredient.ref: return this._drawIngredient(step, g);
            case StepType.heating.ref: return this._drawHeating(step, g);
            default:
                console.log('Unrecognized Step Type', step);
                break;
        }
    };
    RecipeGraph.prototype._drawStart = function (group) {
        group.append('circle')
            .attr('r', '10')
            .attr('cy', 10)
            .attr('fill', 'white')
            .attr('stroke', 'black');
        group.append('text')
            .attr("x", -8)
            .attr("y", 16)
            .attr("font-size", "1.2em")
            .text('\u2605');
    };
    RecipeGraph.prototype._drawIngredient = function (step, g) {
        g.append('circle')
            .attr('r', '10')
            .attr('fill', 'white')
            .attr('stroke', 'black');
        g.append('text')
            .attr("x", -6)
            .attr("y", 6)
            .text('\u2726');
        g.on('mouseover', function (d) { d3.select(this).select('.bubble').style({ opacity: '1' }); });
        this._drawBubble(g, step.name);
    };
    RecipeGraph.prototype._drawBubble = function (g, txt) {
        var bubbleGroup = g.append('g')
            .classed('bubble', true)
            .style("opacity", 0);
        bubbleGroup.append('rect')
            .attr("x", -this.size.width / 2)
            .attr("y", -15 / 2)
            .attr('width', this.size.width)
            .attr('height', 15)
            .attr("fill", '#dfdfdf')
            .style("text-anchor", "middle");
        bubbleGroup.append('text')
            .attr("y", 5)
            .style("text-anchor", "middle")
            .text(txt);
        bubbleGroup.on('mouseout', function (d) {
            d3.select(this).style({ opacity: '0.0', });
        });
    };
    RecipeGraph.prototype._drawHeating = function (step, g) {
        g.append('circle')
            .attr('r', '10')
            .attr('fill', 'white')
            .attr('stroke', 'black');
        g.append('text')
            .attr("x", -8)
            .attr("y", 5)
            .text('\ud83d\udd25');
        g.on('mouseover', function (d) { d3.select(this).select('.bubble').style({ opacity: '1' }); });
        this._drawBubble(g, step.name);
    };
    RecipeGraph.prototype._getMaxNumberOfSteps = function () {
        return Math.max.apply(null, this.recipe.reactors.map(function (r) { return r.steps.length; }));
    };
    RecipeGraph.prototype._updateSize = function () {
        var bbox = this.$$('svg').getBoundingClientRect();
        this.size.width = bbox.width;
        this.size.height = bbox.height - RecipeGraph.vMargin * 2;
    };
    RecipeGraph.vMargin = 15;
    RecipeGraph.minStepsHeight = 10;
    return RecipeGraph;
})(Polymer.DomModule);
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
