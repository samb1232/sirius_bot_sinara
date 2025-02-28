import START_NODE from "./startnode";

const getSavedNodes = () => {
    const savedNodes = localStorage.getItem("nodes");
    return savedNodes ? JSON.parse(savedNodes) : [START_NODE];
  };
export default getSavedNodes