import { callAsyncFunction } from './async-function';
import { wrapRequire } from './wrap-require';
import * as tl from 'azure-pipelines-task-lib/task';
import { getWebApiWithProxy } from "./web-api";

process.on('unhandledRejection', handleError);

async function run() {
  const script: string | undefined = tl.getInput('script', true);
  const maxRetriesInput: string | undefined = tl.getInput('maxRetries', false);

  const maxRetries = isNaN(Number(maxRetriesInput)) ? 5 : Number(maxRetriesInput);
  const webApi = getWebApiWithProxy({ allowRetries: maxRetries > 0, maxRetries });

  if (!script) {
    throw new Error('Script input is required');
  }

  const result = await callAsyncFunction(
    {
      require: wrapRequire,
      webApi,
      tl
    },
    script
  );

  tl.setResult(tl.TaskResult.Succeeded, 'Script executed successfully');
  if (result !== undefined) {
    tl.setVariable('result', typeof result === "string" ? result : JSON.stringify(result), false, true);
  }
}

function handleError(err: any): void {
  tl.setResult(tl.TaskResult.Failed, `Unhandled error: ${err.message}`);
  console.error(err)
}

run().catch(handleError);
