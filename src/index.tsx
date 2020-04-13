import { h, render } from "preact";
import { Router } from "preact-router";
import { ServerProvider, PeerProvider } from "./context";
import { Server } from "./server";
import { Peer } from "./peer";
import { Welcome } from "./Welcome";

const App = () => {
  return (
    <Router>
      <Welcome path="/" />
      <ServerProvider path="/game">
        <Server />
      </ServerProvider>
      <PeerProvider path="/join">
        <Peer />
      </PeerProvider>
    </Router>
  );
};

render(<App />, document.body);
