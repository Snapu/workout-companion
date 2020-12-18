import { StackdriverLogger } from "@josros/stackdriver-logger";
import { v4 } from "uuid";
import { State } from "./state";

class Logger {
  @State()
  public id: string | null = null;
  private stackdriver: StackdriverLogger;

  constructor() {
    if (!this.id) {
      this.id = v4();
    }
    this.stackdriver = new StackdriverLogger(
      process.env.VUE_APP_IAM_ISSUER,
      process.env.VUE_APP_IAM_PRIVATE_KEY,
      process.env.VUE_APP_PROJECT_ID
    );
  }

  public async log(data: any): Promise<void> {
    console.debug("KpiLogger:", data);
    if (process.env.NODE_ENV !== "production") {
      return;
    }
    try {
      await this.stackdriver.log([
        {
          severity: data.error ? "WARNING" : "INFO",
          jsonPayload: {
            userId: this.id,
            userAgent: navigator.userAgent,
            language: navigator.language,
            version: process.env.VUE_APP_VERSION,
            ...data
          }
        }
      ]);
    } catch (error) {
      console.warn(error);
    }
  }
}

const logger = new Logger();

export default logger;

export function Log(message: string, logArgs: boolean = false) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;

    const method = target.constructor.name + "." + propertyKey;

    const createLog = (start: number, args: any, error?: Error) => ({
      message,
      method,
      duration: Date.now() - start,
      ...(logArgs ? { args } : {}),
      ...(error
        ? {
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack
            }
          }
        : {})
    });

    descriptor.value = async function(...args: any) {
      const start = Date.now();
      try {
        const result = await original.apply(this, args);
        await logger.log(createLog(start, args));
        return result;
      } catch (error) {
        await logger.log(createLog(start, args, error));
        throw error;
      }
    };

    return descriptor;
  };
}
