

//Response Reference
/*
{
  tweet_id: '1762545914831634705',
  creation_date: 'Tue Feb 27 18:31:07 +0000 2024',
  text: 'I designed a cover for the Apple Vision Pro.\n' +
    '\n' +
    'The holes line up with the cameras and sensors, so tracking and capture work as expected.\n' +
    '\n' +
    'Thinking of making a small run of these if theres enough demand. Leave a ᯅ if you want one! https://t.co/0l8gZdm495',
  media_url: [
    'https://pbs.twimg.com/ext_tw_video_thumb/1762291982175731712/pu/img/Ui7FV6j96_n-VzAG.jpg'
  ],
  video_url: [
    {
      bitrate: 950000,
      content_type: 'video/mp4',
      url: 'https://video.twimg.com/ext_tw_video/1762291982175731712/pu/vid/avc1/480x852/uncawd_BVa8tRFjr.mp4?tag=12'
    },
    {
      bitrate: 2176000,
      content_type: 'video/mp4',
      url: 'https://video.twimg.com/ext_tw_video/1762291982175731712/pu/vid/avc1/720x1280/V2a-yWZEsp2aVMQu.mp4?tag=12'
    },
    {
      content_type: 'application/x-mpegURL',
      url: 'https://video.twimg.com/ext_tw_video/1762291982175731712/pu/pl/Qb1SBACYFFoIZZrx.m3u8?tag=12&container=cmaf'
    },
    {
      bitrate: 632000,
      content_type: 'video/mp4',
      url: 'https://video.twimg.com/ext_tw_video/1762291982175731712/pu/vid/avc1/320x568/bOoaHVkxTAQQFUd3.mp4?tag=12'
    }
  ],
  user: {
    creation_date: 'Mon Dec 14 20:00:38 +0000 2020',
    user_id: '1338574596195270657',
    username: '_kylegoodrich',
    name: 'Kyle Goodrich',
    follower_count: 881,
    following_count: 238,
    favourites_count: 595,
    is_private: null,
    is_verified: false,
    is_blue_verified: false,
    location: 'Los Angeles',
    profile_pic_url: 'https://pbs.twimg.com/profile_images/1557168473427492864/WZl17p_5_normal.jpg',
    profile_banner_url: 'https://pbs.twimg.com/profile_banners/1338574596195270657/1660092094',
    description: 'AR Product Design @Snapchat • Author of @CompGenerated: The 3D Art Anthology • 3D Artist • Vimeo Staff Pick Winner',     
    external_url: 'http://kylegoodrich.xyz',
    number_of_tweets: 155,
    bot: false,
    timestamp: 1607976038,
    has_nft_avatar: false,
    category: null,
    default_profile: true,
    default_profile_image: false,
    listed_count: 9,
    verified_type: null
  },
  language: 'en',
  favorite_count: 1989,
  retweet_count: 93,
  reply_count: 245,
  quote_count: 37,
  retweet: false,
  views: 313224,
  timestamp: 1709058667,
  video_view_count: null,
  in_reply_to_status_id: null,
  quoted_status_id: null,
  binding_values: null,
  expanded_url: 'https://twitter.com/_kylegoodrich/status/1762545914831634705/video/1',
  retweet_tweet_id: null,
  extended_entities: { media: [ [Object] ] },
  conversation_id: '1762545914831634705',
  retweet_status: null,
  quoted_status: null,
  bookmark_count: 303,
  source: 'Twitter Web App',
  community_note: null
}
*/

