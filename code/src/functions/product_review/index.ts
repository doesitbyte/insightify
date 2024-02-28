import { client, publicSDK } from '@devrev/typescript-sdk';
import { LLMUtils } from './llm_utils';
import { TwitterUtils } from './twitter_utils';
import { ApiUtils, HTTPResponse } from './utils';

export async function handleEvent(event: any) {
  const devrevPAT = event.context.secrets.service_account_token;
  const APIBase = event.execution_metadata.devrev_endpoint;
  const apiUtil: ApiUtils = new ApiUtils(APIBase, devrevPAT);

  const twitterApiKey: string = event.input_data.keyrings.twitter_api_key;
  const hfApiKey: string = event.input_data.keyrings.hf_api_key;
  const fireWorksApiKey: string = event.input_data.keyrings.fireworks_api_key;

  const tags = event.input_data.resources.tags;
  const inputs = event.input_data.global_values;

  const snapInId = event.context.snap_in_id;
  let parameters: string = event.payload.parameters.trim();

  const twitter_utils: TwitterUtils = new TwitterUtils(twitterApiKey);
  const llm_utils: LLMUtils = new LLMUtils(hfApiKey, fireWorksApiKey);

  let product: string;
  product = parameters;

  await apiUtil.postTextMessageWithVisibilityTimeout(
    snapInId,
    `Gathering data and performing analysis for ${product}`,
    1
  );

  let tweetsAll = '';
  let insightsAll = '';
  let total_neutrals = 0;
  let total_positives = 0;
  let total_negatives = 0;
  let total_user_following = 0;
  let total_views = 0;
  let total_replies = 0;
  let total_favs = 0;

  const twitterData = await twitter_utils.getTweets(product, 100, 5, 5, 10);
  const getInsights = twitterData.map(async (tweet: any) => {
    let tweetText = tweet['text'];
    let userFollowing = tweet['userFollowing'];
    let tweetReplies = tweet['reply_count'];
    let tweetFavs = tweet['favorite_count'];
    let tweetViews = tweet['views'];

    const sentiment = await llm_utils.sentimentAnalysis(tweet);
    const insight = await llm_utils.tweet_insights(
      product,
      tweetText,
      sentiment.sentimentLabel,
      userFollowing,
      tweetReplies,
      tweetViews,
      tweetFavs
    );
    tweet['sentiment'] = sentiment;

    if (sentiment.sentimentLabel === 'NEU') {
      total_neutrals += 1;
    } else if (sentiment.sentimentLabel === 'POS') {
      total_positives += 1;
    } else {
      total_negatives += 1;
    }

    total_user_following += userFollowing;
    total_replies += tweetReplies;
    total_views += tweetViews;
    total_favs += tweetFavs;

    tweetsAll += tweetText + '\t';
    insightsAll += insight + '\t';
  });
  await Promise.all(getInsights);

  const limit = twitterData.length;
  const avg_neutrals = total_neutrals / limit;
  const avg_positives = total_positives / limit;
  const avg_negatives = total_negatives / limit;
  const avg_user_following = total_user_following / limit;
  const avg_views = total_views / limit;
  const avg_replies = total_replies / limit;
  const avg_favs = total_favs / limit;

  const summary = await llm_utils.summarizer(tweetsAll, product);

  await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, `\n\nSummary:\n\n ${summary}`, 1);

  const shortInsights = await llm_utils.shortInsights(
    product,
    summary,
    avg_neutrals,
    avg_positives,
    avg_negatives,
    avg_favs,
    avg_replies,
    avg_user_following,
    avg_views
  );

  const cleanedShortInsights = shortInsights.replace(/\*\*/g, '');

  await apiUtil.postTextMessageWithVisibilityTimeout(snapInId, `\n\nQuick Insights:\n\n ${cleanedShortInsights}`, 1);

  const detailedInsights = await llm_utils.detailedInsights(
    product,
    insightsAll,
    avg_neutrals,
    avg_positives,
    avg_negatives,
    avg_favs,
    avg_replies,
    avg_user_following,
    avg_views
  );

  const cleanedDetailedInsights = detailedInsights.replace(/\*\*/g, '');

  await apiUtil.postTextMessageWithVisibilityTimeout(
    snapInId,
    `\n\nDetailed Insights:\n\n ${cleanedDetailedInsights}`,
    1
  );

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
