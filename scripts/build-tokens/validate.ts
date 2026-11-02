// Validation shared by the readers of tokens.json (decision 0026), from the artifact type's grammar.

const namePattern: RegExp = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/u;
const lengthPattern: RegExp = /^(?:-?(?:\d+\.?\d*|\.\d+)(?:px|rem|em|%)|0)$/u;

function fail(where: string, problem: string): never {
  throw new Error(`${where}: ${problem}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function records(value: unknown, where: string): Record<string, unknown>[] {
  if (!(Array.isArray(value) && value.every(isRecord))) {
    fail(where, "not a list of objects");
  }
  return value;
}

function readName(
  raw: Record<string, unknown>,
  family: string,
  used: Set<string>,
): string {
  const name = raw["name"];
  const where = `${family} "${String(name)}"`;
  if (!(typeof name === "string" && namePattern.test(name))) {
    fail(where, "bad name");
  }
  if (used.has(name)) {
    fail(where, "name already used");
  }
  used.add(name);
  return name;
}

function readLength(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value}px`;
  }
  return typeof value === "string" && lengthPattern.test(value)
    ? value
    : undefined;
}

export {
  fail,
  isRecord,
  lengthPattern,
  namePattern,
  readLength,
  readName,
  records,
};
