import {
    PocketConsole,
    LogLevel,
} from "../src/PocketConsole";

let console = PocketConsole({module: "Example-One", level: LogLevel.DEBUG});

let console2 = PocketConsole({module: "Example-Two", level: LogLevel.DEBUG});

const NAME = "Sven Svensson";

class O {
    protected name: string;

    constructor() {
        this.name = NAME;
    }

    public toString(): string {
        return `This is a toString() description of the class instance where name is ${this.name}.
New lines supported as return from toString().
Really long lines are split on the current terminal width, in the case stderr is a terminal and not being redirected to a file. Good to know is that lines splitted are also stripped of initial spaces.`
    }
}

const o = new O();
const o2 = {name: NAME};

console.aced(o, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30], o2);

console2.error("Oh, snap!");

console.warn("Hey, hold on!");

console2.info("Heads up!");

console.debug("FYI", {status: "pending", a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9, j:10, klmno:1234, pqrst:6789}, "Hello");

console.aced("Looking good", o2, Buffer.from("Hello World"));

console.info("BTW: here is the result", {name: "Bobby", callSign: "0xdeadbeef"});

console.getConsole().error("Access to raw stderr output also supported.");

console.log("Just some regular stdout output");

console.table([{col1: "table", col2: "Works as expected"}], ["col1", "col2"]);

console.setFormat("%c[%L%l] %t [%m]%C ");

console.debug("Look here, I just changed the output format.");

console.pushFormat("%c %L ");

console.debug(`I just changed the output format *temporarily* using pushFormat("%c %L ").`);

console.popFormat();

console.debug("Changed it back using popFormat()");
