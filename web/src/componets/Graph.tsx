import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import START_NODE from '../utils/startnode'



const getSavedNodes = () => {
  const savedNodes = localStorage.getItem("nodes");
  return savedNodes ? JSON.parse(savedNodes) : [START_NODE];
};

const getSavedEdges = () => {
  const savedEdges = localStorage.getItem("edges");
  return savedEdges ? JSON.parse(savedEdges) : [];
};

let id = parseInt(localStorage.getItem("nodeId") || "1", 10);
const getId = () => {
  id += 1;
  localStorage.setItem("nodeId", id.toString());
  return `${id}`;
};

const nodeOrigin = [0.5, 0];

const CustomNode = ({ id, data }) => {
  const savedText = localStorage.getItem("node" + id + "Text") || data.label;
  const [label, setLabel] = useState(savedText);
  console.log(id)
  useEffect(() => {
    localStorage.setItem("node" + id + "Text", label);
  }, [label, id]);

  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: 5,
        background: "white",
        width: 150,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Handle type="target" position="top" />
      <textarea
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        style={{
          width: "100%",
          height: "100%",
          resize: "none",
          border: "none",
          background: "transparent",
          outline: "none",
        }}
      />
      <Handle type="source" position="bottom" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(getSavedNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(getSavedEdges());
  const { screenToFlowPosition, setViewport } = useReactFlow();

  useEffect(() => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
  }, [nodes, edges]);

  useEffect(() => {
    const savedViewport = localStorage.getItem("viewport");
    if (savedViewport) {
      setViewport(JSON.parse(savedViewport));
    }
  }, [setViewport]);

  const onMoveEnd = useCallback((event, viewport) => {
    localStorage.setItem("viewport", JSON.stringify(viewport));
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const newId = getId();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode = {
          id: newId,
          type: "custom",
          position: screenToFlowPosition({ x: clientX, y: clientY }),
          data: { label: `New Node` },
          origin: [0.5, 0.0],
          style: { width: 150, height: 50 },
        };

        setNodes((nds) => {
          const updatedNodes = [...nds, newNode];
          localStorage.setItem("nodes", JSON.stringify(updatedNodes));
          return updatedNodes;
        });

        setEdges((eds) => {
          const updatedEdges = [...eds, { id: `edge-${newId}`, source: connectionState.fromNode.id, target: newId }];
          localStorage.setItem("edges", JSON.stringify(updatedEdges));
          return updatedEdges;
        });
      }
    },
    [screenToFlowPosition]
  );

  const onNodesDelete = useCallback(
    (deletedNodes) => {
      setNodes((nds) => {
        const remainingNodes = nds.filter((node) => !deletedNodes.some((d) => d.id === node.id));
        localStorage.setItem("nodes", JSON.stringify(remainingNodes));
        return remainingNodes;
      });
      setEdges((eds) => {
        const remainingEdges = eds.filter((edge) => !deletedNodes.some((d) => d.id === edge.source || d.id === edge.target));
        localStorage.setItem("edges", JSON.stringify(remainingEdges));
        return remainingEdges;
      });
    },
    []
  );

  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        style={{ backgroundColor: "#F7F9FB" }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onMoveEnd={onMoveEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        nodeOrigin={nodeOrigin}
        nodeTypes={nodeTypes}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

const Graph = () => (
  <div style={{ width: "100%", height: "100%" }}>
    <ReactFlowProvider>
      <AddNodeOnEdgeDrop />
    </ReactFlowProvider>
  </div>
);

export default Graph;
