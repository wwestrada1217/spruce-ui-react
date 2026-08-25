declare module 'jest-axe' {
  interface AxeResults {
    readonly violations: readonly unknown[];
  }

  export function axe(container: Element): Promise<AxeResults>;
}
