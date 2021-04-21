import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: string;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  episodes: Episode[]
}

export default function Home(props: HomeProps) {
  return (
    <p>{JSON.stringify(props.episodes[0])}</p>
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

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      description: episode.description,
      url: episode.file.url,
      durationAsString: convertDurationToTimeString(Number(episode.file.duration))
    }
  })

  return {
    props: {
      episodes
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
