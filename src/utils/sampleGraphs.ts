import { Graph } from '@/types/graph';

export const sampleGraphs: Record<string, Graph> = {
  cities: {
    nodes: [
      { id: 'A', label: 'Mumbai', x: 150, y: 300 },
      { id: 'B', label: 'Delhi', x: 250, y: 100 },
      { id: 'C', label: 'Bangalore', x: 350, y: 350 },
      { id: 'D', label: 'Kolkata', x: 550, y: 200 },
      { id: 'E', label: 'Chennai', x: 450, y: 400 },
      { id: 'F', label: 'Hyderabad', x: 400, y: 250 },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 7 },
      { from: 'A', to: 'C', weight: 5 },
      { from: 'B', to: 'D', weight: 6 },
      { from: 'B', to: 'F', weight: 4 },
      { from: 'C', to: 'E', weight: 3 },
      { from: 'C', to: 'F', weight: 4 },
      { from: 'D', to: 'F', weight: 5 },
      { from: 'E', to: 'F', weight: 2 },
      { from: 'D', to: 'E', weight: 7 },
    ],
  },
  simple: {
    nodes: [
      { id: 'A', label: 'A', x: 150, y: 200 },
      { id: 'B', label: 'B', x: 300, y: 100 },
      { id: 'C', label: 'C', x: 300, y: 300 },
      { id: 'D', label: 'D', x: 450, y: 200 },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'D', weight: 3 },
      { from: 'B', to: 'C', weight: 1 },
    ],
  },
  complex: {
    nodes: [
      { id: 'A', label: 'Start', x: 100, y: 250 },
      { id: 'B', label: 'B', x: 200, y: 150 },
      { id: 'C', label: 'C', x: 200, y: 350 },
      { id: 'D', label: 'D', x: 300, y: 100 },
      { id: 'E', label: 'E', x: 300, y: 250 },
      { id: 'F', label: 'F', x: 300, y: 400 },
      { id: 'G', label: 'G', x: 450, y: 200 },
      { id: 'H', label: 'End', x: 550, y: 250 },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 3 },
      { from: 'A', to: 'C', weight: 5 },
      { from: 'B', to: 'D', weight: 2 },
      { from: 'B', to: 'E', weight: 4 },
      { from: 'C', to: 'E', weight: 3 },
      { from: 'C', to: 'F', weight: 4 },
      { from: 'D', to: 'G', weight: 3 },
      { from: 'E', to: 'G', weight: 2 },
      { from: 'E', to: 'H', weight: 6 },
      { from: 'F', to: 'H', weight: 5 },
      { from: 'G', to: 'H', weight: 4 },
    ],
  },
};
