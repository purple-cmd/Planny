import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../prisma/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { title, description, options } = req.body;
    const event = await db.event.create({
      data: {
        title,
        description,
        options: {
          create: options,
        },
      },
      include: { options: true },
    });

    res.json(event);
  } else if (req.method === "PUT") {
    const { options: OpIdsToInc } = req.body;

    await db.option.updateMany({
      where: {
        id: {
          in: OpIdsToInc,
        },
      },
      data: {
        vote: {
          increment: 1,
        },
      },
    });

    res.json({ ok: true });
  }
}
