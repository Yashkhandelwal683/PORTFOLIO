const JOGRUBER_API = 'https://github-contributions-api.jogruber.de/v4'

const CONTRIBUTION_QUERY = `query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}`

function calendarToDays(cal) {
  const days = []
  for (const week of cal.weeks) {
    for (const day of week.contributionDays) {
      const d = new Date(day.date)
      const count = day.contributionCount
      const level = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 7 ? 3 : 4
      days.push({ date: d, count, level, key: day.date })
    }
  }
  return { days, total: cal.totalContributions }
}

function jogruberToDays(data) {
  const contributions = data.contributions || []
  const total = data.total?.lastYear || 0
  const days = []
  for (const c of contributions) {
    const d = new Date(c.date)
    days.push({ date: d, count: c.count, level: c.level, key: c.date })
  }
  return { days, total }
}

export async function fetchGitHubContributions(username) {
  try {
    const res = await fetch('/api/github/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: CONTRIBUTION_QUERY, variables: { username } }),
    })

    if (res.ok) {
      const json = await res.json()
      if (!json.errors && json.data?.user?.contributionsCollection?.contributionCalendar) {
        const cal = json.data.user.contributionsCollection.contributionCalendar
        console.log(`[GitHub] GraphQL success: ${cal.totalContributions} contributions`)
        return calendarToDays(cal)
      }
      console.warn('[GitHub] GraphQL response errors:', json.errors?.[0]?.message)
    } else {
      console.warn(`[GitHub] GraphQL proxy returned ${res.status}, falling back`)
    }
  } catch (e) {
    console.warn('[GitHub] GraphQL failed, falling back to jogruber:', e.message)
  }

  const fallbackRes = await fetch(`${JOGRUBER_API}/${username}?y=last`)
  if (!fallbackRes.ok) throw new Error(`Jogruber API returned ${fallbackRes.status}`)
  const data = await fallbackRes.json()
  console.log(`[GitHub] Jogruber success: ${data.total?.lastYear || 0} contributions`)
  return jogruberToDays(data)
}
