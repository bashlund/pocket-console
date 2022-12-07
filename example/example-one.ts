import {
    PocketConsole,
    LogLevel,
} from "../src/PocketConsole";

let console = PocketConsole({module: "Example-One", level: LogLevel.DEBUG});

let console2 = PocketConsole({module: "Example-Two", level: LogLevel.DEBUG});

class O {
    protected name: string;

    constructor() {
        this.name = "Puttle McFnattle";
    }

    public toString(): string {
        return `toString description of the class instance where name is ${this.name}`;;
    }
}

const o = new O();
const o2 = {name: "Puttle McFnattle"};

console.aced(o, [1,2,3], o2);

console.aced("Looking good", o2, Buffer.from("Hello World"));

console2.error("Oh, snap!");

console.warn("Hey, hold on!");

console2.info("Heads up!");

console.debug("FYI", {status: "pending"});

console.info("BTW: here is the result", {name: "Bobby", callSign: "0xdeadbeef"});

console.getConsole().error("Man, what a boring unformatted stderr message this is...");

console.log("Just some regular stdout output");

console.table([{col1: "table", col2: "still works"}], ["col1", "col2"]);

console.setFormat("%c[%L%l] %t [%m]%C ");

console.debug("Look here, I just changed the output format.");
