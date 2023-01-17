/**
 * Copy and extend the `console` object with nice (colored) formatting and level thresholds.
 *
 * do `let console = PocketConsole()` to replace the current console object.
 *
 * The common functions are available and the following are replaced:
 *  error - outputs to stderr with formatting on log level ERROR.
 *  warn - outputs to stderr with formatting on log level WARN.
 *  info - outputs to stderr with formatting on log level INFO.
 *  debug - outputs to stderr with formatting on log level DEBUG.
 *
 * This function is added:
 *  aced - outputs to stderr with formatting on log level INFO,
 *       but can be differently colored than info logging to signal
 *       that an operation was totally ACED.
 *
 * The logger does automatic grouping when providing multiple
 * arguments to the logging functions.
 *
 * Options provided in to the creator function can be overridden by setting env variables.
 * process.env.LOG_LEVEL = "debug" | "info" | "warn" | "error" | "none"
 * process.env.LOG_FORMAT overrides the format string.
 */

export enum LogLevel {
    DEBUG   = "debug",
    INFO    = "info",
    WARN    = "warn",
    ERROR   = "error",
    NONE    = "none",
}

export type PocketConsoleOptions = {
    /**
     * The name of the module doing the logging, optional.
     * "%m" show the module name if used in the log format.
     */
    module?: string,

    /**
     * Threshold of logging level.
     * Any logging below this level will not be output.
     * Default is LogLevel.INFO.
     */
    level?: LogLevel,

    /**
     * How to format the prefix of the output.
     * %c turn colors on (ignored if output is not terminal).
     *      Each log level has its own color.
     * %C turn colors off
     * %t - the time
     * %l - the log level
     * %L - the log unicode character (requires terminal and that the terminal supports unicode)
     * %m - the module name.
     * Default is "%t %c[%l]%C [%m] ".
     */
    format?: string,

    /** If true then use useToString() functions on object if exists. */
    useToString?: boolean,
};

export type PocketConsoleType = Console & {
    aced: Function;
    setFormat: (format: string | undefined) => void,
    setLevel: (level: LogLevel | string | undefined) => void,
    getConsole: () => Console,
    isPocket: boolean,
};

const EMOJIS: {[level: string]: string} = {
    ["ERROR"]: "\u2717 ",
    ["WARN "]: "\u2691 ",
    ["INFO "]: "\u2605 ",
    ["ACED "]: "\u2713 ",
    ["DEBUG"]: "\u2606 ",
};

const COLORS: {[level: string]: string} = {
    DEFAULT: "\x1b[0m",
    ["ERROR"]: "\x1b[31m",
    ["WARN "]: "\x1b[33m",
    ["INFO "]: "\x1b[36m",
    ["ACED "]: "\x1b[32m",
    ["DEBUG"]: "\x1b[34m",
};

//@ts-ignore
if (console.isPocket) {
    throw new Error("Global console object is already PocketConsole.");
}

const originalConsole   = console;
const consoleError      = console.error;
const consoleGroup      = console.group;
const consoleGroupEnd   = console.groupEnd;


/**
 * Return the original unaltered console object.
 */
const getConsole = (): Console => {
    return originalConsole;
};

