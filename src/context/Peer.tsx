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
        host: "127.0.0.1",
        port: 4000,
        path: "/",
      });
      peer.current = p;

      // Peer connected to signalling server
      p.on("open", () => {
        setState((s) => ({
          ...s,
          connected: true,
        }));
      });

      p.on("connection", () => {
        console.log("CONNECTION");
      });

      const c = p.connect(id);
      connection.current = c;
      c.on("open", function () {
        console.log("OPENED");
        // here you have conn.id
        c.send("hi!");
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
