import { Header } from "../components/Header";

export default function Home() {
  return (
    <h1>whahh</h1>
  )
}

/*
By declaring "getStaticProps", Nextjs will understand 
that it needs to fetch that information before the app even renders
so that crawlers will be able to see that info on first render
and index your page.

This is called Static Site Generation. The first access to the page will
create a static html and every single access within a set span of time
 will be served this static page.
*/

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json();

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60 * 8,
  }
}


/*
By declaring "getServerSideProps", Nextjs will understand
that it needs to fetch that information before the app even renders
so that crawlers will be able to see that info on first render
and index your page.

This is called Server Side Rendering. Every single access to the page
will run this function.
*/

// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json();

//   return {
//     props: {
//       episodes: data
//     }
//   }
// }
