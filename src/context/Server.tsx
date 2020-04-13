import { createContext, FunctionComponent, h } from "preact";
import Peer from "peerjs";
import {
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "preact/hooks/src";

interface ServerContextValue {
  /** Unique ID of server. */
  id: string;
  /** Connected to signalling server. */
  connected: boolean;
  /** Connections to server. */
  connections: Record<string, Peer.DataConnection>;
}

export const ServerContext = createContext<ServerContextValue>(null as any);

export const useServer = () => useContext(ServerContext);

export const ServerProvider: FunctionComponent = ({ children }) => {
  // Root app state
  const [state, setState] = useState({
    id: "some-id",
    connected: false,
  });

  // User connections
  const [connections, setConnections] = useState<
    Record<string, Peer.DataConnection>
  >({});

  // Own peer
  const peer = useRef(
    new Peer(state.id, {
      host: "127.0.0.1",
      port: 4000,
      path: "/",
    })
  );

  const setup = useCallback(async () => {
    const p = peer.current;

    // Connection to signalling server
    p.on("open", () => {
      setState((s) => ({
        ...s,
        connected: true,
      }));
    });

    // Connection from user
    p.on("connection", (connection) => {
      setConnections((connections) => ({
        ...connections,
        [connection.peer]: connection,
      }));

      // Handle connection disconnect
      connection.on("close", () => {
        setConnections((connections) => {
          const {
            [connection.peer]: ignored,
            ...otherConnections
          } = connections;

          return otherConnections;
        });
      });
    });
  }, []);

  useEffect(() => {
    setup();
    return () => Object.values(connections).forEach((c) => c.close());
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      connections,
    }),
    [state, connections]
  );

  return (
    <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
  );
};
