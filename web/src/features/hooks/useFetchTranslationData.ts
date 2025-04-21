import { useMemo } from 'react';
import blogData from '@/data/output/summary/blog.json';
import caseStudiesData from '@/data/output/summary/case-studies.json';
import communityData from '@/data/output/summary/community.json';
import docsConceptsData from '@/data/output/summary/docs/concepts.json';
import docsContributeData from '@/data/output/summary/docs/contribute.json';
import docsReferenceData from '@/data/output/summary/docs/reference.json';
import docsTasksData from '@/data/output/summary/docs/tasks.json';
import docsTutorialsData from '@/data/output/summary/docs/tutorials.json';
import examplesData from '@/data/output/summary/examples.json';
import includesData from '@/data/output/summary/includes.json';
import partnersData from '@/data/output/summary/partners.json';
import releasesData from '@/data/output/summary/releases.json';
import trainingData from '@/data/output/summary/training.json';
import { ContentType, DocsSubContentType, TranslationState } from '../translation';

const translationDataMap = {
  blog: blogData as TranslationState,
  community: communityData as TranslationState,
  example: examplesData as TranslationState,
  include: includesData as TranslationState,
  release: releasesData as TranslationState,
  case_study: caseStudiesData as TranslationState,
  partner: partnersData as TranslationState,
  training: trainingData as TranslationState,
  docs: {
    concept: docsConceptsData as TranslationState,
    reference: docsReferenceData as TranslationState,
    tutorial: docsTutorialsData as TranslationState,
    task: docsTasksData as TranslationState,
    contribute: docsContributeData as TranslationState,
  },
};

export const useFetchTranslationData = (
  contentType: ContentType,
  docsSubContentType?: DocsSubContentType
): TranslationState => {
  return useMemo(() => {
    if (contentType === 'docs') {
      if (!docsSubContentType) {
        throw new Error('docsSubContentType is required when contentType is "docs"');
      }
      return translationDataMap.docs[docsSubContentType];
    }

    const data = translationDataMap[contentType];
    if (!data) {
      throw new Error(`Unknown content type: ${contentType}`);
    }

    return data;
  }, [contentType, docsSubContentType]);
};
