export class LLMUtils {
  private hfAPIKey: string;
  private fireworksAPIKey: string;

  constructor(hfAPIKey: string, fireworksAPIKey: string) {
    this.hfAPIKey = hfAPIKey;
    this.fireworksAPIKey = fireworksAPIKey;
  }

  async sentimentAnalysis(tweet: any) {
    try {
      const text = tweet['text'];

      const data = { inputs: text };
      const response = await fetch(
        'https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis',
        {
          headers: { Authorization: `Bearer ${this.hfAPIKey}` },
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      const result: any = await response.json();
      const sentimentLabel = result[0][0]['label'];
      const sentimentScore = result[0][0]['score'];

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
    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.fireworksAPIKey}`,
      },
      body: JSON.stringify({
        model: 'accounts/fireworks/models/mixtral-8x7b-instruct',
        max_tokens: 4096,
        top_p: 1,
        top_k: 40,
        presence_penalty: 0,
        frequency_penalty: 0,
        temperature: 0.6,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const result = await response.json();
    const reply = result['choices'][0]['message'];

    const summary = reply['content'];

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

    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.fireworksAPIKey}`,
      },
      body: JSON.stringify({
        model: 'accounts/fireworks/models/mixtral-8x7b-instruct',
        max_tokens: 4096,
        top_p: 1,
        top_k: 40,
        presence_penalty: 0,
        frequency_penalty: 0,
        temperature: 0.6,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const result = await response.json();
    const reply = result['choices'][0]['message'];

    const insights = reply['content'];

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

    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.fireworksAPIKey}`,
      },
      body: JSON.stringify({
        model: 'accounts/fireworks/models/mixtral-8x7b-instruct',
        max_tokens: 4096,
        top_p: 1,
        top_k: 40,
        presence_penalty: 0,
        frequency_penalty: 0,
        temperature: 0.6,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const result = await response.json();
    const reply = result['choices'][0]['message'];

    const insights = reply['content'];

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

    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer 5PCMarcJBD5QMXI5o5GsUYqufgKdBT5pHDj4JwtR8J9f6ob3`,
      },
      body: JSON.stringify({
        model: 'accounts/fireworks/models/mixtral-8x7b-instruct',
        max_tokens: 4096,
        top_p: 1,
        top_k: 40,
        presence_penalty: 0,
        frequency_penalty: 0,
        temperature: 0.6,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const result = await response.json();
    const reply = result['choices'][0]['message'];

    const det_insights = reply['content'];

    let tags = det_insights
      .split(/\n/)
      .filter((sentence: string) => sentence.trim() !== '')
      .slice(1);
    tags = tags.map((sentence: string) => sentence.replace(/^\d+\.\s?/, '').trim());

    return {
      det_insights: det_insights,
      tags: tags,
    };
  }
}
