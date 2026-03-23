// src/types/index.ts

export type ProjectType = "DESIGN" | "SOCIAL" | "VIDEO" | "MOTION" | "BRANDING" | "OUTROS";
export type MediaType = "IMAGE" | "VIDEO";

export interface MediaItem {
  id: number;
  url: string;
  type: MediaType;
  order: number;
  projectId: number;
  createdAt: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  subtitle?: string | null;
  type: ProjectType;
  description: string;
  tags: string[];
  mainMediaUrl: string;
  mainMediaType: MediaType;
  externalUrl?: string | null;
  featured: boolean;
  projectDate: string;
  createdAt: string;
  updatedAt: string;
  extraMedia: MediaItem[];
}

export interface ProjectFormData {
  title: string;
  subtitle?: string;
  type: ProjectType;
  description: string;
  tags: string[];
  externalUrl?: string;
  featured: boolean;
  projectDate: string;
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  DESIGN: "Design",
  SOCIAL: "Social Media",
  VIDEO: "Vídeo",
  MOTION: "Motion",
  BRANDING: "Branding",
  OUTROS: "Outros",
};

export const PROJECT_TYPE_COLORS: Record<ProjectType, string> = {
  DESIGN: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  SOCIAL: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  VIDEO: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  MOTION: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  BRANDING: "bg-accent/20 text-accent border-accent/30",
  OUTROS: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};
