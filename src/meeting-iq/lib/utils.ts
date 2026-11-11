// @ts-nocheck
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from "dompurify"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format text with bullet points and line breaks for HTML rendering
export function formatBulletText(text: string): { formatted: string; hasBullets: boolean } {
  // First convert markdown-style formatting to HTML
  let processedText = text
    // Convert **bold** to <strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert *italic* to <em> (but not if it's part of ** pattern)
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  
  // Check if text already contains HTML tags
  const hasHtmlTags = /<[^>]+>/g.test(processedText);
  
  if (hasHtmlTags && /<ul\b|<ol\b|<li\b/i.test(processedText)) {
    // Text already contains HTML list formatting, sanitize then return
    return {
      formatted: DOMPurify.sanitize(processedText),
      hasBullets: true
    };
  }
  
  // Check if text contains bullet patterns
  const bulletPatterns = [
    /^(•\s+)/gm,        // • bullet
    /^(\*\s+)/gm,       // * bullet (but not markdown formatting)
    /^(-\s+)/gm,        // - bullet
    /^(\d+\.\s+)/gm,    // 1. numbered
  ];
  
  let hasBullets = bulletPatterns.some(pattern => pattern.test(processedText));
  
  if (!hasBullets) {
    // Just convert line breaks to <br> for non-bulleted text
    return {
      formatted: DOMPurify.sanitize(processedText.replace(/\n/g, '<br>')),
      hasBullets: false
    };
  }
  
  // Convert bullet patterns to HTML list items
  let formatted = processedText
    // Convert bullet patterns to <li> tags
    .replace(/^(•\s+)(.+)$/gm, '<li>$2</li>')
    .replace(/^(\*\s+)(.+)$/gm, '<li>$2</li>')
    .replace(/^(-\s+)(.+)$/gm, '<li>$2</li>')
    .replace(/^(\d+\.\s+)(.+)$/gm, '<li>$2</li>')
    // Handle line breaks between non-bullet items
    .replace(/\n(?!<li>)/g, '<br>')
    // Wrap consecutive <li> items in <ul>
    .replace(/(<li>.*<\/li>(?:\s*<li>.*<\/li>)*)/gs, '<ul class="list-disc list-outside space-y-1 pl-5">$1</ul>');
  
  return {
    formatted: DOMPurify.sanitize(formatted),
    hasBullets: true
  };
}
