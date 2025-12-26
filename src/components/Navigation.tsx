import { Link } from '@tanstack/react-router'

export function Navigation() {
  return (
    <nav
      style={{
        padding: '1rem',
        borderBottom: '1px solid #ccc',
        marginBottom: '2rem',
      }}
    >
      <ul
        style={{
          display: 'flex',
          gap: '1rem',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <Link to="/" activeProps={{ style: { fontWeight: 'bold' } }}>
            홈 =
          </Link>
        </li>
        <li>
          <Link
            to="/article/$id"
            params={{ id: '123' }}
            activeProps={{ style: { fontWeight: 'bold' } }}
          >
            뉴스 디테일
          </Link>
        </li>
        <li>
          <Link
            to="/category/$slug"
            params={{ slug: 'technology' }}
            activeProps={{ style: { fontWeight: 'bold' } }}
          >
            기술 카테고리
          </Link>
        </li>
        <li>
          <Link
            to="/category/$slug"
            params={{ slug: 'sports' }}
            activeProps={{ style: { fontWeight: 'bold' } }}
          >
            스포츠 카테고리
          </Link>
        </li>
      </ul>
    </nav>
  )
}
