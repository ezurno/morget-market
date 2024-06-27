import db from "../db";

export default async function isExistUsername(
  username: string
): Promise<boolean> {
  const user = await db.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
    },
  });

  return Boolean(user);
}
