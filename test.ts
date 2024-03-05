class LLMUtils {
  private hfAPIKey: string;
  private fireworksAPIKey: string;

  constructor(hfAPIKey: string, fireworksAPIKey: string) {
    this.hfAPIKey = hfAPIKey;
    this.fireworksAPIKey = fireworksAPIKey;
  }

  async sentimentAnalysis(tweet: any) {
    try {
      const text = tweet["text"];

      const data = { inputs: text };
      const response = await fetch(
        "https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis",
        {
          headers: { Authorization: `Bearer ${this.hfAPIKey}` },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result: any = await response.json();
      const sentimentLabel = result[0][0]["label"];
      const sentimentScore = result[0][0]["score"];

      return {
        sentimentLabel,
        sentimentScore,
      };
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async summarizer(tweets: string, query: string) {
    const prompt = `Your role is to summarise these tweets that were extracted for the given query
    <Tweets>
    ${tweets}
  
    <Query>
    ${query}
    `;
    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.fireworksAPIKey}`,
        },
        body: JSON.stringify({
          model: "accounts/fireworks/models/mixtral-8x7b-instruct",
          max_tokens: 4096,
          top_p: 1,
          top_k: 40,
          presence_penalty: 0,
          frequency_penalty: 0,
          temperature: 0.6,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const result = await response.json();
    const reply = result["choices"][0]["message"];

    const summary = reply["content"];

    return summary;
  }

  async shortInsights(
    query: string,
    summary: string,
    avg_neutrals: number,
    avg_positives: number,
    avg_negatives: number,
    avg_favs: number,
    avg_replies: number,
    avg_user_following: number,
    avg_views: number
  ) {
    const prompt = `You are a chatbot capable of analysing and understanding requirements and sending insights on the same. 
      Your role is to analyse the <Summary for insight> for a particular <Query from user> and its related twitter <Metrics>
      After your analysis your role is to provide 5 very specific and actionable insights to improve the product of that company based on the <Query from user>
      
      <Query from user>
      ${query}
  
      <Summary for insight>
      ${summary}
  
      <Metrics>
      Average Views : ${avg_views}
      Average Likes : ${avg_favs}
      Sentiment : ${avg_neutrals}% Neutral, ${avg_negatives}% Negative and ${avg_positives}% Positive
      Average Engagement : ${avg_replies}
      Average User Following of Tweet Author : ${avg_user_following}
      
      <Insights>
      `;

    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.fireworksAPIKey}`,
        },
        body: JSON.stringify({
          model: "accounts/fireworks/models/mixtral-8x7b-instruct",
          max_tokens: 4096,
          top_p: 1,
          top_k: 40,
          presence_penalty: 0,
          frequency_penalty: 0,
          temperature: 0.6,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const result = await response.json();
    const reply = result["choices"][0]["message"];

    const insights = reply["content"];

    return insights;
  }

  async tweet_insights(
    query: string,
    text: string,
    sentiment: string,
    user_following: number,
    replies: number,
    views: number,
    favs: number
  ) {
    const prompt = `You are a chatbot capable of analysing and understanding requirements and sending insights on the same. Your role is to analyze the tweet for a particular <Query from users> and its related Twitter <Metrics> with reference to <Tweet for insight>. After your analysis, your role is to provide 2 very factual, specific, and actionable <Insights> to improve the product image.
  
      <Query from users>
      ${query}
      <Tweet for insight>
      ${text}
      <Metrics>
      Average Views: ${views}
      Average Likes: ${favs}
      Sentiment: ${sentiment}
      Average Engagement: ${replies}
      Average User Following of Tweet Author: ${user_following}
      <Insights>
      `;

    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.fireworksAPIKey}`,
        },
        body: JSON.stringify({
          model: "accounts/fireworks/models/mixtral-8x7b-instruct",
          max_tokens: 4096,
          top_p: 1,
          top_k: 40,
          presence_penalty: 0,
          frequency_penalty: 0,
          temperature: 0.6,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const result = await response.json();
    const reply = result["choices"][0]["message"];

    const insights = reply["content"];

    return insights;
  }

  async detailedInsights(
    query: string,
    summary: string,
    avg_neutrals: number,
    avg_positives: number,
    avg_negatives: number,
    avg_favs: number,
    avg_replies: number,
    avg_user_following: number,
    avg_views: number
  ) {
    const prompt = `You are a chatbot capable of analysing and understanding requirements and sending insights on the same. 
      Your role is to analyse the <Summary for insight> for a particular <Query from user> and its related twitter <Metrics>
      After your analysis your role is to provide 10 very specific and actionable insights to improve the product of that company based on the <Query from user>
      
      <Query from user>
      ${query}
  
      <Summary for insight>
      ${summary}
  
      <Metrics>
      Average Views : ${avg_views}
      Average Likes : ${avg_favs}
      Sentiment : ${avg_neutrals}% Neutral, ${avg_negatives}% Negative and ${avg_positives}% Positive
      Average Engagement : ${avg_replies}
      Average User Following of Tweet Author : ${avg_user_following}
      
      <Insights>
      `;

    const response = await fetch(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer 5PCMarcJBD5QMXI5o5GsUYqufgKdBT5pHDj4JwtR8J9f6ob3`,
        },
        body: JSON.stringify({
          model: "accounts/fireworks/models/mixtral-8x7b-instruct",
          max_tokens: 4096,
          top_p: 1,
          top_k: 40,
          presence_penalty: 0,
          frequency_penalty: 0,
          temperature: 0.6,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    const result = await response.json();
    const reply = result["choices"][0]["message"];

    const det_insights = reply["content"];

    let tags = det_insights
      .split(/\d+\./)
      .filter((sentence: string) => sentence.trim() !== "");
    tags = tags.map((sentence: string) => sentence.trim());

    return {
      det_insights: det_insights,
      tags: tags,
    };
  }
}

class TwitterUtils {
  private twitterAPIkey!: string;

  constructor(twitterAPIkey: string) {
    this.twitterAPIkey = twitterAPIkey;
  }

  async getTweets(
    query: string,
    minLikes: number,
    minRetweets: number,
    limit: number,
    daysAgo: number
  ) {
    const baseUrl: string = "https://twitter154.p.rapidapi.com/search/search";

    const daysAgoDate = new Date();
    daysAgoDate.setDate(daysAgoDate.getDate() - daysAgo);

    const queryParams: Record<string, any> = {
      query: query,
      section: "top",
      min_retweets: minRetweets,
      min_likes: minLikes,
      limit: 5,
      start_date: daysAgoDate.toISOString().split("T")[0],
      language: "en",
    };

    const searchParams: URLSearchParams = new URLSearchParams(queryParams);

    const urlWithParams: string = `${baseUrl}?${searchParams.toString()}`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": this.twitterAPIkey,
        "X-RapidAPI-Host": "twitter154.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(urlWithParams, options);
      const result = await response.json();
      console.log("Number of tweets retrieved: " + result["results"].length);

      const data = result["results"];
      let finalData = [];

      for (const tweet of data) {
        try {
          finalData.push(this.formatTweet(tweet));
        } catch (err) {
          console.log(err);
          continue;
        }
      }

      return finalData;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  formatTweet(tweet: any) {
    try {
      const user_following = tweet["user"]["follower_count"];
      const replies = tweet["reply_count"];
      const views = tweet["views"];
      const favs = tweet["favorite_count"];
      const text = tweet["text"];
      const valid = true;

      return {
        text,
        favs,
        views,
        replies,
        user_following,
        valid,
      };
    } catch (error) {
      console.log(error);
      return {
        valid: false,
      };
    }
  }
}

const product = "Apple Vision Pro";

const twitter_utils = new TwitterUtils(
  "e2b67bdcdbmshf01327ba37288f4p188af1jsnb3c0b43dcb3a"
);
const llm_utils = new LLMUtils(
  "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",
  "5PCMarcJBD5QMXI5o5GsUYqufgKdBT5pHDj4JwtR8J9f6ob3"
);

const main = async () => {
  let tweetsAll = "";
  let insightsAll = "";
  let total_neutrals = 0;
  let total_positives = 0;
  let total_negatives = 0;
  let total_user_following = 0;
  let total_views = 0;
  let total_replies = 0;
  let total_favs = 0;

  const twitterData = await twitter_utils.getTweets(product, 100, 5, 5, 10);
  const getInsights = twitterData.map(async (tweet: any) => {
    let tweetText = tweet["text"];
    let userFollowing = tweet["user_following"];
    let tweetReplies = tweet["replies"];
    let tweetFavs = tweet["favs"];
    let tweetViews = tweet["views"];

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
    tweet["sentiment"] = sentiment;

    if (sentiment.sentimentLabel === "NEU") {
      total_neutrals += 1;
    } else if (sentiment.sentimentLabel === "POS") {
      total_positives += 1;
    } else {
      total_negatives += 1;
    }

    total_user_following += userFollowing;
    total_replies += tweetReplies;
    total_views += tweetViews;
    total_favs += tweetFavs;

    tweetsAll += tweetText + "\t";
    insightsAll += insight + "\t";
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

  console.log(summary);

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

  const cleanedShortInsights = shortInsights.replace(/\*\*/g, "");

  console.log(cleanedShortInsights);

  const detailedInsights = await llm_utils.detailedInsights(
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

  const cleanedDetailedInsights = detailedInsights.det_insights.replace(
    /\*\*/g,
    ""
  );

  console.log(cleanedDetailedInsights);

  detailedInsights.tags.map(async (tag: string) => {
    console.log(tag);
  });

  return detailedInsights.tags;
};

main().then((response) => {
  console.log(response);
});
