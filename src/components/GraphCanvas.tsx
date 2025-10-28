import { useEffect, useRef } from 'react';
import { Graph, Node, Edge } from '@/types/graph';

interface GraphCanvasProps {
  graph: Graph;
  path: string[];
  visitedNodes: string[];
  startNode: string | null;
  endNode: string | null;
  onNodeClick: (nodeId: string) => void;
}

export const GraphCanvas = ({
  graph,
  path,
  visitedNodes,
  startNode,
  endNode,
  onNodeClick,
}: GraphCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    graph.edges.forEach(edge => {
      const fromNode = graph.nodes.find(n => n.id === edge.from);
      const toNode = graph.nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const isInPath = path.length > 0 && 
        path.includes(edge.from) && 
        path.includes(edge.to) &&
        Math.abs(path.indexOf(edge.from) - path.indexOf(edge.to)) === 1;

      // Draw edge line
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      
      if (isInPath) {
        ctx.strokeStyle = 'hsl(180 100% 50%)';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'hsl(180 100% 50%)';
      } else {
        ctx.strokeStyle = 'hsl(217 33% 25%)';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
      }
      
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw weight
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      
      ctx.fillStyle = 'hsl(222 47% 11%)';
      ctx.beginPath();
      ctx.arc(midX, midY, 16, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = isInPath ? 'hsl(180 100% 50%)' : 'hsl(217 33% 35%)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = 'hsl(210 40% 98%)';
      ctx.font = 'bold 12px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(edge.weight.toString(), midX, midY);
    });

    // Draw nodes
    graph.nodes.forEach(node => {
      const isVisited = visitedNodes.includes(node.id);
      const isInPath = path.includes(node.id);
      const isStart = node.id === startNode;
      const isEnd = node.id === endNode;

      // Draw glow for path nodes
      if (isInPath || isStart || isEnd) {
        ctx.shadowBlur = 25;
        ctx.shadowColor = isStart || isEnd ? 'hsl(263 70% 65%)' : 'hsl(180 100% 50%)';
      }

      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
      
      if (isStart || isEnd) {
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 30);
        gradient.addColorStop(0, 'hsl(263 70% 65%)');
        gradient.addColorStop(1, 'hsl(220 70% 60%)');
        ctx.fillStyle = gradient;
      } else if (isInPath) {
        ctx.fillStyle = 'hsl(180 100% 50% / 0.3)';
      } else if (isVisited) {
        ctx.fillStyle = 'hsl(217 33% 22%)';
      } else {
        ctx.fillStyle = 'hsl(222 47% 14%)';
      }
      
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw border
      ctx.strokeStyle = isInPath || isStart || isEnd ? 'hsl(180 100% 50%)' : 'hsl(217 33% 35%)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw label
      ctx.fillStyle = 'hsl(210 40% 98%)';
      ctx.font = 'bold 14px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
  }, [graph, path, visitedNodes, startNode, endNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if click is on a node
    const clickedNode = graph.nodes.find(node => {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
      return distance <= 30;
    });

    if (clickedNode) {
      onNodeClick(clickedNode.id);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={700}
      height={500}
      onClick={handleCanvasClick}
      className="rounded-lg border-2 border-border bg-card cursor-pointer"
    />
  );
};
