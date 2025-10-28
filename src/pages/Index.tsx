import { useState } from 'react';
import { GraphCanvas } from '@/components/GraphCanvas';
import { ControlPanel } from '@/components/ControlPanel';
import { Algorithm, Graph, PathResult } from '@/types/graph';
import { runAlgorithm } from '@/utils/algorithms';
import { sampleGraphs } from '@/utils/sampleGraphs';
import { toast } from 'sonner';
import { Network } from 'lucide-react';

const Index = () => {
  const [graph, setGraph] = useState<Graph>(sampleGraphs.cities);
  const [algorithm, setAlgorithm] = useState<Algorithm>('dijkstra');
  const [startNode, setStartNode] = useState<string | null>(null);
  const [endNode, setEndNode] = useState<string | null>(null);
  const [pathResult, setPathResult] = useState<PathResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleNodeClick = (nodeId: string) => {
    if (!startNode) {
      setStartNode(nodeId);
      toast.success(`Start node set to ${graph.nodes.find(n => n.id === nodeId)?.label}`);
    } else if (!endNode && nodeId !== startNode) {
      setEndNode(nodeId);
      toast.success(`End node set to ${graph.nodes.find(n => n.id === nodeId)?.label}`);
    } else if (nodeId === startNode) {
      setStartNode(null);
      toast.info('Start node cleared');
    } else if (nodeId === endNode) {
      setEndNode(null);
      toast.info('End node cleared');
    }
  };

  const handleRunAlgorithm = async () => {
    if (!startNode || !endNode) {
      toast.error('Please select both start and end nodes');
      return;
    }

    setIsRunning(true);
    setPathResult(null);

    // Simulate visualization delay
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const result = runAlgorithm(algorithm, graph, startNode, endNode);
      
      if (result.path.length === 0) {
        toast.error('No path found between selected nodes');
        setPathResult(null);
      } else {
        setPathResult(result);
        const algorithmNames = {
          dijkstra: "Dijkstra's Algorithm",
          astar: 'A* Search',
          bfs: 'Breadth First Search',
          dfs: 'Depth First Search',
        };
        toast.success(
          `Path found using ${algorithmNames[algorithm]}! Distance: ${result.distance.toFixed(2)}`
        );
      }
    } catch (error) {
      toast.error('Error running algorithm');
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setStartNode(null);
    setEndNode(null);
    setPathResult(null);
    toast.info('Reset complete');
  };

  const handleLoadSample = (sample: string) => {
    const sampleGraph = sampleGraphs[sample];
    if (sampleGraph) {
      setGraph(sampleGraph);
      handleReset();
      toast.success('Sample graph loaded');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-blue-600">
              <Network className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold glow-text">Path Finder Visualizer</h1>
              <p className="text-sm text-muted-foreground">
                Interactive Graph Algorithm Visualization
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Canvas Area */}
          <div className="space-y-4">
            <GraphCanvas
              graph={graph}
              path={pathResult?.path || []}
              visitedNodes={pathResult?.visitedOrder || []}
              startNode={startNode}
              endNode={endNode}
              onNodeClick={handleNodeClick}
            />

            {pathResult && pathResult.path.length > 0 && (
              <div className="glass-panel p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-accent">Path Found</h3>
                <div className="flex flex-wrap gap-2">
                  {pathResult.path.map((nodeId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-mono text-sm border border-primary/30">
                        {graph.nodes.find(n => n.id === nodeId)?.label}
                      </span>
                      {index < pathResult.path.length - 1 && (
                        <span className="text-accent">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Control Panel */}
          <div>
            <ControlPanel
              algorithm={algorithm}
              onAlgorithmChange={setAlgorithm}
              onRunAlgorithm={handleRunAlgorithm}
              onReset={handleReset}
              onLoadSample={handleLoadSample}
              startNode={startNode}
              endNode={endNode}
              distance={pathResult?.distance ?? -1}
              isRunning={isRunning}
            />
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">Dijkstra's Algorithm</h4>
            <p className="text-sm text-muted-foreground">
              Finds shortest path using weighted edges. Optimal for positive weights.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">A* Search</h4>
            <p className="text-sm text-muted-foreground">
              Uses heuristics for faster pathfinding. Great for spatial graphs.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">BFS</h4>
            <p className="text-sm text-muted-foreground">
              Explores level by level. Finds shortest path in unweighted graphs.
            </p>
          </div>
          <div className="glass-panel p-4 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">DFS</h4>
            <p className="text-sm text-muted-foreground">
              Explores depth-first. Useful for maze solving and connectivity.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
