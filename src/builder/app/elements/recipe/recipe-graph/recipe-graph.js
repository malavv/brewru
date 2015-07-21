/// <reference path="../../../src/defs/d3/d3.d.ts" />
/// <reference path="../../../src/defs/polymer/polymer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../../src/recipe.ts" />
/// <reference path="../../../src/base/eventBus.ts" />
var RecipeGraph = (function (_super) {
    __extends(RecipeGraph, _super);
    function RecipeGraph() {
        _super.apply(this, arguments);
    }
    // Lifecycles
    RecipeGraph.prototype.ready = function () {
        this.nodeOffset = 80;
        this.vMargin = 30;
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
        if (this.recipe === undefined)
            return;
        this.drawReactors();
    };
    // on iron-resize
    RecipeGraph.prototype.onResize = function () {
        if (this.svg === undefined)
            return;
        var bbox = this.$$('svg').getBoundingClientRect();
        this.size.width = bbox.width;
        this.size.height = bbox.height - this.vMargin * 2;
        this.reactorWidth = bbox.width / this.recipe.reactors.length;
        // Remove old
        this.svg.selectAll("*").remove();
        // Redraw
        this.drawReactors();
    };
    // Methods
    RecipeGraph.prototype.drawReactors = function () {
        var _this = this;
        if (this.svg === undefined)
            return;
        var reactorGroup = this.svg.selectAll('g')
            .data(this.recipe.reactors)
            .enter()
            .append('g')
            .attr("transform", function (d, idx) {
            return 'translate(' + ((idx * _this.reactorWidth) + _this.reactorWidth / 2.0) + ', 0)';
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
                switch (step.type.id) {
                    case StepType.start.id: return _this.drawStart(reactorGroup);
                    case StepType.addIngredient.id: return _this.drawIngredient(step, reactorGroup, idx * _this.nodeOffset);
                    case StepType.heating.id: return _this.drawHeating(step, reactorGroup, idx * _this.nodeOffset);
                    default:
                        console.log('Unrecognized Step Type', step);
                        break;
                }
            });
        });
    };
    RecipeGraph.prototype.drawStart = function (g) {
        g.append('circle')
            .attr('r', '10')
            .attr('fill', 'white')
            .attr('stroke', 'black');
        g.append('text')
            .attr("x", -8)
            .attr("y", 7)
            .attr("font-size", "1.2em")
            .text('\u2605');
    };
    RecipeGraph.prototype.drawIngredient = function (step, g, localOffset) {
        g.append('circle')
            .attr('r', '10')
            .attr('cy', localOffset)
            .attr('fill', 'white')
            .attr('stroke', 'black');
        g.append('text')
            .attr("x", -5)
            .attr("y", localOffset + 5)
            .text('\u2726');
    };
    RecipeGraph.prototype.drawHeating = function (step, g, localOffset) {
        g.append('circle')
            .attr('r', '10')
            .attr('cy', localOffset)
            .attr('fill', 'white')
            .attr('stroke', 'black');
        g.append('text')
            .attr("x", -8)
            .attr("y", localOffset + 5)
            .text('\ud83d\udd25');
    };
    RecipeGraph.prototype.drawStep = function (g, offset, step, index) {
        switch (step.type.id) {
            case StepType.start.id: return this.drawStart(g);
            case StepType.addIngredient.id: return this.drawIngredient(step, g, index * offset);
            case StepType.heating.id: return this.drawHeating(step, g, index * offset);
            default:
                console.log('Unrecognized Step Type', step);
                break;
        }
    };
    return RecipeGraph;
})(Polymer.DomModule);
RecipeGraph.prototype.is = 'recipe-graph';
RecipeGraph.prototype.listeners = {
    "iron-resize": 'onResize'
};
RecipeGraph.prototype.behaviors = [
    Polymer.IronResizableBehavior
];
RecipeGraph.prototype.properties = {
    recipe: {
        type: Recipe,
        value: undefined,
        observer: 'recipeChanged'
    },
    size: {
        type: Object,
        value: undefined
    }
};
