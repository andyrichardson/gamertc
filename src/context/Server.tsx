import { createContext, FunctionComponent, h } from "preact";
import Peer from "peerjs";
import {
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "preact/hooks";
import chance from "chance";

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
    id: chance.Chance().word({ length: 7 }),
    connected: false,
  });

  // User connections
  const [connections, setConnections] = useState<
    Record<string, Peer.DataConnection>
  >({});

  // Own peer
  const peer = useRef<Peer>();

  const setup = useCallback(async () => {
    const p = new Peer(state.id, {
      debug: 3,
      host: process.env.SIGNAL_HOST,
      port: Number(process.env.SIGNAL_PORT),
      path: process.env.SIGNAL_PATH,
    });
    peer.current = p;

    // Connection to signalling server
    p.on("open", () => {
      setState((s) => ({
        ...s,
        connected: true,
      }));
    });

    // Connection from user
    p.on("connection", (connection) => {
      console.log(connection);
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
    return () => {
      Object.values(connections).forEach((c) => c.close());
      () => peer.current?.disconnect();
    };
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
