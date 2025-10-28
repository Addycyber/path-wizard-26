import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Algorithm } from '@/types/graph';
import { Play, RotateCcw, Zap } from 'lucide-react';

interface ControlPanelProps {
  algorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onRunAlgorithm: () => void;
  onReset: () => void;
  onLoadSample: (sample: string) => void;
  startNode: string | null;
  endNode: string | null;
  distance: number;
  isRunning: boolean;
}

export const ControlPanel = ({
  algorithm,
  onAlgorithmChange,
  onRunAlgorithm,
  onReset,
  onLoadSample,
  startNode,
  endNode,
  distance,
  isRunning,
}: ControlPanelProps) => {
  return (
    <div className="space-y-4">
      <Card className="glass-panel p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-2 glow-text">Algorithm</h2>
          <Select value={algorithm} onValueChange={(v) => onAlgorithmChange(v as Algorithm)}>
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
              <SelectItem value="astar">A* Search</SelectItem>
              <SelectItem value="bfs">Breadth First Search</SelectItem>
              <SelectItem value="dfs">Depth First Search</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Start Node:</span>
            <span className="font-mono text-primary">{startNode || 'None'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">End Node:</span>
            <span className="font-mono text-primary">{endNode || 'None'}</span>
          </div>
          {distance >= 0 && (
            <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
              <span className="text-muted-foreground">Distance:</span>
              <span className="font-mono text-accent font-bold">{distance.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button
            onClick={onRunAlgorithm}
            disabled={!startNode || !endNode || isRunning}
            className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90"
          >
            <Play className="mr-2 h-4 w-4" />
            Find Path
          </Button>
          <Button onClick={onReset} variant="outline" className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </Card>

      <Card className="glass-panel p-6 space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Zap className="h-4 w-4 text-accent" />
          Sample Graphs
        </h3>
        <div className="space-y-2">
          <Button
            onClick={() => onLoadSample('cities')}
            variant="secondary"
            className="w-full justify-start"
          >
            Indian Cities
          </Button>
          <Button
            onClick={() => onLoadSample('simple')}
            variant="secondary"
            className="w-full justify-start"
          >
            Simple Graph
          </Button>
          <Button
            onClick={() => onLoadSample('complex')}
            variant="secondary"
            className="w-full justify-start"
          >
            Complex Network
          </Button>
        </div>
      </Card>

      <Card className="glass-panel p-4 space-y-2 text-sm">
        <p className="text-muted-foreground">
          <strong>Instructions:</strong>
        </p>
        <ul className="space-y-1 text-muted-foreground ml-4 list-disc">
          <li>Click nodes to select start/end points</li>
          <li>Choose an algorithm</li>
          <li>Click "Find Path" to visualize</li>
        </ul>
      </Card>
    </div>
  );
};