const sentiment_analysis = async (text) => {
    try {
        console.log(text)
        const data = { "inputs": text }
        const response = await fetch(
            "https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis",
            {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        const sentiment = result[0][0]['label']
        return sentiment;
    } catch (error) {
        console.log(error)
    }
}

const summariser = async (tweets, query) => {
    const prompt = `Your role is to summarise these tweets that were extracted for the given query
  <Tweets>
  ${tweets}

  <Query>
  ${query}
  `
    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Accept': "application/json",
            'Content-Type': "application/json",
            'Authorization': `Bearer 5PCMarcJBD5QMXI5o5GsUYqufgKdBT5pHDj4JwtR8J9f6ob3`
        },
        body: JSON.stringify({
            model: "accounts/fireworks/models/mixtral-8x7b-instruct",
            max_tokens: 4096,
            top_p: 1,
            top_k: 40,
            presence_penalty: 0,
            frequency_penalty: 0,
            temperature: 0.6,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    const result = await response.json()
    const reply = result['choices'][0]['message']
    console.log(reply["content"])

    const summary = reply["content"]

    return summary

}

const short_insights = async (query, summary, avg_neutrals, avg_positives, avg_negatives, avg_favs,
    avg_replies, avg_user_following, avg_views) => {


    const prompt = `You are a super talented social media marketing expert. 
    Your role is to analyse the summary of all the tweets for a particular query and its related twitter metrics
    After your analysis your role is to provide 5 very factual, specific and actionable insights to improve social media image of the query
    
    <Query>
    ${query}

    <Summary>
    ${summary}

    <Metrics>
    Average Views : ${avg_views}
    Average Likes : ${avg_favs}
    Sentiment : ${avg_neutrals}% Neutral, ${avg_negatives}% Negative and ${avg_positives}% Positive
    Average Engagement : ${avg_replies}
    Average User Following of Tweet Author : ${avg_user_following}
    
    <Insights>
    `

    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Accept': "application/json",
            'Content-Type': "application/json",
            'Authorization': `Bearer 5PCMarcJBD5QMXI5o5GsUYqufgKdBT5pHDj4JwtR8J9f6ob3`
        },
        body: JSON.stringify({
            model: "accounts/fireworks/models/mixtral-8x7b-instruct",
            max_tokens: 4096,
            top_p: 1,
            top_k: 40,
            presence_penalty: 0,
            frequency_penalty: 0,
            temperature: 0.6,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    const result = await response.json()
    const reply = result['choices'][0]['message']
    console.log(reply["content"])

    const insights = reply["content"]

    return insights
}

const short_brief = async (query) => {
    let tweets = ""
    let total_neutrals = 0
    let total_positives = 0
    let total_negatives = 0
    let total_user_following = 0
    let total_views = 0
    let total_replies = 0
    let total_favs = 0

    // Create a new Date object for today's date
    const today = new Date();

    // Subtract 7 days from today
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Extract the components of the new date
    const startYear = sevenDaysAgo.getFullYear();
    const startMonth = sevenDaysAgo.getMonth() + 1; // Month is zero-indexed, so we add 1
    const startDay = sevenDaysAgo.getDate();

    // Store the new date in a variable called start_date
    const start_date = `${startYear}-${startMonth < 10 ? '0' : ''}${startMonth}-${startDay < 10 ? '0' : ''}${startDay}`;
    const min_retweets = 5
    const min_likes = 5
    const limit = 5

    const url = `https://twitter154.p.rapidapi.com/search/search?query=${query}&section=top&min_retweets=${min_retweets}&min_likes=${min_likes}&limit=${limit}&start_date=${start_date}&language=en`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'e2b67bdcdbmshf01327ba37288f4p188af1jsnb3c0b43dcb3a',
            'X-RapidAPI-Host': 'twitter154.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result["results"]);

        const data = result["results"]

        for (const tweet of data) {
            const sentiment = await sentiment_analysis(tweet['text'])
            console.log(sentiment)
            if (sentiment === "NEU") {
                total_neutrals += 1
            }
            else if (sentiment === "POS") {
                total_positives += 1
            }
            else {
                total_negatives += 1
            }

            total_user_following += tweet['user']['follower_count']
            total_replies += tweet['reply_count']
            total_views += tweet['views']
            total_favs += tweet['favorite_count']

            tweets += tweet['text']
        }

        const avg_neutrals = total_neutrals / limit
        const avg_positives = total_positives / limit
        const avg_negatives = total_negatives / limit
        const avg_user_following = total_user_following / limit
        const avg_views = total_views / limit
        const avg_replies = total_replies / limit
        const avg_favs = total_favs / limit

        console.log(avg_neutrals, avg_positives, avg_negatives, avg_favs
            , avg_replies, avg_user_following, avg_views)

        const summary = await summariser(tweets, query)

        const insights = await short_insights(query, summary, avg_neutrals, avg_positives, avg_negatives, avg_favs
            , avg_replies, avg_user_following, avg_views)

        const cleaned_insights = insights.replace(/\*\*/g, '');
        return cleaned_insights
    } catch (error) {
        console.error(error);
    }
}

short_brief("Apple Vision Pro")


//Response Reference
/*
{
  tweet_id: '1762545914831634705',
  creation_date: 'Tue Feb 27 18:31:07 +0000 2024',
  text: 'I designed a cover for the Apple Vision Pro.\n' +
    '\n' +
    'The holes line up with the cameras and sensors, so tracking and capture work as expected.\n' +
    '\n' +
    'Thinking of making a small run of these if theres enough demand. Leave a ᯅ if you want one! https://t.co/0l8gZdm495',
  media_url: [
    'https://pbs.twimg.com/ext_tw_video_thumb/1762291982175731712/pu/img/Ui7FV6j96_n-VzAG.jpg'
  ],
  video_url: [
    {
      bitrate: 950000,
      content_type: 'video/mp4',
      url: 'https://video.twimg.com/ext_tw_video/1762291982175731712/pu/vid/avc1/480x852/uncawd_BVa8tRFjr.mp4?tag=12'
    },
    {
      bitrate: 2176000,
      content_type: 'video/mp4',
      url: 'https://video.twimg.com/ext_tw_video/1762291982175731712/pu/vid/avc1/720x1280/V2a-yWZEsp2aVMQu.mp4?tag=12'
    },
    {
      content_type: 'application/x-mpegURL',
      url: 'https://video.twimg.com/ext_tw_video/1762291982175731712/pu/pl/Qb1SBACYFFoIZZrx.m3u8?tag=12&container=cmaf'
    },
    {
      bitrate: 632000,
      content_type: 'video/mp4',
      url: 'https://video.twimg.com/ext_tw_video/1762291982175731712/pu/vid/avc1/320x568/bOoaHVkxTAQQFUd3.mp4?tag=12'
    }
  ],
  user: {
    creation_date: 'Mon Dec 14 20:00:38 +0000 2020',
    user_id: '1338574596195270657',
    username: '_kylegoodrich',
    name: 'Kyle Goodrich',
    follower_count: 881,
    following_count: 238,
    favourites_count: 595,
    is_private: null,
    is_verified: false,
    is_blue_verified: false,
    location: 'Los Angeles',
    profile_pic_url: 'https://pbs.twimg.com/profile_images/1557168473427492864/WZl17p_5_normal.jpg',
    profile_banner_url: 'https://pbs.twimg.com/profile_banners/1338574596195270657/1660092094',
    description: 'AR Product Design @Snapchat • Author of @CompGenerated: The 3D Art Anthology • 3D Artist • Vimeo Staff Pick Winner',     
    external_url: 'http://kylegoodrich.xyz',
    number_of_tweets: 155,
    bot: false,
    timestamp: 1607976038,
    has_nft_avatar: false,
    category: null,
    default_profile: true,
    default_profile_image: false,
    listed_count: 9,
    verified_type: null
  },
  language: 'en',
  favorite_count: 1989,
  retweet_count: 93,
  reply_count: 245,
  quote_count: 37,
  retweet: false,
  views: 313224,
  timestamp: 1709058667,
  video_view_count: null,
  in_reply_to_status_id: null,
  quoted_status_id: null,
  binding_values: null,
  expanded_url: 'https://twitter.com/_kylegoodrich/status/1762545914831634705/video/1',
  retweet_tweet_id: null,
  extended_entities: { media: [ [Object] ] },
  conversation_id: '1762545914831634705',
  retweet_status: null,
  quoted_status: null,
  bookmark_count: 303,
  source: 'Twitter Web App',
  community_note: null
}
*/

const sentiment_analysis = async (text) => {
    try {
        console.log(text)
        const data = { "inputs": text }
        const response = await fetch(
            "https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis",
            {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        const sentiment = result[0][0]['label']
        return sentiment;
    } catch (error) {
        console.log(error)
    }
}

const summariser = async (tweets, query) => {
    const prompt = `Your role is to summarise these tweets that were extracted for the given query
  <Tweets>
  ${tweets}

  <Query>
  ${query}
  `
    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Accept': "application/json",
            'Content-Type': "application/json",
            'Authorization': `Bearer 5PCMarcJBD5QMXI5o5GsUYqufgKdBT5pHDj4JwtR8J9f6ob3`
        },
        body: JSON.stringify({
            model: "accounts/fireworks/models/mixtral-8x7b-instruct",
            max_tokens: 4096,
            top_p: 1,
            top_k: 40,
            presence_penalty: 0,
            frequency_penalty: 0,
            temperature: 0.6,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    const result = await response.json()
    const reply = result['choices'][0]['message']
    console.log(reply["content"])

    const summary = reply["content"]

    return summary

}

const short_insights = async (query, summary, avg_neutrals, avg_positives, avg_negatives, avg_favs,
    avg_replies, avg_user_following, avg_views) => {


    const prompt = `You are a super talented social media marketing expert. 
    Your role is to analyse the summary of all the tweets for a particular query and its related twitter metrics
    After your analysis your role is to provide 5 very factual, specific and actionable insights to improve social media image of the query
    
    <Query>
    ${query}

    <Summary>
    ${summary}

    <Metrics>
    Average Views : ${avg_views}
    Average Likes : ${avg_favs}
    Sentiment : ${avg_neutrals}% Neutral, ${avg_negatives}% Negative and ${avg_positives}% Positive
    Average Engagement : ${avg_replies}
    Average User Following of Tweet Author : ${avg_user_following}
    
    <Insights>
    `

    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Accept': "application/json",
            'Content-Type': "application/json",
            'Authorization': `Bearer 5PCMarcJBD5QMXI5o5GsUYqufgKdBT5pHDj4JwtR8J9f6ob3`
        },
        body: JSON.stringify({
            model: "accounts/fireworks/models/mixtral-8x7b-instruct",
            max_tokens: 4096,
            top_p: 1,
            top_k: 40,
            presence_penalty: 0,
            frequency_penalty: 0,
            temperature: 0.6,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    const result = await response.json()
    const reply = result['choices'][0]['message']
    console.log(reply["content"])

    const insights = reply["content"]

    return insights
}

const short_brief = async (query) => {
    let tweets = ""
    let total_neutrals = 0
    let total_positives = 0
    let total_negatives = 0
    let total_user_following = 0
    let total_views = 0
    let total_replies = 0
    let total_favs = 0

    // Create a new Date object for today's date
    const today = new Date();

    // Subtract 7 days from today
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Extract the components of the new date
    const startYear = sevenDaysAgo.getFullYear();
    const startMonth = sevenDaysAgo.getMonth() + 1; // Month is zero-indexed, so we add 1
    const startDay = sevenDaysAgo.getDate();

    // Store the new date in a variable called start_date
    const start_date = `${startYear}-${startMonth < 10 ? '0' : ''}${startMonth}-${startDay < 10 ? '0' : ''}${startDay}`;
    const min_retweets = 5
    const min_likes = 5
    const limit = 5

    const url = `https://twitter154.p.rapidapi.com/search/search?query=${query}&section=top&min_retweets=${min_retweets}&min_likes=${min_likes}&limit=${limit}&start_date=${start_date}&language=en`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'e2b67bdcdbmshf01327ba37288f4p188af1jsnb3c0b43dcb3a',
            'X-RapidAPI-Host': 'twitter154.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result["results"]);

        const data = result["results"]

        for (const tweet of data) {
            const sentiment = await sentiment_analysis(tweet['text'])
            console.log(sentiment)
            if (sentiment === "NEU") {
                total_neutrals += 1
            }
            else if (sentiment === "POS") {
                total_positives += 1
            }
            else {
                total_negatives += 1
            }

            total_user_following += tweet['user']['follower_count']
            total_replies += tweet['reply_count']
            total_views += tweet['views']
            total_favs += tweet['favorite_count']

            tweets += tweet['text']
        }

        const avg_neutrals = total_neutrals / limit
        const avg_positives = total_positives / limit
        const avg_negatives = total_negatives / limit
        const avg_user_following = total_user_following / limit
        const avg_views = total_views / limit
        const avg_replies = total_replies / limit
        const avg_favs = total_favs / limit

        console.log(avg_neutrals, avg_positives, avg_negatives, avg_favs
            , avg_replies, avg_user_following, avg_views)

        const summary = await summariser(tweets, query)

        const insights = await short_insights(query, summary, avg_neutrals, avg_positives, avg_negatives, avg_favs
            , avg_replies, avg_user_following, avg_views)

        const cleaned_insights = insights.replace(/\*\*/g, '');
        return cleaned_insights
    } catch (error) {
        console.error(error);
    }
}

short_brief("Apple Vision Pro")
