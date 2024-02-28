import { client, publicSDK } from '@devrev/typescript-sdk';
import { ApiUtils, HTTPResponse } from '../product_review/utils';

export async function handleEvent(event: any) {
  const devrevPAT = event.context.secrets.service_account_token;
  const APIBase = event.execution_metadata.devrev_endpoint;
  const apiUtil: ApiUtils = new ApiUtils(APIBase, devrevPAT);

  const snapInId = event.context.snap_in_id;
  let commentID: string | undefined;

  // Send a help message in CLI help format.
  const helpMessage = `help message`;
  let postResp = await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, helpMessage, 1);
  if (!postResp.success) {
    console.error(`Error while creating timeline entry: ${postResp.message}`);
    return;
  }
  return;
}

export const run = async (events: any[]) => {
  for (let event of events) {
    await handleEvent(event);
  }
};

export default run;
