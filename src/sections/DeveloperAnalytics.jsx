import SectionWrapper from '../components/SectionWrapper'
import HeroAnalytics from '../components/analytics/HeroAnalytics'
import GitHubAnalytics from '../components/analytics/GitHubAnalytics'
import ContributionCharts from '../components/analytics/ContributionCharts'
import LanguageCharts from '../components/analytics/LanguageCharts'
import LeetCodeDashboard from '../components/analytics/LeetCodeDashboard'
import CompetitiveProgramming from '../components/analytics/CompetitiveProgramming'
import OpenSource from '../components/analytics/OpenSource'

const SECTIONS = [
  { component: GitHubAnalytics, props: { username: 'Yashkhandelwal683' }, id: 'github' },
  { component: ContributionCharts, props: { username: 'Yashkhandelwal683' }, id: 'charts' },
  { component: LanguageCharts, props: { username: 'Yashkhandelwal683' }, id: 'languages' },
  { component: LeetCodeDashboard, props: { username: 'yash_khandelwal123' }, id: 'leetcode' },
  { component: CompetitiveProgramming, props: {}, id: 'cp' },
  { component: OpenSource, props: { username: 'Yashkhandelwal683' }, id: 'opensource' },
]

export default function DeveloperAnalytics() {
  return (
    <section id="analytics" className="relative z-10 pb-24">
      <HeroAnalytics />

      <div className="container-max px-4 space-y-20">
        {SECTIONS.map(({ component: Component, props, id }) => (
          <SectionWrapper key={id} id={id} animation="fadeUp">
            <Component {...props} />
          </SectionWrapper>
        ))}
      </div>
    </section>
  )
}
