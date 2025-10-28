export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface Edge {
  from: string;
  to: string;
  weight: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface PathResult {
  path: string[];
  distance: number;
  visitedOrder: string[];
}

export type Algorithm = 'dijkstra' | 'bfs' | 'dfs' | 'astar';
