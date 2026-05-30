import { EXAMPLE_CODE } from './generated/exampleCode';

export function getExampleCode(id: string): string {
  const code = EXAMPLE_CODE[id];
  if (!code) {
    throw new Error(
      `No example code registered for "${id}". Did predocs:* run?`,
    );
  }
  return code;
}

export function hasExampleCode(id: string): boolean {
  return Boolean(EXAMPLE_CODE[id]);
}
