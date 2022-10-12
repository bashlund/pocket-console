import {
    Console,
    LogLevel,
} from "../src/Console";

let console = new Console({module: "Example-One", level: LogLevel.DEBUG});

console.aced("Oh yeah!");
console.error("Oh, snap!");
console.warn("Hey, hold on!");
console.info("Heads up!");
console.debug("FYI");
console.aced("BTW: here is the result", {name: "Bobby", callSign: "0xdeadbeef"});
