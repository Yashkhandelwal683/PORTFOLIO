import { Helmet } from 'react-helmet-async'

export default function SEO({ title, description }) {
  return (
    <Helmet>
      <title>{title || 'Yash Khandelwal | Full Stack Developer & Java Developer'}</title>
      <meta name="description" content={description || 'Premium developer portfolio showcasing projects, skills, and coding profiles.'} />
      <meta property="og:title" content={title || 'Yash Khandelwal | Full Stack Developer'} />
      <meta property="og:description" content={description || 'Premium developer portfolio showcasing projects, skills, and coding profiles.'} />
      <meta name="twitter:title" content={title || 'Yash Khandelwal | Full Stack Developer'} />
      <meta name="twitter:description" content={description || 'Premium developer portfolio showcasing projects, skills, and coding profiles.'} />
    </Helmet>
  )
}
