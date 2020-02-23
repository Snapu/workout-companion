export class SpreadsheetNotPickedError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "SpreadsheetNotPickedError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
