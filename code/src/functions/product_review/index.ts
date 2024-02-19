import { client, publicSDK } from '@devrev/typescript-sdk';
import { ApiUtils, HTTPResponse } from '../utils';

export async function handleEvent(event: any) {
  const devrevPAT = event.context.secrets.service_account_token;
  const APIBase = event.execution_metadata.devrev_endpoint;
  const apiUtil: ApiUtils = new ApiUtils(APIBase, devrevPAT);

  const snapInId = event.context.snap_in_id;
  let parameters: string = event.payload.parameters.trim();
  let product: string | undefined;
  let commentID: string | undefined;

  let postResp: HTTPResponse = await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, 'Analyzing your input', 1);
  if (!postResp.success) {
    console.error(`Error while creating timeline entry: ${postResp.message}`);
    return;
  }

  product = parameters;
  postResp = await apiUtil.postTextMessage(snapInId, `Your input is: ${product}`, commentID);
  if (!postResp.success) {
    console.error(`Error while creating timeline entry: ${postResp.message}`);
    return;
  }
  commentID = postResp.data.timeline_entry.id;
}

export const run = async (events: any[]) => {
  for (let event of events) {
    await handleEvent(event);
  }
};

export default run;
