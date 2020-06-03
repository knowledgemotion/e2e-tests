// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ElementContext, RunOptions } from 'axe-core';

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      checkA11y(
        threshold?: number,
        context?: ElementContext,
        options?: RunOptions,
      ): void;
    }
  }
}
