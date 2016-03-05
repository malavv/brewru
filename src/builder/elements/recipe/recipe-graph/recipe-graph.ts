/// <reference path="../../../lib/brew/brew.d.ts" />
/// <reference path="../../../lib/polymer/polymer.ts" />

class RecipeGraph extends Polymer.DomModule {
  private recipe: Recipe;

  public attached() {
    console.log('attached');

    var overviewData = [];
    overviewData.push(this.getDataObj('vol'));
    overviewData.push(this.getDataObj('temp'));

    Plotly.newPlot('basic', overviewData, {
      title: 'Overview',
      xaxis: { title: 'Time Interval (min)' },
      yaxis: {title: 'Volume in L'},
      yaxis2: {
        title: 'Temperature in C',
        titlefont: {color: 'rgb(148, 103, 189)'},
        tickfont: {color: 'rgb(148, 103, 189)'},
        overlaying: 'y',
        side: 'right'
      }
    });

    var substanceData = this.recipe.data.substance.map((s, idx) => {
      var dataObj = {
        x: [],
        y: [],
        type: 'scatter',
        name: s
      };
      this.recipe.data.steps.forEach(s => {
        dataObj.x.push(s.time);
        dataObj.y.push(s.sub[idx]);
      });
      return dataObj;
    });

    Plotly.newPlot('substances', substanceData, {
      title: 'Reactor',
      xaxis: { title: 'Time Interval (min)' },
      yaxis: {title: 'Quantity of substance in Moles'}
    });
  }


  public getDataObj(key:string) {
    var dataObj = {
      x: [],
      y: [],
      type: 'scatter',
      name: key
    };

    if (key == 'temp') {
      dataObj.yaxis = 'y2';
    }
    this.recipe.data.steps.forEach(s => {
      dataObj.x.push(s.time);
      dataObj.y.push(s[key]);
    });
    return dataObj;
  }
}

window.Polymer(window.Polymer.Base.extend(RecipeGraph.prototype, {
  is: 'recipe-graph',

  properties: {
    recipe: Object
  }
}));