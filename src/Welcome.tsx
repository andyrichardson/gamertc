import { h } from "preact";
import styled from "styled-components";

export const Welcome = () => {
  return (
    <Page>
      <h1>Welcome</h1>
      <a href="/game">Start game</a>
    </Page>
  );
};

const Page = styled.main``;
