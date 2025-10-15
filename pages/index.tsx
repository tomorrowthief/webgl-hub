import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { GetStaticProps, NextPage } from 'next';
import { WebGLExample } from '../types';
import { translations } from '../lib/translations';

interface HomePageProps {
  home: {
    title: string;
    description: string;
  };
  common: {
    viewExample: string;
  };
  examples: WebGLExample[];
  categories: { [key: string]: string };
  categoryOrder: string[];
}

const HomePage: NextPage<HomePageProps> = ({ home, common, examples, categories, categoryOrder }) => {

  const groupedExamples = examples.reduce((acc, example) => {
    if (!acc[example.category]) {
      acc[example.category] = [];
    }
    acc[example.category].push(example);
    return acc;
  }, {} as Record<string, WebGLExample[]>);
  
  const sortedCategories = categoryOrder.filter(cat => groupedExamples[cat]);

  return (
    <div>
      <Head>
        <title>WebGL Learning Hub</title>
        <meta name="description" content="An interactive platform to learn WebGL through practical examples. Browse a curated list of tutorials, view detailed explanations, and explore the corresponding code snippets to master modern web graphics." />
      </Head>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl" dangerouslySetInnerHTML={{__html: home.title.replace('WebGL Hub', '<span class="text-teal-400">WebGL Hub</span>')}}>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-navy-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          {home.description}
        </p>
      </div>

      <div className="space-y-12">
        {sortedCategories.map(categoryKey => (
          <section key={categoryKey}>
            <h2 className="text-2xl font-bold text-white border-b-2 border-navy-700 pb-2 mb-6">{categories[categoryKey]}</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {groupedExamples[categoryKey].map((example) => (
                <Link
                  key={example.id}
                  href={`/example/${example.id}`}
                  className="block group bg-navy-900 p-6 rounded-lg shadow-lg hover:shadow-teal-400/20 hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-teal-400 group-hover:text-teal-300 transition-colors">
                    {example.title}
                  </h3>
                  <p className="mt-2 text-navy-300">
                    {example.summary}
                  </p>
                  <div className="mt-4 text-sm font-semibold text-white group-hover:text-teal-300 transition-colors flex items-center">
                      {common.viewExample}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const content = translations[locale!];
  return {
    props: {
      home: content.home,
      common: content.common,
      examples: content.examples,
      categories: content.categories,
      categoryOrder: content.categoryOrder,
    },
  };
};

export default HomePage;
