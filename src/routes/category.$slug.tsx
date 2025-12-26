import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/category/$slug')({
  component: CategoryPage,
})

function CategoryPage() {
  const { slug } = Route.useParams()

  return (
    <div>
      <h1>카테고리: {slug}</h1>
    </div>
  )
}
