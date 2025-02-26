import ButtonAppBar from './componets/AppBar';
import Graph from './componets/Graph';
export default function App() {
    return (
      <div style={{ display: "flow", flexDirection: "column", height: "100vh" }}>
        <div>
        <ButtonAppBar />
        </div>
        <div style={{ flex: 1, display: "flex",height: "100%" }}>
        <Graph></Graph>
      </div>
      </div>
    );
  }
  