import { client, publicSDK } from '@devrev/typescript-sdk';
import { ApiUtils, HTTPResponse } from '../utils';

export async function handleEvent(event: any) {
  const devrevPAT = event.context.secrets.service_account_token;
  const APIBase = event.execution_metadata.devrev_endpoint;
  const apiUtil: ApiUtils = new ApiUtils(APIBase, devrevPAT);

  const tags = event.input_data.resources.tags;
  const inputs = event.input_data.global_values;

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

  const createTicketResp = await apiUtil.createTicket({
    title: product,
    tags: [{ id: tags['test_tag1'].id }],
    body: 'test_body',
    type: publicSDK.WorkType.Ticket,
    owned_by: [inputs['default_owner_id']],
    applies_to_part: inputs['default_part_id'],
  });
  if (!createTicketResp.success) {
    console.error(`Error while creating ticket: ${createTicketResp.message}`);
    return;
  }
  // Post a message with ticket ID.
  const ticketID = createTicketResp.data.work.id;
  const ticketCreatedMessage = `Created ticket: <${ticketID}> for product ${product}`;
  const postTicketResp: HTTPResponse = await apiUtil.postTextMessageWithVisibilityTimeout(
    snapInId,
    ticketCreatedMessage,
    1
  );
  if (!postTicketResp.success) {
    console.error(`Error while creating timeline entry: ${postTicketResp.message}`);
    return;
  }
}

export const run = async (events: any[]) => {
  for (let event of events) {
    await handleEvent(event);
  }
};

export default run;
