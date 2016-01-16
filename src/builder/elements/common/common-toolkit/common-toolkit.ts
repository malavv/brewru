/// <reference path="../../../lib/polymer/polymer.ts" />

class CommonToolkit extends Polymer.DomModule {
  locked: boolean;
  target: HTMLElement;
  width: number;
  minWidth: number;

  attached() {
    var children = Polymer.dom(this).children;
    var childCount:number = children.length;
    console.log('CommonToolkit', childCount)
  }

  track(e) {
    switch (e.detail.state) {
      case 'start':
        this.width = this.$$('.content iron-pages').getBoundingClientRect().width;
        break;
      case 'track':
        var dx = e.detail.ddx;
        this.width = Math.max(this.width - dx, this.minWidth);
        break;
      case 'end':
        console.log('Tracking ended!');
        break;
    }
    if (this.locked) {
      return;
    }
  }

  preventSelection(e:any) {
    e.preventDefault();
  }

  onWidthChange() {
    this.$$('.content iron-pages').style.width = this.width + 'px';
    console.log('onWidthChange');
  }
}

window.Polymer(window.Polymer.Base.extend(CommonToolkit.prototype, {
  is: 'common-toolkit',

  properties: {
    selected: {
      type: Number,
      value: 0
    },
    locked: {
      type: Boolean,
      value: false
    },
    width: {
      type: Number,
      observer: 'onWidthChange'
    },
    minWidth: {
      type: Number,
      value: 200
    }
  }
}));