# pocket-console

Santa Claus came early this year and gifted this sleak little logging lib written in TypeScript.  

It got colors, log levels, automatic grouping, and yes also some of those unicode chars if you like.  

0, zero, nada, zip, none, no dependencies.  

Controllable via `env` variables.  


```sh
// options are optional.
const options = {module: "ModuleName", level: "error" | "warn" | "info" | "debug", format: "%c%M%t %m %l"};

let console = new Console(options);

// aced has same loglevel threshold as info.
console.aced("Oh yeah!");

console.error("Oh, snap!");

console.warn("Hey, hold on!");

console.info("Heads up!");

console.debug("FYI");

console.rawError("Just output this to stderr");

console.log("stdout logging is not formatted in any way");

// Grouped output (secondary lines are indented).
console.aced("BTW: here is the result", {name: "Bobby", callSign: "0xdeadbeef"});
```

An important feature is that options can ge globally set using `env` variables. So if multiple dependencies of your project is using pocket-console then you can steer the loglevel and logformat for all those loggers, like:  
```sh
logLevel=none node -r ts-node/register ./example/example-one.ts
logLevel=debug logFormat="%c%L" node -r ts-node/register ./example/example-one.ts
```

It does automatic grouping for you, if you have more than one argument or the single argument is non-string.