export const PocketConsole = (consoleOptions?: PocketConsoleOptions): PocketConsoleType => {
    const options: PocketConsoleOptions = {
        module: consoleOptions?.module ?? "",
        level: LogLevel.INFO,
        format: "%t %c[%L%l]%C [%m] ",
        useToString: consoleOptions?.useToString ?? true,
    };

    const isTerminal = process?.stderr?.isTTY ?? false;

    const setFormat = (format: string | undefined) => {
        if (format !== undefined) {
            if (format.match(/^[ -~]*$/)) {
                options.format = format;
            }
        }
    };

    const stderr = (level: string, ...args: any[]) => {
        const date = new Date();
        const time = String(date.getFullYear()) + "-" + String(date.getMonth() + 1).padStart(2, "0") +
            "-" + String(date.getDate()).padStart(2, "0") + "T" +
            String(date.getHours()).padStart(2, "0") + ":" +
            String(date.getMinutes()).padStart(2, "0") + ":" +
            String(date.getSeconds()).padStart(2, "0");

        const regEx = /^([^%]*)%(.)/;
        let format = options.format ?? "";
        let prefix = "";
        let coloring=false;
        while (true) {
            const match = regEx.exec(format);
            if (!match) {
                prefix = `${prefix}${format}`;
                break;
            }
            format = format.slice(match[0].length);
            prefix = `${prefix}${match[1]}`;
            if (match[2] === 't') {
                prefix = `${prefix}${time}`;
            }
            else if (match[2] === 'l') {
                prefix = `${prefix}${level}`;
            }
            else if (match[2] === 'm') {
                prefix = `${prefix}${options.module}`;
            }
            else if (match[2] === 'c') {
                if (isTerminal) {
                    prefix = `${prefix}${COLORS[level]}`;
                    coloring = true;
                }
            }
            else if (match[2] === 'C') {
                if (isTerminal) {
                    prefix = `${prefix}${COLORS.DEFAULT}`;
                    coloring = false;
                }
            }
            else if (match[2] === 'L') {
                if (isTerminal) {
                    prefix = `${prefix}${EMOJIS[level]}`;
                }
            }
            else {
                prefix = `${prefix}%`;
            }
        }

        if (args.length === 0) {
            consoleError(prefix);
        }
        else if (args.length === 1 && typeof(args[0]) === "string") {
            consoleError(`${prefix}${args[0]}`);
        }
        else {
            if (args[0] === null || args[0] === undefined || typeof args[0] !== "object") {
                consoleGroup(`${prefix}${args[0]}`);  // forces toString on args[0].
                args.shift();
            }
            else {
                consoleGroup(`${prefix}`);
            }

            args.forEach( obj => {
                if (obj && obj.constructor !== Object && !Array.isArray(obj) && !Buffer.isBuffer(obj) && typeof obj.toString === "function" && options.useToString) {
                    consoleError(obj.toString());
                }
                else {
                    consoleError(obj);
                }
            });

            consoleGroupEnd();
        }

        if (coloring && isTerminal) {
            consoleError(COLORS.DEFAULT);
        }
    };

    const setLevel = (level: LogLevel | string | undefined) => {
        if (level === LogLevel.DEBUG) {
            options.level = LogLevel.DEBUG;
        }
        else if (level === LogLevel.INFO) {
            options.level = LogLevel.INFO;
        }
        else if (level === LogLevel.WARN) {
            options.level = LogLevel.WARN;
        }
        else if (level === LogLevel.NONE) {
            options.level = LogLevel.NONE;
        }
        else if (level === LogLevel.ERROR) {
            options.level = LogLevel.ERROR;
        }
    };

    const error = (...args: any[]) => {
        if ([LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR].includes(options.level!)) {
            stderr("ERROR", ...args);
        }
    };

    const warn = (...args: any[]) => {
        if ([LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN].includes(options.level!)) {
            stderr("WARN ", ...args);
        }
    };

    const info = (...args: any[]) => {
        if ([LogLevel.DEBUG, LogLevel.INFO].includes(options.level!)) {
            stderr("INFO ", ...args);
        }
    };

    /**
     * Same log level as INFO, but can be differently colored.
     */
    const aced = (...args: any[]) => {
        if ([LogLevel.DEBUG, LogLevel.INFO].includes(options.level!)) {
            stderr("ACED ", ...args);
        }
    };

    const debug = (...args: any[]) => {
        if ([LogLevel.DEBUG].includes(options.level!)) {
            stderr("DEBUG", ...args);
        }
    };

    setLevel(process?.env?.LOG_LEVEL ?? consoleOptions?.level);
    setFormat(process?.env?.LOG_FORMAT ?? consoleOptions?.format);

    const pocketConsole: any = {};

    for (let p in originalConsole) {
        //@ts-ignore
        pocketConsole[p] = originalConsole[p];
    }

    pocketConsole.error         = error;
    pocketConsole.warn          = warn;
    pocketConsole.debug         = debug;
    pocketConsole.info          = info;
    pocketConsole.aced          = aced;
    pocketConsole.setFormat     = setFormat;
    pocketConsole.setLevel   = setLevel;
    pocketConsole.getConsole    = getConsole;
    pocketConsole.isPocket      = true;

    return pocketConsole;
};
