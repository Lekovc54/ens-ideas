// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { StaticJsonRpcProvider } from "@ethersproject/providers";

// Cloudflare ETH node has a 1k req/minute limit
const provider = new StaticJsonRpcProvider("https://cloudflare-eth.com");

const firstParam = (param: string | string[]) => {
  return Array.isArray(param) ? param[0] : param;
};

type Data =
  | {
      address: string;
      name: string | null;
      avatar: string | null;
    }
  | { address: string; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const address = firstParam(req.query.address);

  try {
    const name = await provider.lookupAddress(address);
    const avatar = name ? await provider.getAvatar(name) : null;

    res
      .status(200)
      .setHeader(
        "CDN-Cache-Control",
        `s-maxage=${60 * 60 * 24}, stale-while-revalidate`
      )
      .json({ address, name, avatar });
  } catch (error: any) {
    res.status(500).json({ address, error: error.message });
  }
}
