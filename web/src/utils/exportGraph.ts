import START_NODE from "./startnode";
import getSavedEdges from "./getEdges";
import getSavedNodes from "./getNodes";
  
const buildHierarchy = (nodes, edges) => {
    const nodeMap = Object.fromEntries(nodes.map(node => [node.id, { ...node, children: [] }]));
    edges.forEach(edge => {
      if (nodeMap[edge.source] && nodeMap[edge.target]) {
        nodeMap[edge.source].children.push(nodeMap[edge.target]);
      }
    });
    return Object.values(nodeMap).filter(node => !edges.some(edge => edge.target === node.id));
  };
  
  const downloadJson = (json) => {
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "graph.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportGraph = () => {
    const nodes = getSavedNodes();
    const edges = getSavedEdges();
    const hierarchy = buildHierarchy(nodes, edges);
    const json = JSON.stringify(hierarchy, null, 2);
    console.log(json);
    downloadJson(json);
  };

export default exportGraph;