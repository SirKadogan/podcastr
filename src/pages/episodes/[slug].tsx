import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import api from '../../services/api';
import Image from 'next/image';
import Link from 'next/link';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';
import Head from 'next/head';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
  description: string;
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode(props: EpisodeProps) {
  const { episode } = props;
  const { play } = usePlayer();
  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title}</title>
      </Head>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />

    </div>

  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map((episode) => {
    return {
      params: {
        slug: episode.id,
      }
    }
  })

  return {
    paths,
    fallback: 'blocking'
  }
  /* If "fallback: true", getStaticProps will run on client side. This way, crawlers would
  not index the page, but a new page would be cached on the server once a user entres the page*/

  /* If fallback: false, pages not set on "paths" would return 404*/

  /* If fallback: blocking, pages are rendered on the next.js server and cached once loaded.*/
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    description: data.description,
    url: data.file.url,
    durationAsString: convertDurationToTimeString(Number(data.file.duration))
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}