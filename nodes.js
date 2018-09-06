'use strict';

class Node {
  constructor(id, isGatewate=false, payload = undefined) {
    this.id = id;
    this.isGatewate = isGatewate;
    this.payload = payload;
    this.score = 0;
  }

  toString(){
    //   return `${this.id} - ${this.isGatewate}`;
      return `${this.id}`;
  }
}

class Edge {
    /**
     * 
     * @param {Node} source 
     * @param {Node} target 
     * @param {Object} payload 
     */
  constructor(source, target, payload = undefined) {
    this.source = source;
    this.target = target;
    this.payload = payload;
  }

  toString(){
      return `${this.source} ${this.target}`;
  }
}

let JJ = 0;
/**
 * HELPERS
 */
Array.prototype.chooseRandom = function() {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.sum = function(obj) {
  return this.reduce((acc, next) => (acc += obj(next)), 0);
};

Array.prototype.min = function(obj) {
  return this.reduce(
    (acc, next) => (acc && obj(next) > obj(acc) ? acc : next)
  );
};

Array.prototype.max = function(fn) {
  return this.reduce((acc, next) => (acc && fn(next) > fn(acc) ? next : acc));
};

Set.prototype.toString = function() {
  let str = "Set( ";
  this.forEach(value => (str += value + ", "));
  str += ");";
  return str;
};

Map.prototype.toString = function() {
  let str = "Map( ";
  this.forEach((value, key) => (str += key + " => " + value + ", \r\n"));
  str += ");";
  return str;
};

function getKeyForMinKeyMap(map, fn, initialValue) {
  let minKey = initialValue;
  map.forEach((_, key) => (minKey = fn(key) < fn(minKey) ? key : minKey));
  return minKey;
}

class Graph {
  constructor(N) {
    if (N.constructor.name === "Graph") {
      this.nodes = N.nodes;
      this.neightboors = N.neightboors;
      this.indexAgent = N.indexAgent;
    } else {
      this.nodes = {};
      this.neightboors = new Map();
      this.indexAgent = null;

      for (let i = 0; i < N; i++) {
        this.nodes[i] = new Node(i);
        this.neightboors.set(this.nodes[i], new Set());
      }
    }
  }

  addGateway(index) {
    this.nodes[index].isGateway = true;
  }

  addEdge(source, target) {
    let { [source]: src, [target]: trgt } = this.nodes;
    let e = new Edge(src, trgt);
    this.neightboors.get(e.source).add(e);
    this.neightboors.get(e.target).add(e);
    return this;
  }

  deleteEdge(edge) {
    this.neightboors.get(edge.source).delete(edge);
    this.neightboors.get(edge.target).delete(edge);
  }

  /**
   * Number of edges in the environ
   * @param {Node} node
   * @return {Number} the degree of the given node
   */
  getDegreeFromNode(node) {
    return this.neightboors.get(node).size;
  }

  getMaxDegreeFromGatway() {
    let nodeMax;
    let degreeNodeMax = -1;
    let edgesFromGateway = Object.values(this.nodes)
      .filter(node => node.isGateway)
      .map(node => this.neightboors.get(node))
      .forEach(edgeSet => {
        edgeSet.forEach(edge => {
          let focus = edge.source.isGateway ? edge.target : edge.source;
          [nodeMax, degreeNodeMax] =
            this.getDegreeFromNode(focus) > degreeNodeMax
              ? [focus, this.getDegreeFromNode(focus)]
              : [nodeMax, degreeNodeMax];
        });
      });
    return nodeMax;
  }

  getMaxDegreeFromAPathFromGateway(path) {
    let nodeMax;
    let degreeNodeMax = -1;
    path.forEach(edge => {
      printErr("gettingMaxDegreee : ", edge);
      let focus;
      if (
        (focus =
          (edge.source.isGateway && edge.target) ||
          (edge.target.isGateway && edge.source))
      ) {
        [nodeMax, degreeNodeMax] =
          this.getDegreeFromNode(focus) > degreeNodeMax
            ? [focus, this.getDegreeFromNode(focus)]
            : [nodeMax, degreeNodeMax];
      }
    });
    return nodeMax;
  }

  getShortestPathDijkstra(source, target) {
    printErr("processing ....", source, target);
    let dists = new Map();
    let reversePath = new Map();
    this.neightboors.forEach((_, node) => {
      dists.set(node, Infinity);
    });
    dists.set(source, 0);
    let getDist = node => dists.get(node);
    let Q = new Map(this.neightboors);
    let iterNeighboors = Q.keys();
    let node;
    while ((node = iterNeighboors.next().value)) {
      let n = getKeyForMinKeyMap(Q, getDist, node);
      Q.delete(n);
      if (n === target) {
        break;
      }
      this.neightboors.get(n).forEach(edge => {
        let focus = edge.source === n ? edge.target : edge.source;
        if (getDist(focus) > getDist(n) + 1 /*e.weight*/) {
          dists.set(focus, getDist(n) + 1);
          reversePath.set(focus, edge);
        }
      });
    }
    dists.forEach((dist, n) => !Number.isFinite(dist) && dists.delete(n));
    let P = new Set();
    let t = target;
    while (reversePath.has(t)) {
      let edge = reversePath.get(t);
      P.add(edge);
      t = t === edge.target ? edge.source : edge.target;
    }
    printErr("GOT : ", P);
    return P;
  }

  getShortestPaths_FromAgentToNearestGateway() {
    printErr("-------------");
    printErr("-------------");
    printErr("-------------");
    let agent = this.nodes[this.indexAgent];
    let gateways = Object.values(this.nodes).filter(node => node.isGateway);
    let paths = gateways
      .map(gateway => this.getShortestPathDijkstra(agent, gateway))
      .filter(path => path.size > 0);
    printErr("-------------");
    printErr(paths);
    printErr("-------------");
    let minPath = paths.min(path => path.size);
    printErr(minPath);
    printErr("-------------");
    let minPaths = paths.filter(path => path.size === minPath.size);
    return minPaths;
  }

  /**
   * get voisinage de node
   * @param {Node} node
   * @return {Node[]} array of node
   */
  getNeighborhoods(node) {
    let v = [];
    this.neightboors
      .get(node)
      .forEach(edge =>
        v.push(edge.source === node ? edge.target : edge.source)
      );
    return v;
  }

  /** DANGER modify nodes call it one time*/
  updateNodesScore(){
    Object.values(this.nodes)
      .filter(node => node.isGateway)
      .map((node) => this.getNeighborhoods(node))
      .forEach(voisins =>
        voisins.map(n => {
          n.score += 1;
        })
      );
  }

  getEdgeToSever() {
    JJ += 1;
    this.updateNodesScore();
    let minPaths = this.getShortestPaths_FromAgentToNearestGateway();
    let distance_min = minPaths.min((path) => path.size).size;
    let nodes_with_score = Object.values(this.nodes).filter((n) => n.score > 1 && !n.isGateway);
    let score_max = nodes_with_score.max((n) => n.score);
    let agent = this.nodes[this.indexAgent];
    printErr(distance_min, score_max, JJ, 'yeyeyeyey');
    if (distance_min > 1 && score_max > 1 && JJ > 1){
      let edgeToDelete;
      let node_to_focus = nodes_with_score.min((node) => this.getShortestPathDijkstra(agent, node).size/node.score);
      printErr('FOCUS ', node_to_focus);
      this.neightboors.get(node_to_focus).forEach((edge) => {
        if (edge.source.isGateway || edge.target.isGateway){
          edgeToDelete = edge;
        }
      });
      this.deleteEdge(edgeToDelete);
      return edgeToDelete;
    }
    printErr("---------MIN SSSSS PATHS---");
    printErr(minPaths);
    printErr("-------------");
    let maxPath = minPaths.max(path =>
      this.getDegreeFromNode(this.getMaxDegreeFromAPathFromGateway(path))
    );
    // this.neightboors.get(maxNode).forEach(edge => {
    //   if (!edgeToDelete && (edge.source.isGateway || edge.target.isGateway)) {
    //     edgeToDelete = edge;
    //   }
    // });
    printErr("------MAX PATH-----");
    printErr(maxPath);
    let edgeToDelete = Array.from(maxPath)[0];

    minPaths.forEach(path =>
      path.forEach(edge => {
        if (
          (edge.source.id === 8 || edge.source.id === 16) &&
          (edge.target.id === 8 || edge.target.id === 16)
        ) {
          edgeToDelete = edge;
        }
      })
    );

    this.deleteEdge(edgeToDelete);
    return edgeToDelete;
  }
}

var inputs = readline().split(" ");
var N = parseInt(inputs[0]); // the total number of nodes in the level, including the gateways
var L = parseInt(inputs[1]); // the number of links
var E = parseInt(inputs[2]); // the number of exit gateways

let G = new Graph(N);

for (var i = 0; i < L; i++) {
  var inputs = readline().split(" ");
  var N1 = parseInt(inputs[0]); // N1 and N2 defines a link between these nodes
  var N2 = parseInt(inputs[1]);
  G.addEdge(N1, N2);
}
for (var i = 0; i < E; i++) {
  var EI = parseInt(readline()); // the index of a gateway node

  G.addGateway(EI);
}

// game loop

while (true) {
  var SI = parseInt(readline()); // The index of the node on which the Skynet agent is positioned this turn
  G.indexAgent = SI;

  // Write an action using print()
  // To debug: printErr('Debug messages...');

  // Example: 3 4 are the indices of the nodes you wish to sever the link between
  print(G.getEdgeToSever());
}

// HAHA AGAIN
