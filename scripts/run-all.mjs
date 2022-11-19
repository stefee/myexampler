import run001 from "../examples/001-useRef.mjs";
import run002 from "../examples/002-useState.mjs";

const allExamples = [run001, run002];

for (const runExample of allExamples) {
  runExample();
}
console.log("Passed");
