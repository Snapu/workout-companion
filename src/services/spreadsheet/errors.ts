export class SpreadsheetNotPickedError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "SpreadsheetNotPickedError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NoColumnError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "NoColumnError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class EmptySheetError extends Error {
  public constructor(message?: string) {
    super(message);
    this.name = "EmptySheet";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
