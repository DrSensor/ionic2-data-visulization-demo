import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import * as d3 from "d3";

@Component({
  selector: 'page-graph',
  templateUrl: 'graph.html'
})
export class GraphPage {
  @ViewChild('graph') graphContainer

  platform: Platform
  nodes: any[]
  links: any[]
  width: number = window.innerWidth
  height: number = window.innerHeight
  margin: any = {
    top: 20, 
    right: 20, 
    bottom: 30, 
    left: 40
  }

  x: any
  y: any
  graph: any
  svg: any

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.width = this.platform.width() - this.margin.left - this.margin.right
      this.height = this.platform.height() - this.margin.top - this.margin.bottom
    })

    this.nodes = d3.range(1000).map(function(i) {
      return {
        index: i
      }
    })

    this.links = d3.range(this.nodes.length - 1).map(function(i) {
      return {
        source: Math.floor(Math.sqrt(i)),
        target: i + 1
      }
    })
    this.initGraph()
  }

  constructor(navCtrl: NavController, platform: Platform) {
    this.platform = platform
  }

  initGraph() {    
    this.svg = d3.select('#graph').append('svg')
      .attr('height', '100%')
      .attr('width', '100%')
      .attr('viewBox','0 0 '
                        +Math.min(window.innerWidth,window.innerHeight)
                        +' '
                        +Math.max(window.innerWidth,window.innerHeight))

    this.graph = this.svg.attr("preserveAspectRatio", "xMidYMid meet")
            .attr("pointer-events", "all")
            .append('g')

    let simulation = d3.forceSimulation(this.nodes)
      .force("charge", d3.forceManyBody())
      .force("link", d3.forceLink(this.links))
      .force("center", d3.forceCenter(window.innerHeight / 2.0, window.innerWidth / 2.0))
      .force("x", d3.forceX())
      .force("y", d3.forceY())
    
    let link = this.graph.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('stroke', 'black')
    
    let node = this.graph.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(this.nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => {
        return (window.innerHeight+window.innerWidth)/200
      })
      .call(
        d3.drag()
          .on('start', dragStarted)
          .on('drag', dragged)
          .on('end', dragended)
      )

    simulation.nodes(this.nodes)
      .on("tick", ticked)
    
    function ticked() {
      link.attr("x1", (d) => { return d.source.x })
          .attr("y1", (d) => { return d.source.y })
          .attr("x2", (d) => { return d.target.x })
          .attr("y2", (d) => { return d.target.y })  
      node.attr('cx', (d) => { return d.x })
          .attr('cy', (d) => { return d.y })
    }
    
    function dragStarted(d) {
      if (!d3.event.activate) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

}
