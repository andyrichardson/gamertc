import { createContext, FunctionComponent, h } from "preact";
import Peer from "peerjs";
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "preact/hooks";

interface PeerContextValue {
  connect: (arg: { name: string; id: string }) => void;
  connected: boolean;
}

export const PeerContext = createContext<PeerContextValue>(null as any);

export const usePeer = () => useContext(PeerContext);

export const PeerProvider: FunctionComponent = ({ children }) => {
  const [state, setState] = useState({
    connected: false,
  });
  const peer = useRef<Peer>();
  const connection = useRef<Peer.DataConnection>();

  const connect = useCallback<PeerContextValue["connect"]>(
    async ({ name, id }) => {
      if (peer.current) {
        peer.current.destroy();
      }

      const p = new Peer(name, {
        debug: 3,
        host: process.env.SIGNAL_HOST,
        port: Number(process.env.SIGNAL_PORT),
        path: process.env.SIGNAL_PATH,
      });
      peer.current = p;

      // Disconnected from signalling server
      p.on("disconnected", () => {
        setState((s) => ({
          ...s,
          connected: false,
        }));
      });

      const c = p.connect(id);
      connection.current = c;

      // Connected to game server
      c.on("open", () => {
        setState((s) => ({
          ...s,
          connected: true,
        }));
      });
      c.on("data", function (data) {
        // Will print 'hi!'
        console.log(data);
      });
    },
    []
  );

  useEffect(() => {
    return () => connection.current && connection.current.close();
  }, []);

  return (
    <PeerContext.Provider value={{ connect, ...state }}>
      {children}
    </PeerContext.Provider>
  );
};
