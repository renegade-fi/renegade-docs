export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ALGOLIA_CRAWLER_ID, ALGOLIA_CRAWLER_USER_ID, ALGOLIA_CRAWLER_API_KEY } = process.env;
  if (!ALGOLIA_CRAWLER_ID || !ALGOLIA_CRAWLER_USER_ID || !ALGOLIA_CRAWLER_API_KEY) {
    return res.status(500).json({ error: "Missing Algolia Crawler environment variables" });
  }

  const credentials = Buffer.from(
    `${ALGOLIA_CRAWLER_USER_ID}:${ALGOLIA_CRAWLER_API_KEY}`
  ).toString("base64");

  const response = await fetch(
    `https://crawler.algolia.com/api/1/crawlers/${ALGOLIA_CRAWLER_ID}/reindex`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return res.status(response.status).json(data);
}
