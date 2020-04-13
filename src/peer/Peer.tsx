import { h, Fragment } from "preact";
import { useState, useCallback } from "preact/hooks";
import { usePeer } from "../context";

export const Peer = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const { connect, connected } = usePeer();

  const handleNameChange = useCallback(
    (e: any) => setName(e.currentTarget.value),
    []
  );

  const handleIdChange = useCallback(
    (e: any) => setId(e.currentTarget.value),
    []
  );

  const handleConnect = useCallback(() => {
    connect({ name, id });
  }, [name, id, connect]);

  return (
    <Fragment>
      <h1>Peer {connected && "Connected"}</h1>
      <input type="text" value={name} onChange={handleNameChange} />
      <input type="text" value={id} onChange={handleIdChange} />
      <button onClick={handleConnect}>Connect</button>
    </Fragment>
  );
};
