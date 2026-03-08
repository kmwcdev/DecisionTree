import type { TreeSchema } from '../types';

export const sampleTree: TreeSchema = {
  version: 1,
  nodes: [
    {
      id: 'n1',
      type: 'info',
      position: { x: 300, y: 50 },
      data: {
        label: 'Labor Has Started',
        description: 'You are experiencing regular contractions. Stay calm and track the timing.',
        nodeType: 'info',
      },
    },
    {
      id: 'n2',
      type: 'decision',
      position: { x: 300, y: 200 },
      data: {
        label: 'Are contractions ≤ 5 min apart, lasting ≥ 1 min, for ≥ 1 hour?',
        description: 'This is the 5-1-1 rule. Time several contractions before deciding.',
        nodeType: 'decision',
      },
    },
    {
      id: 'n3',
      type: 'action',
      position: { x: 100, y: 390 },
      data: {
        label: 'Stay Home & Rest',
        description: 'Early labor — contractions are irregular or far apart. Rest, eat lightly, drink water. Call your provider if unsure.',
        nodeType: 'action',
      },
    },
    {
      id: 'n4',
      type: 'action',
      position: { x: 500, y: 390 },
      data: {
        label: 'Head to the Hospital',
        description: 'Active labor is likely. Grab your bag, call your provider, and go to Labor & Delivery.',
        nodeType: 'action',
      },
    },
    {
      id: 'n5',
      type: 'decision',
      position: { x: 100, y: 570 },
      data: {
        label: 'Did contractions intensify in the past hour?',
        description: 'Compare frequency and pain level to an hour ago.',
        nodeType: 'decision',
      },
    },
    {
      id: 'n6',
      type: 'info',
      position: { x: 100, y: 750 },
      data: {
        label: 'Keep Monitoring',
        description: 'Rest and re-check in 30–60 minutes. Contact your provider if you have any concerns.',
        nodeType: 'info',
      },
    },
  ],
  edges: [
    {
      id: 'e1-2',
      source: 'n1',
      target: 'n2',
      data: {},
    },
    {
      id: 'e2-3',
      source: 'n2',
      target: 'n3',
      label: 'No',
      data: { label: 'No' },
    },
    {
      id: 'e2-4',
      source: 'n2',
      target: 'n4',
      label: 'Yes',
      data: { label: 'Yes' },
    },
    {
      id: 'e3-5',
      source: 'n3',
      target: 'n5',
      data: {},
    },
    {
      id: 'e5-6',
      source: 'n5',
      target: 'n6',
      label: 'No',
      data: { label: 'No' },
    },
  ],
};
