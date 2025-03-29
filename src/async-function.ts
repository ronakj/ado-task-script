import * as tl from 'azure-pipelines-task-lib';
import { type WebApi } from 'azure-devops-node-api';

const AsyncFunction = Object.getPrototypeOf(async () => null).constructor

export declare type AsyncFunctionArguments = {
    tl: typeof tl,
    webApi: WebApi,
    require: NodeJS.Require
};

export function callAsyncFunction<T>(
  args: AsyncFunctionArguments,
  source: string
): Promise<T> {
  const fn = new AsyncFunction(...Object.keys(args), source)
  return fn(...Object.values(args))
}