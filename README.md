# pocket-console

Santa Claus came early this year and gifted this sleak little logging lib written in TypeScript.  

It is a drop-in replacement of `console`.  

It got colors, log levels, automatic grouping, and yes also some of those unicode chars if you like.  

0, zero, nada, zip, none, no dependencies.  

Also, controllable via `env` variables.  

Colors are automatically turned off when not outputting to a terminal.  


```sh
// options are optional.
const options = {module: "ModuleName", level: "error" | "warn" | "info" | "debug", format: "%c%M%t %m %l"};

let console = PocketConsole(options);

// aced has same loglevel threshold as info.
console.aced("Oh yeah!");

console.error("Oh, snap!");

console.warn("Hey, hold on!");

console.info("Heads up!");

console.debug("FYI");

console.getConsole().error("Use the original console object to output directly to stderr");

console.log("stdout logging is not formatted in any way");

// Grouped output (secondary lines are indented).
console.aced("BTW: here is the result", {name: "Bobby", callSign: "0xdeadbeef"});

// Console's other functionality is still available.
console.table([{col1: "table", col2: "still works"}], ["col1", "col2"]);
```

An important feature is that options can ge globally set using `env` variables. So if multiple dependencies of your project is using pocket-console then you can steer the loglevel and logformat for all those loggers, like:  
```sh
node -r ts-node/register ./example/example-one.ts

LOG_FORMAT="%c%L" node -r ts-node/register ./example/example-one.ts

LOG_LEVEL=none node -r ts-node/register ./example/example-one.ts
```

It does automatic grouping for you, if you have more than one argument or the single argument is non-string.
