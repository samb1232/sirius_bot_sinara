const importGraph = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedGraph = JSON.parse(e.target.result);
        const nodes = [];
        const edges = [];
        
        const traverse = (node, parentId = null) => {
          nodes.push({
            id: node.id,
            type: "custom",
            position: node.position || { x: 0, y: 0 },
            data: { label: node.data.label },
            style: { width: 150, height: 50 },
          });
          
          if (parentId) {
            edges.push({ id: `edge-${parentId}-${node.id}`, source: parentId, target: node.id });
          }
          
          node.children.forEach(child => traverse(child, node.id));
        };
        
        importedGraph.forEach(rootNode => traverse(rootNode));
  
        localStorage.setItem("nodes", JSON.stringify(nodes));
        localStorage.setItem("edges", JSON.stringify(edges));
        window.location.reload();
      } catch (error) {
        console.error("Error importing graph:", error);
      }
    };
    reader.readAsText(file);
  };
export default importGraph
  