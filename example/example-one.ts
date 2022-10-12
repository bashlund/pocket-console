import {
    PocketConsole,
    LogLevel,
} from "../src/PocketConsole";

let console = PocketConsole({module: "Example-One", level: LogLevel.DEBUG});

console.aced("Oh yeah!");
console.error("Oh, snap!");
console.warn("Hey, hold on!");
console.info("Heads up!");
console.debug("FYI");
console.aced("BTW: here is the result", {name: "Bobby", callSign: "0xdeadbeef"});
console.getConsole().error("Man, what a boring unformatted stderr message this is...");
console.log("Just some regular stdout output");
console.table([{col1: "table", col2: "still works"}], ["col1", "col2"]);

console.setFormat("%c[%L%l] %t [%m]%C ");
console.debug("FYI: I changed the output format.");
