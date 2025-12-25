import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/article/$id')({
  component: ArticleDetail,
})

function ArticleDetail() {
  const { id } = Route.useParams()

  return (
    <div>
      <h1>뉴스 상세</h1>
      <p>Article ID: {id}</p>
    </div>
  )
}
