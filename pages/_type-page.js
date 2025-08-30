import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import ContentGrid from '../components/ContentGrid'
import FilterPills from '../components/FilterPills'

export default function TypePage({ works, type }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Cargando...</div>
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6 capitalize">{type}</h1>
        <FilterPills />
        <ContentGrid works={works} />
      </div>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  // Import dinámico: así evitamos que Vercel intente empaquetar 'fs' en el cliente
  const { getAllWorks } = await import('../lib/server/content.js')
  const all = await getAllWorks()
  const type = params?.type || 'series'

  const works = all.filter((work) => work.tipo?.toLowerCase() === type)

  return {
    props: {
      works,
      type,
    },
  }
}

export async function getStaticPaths() {
  const paths = ['series', 'cortos', 'peliculas', 'trailers'].map((type) => ({
    params: { type },
  }))

  return {
    paths,
    fallback: true,
  }
}
