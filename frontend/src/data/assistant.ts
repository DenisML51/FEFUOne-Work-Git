import type { KnowledgeModule, UploadPreset } from "@/types";

export const knowledgeModules: KnowledgeModule[] = [
  {
    id: "m1",
    titleKey: "knowledge.m1.title",
    index: 1,
    items: [
      {
        id: "m1i1",
        titleKey: "knowledge.m1.i1",
        kind: "doc",
        duration: "06:20",
        status: "done",
      },
      {
        id: "m1i2",
        titleKey: "knowledge.m1.i2",
        kind: "doc",
        duration: "08:05",
        status: "done",
      },
      {
        id: "m1i3",
        titleKey: "knowledge.m1.i3",
        kind: "video",
        duration: "12:40",
        status: "active",
      },
      {
        id: "m1i4",
        titleKey: "knowledge.m1.i4",
        kind: "doc",
        duration: "05:10",
        status: "todo",
      },
    ],
  },
  {
    id: "m2",
    titleKey: "knowledge.m2.title",
    index: 2,
    items: [
      {
        id: "m2i1",
        titleKey: "knowledge.m2.i1",
        kind: "doc",
        duration: "07:30",
        status: "done",
      },
      {
        id: "m2i2",
        titleKey: "knowledge.m2.i2",
        kind: "video",
        duration: "14:15",
        status: "active",
      },
      {
        id: "m2i3",
        titleKey: "knowledge.m2.i3",
        kind: "doc",
        duration: "09:00",
        status: "todo",
      },
    ],
  },
];

export const uploadPresets: UploadPreset[] = [
  {
    id: "stock",
    labelKey: "uploads.presets.stock",
    name: "ТМЦ_остатки_2026.xlsx",
    totalMb: 12.8,
  },
  {
    id: "receipts",
    labelKey: "uploads.presets.receipts",
    name: "Поступления_февраль.csv",
    totalMb: 8.4,
  },
  {
    id: "act",
    labelKey: "uploads.presets.act",
    name: "Акт_инвентаризации.pdf",
    totalMb: 5.1,
  },
];
