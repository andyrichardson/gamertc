import { h, render, Fragment } from "preact";
import { ServerProvider, PeerProvider } from "./context";
import { Server } from "./server";
import { Peer } from "./peer";

const App = () => {
  return (
    <Fragment>
      <ServerProvider>
        <Server />
      </ServerProvider>
      <PeerProvider>
        <Peer />
      </PeerProvider>
    </Fragment>
  );
};

render(<App />, document.body);
