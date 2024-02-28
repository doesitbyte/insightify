export class TwitterUtils {
  private twitterAPIkey!: string;

  constructor(twitterAPIkey: string) {
    this.twitterAPIkey = twitterAPIkey;
  }

  async getTweets(query: string, minLikes: number, minRetweets: number, limit: number, daysAgo: number) {
    const baseUrl: string = 'https://twitter154.p.rapidapi.com/search/search';

    const daysAgoDate = new Date();
    daysAgoDate.setDate(daysAgoDate.getDate() - daysAgo);

    const queryParams: Record<string, any> = {
      query: query,
      section: 'top',
      min_retweets: minRetweets,
      min_likes: minLikes,
      limit: 5,
      start_date: daysAgoDate.toISOString().split('T')[0],
      language: 'en',
    };

    const searchParams: URLSearchParams = new URLSearchParams(queryParams);

    const urlWithParams: string = `${baseUrl}?${searchParams.toString()}`;

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': this.twitterAPIkey,
        'X-RapidAPI-Host': 'twitter154.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(urlWithParams, options);
      const result = await response.json();
      console.log('Number of tweets retrieved: ' + result['results'].length);

      const data = result['results'];
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
      const user_following = tweet['user']['follower_count'];
      const replies = tweet['reply_count'];
      const views = tweet['views'];
      const favs = tweet['favorite_count'];
      const text = tweet['text'];
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
