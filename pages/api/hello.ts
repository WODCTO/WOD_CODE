import type { NextApiRequest, NextApiResponse } from 'next'
import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { AccountLayout } from '@solana/spl-token'
const programId = process.env.NEXT_PUBLIC_PROGRAM_ID
const MAX_SUPPLY = 1_000_000_000_000_000;
const MAX_HOLDERS = 1000;

type ResponseData = {
  holders?: { owner: string; amount: string; percentage: number }[]
  message?: string
  error?: string
}
const RPC_API_KEY = process.env.RPC_API_KEY | "YOUR KEY";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'GET') {
    // Add cache-control header
    res.setHeader(
      'Cache-Control',
      's-maxage=10, stale-while-revalidate'
    );

    try {
      // Connect to Solana network (use your preferred RPC endpoint)
      const connection = new Connection(`https://omniscient-white-dawn.solana-mainnet.quiknode.pro/${RPC_API_KEY}/`)
      
      // Replace with your SPL token mint address
      const mintAddress = new PublicKey(programId as string)

      // Get all token accounts for this mint
      const tokenAccounts = await connection.getProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 165,
            },
            {
              memcmp: {
                offset: 0,
                bytes: mintAddress.toBase58(),
              },
            },
          ],
        }
      );
      
      // Create a map to aggregate amounts by owner
      const holdersMap = new Map<string, bigint>();
      
      // Aggregate amounts for each owner
      tokenAccounts.forEach((account) => {
        const decoded = AccountLayout.decode(new Uint8Array(account.account.data));
        if (decoded.amount > 0) {
          const owner = new PublicKey(decoded.owner).toBase58();
          const amount = BigInt(decoded.amount.toString());
          holdersMap.set(owner, (holdersMap.get(owner) || BigInt(0)) + amount);
        }
      });

      // Convert map to array and format
      const holders = Array.from(holdersMap.entries())
        .map(([owner, amount]) => ({
          owner,
          amount,
          percentage: (Number(amount) / Number(MAX_SUPPLY)) * 100
        }))
        .sort((a, b) => Number(b.amount - a.amount))
        .slice(1, MAX_HOLDERS + 1)
        .map((holder, _, array) => {
          // Get the maximum amount (first holder in array, since we already sliced off the absolute largest)
          const maxAmount = Number(array[0].amount);
          // Get the normalized value between 0 and 1
          const normalizedAmount = Number(holder.amount) / maxAmount;
          
          return {
            owner: holder.owner,
            amount: holder.amount.toString(),
            percentage: holder.percentage,
            normalizedSize: normalizedAmount // This will be 1.0 for the largest holder in our set
          };
        });

      res.status(200).json({ holders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch token holders' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
} 