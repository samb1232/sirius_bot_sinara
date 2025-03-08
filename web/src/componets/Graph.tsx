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
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const flowKey = 'example-flow';
const getNodeId = () => `randomnode_${+new Date()}`;
const nodeOrigin = [0.5, 0];

const initialNodes = [
  { id: '1', data: { label: '/start' }, type: 'input', position: { x: 0, y: -50 }, draggable: false, selectable: false },
  { id: '2', data: { label: 'Вопрос 1' }, type: 'default', position: { x: 0, y: 50 } },
  
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

type CustomNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
  origin?: [number, number];
  draggable?: boolean;
  selectable?: boolean;
};

type CustomEdge = {
  id: string;
  source: string;
  target: string;
};

const GraphEditor = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<CustomNode, CustomEdge> | null>(null);
  const { setViewport, screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    const restoreFlow = async () => {
      const flowString = localStorage.getItem(flowKey);
      if (flowString) {
        const flow = JSON.parse(flowString);
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
  }, [setNodes, setEdges, setViewport]);

  useEffect(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [nodes, edges, rfInstance]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flowString = localStorage.getItem(flowKey);
      if (flowString) {
        const flow = JSON.parse(flowString);
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
  }, [setNodes, setEdges, setViewport]);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: any) => {
      if (!connectionState.isValid) {
        const id = getNodeId();
        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        const newNode: CustomNode = {
          id,
          type: 'default',
          position: screenToFlowPosition({ x: clientX, y: clientY }),
          data: { label: `gngngn` },
          origin: nodeOrigin as [number, number],
        };
        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [...eds, { id, source: connectionState.fromNode.id, target: id }]);
        onSave();
      }
    },
    [screenToFlowPosition, setNodes, setEdges]
  );

  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow<CustomNode, CustomEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onInit={setRfInstance}
        fitView
        fitViewOptions={{ padding: 2 }}
        style={{ backgroundColor: "#F7F9FB" }}
        nodeOrigin={nodeOrigin as [number, number]}
      >
        <Background />
        {/* <Panel position="top-right">
          <button onClick={onSave}>Save</button>
          <button onClick={onRestore}>Restore</button>
        </Panel> */}
      </ReactFlow>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <GraphEditor />
  </ReactFlowProvider>
);
