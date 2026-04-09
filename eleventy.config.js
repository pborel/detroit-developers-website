import pluginRss from "@11ty/eleventy-plugin-rss";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/CNAME");

  // Custom filters
  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content) return "1 min read";
    const text = content.replace(/<[^>]+>/g, "");
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    const minutes = Math.ceil(words / 230);
    return `${minutes} min read`;
  });

  eleventyConfig.addFilter("excerpt", (content) => {
    if (!content) return "";
    const pMatch = content.match(/<p>(.*?)<\/p>/s);
    const text = pMatch ? pMatch[1].replace(/<[^>]+>/g, "") : content.replace(/<[^>]+>/g, "").trim();
    const firstSentences = text.split(/\.\s/)[0] + ".";
    return firstSentences.length > 160
      ? firstSentences.substring(0, 157) + "..."
      : firstSentences;
  });

  eleventyConfig.addFilter("dateFormat", (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  eleventyConfig.addFilter("isUpcoming", (date) => {
    const d = new Date(date);
    const dayAfter = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1));
    return dayAfter > new Date();
  });

  eleventyConfig.addFilter("timeFormat", (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Detroit",
    });
  });

  // Collections (glob-based — do NOT also add tags in frontmatter to avoid duplicates)
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter((post) => !post.data.draft)
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("drafts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md")
      .filter((post) => post.data.draft)
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("events", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/events/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.addCollection("talks", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/talks/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("presentations", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/slides/*.njk")
      .filter((p) => p.data.permalink !== "/slides/" && !p.data.draft)
      .sort((a, b) => (a.data.title || "").localeCompare(b.data.title || ""));
  });

  eleventyConfig.addCollection("draftPresentations", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/slides/*.njk")
      .filter((p) => p.data.permalink !== "/slides/" && p.data.draft)
      .sort((a, b) => (a.data.title || "").localeCompare(b.data.title || ""));
  });

  return {
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
}
