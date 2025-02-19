import {Status} from './components';

/**
 * Renders the Status component using Ink
 *
 * This function dynamically imports the Ink library and renders a Status component
 * to display progress information. The component is rendered to stderr to avoid
 * interfering with regular stdout output.
 *
 * The function creates a Promise that resolves when the Status component signals
 * completion. The unmount function is stored globally to allow cleanup from other
 * parts of the application.
 *
 * @param {Object} options - The render options
 * @param {number} [options.numberOfPlugins=0] - Number of plugins to process
 * @returns {Promise<void>} A promise that resolves when the Status component completes
 *
 * @example
 * ```typescript
 * await render({ numberOfPlugins: 5 });
 * // Status component is now rendered and will update progress
 * // global.unmount() can be called later to clean up
 * ```
 */
export async function renderStatus({
  numberOfPlugins = 0,
}: {
  numberOfPlugins?: number;
}): Promise<void> {
  const {render} = await import('ink');

  await new Promise(res => {
    const {unmount} = render(
      <Status res={res} numberOfPlugins={numberOfPlugins} />,
      {stdout: process.stderr},
    );
    global.unmount = unmount;
  });
}
