export const config = {
  api: {
    bodyParser: { sizeLimit: '10mb' },
    responseLimit: false,
  },
};

const IMAGE_CID = "bafybeicwkk7zdosv5msca4m6txuftwecbwllwc4bk33szrzdaalnk2xweq";
const IMAGE_URI = `ipfs://${IMAGE_CID}/Tempo.png`;

function buildMetadata(i) {
  return JSON.stringify({
    name: `Tempo Genesis #${i}`,
    description:
      "tempo.fun Genesis Pass — Holders receive 3% platform revenue share and zero platform fees. Network: TEMPO | Tier: Genesis",
    image: IMAGE_URI,
    external_url: "https://tempo.fun",
    attributes: [
      { trait_type: "Network", value: "TEMPO" },
      { trait_type: "Tier", value: "Genesis" },
      { trait_type: "Pass Type", value: "OG" },
      { trait_type: "Benefit 1", value: "3% Platform Revenue" },
      { trait_type: "Benefit 2", value: "Zero Fee" },
    ],
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.PINATA_API_KEY;
  const secretKey = process.env.PINATA_SECRET_KEY;

  if (!apiKey || !secretKey) {
    return res.status(500).json({ error: "Pinata API keys not configured in environment variables." });
  }

  try {
    const { default: FormData } = await import("form-data");
    const fetch = (await import("node-fetch")).default;

    const form = new FormData();

    for (let i = 1; i <= 999; i++) {
      const content = Buffer.from(buildMetadata(i), "utf-8");
      form.append("file", content, {
        filename: `metadata/${i}.json`,
        contentType: "application/json",
      });
    }

    form.append("pinataOptions", JSON.stringify({ cidVersion: 1, wrapWithDirectory: true }));
    form.append("pinataMetadata", JSON.stringify({ name: "tempo-genesis-metadata" }));

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretKey,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: errText });
    }

    const data = await response.json();
    return res.status(200).json({
      cid: data.IpfsHash,
      baseURI: `ipfs://${data.IpfsHash}/`,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
