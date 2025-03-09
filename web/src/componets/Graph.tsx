import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
  Connection,
  ReactFlowInstance,
  XYPosition,
  Node,
  Edge,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const flowKey = 'example-flow';
const nodeOrigin = [0.5, 0];

const startNode: FlowNode = { 
  id: '1', 
  data: { label: '/start' }, 
  type: 'input', 
  position: { x: 0, y: -50 }, 
  draggable: false, 
  selectable: false 
};

type NodeData = {
  label: string;
};

type FlowNode = Node<NodeData>;
type FlowEdge = Edge;

const initialNodes: FlowNode[] = [
  startNode,
  { 
    id: '2', 
    data: { label: 'Вопрос 1' }, 
    type: 'default', 
    position: { x: 0, y: 50 } 
  },
];

const initialEdges: FlowEdge[] = [{ id: 'e1-2', source: '1', target: '2' }];

const GraphEditor = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<FlowNode, FlowEdge> | null>(null);
  const { setViewport, screenToFlowPosition } = useReactFlow();

  const getNodeId = useCallback(() => {
    const maxId = Math.max(...nodes.map(node => parseInt(node.id)));
    return String(maxId + 1);
  }, [nodes]);

  useEffect(() => {
    const restoreFlow = async () => {
      const flowString = localStorage.getItem(flowKey);
      if (flowString) {
        const flow = JSON.parse(flowString);
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        // Восстанавливаем ноды, добавляя стартовую ноду в начало
        const savedNodes = flow.nodes || [];
        setNodes([startNode, ...savedNodes]);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
  }, [setNodes, setEdges, setViewport]);

  useEffect(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      // Сохраняем все ноды кроме стартовой
      flow.nodes = nodes.filter(node => node.id !== '1');
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [nodes, edges, rfInstance]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: any) => {
      if (!connectionState.isValid) {
        const id = getNodeId();
        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        const newNode: FlowNode = {
          id,
          type: 'default',
          position: screenToFlowPosition({ x: clientX, y: clientY }),
          data: { label: 'Новый вопрос' },
        };
        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [...eds, { id: `e${connectionState.fromNode.id}-${id}`, source: connectionState.fromNode.id, target: id }]);
      }
    },
    [screenToFlowPosition, setNodes, setEdges, getNodeId]
  );

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: FlowNode) => {
    // Prevent editing start node
    if (node.id === '1') return;

    const newLabel = prompt('Введите новый текст:', node.data.label);
    if (newLabel !== null) {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: { ...n.data, label: newLabel },
            };
          }
          return n;
        })
      );
    }
  }, [setNodes]);

  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow<FlowNode, FlowEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onInit={setRfInstance}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
        fitViewOptions={{ padding: 2 }}
        style={{ backgroundColor: "#F7F9FB" }}
        nodeOrigin={nodeOrigin as [number, number]}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <GraphEditor />
  </ReactFlowProvider>
);
