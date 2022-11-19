import assert from "assert";
import EventEmitter from "events";
import * as React from "react";
import * as Renderer from "react-test-renderer";

export default function runExample() {
  function MyUserInterface(properties) {
    const user = properties.user;

    const userName = React.useRef(null);

    function listenForUserSpeaking() {
      function setUserName(name) {
        userName.current = name;
      }

      const listener = user.addListener("speaking", setUserName);

      return function stopListening() {
        user.removeListener(listener);
      };
    }

    React.useEffect(listenForUserSpeaking, [user]);

    if (userName.current === null) {
      return "Hello, what is your name?";
    } else {
      return "Nice to meet you, " + userName.current + "!";
    }
  }

  const myUser = new EventEmitter();

  let testRenderer;

  function createRenderer() {
    const properties = {
      user: myUser,
    };
    const element = React.createElement(MyUserInterface, properties);
    testRenderer = Renderer.create(element);
  }

  function updateRenderer() {
    const properties = {
      user: myUser,
    };
    const element = React.createElement(MyUserInterface, properties);
    testRenderer.update(element);
  }

  Renderer.act(createRenderer);

  assert.strictEqual(testRenderer.toTree().rendered, "Hello, what is your name?");

  myUser.emit("speaking", "Michael Cera");

  assert.strictEqual(testRenderer.toTree().rendered, "Hello, what is your name?");

  Renderer.act(updateRenderer);

  assert.strictEqual(testRenderer.toTree().rendered, "Nice to meet you, Michael Cera!");
}
