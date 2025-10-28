import { Graph, PathResult } from '@/types/graph';

class PriorityQueue<T> {
  private items: Array<{ element: T; priority: number }> = [];

  enqueue(element: T, priority: number) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.items.shift()?.element;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

export const dijkstra = (graph: Graph, startId: string, endId: string): PathResult => {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const visitedOrder: string[] = [];
  const pq = new PriorityQueue<string>();

  // Initialize distances
  graph.nodes.forEach(node => {
    distances[node.id] = node.id === startId ? 0 : Infinity;
    previous[node.id] = null;
  });

  pq.enqueue(startId, 0);

  while (!pq.isEmpty()) {
    const current = pq.dequeue();
    if (!current || visited.has(current)) continue;

    visited.add(current);
    visitedOrder.push(current);

    if (current === endId) break;

    // Get neighbors
    const edges = graph.edges.filter(e => e.from === current || e.to === current);
    
    edges.forEach(edge => {
      const neighbor = edge.from === current ? edge.to : edge.from;
      if (visited.has(neighbor)) return;

      const newDist = distances[current] + edge.weight;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = current;
        pq.enqueue(neighbor, newDist);
      }
    });
  }

  // Reconstruct path
  const path: string[] = [];
  let current: string | null = endId;
  
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path: path[0] === startId ? path : [],
    distance: distances[endId] === Infinity ? -1 : distances[endId],
    visitedOrder,
  };
};

export const bfs = (graph: Graph, startId: string, endId: string): PathResult => {
  const queue: string[] = [startId];
  const visited = new Set<string>([startId]);
  const visitedOrder: string[] = [startId];
  const previous: Record<string, string | null> = { [startId]: null };

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (current === endId) break;

    const edges = graph.edges.filter(e => e.from === current || e.to === current);
    
    edges.forEach(edge => {
      const neighbor = edge.from === current ? edge.to : edge.from;
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        visitedOrder.push(neighbor);
        previous[neighbor] = current;
        queue.push(neighbor);
      }
    });
  }

  // Reconstruct path
  const path: string[] = [];
  let current: string | null = endId;
  let distance = 0;
  
  while (current) {
    path.unshift(current);
    const prev = previous[current];
    if (prev) {
      const edge = graph.edges.find(e => 
        (e.from === prev && e.to === current) || (e.from === current && e.to === prev)
      );
      if (edge) distance += edge.weight;
    }
    current = prev;
  }

  return {
    path: path[0] === startId ? path : [],
    distance: path[0] === startId ? distance : -1,
    visitedOrder,
  };
};

export const dfs = (graph: Graph, startId: string, endId: string): PathResult => {
  const stack: string[] = [startId];
  const visited = new Set<string>();
  const visitedOrder: string[] = [];
  const previous: Record<string, string | null> = { [startId]: null };

  while (stack.length > 0) {
    const current = stack.pop()!;
    
    if (visited.has(current)) continue;
    
    visited.add(current);
    visitedOrder.push(current);

    if (current === endId) break;

    const edges = graph.edges.filter(e => e.from === current || e.to === current);
    
    edges.forEach(edge => {
      const neighbor = edge.from === current ? edge.to : edge.from;
      if (!visited.has(neighbor) && !previous[neighbor]) {
        previous[neighbor] = current;
        stack.push(neighbor);
      }
    });
  }

  // Reconstruct path
  const path: string[] = [];
  let current: string | null = endId;
  let distance = 0;
  
  while (current) {
    path.unshift(current);
    const prev = previous[current];
    if (prev) {
      const edge = graph.edges.find(e => 
        (e.from === prev && e.to === current) || (e.from === current && e.to === prev)
      );
      if (edge) distance += edge.weight;
    }
    current = prev;
  }

  return {
    path: path[0] === startId ? path : [],
    distance: path[0] === startId ? distance : -1,
    visitedOrder,
  };
};

const heuristic = (node1: { x: number; y: number }, node2: { x: number; y: number }): number => {
  return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
};

export const aStar = (graph: Graph, startId: string, endId: string): PathResult => {
  const openSet = new PriorityQueue<string>();
  const closedSet = new Set<string>();
  const visitedOrder: string[] = [];
  
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const previous: Record<string, string | null> = {};

  const startNode = graph.nodes.find(n => n.id === startId)!;
  const endNode = graph.nodes.find(n => n.id === endId)!;

  graph.nodes.forEach(node => {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
    previous[node.id] = null;
  });

  gScore[startId] = 0;
  fScore[startId] = heuristic(startNode, endNode);
  openSet.enqueue(startId, fScore[startId]);

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
    if (!current) break;

    if (closedSet.has(current)) continue;
    
    closedSet.add(current);
    visitedOrder.push(current);

    if (current === endId) break;

    const currentNode = graph.nodes.find(n => n.id === current)!;
    const edges = graph.edges.filter(e => e.from === current || e.to === current);

    edges.forEach(edge => {
      const neighbor = edge.from === current ? edge.to : edge.from;
      if (closedSet.has(neighbor)) return;

      const tentativeGScore = gScore[current] + edge.weight;

      if (tentativeGScore < gScore[neighbor]) {
        previous[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        const neighborNode = graph.nodes.find(n => n.id === neighbor)!;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighborNode, endNode);
        openSet.enqueue(neighbor, fScore[neighbor]);
      }
    });
  }

  // Reconstruct path
  const path: string[] = [];
  let current: string | null = endId;
  
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return {
    path: path[0] === startId ? path : [],
    distance: gScore[endId] === Infinity ? -1 : gScore[endId],
    visitedOrder,
  };
};

export const runAlgorithm = (
  algorithm: string,
  graph: Graph,
  startId: string,
  endId: string
): PathResult => {
  switch (algorithm) {
    case 'dijkstra':
      return dijkstra(graph, startId, endId);
    case 'bfs':
      return bfs(graph, startId, endId);
    case 'dfs':
      return dfs(graph, startId, endId);
    case 'astar':
      return aStar(graph, startId, endId);
    default:
      return dijkstra(graph, startId, endId);
  }
};
