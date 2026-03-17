export default async function () {
  // Best-effort scraper for Meetup's internal API.
  // Falls back to upcoming.json (loaded separately by 11ty) on any failure.
  // Meetup is a React SPA — this targets their GraphQL endpoint, which can
  // change without notice.
  try {
    const response = await fetch(
      "https://www.meetup.com/gql2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operationName: "getGroupUpcomingEvents",
          variables: {
            urlname: "detroit-developers",
            first: 3,
          },
          query: `query getGroupUpcomingEvents($urlname: String!, $first: Int) {
            groupByUrlname(urlname: $urlname) {
              upcomingEvents(input: { first: $first }) {
                edges {
                  node {
                    title
                    description
                    dateTime
                    eventUrl
                    venue {
                      name
                      address
                      city
                      state
                    }
                    going
                  }
                }
              }
            }
          }`,
        }),
      }
    );

    if (!response.ok) {
      console.log("[meetup.js] Fetch failed, using upcoming.json fallback");
      return { upcoming: null };
    }

    const data = await response.json();
    const edges = data?.data?.groupByUrlname?.upcomingEvents?.edges;

    if (!edges || edges.length === 0) {
      return { upcoming: null };
    }

    const upcoming = edges.map((edge) => {
      const node = edge.node;
      const venue = node.venue;
      return {
        title: node.title,
        description: node.description?.replace(/<[^>]*>/g, "").substring(0, 200),
        date: node.dateTime,
        location: venue
          ? `${venue.name}, ${venue.address}, ${venue.city}`
          : "TBD",
        url: node.eventUrl,
        attendeeCount: node.going,
      };
    });

    console.log(`[meetup.js] Fetched ${upcoming.length} upcoming events`);
    return { upcoming };
  } catch (err) {
    console.log(`[meetup.js] Error: ${err.message}, using upcoming.json fallback`);
    return { upcoming: null };
  }
};
