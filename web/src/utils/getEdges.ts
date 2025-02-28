const getSavedEdges = () => {
    const savedEdges = localStorage.getItem("edges");
    return savedEdges ? JSON.parse(savedEdges) : [];
  };
export default getSavedEdges