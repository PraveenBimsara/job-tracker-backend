import axios from 'axios';

// Get recommended jobs (smart matching)
const getRecommendedJobs = async (userJobs = []) => {
  try {
    // Extract skills/keywords from user's existing applications
    const keywords = extractKeywords(userJobs);
    const searchTerm = keywords.length > 0 ? keywords[0] : 'software engineer';
    
    // Fetch from RemoteOK
    const remoteJobs = await searchRemoteOKJobs(searchTerm);
    
    // Return top 5 most relevant
    return remoteJobs.slice(0, 5);
  } catch (error) {
    console.error('Recommendation error:', error.message);
    return [];
  }
};

// Extract keywords from user's job applications
const extractKeywords = (userJobs) => {
  const keywords = new Set();
  
  userJobs.forEach(job => {
    // Extract from position titles
    const words = job.position.toLowerCase().split(' ');
    words.forEach(word => {
      if (word.length > 3) keywords.add(word);
    });
  });
  
  // Common tech keywords
  const techKeywords = ['react', 'python', 'javascript', 'java', 'node', 'frontend', 'backend', 'fullstack', 'devops'];
  const matches = techKeywords.filter(keyword => 
    Array.from(keywords).some(k => k.includes(keyword))
  );
  
  return matches.length > 0 ? matches : ['software', 'developer'];
};

// Search remote jobs from RemoteOK
const searchRemoteOKJobs = async (query = 'software') => {
  try {
    const url = 'https://remoteok.com/api';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'JobTrackr/1.0',
      },
    });

    const jobs = response.data.slice(1);

    return jobs
      .filter(job => 
        job.position.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        (job.tags && job.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
      )
      .slice(0, 30)
      .map(job => ({
        externalId: job.id,
        title: job.position,
        company: job.company,
        location: job.location || 'Remote',
        description: job.description || '',
        url: job.url,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        tags: job.tags || [],
        created: job.date,
        source: 'RemoteOK',
        logo: job.company_logo || null,
      }));
  } catch (error) {
    console.error('RemoteOK API Error:', error.message);
    return [];
  }
};

// Main search function
const searchJobs = async (query = 'software engineer') => {
  try {
    const jobs = await searchRemoteOKJobs(query);
    return jobs;
  } catch (error) {
    console.error('Job search error:', error.message);
    throw error;
  }
};

export { searchJobs, searchRemoteOKJobs, getRecommendedJobs };