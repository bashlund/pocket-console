export enum LogLevel {
    DEBUG   = "debug",
    INFO    = "info",
    WARN    = "warn",
    ERROR   = "error",
    NONE    = "none",
}

export type ConsoleOptions = {
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
};

const EMOJIS: {[level: string]: string} = {
    ["ERROR"]: "\u2717 ",
    ["WARN "]: "\u2691 ",
    ["INFO "]: "\u2605 ",
    ["ACED "]: "\u2713 ",
    ["DEBUG"]: "\u2605 ",
};

const COLORS: {[level: string]: string} = {
    DEFAULT: "\x1b[0m",
    ["ERROR"]: "\x1b[31m",
    ["WARN "]: "\x1b[33m",
    ["INFO "]: "\x1b[36m",
    ["ACED "]: "\x1b[32m",
    ["DEBUG"]: "\x1b[34m",
};

const originalConsole = console;

/**
 * Simple but sufficient console logging.
 * do `console = new Console()` to replace the current console object.
 * The common functions are available with some added.
 *  rawError - outputs directly to stderr without any formatting.
 *  error - outputs to stderr with formatting on log level ERROR.
 *  warn - outputs to stderr with formatting on log level WARN.
 *  info - outputs to stderr with formatting on log level INFO.
 *  aced - outputs to stderr with formatting on log level INFO,
 *       but can be differently colored than info logging to signal
 *       that an operation was totally ACED.
 *  debug - outputs to stderr with formatting on log level DEBUG.
 *  log - outputs directly to stdout without any formatting.
 *
 * The logger does automatic grouping when providing multiple arguments
 * to the logging functions.
 *
 * Options provided in the constructor can be overridden by setting env variables.
 * process.env.level = "debug" | "info" | "warn" | "error" | "none"
 * process.env.format overrides the format string.
 */
export class Console {
    protected options: ConsoleOptions;
    protected isTerminal: boolean;

    constructor(options?: ConsoleOptions) {
        this.options = {
            module: options?.module ?? "",
            level: LogLevel.INFO,
            format: "%t %c[%L%l]%C [%m] ",
        };
        this.isTerminal = process?.stderr?.isTTY ?? false;
        this.setLevel(process?.env?.logLevel ?? options?.level);
        this.setFormat(process?.env?.logFormat ?? options?.format);
    }

    public setFormat(format: string | undefined) {
        if (format !== undefined) {
            if (format.match(/^[ -~]*$/)) {
                this.options.format = format;
            }
        }
    }

    public setLevel(level: LogLevel | string | undefined) {
        if (level === LogLevel.DEBUG) {
            this.options.level = LogLevel.DEBUG;
        }
        else if (level === LogLevel.INFO) {
            this.options.level = LogLevel.INFO;
        }
        else if (level === LogLevel.WARN) {
            this.options.level = LogLevel.WARN;
        }
        else if (level === LogLevel.NONE) {
            this.options.level = LogLevel.NONE;
        }
        else if (level === LogLevel.ERROR) {
            this.options.level = LogLevel.ERROR;
        }
    }

    public error(...args: any[]) {
        if ([LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR].includes(this.options.level!)) {
            this.stderr("ERROR", ...args);
        }
    }

    public warn(...args: any[]) {
        if ([LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN].includes(this.options.level!)) {
            this.stderr("WARN ", ...args);
        }
    }

    public info(...args: any[]) {
        if ([LogLevel.DEBUG, LogLevel.INFO].includes(this.options.level!)) {
            this.stderr("INFO ", ...args);
        }
    }

    /**
     * Same log level as INFO, but can be differently colored.
     */
    public aced(...args: any[]) {
        if ([LogLevel.DEBUG, LogLevel.INFO].includes(this.options.level!)) {
            this.stderr("ACED ", ...args);
        }
    }

    public debug(...args: any[]) {
        if ([LogLevel.DEBUG].includes(this.options.level!)) {
            this.stderr("DEBUG", ...args);
        }
    }

    public log(...args: any[]) {
        originalConsole.log(...args);
    }

    public rawError(...args: any) {
        originalConsole.error(...args);
    }

    protected stderr(level: string, ...args: any[]) {
        const date = new Date();
        const time = String(date.getFullYear()) + "-" + String(date.getMonth() + 1).padStart(2, "0") +
            "-" + String(date.getDate()).padStart(2, "0") + "T" +
            String(date.getHours()).padStart(2, "0") + ":" +
            String(date.getMinutes()).padStart(2, "0") + ":" +
            String(date.getSeconds()).padStart(2, "0");

        const regEx = /^([^%]*)%(.)/;
        let format = this.options.format ?? "";
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
                prefix = `${prefix}${this.options.module}`;
            }
            else if (match[2] === 'c') {
                if (this.isTerminal) {
                    prefix = `${prefix}${COLORS[level]}`;
                    coloring = true;
                }
            }
            else if (match[2] === 'C') {
                if (this.isTerminal) {
                    prefix = `${prefix}${COLORS.DEFAULT}`;
                    coloring = false;
                }
            }
            else if (match[2] === 'L') {
                if (this.isTerminal) {
                    prefix = `${prefix}${EMOJIS[level]}`;
                }
            }
            else {
                prefix = `${prefix}%`;
            }
        }

        if (args.length === 0) {
            originalConsole.error(prefix);
        }
        else if (args.length === 1 && typeof(args[0]) === "string") {
            originalConsole.error(`${prefix}${args[0]}`);
        }
        else {
            originalConsole.group(`${prefix}${args[0]}`);  // forces toString on args[0].
            if (typeof(args[0]) === "string") {
                // If first arg was string, it is used for group heading above then discarded.
                args.shift();
            }
            args.forEach( obj => {
                originalConsole.error(obj);
            });
            originalConsole.groupEnd();
        }

        if (coloring && this.isTerminal) {
            originalConsole.error(COLORS.DEFAULT);
        }
    }
}
