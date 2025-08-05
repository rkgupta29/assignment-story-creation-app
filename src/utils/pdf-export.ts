import html2pdf from 'html2pdf.js';
import { Story, StoryType } from '@/types/story';

export const exportStoryToPDF = async (story: Story) => {
  // Create a temporary container for the PDF content
  const container = document.createElement('div');
  container.style.padding = '40px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.style.backgroundColor = 'white';
  container.style.color = '#333';
  
  // Add global styles for links
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    a {
      color: #3b82f6 !important;
      text-decoration: underline !important;
      display: inline-block !important;
    }
    a:hover {
      color: #2563eb !important;
    }
  `;
  container.appendChild(styleElement);

  // Add story metadata
  const header = document.createElement('div');
  header.style.marginBottom = '30px';
  header.style.borderBottom = '2px solid #e5e7eb';
  header.style.paddingBottom = '20px';

  const typeIcon = story.type === StoryType.TEXT ? '📄' : '🎤';
  const typeText = story.type === StoryType.TEXT ? 'Text Story' : 'Voice Story';
  
  header.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; color: #6b7280; font-size: 14px;">
      <span>${typeIcon}</span>
      <span>${typeText}</span>
      <span>•</span>
      <span>📅 ${new Date(story.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })}</span>
    </div>
    <h1 style="font-size: 32px; font-weight: bold; color: #111827; margin: 0 0 15px 0; line-height: 1.2;">
      ${story.title}
    </h1>
    <div style="display: flex; align-items: center; gap: 8px; color: #4b5563; font-size: 18px;">
      <span>👤</span>
      <span>by ${story.authorName}</span>
    </div>
  `;

  container.appendChild(header);

  // Add audio section for voice stories
  if (story.type === StoryType.VOICE && story.audioUrl) {
    const audioSection = document.createElement('div');
    audioSection.style.marginBottom = '30px';
    audioSection.style.padding = '20px';
    audioSection.style.backgroundColor = '#f9fafb';
    audioSection.style.borderRadius = '8px';
    audioSection.style.border = '1px solid #e5e7eb';

    audioSection.innerHTML = `
      <h3 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 15px 0;">
        🎵 Audio Story
      </h3>
      <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px;">
        This story includes an audio recording. Click the link below to listen to the full audio:
      </p>
      <a href="${story.audioUrl}" 
         style="font-weight: 500; font-size: 16px;"
         target="_blank">
        🔊 Listen to Audio Story
      </a>
    `;

    container.appendChild(audioSection);
  }

  // Add content section
  const contentSection = document.createElement('div');
  
  // Helper function to convert relative URLs to absolute URLs
  const convertToAbsoluteUrls = (htmlContent: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    const links = tempDiv.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        // Handle different types of URLs
        if (href.startsWith('http://') || href.startsWith('https://')) {
          // Already absolute, keep as is
        } else if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
          // Keep special links as is
          return;
        } else if (href.startsWith('/')) {
          // Internal relative path, make it absolute with current domain
          link.setAttribute('href', `https://${window.location.host}${href}`);
        } else if (href.includes('.') && !href.includes('/')) {
          // Likely a domain without protocol (e.g., "example.com")
          link.setAttribute('href', `https://${href}`);
        } else {
          // Other relative paths, make them absolute with current domain
          link.setAttribute('href', `https://${window.location.host}/${href}`);
        }
        
        // Ensure all links open in new tab
        link.setAttribute('target', '_blank');
      }
    });
    
    return tempDiv.innerHTML;
  };

  if (story.type === StoryType.TEXT) {
    // For text stories, use the content directly with absolute URLs
    const processedContent = convertToAbsoluteUrls(story.content);
    contentSection.innerHTML = `
      <div style="font-size: 16px; line-height: 1.6; color: #374151;">
        ${processedContent}
      </div>
    `;
  } else {
    // For voice stories, show the transcript with absolute URLs
    const processedTranscript = story.audioTranscript ? convertToAbsoluteUrls(story.audioTranscript) : 'No transcript available.';
    contentSection.innerHTML = `
      <h3 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0 0 20px 0;">
        📝 Transcript
      </h3>
      <div style="font-size: 16px; line-height: 1.6; color: #374151;">
        ${processedTranscript}
      </div>
    `;
  }

  container.appendChild(contentSection);

  // Add footer
  const footer = document.createElement('div');
  footer.style.marginTop = '40px';
  footer.style.paddingTop = '20px';
  footer.style.borderTop = '1px solid #e5e7eb';
  footer.style.textAlign = 'center';
  footer.style.color = '#6b7280';
  footer.style.fontSize = '12px';
  
  footer.innerHTML = `
    <p>Exported from Story Creation App on ${new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</p>
  `;

  container.appendChild(footer);

  // Configure PDF options
  const options = {
    margin: [10, 10, 10, 10],
    filename: `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      allowTaint: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  try {
    // Generate and download the PDF
    await html2pdf().from(container).set(options).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}; 