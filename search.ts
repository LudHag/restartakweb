import { youtube_v3 } from "googleapis";

export type YoutubeSearchResult = {
  link?: string | null;
  title?: string | null;
  created?: string | null;
  published: string;
};

export async function searchYouTube(
  reactionQuery: string,
  ignorePhrases: string[],
  youtube: youtube_v3.Youtube
): Promise<YoutubeSearchResult[]> {
  try {
    const currentTime = new Date();
    const oneDayAgo = new Date(
      currentTime.getTime() - 24 * 60 * 60 * 1000
    ).toISOString();

    const response = await youtube.search.list({
      part: ["id", "snippet"],
      q: `"${reactionQuery}" reaction`,
      maxResults: 50,
      publishedAfter: oneDayAgo,
    });

    const paresedVideos: YoutubeSearchResult[] =
      response.data.items?.map((item) => ({
        link: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
        title: item.snippet?.title,
        creator: item.snippet?.channelTitle,
        published: getHoursSincePublished(
          item.snippet?.publishedAt,
          currentTime
        ),
      })) || [];

    const filteredResults = paresedVideos
      .filter((video) => video.link && video.title)
      .filter(
        (video) =>
          video.title?.toLowerCase().includes("reaction") &&
          video.title?.toLowerCase().includes(reactionQuery)
      )
      .filter((video) => {
        const title = video.title?.toLowerCase();
        return !ignorePhrases
          .map((x) => x.toLowerCase())
          .some((phrase) => title!.includes(phrase));
      });

    return filteredResults;
  } catch (error) {
    throw new Error(`Failed to search YouTube: ${error}`);
  }
}

const getHoursSincePublished = (
  publishedAt: string | null | undefined,
  currentTime: Date
) => {
  if (!publishedAt) return "";

  const publishedDate = new Date(publishedAt);
  const timeDifference = currentTime.getTime() - publishedDate.getTime();
  const hours = timeDifference / (60 * 60 * 1000);
  return `Published ${Math.floor(hours)} hours ago`;
};
