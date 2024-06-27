export default async function getGithubEmail(
  access_token: string
): Promise<string> {
  const userEmailResponse = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  let email = "";
  const githubEmail = await userEmailResponse.json();

  for (let mail of githubEmail) {
    if (mail.primary && mail.verified && mail.visibility === "public") {
      email = mail.email;
      break;
    }
  }

  return email;
}
