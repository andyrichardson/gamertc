import { h, Fragment } from "preact";
import {} from "preact-router";
import { useState, useCallback, useEffect } from "preact/hooks";
import { usePeer } from "../context";

export const Peer = () => {
  const [name, setName] = useState(window.localStorage.getItem("name") || "");
  const [id, setId] = useState<string>("");
  const { connect, connected } = usePeer();

  const handleNameChange = useCallback((e: any) => {
    setName(e.currentTarget.value);
  }, []);

  const handleIdChange = useCallback(
    (e: any) => setId(e.currentTarget.value),
    []
  );

  useEffect(() => {
    if (id !== "") {
      return;
    }

    const urlId = /\?id=(\w+)/.exec(window.location.search);

    if (urlId === null) {
      return;
    }

    setId(urlId[1]);
  }, [id, window.location.search]);

  const handleConnect = useCallback(() => {
    window.localStorage.setItem("name", name);
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
