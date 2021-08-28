import assert from "assert";
import EventEmitter from "events";
import * as React from "react";
import * as Renderer from "react-test-renderer";

export default function runExample () {
  function MyUserInterface(props) {
    const userName = React.useRef(null);

    function setUserName(name) {
      userName.current = name;
    }

    function listenForUserSpeaking() {
      props.user.addListener("speakName", setUserName);
    }

    React.useEffect(listenForUserSpeaking);

    if (userName.current === null) {
      return "Hello, what is your name?";
    } else {
      return "Nice to meet you, " + userName.current + "!";
    }
  }

  const myUser = new EventEmitter();

  let myRenderer;

  function createRenderer() {
    const props = {
      user: myUser,
    };
    myRenderer = Renderer.create(React.createElement(MyUserInterface, props));
  }

  function updateRenderer() {
    const props = {
      user: myUser,
    };
    myRenderer.update(React.createElement(MyUserInterface, props));
  }

  function assertRenderedOutputToEqual (expected) {
    const renderedOutput = myRenderer.toTree().rendered;
    console.log(renderedOutput);
    assert.strictEqual(renderedOutput, expected);
  }

  Renderer.act(createRenderer);

  assertRenderedOutputToEqual("Hello, what is your name?");

  myUser.emit("speakName", "Michael Cera");

  assertRenderedOutputToEqual("Hello, what is your name?");

  Renderer.act(updateRenderer);

  assertRenderedOutputToEqual("Nice to meet you, Michael Cera!");
}
