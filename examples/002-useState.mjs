import assert from "assert";
import EventEmitter from "events";
import * as React from "react";
import * as Renderer from "react-test-renderer";

export default function runExample() {
  function MyUserInterface(properties) {
    const user = properties.user;

    const [userName, setUserName] = React.useState(null);

    function listenForUserSpeaking() {
      const listener = user.addListener("speaking", setUserName);

      return function stopListening() {
        user.removeListener(listener);
      };
    }

    React.useEffect(listenForUserSpeaking, [user]);

    if (userName === null) {
      return "Hello, what is your name?";
    } else {
      return "Nice to meet you, " + userName + "!";
    }
  }

  const myUser = new EventEmitter();

  let myRenderer;

  function createRenderer() {
    const properties = {
      user: myUser,
    };
    const element = React.createElement(MyUserInterface, properties);
    myRenderer = Renderer.create(element);
  }

  Renderer.act(createRenderer);

  assert.strictEqual(myRenderer.toTree().rendered, "Hello, what is your name?");

  myUser.emit("speaking", "Michael Cera");

  assert.strictEqual(myRenderer.toTree().rendered, "Nice to meet you, Michael Cera!");
}
