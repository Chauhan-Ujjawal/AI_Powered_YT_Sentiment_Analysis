import React, { useState } from 'react';
import { Play, MessageCircle, Brain, Copy, CheckCircle, AlertCircle, Loader, Heart, ThumbsUp, ThumbsDown, Meh, Zap, Star, Smile, Frown, Users, TrendingUp, TrendingDown, Award, X } from 'lucide-react';

interface AnalysisState {
  status: 'idle' | 'extracting' | 'fetching' | 'analyzing' | 'complete' | 'error';
  videoId: string | null;
  comments: string[];
  review: {
    sentiment: string;
    color: string;
    bgColor: string;
    borderColor: string;
    score: string;
    review: string;
  } | null;
  error: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisState>({
    status: 'idle',
    videoId: null,
    comments: [],
    review: null,
    error: ''
  });
  const [copied, setCopied] = useState(false);

  const extractVideoId = (inputURL: string): string | null => {
    const match = inputURL.match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const mockFetchComments = async (videoId: string): Promise<string[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock comments data
    return [
      "This video is absolutely amazing! The content is so well researched and presented.",
      "I've watched this multiple times and still learn something new each time.",
      "Great tutorial! Very clear explanations and easy to follow.",
      "The production quality is top-notch. Keep up the excellent work!",
      "This helped me so much with my project. Thank you for making this!",
      "I disagree with some points but overall a solid video.",
      "Could use better audio quality but the content is valuable.",
      "Subscribed! Looking forward to more content like this.",
      "This is exactly what I was looking for. Perfect timing!",
      "The examples provided are really helpful for understanding the concepts.",
      "A bit long but worth watching till the end.",
      "Amazing explanation! This cleared up so many doubts I had.",
      "The visual aids really help in understanding the complex topics.",
      "I wish there were more videos like this on YouTube.",
      "Excellent work! This deserves more views and likes."
    ];
  };

  const mockAnalyzeComments = async (comments: string[]): Promise<string> => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate varied sentiment analysis based on video ID or random selection
    const sentimentTypes = [
      {
        sentiment: "Highly Positive",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        score: "9.2/10",
        review: `This video has received overwhelmingly positive feedback from viewers. The comments reflect strong appreciation for the content quality, with viewers praising the clear explanations, well-researched material, and professional presentation.

**Key Highlights:**
• Viewers consistently mention the educational value and clarity of explanations
• High production quality is frequently appreciated
• Content is described as helpful and practical for real-world applications
• Strong engagement with viewers expressing desire for more similar content

**Areas for Improvement:**
• A few comments suggest minor audio quality improvements
• Some viewers find the content length could be optimized

This content appears to be highly valuable to its target audience with exceptional educational merit and professional presentation quality.`
      },
      {
        sentiment: "Positive",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        score: "7.8/10",
        review: `The video receives generally positive feedback with viewers appreciating the effort and content quality. Most comments show satisfaction with the material presented.

**Key Highlights:**
• Good educational content that helps viewers understand the topic
• Decent production quality and clear audio
• Helpful examples and practical applications
• Positive engagement from the target audience

**Areas for Improvement:**
• Some viewers suggest adding more detailed explanations
• Pacing could be improved for better retention
• Visual aids could be enhanced for complex topics

Overall, this is solid content that delivers value to viewers, though there's room for enhancement in presentation and depth.`
      },
      {
        sentiment: "Mixed",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        score: "6.1/10",
        review: `The video shows mixed reception with viewers having divided opinions. While some appreciate the content, others have concerns about various aspects.

**Positive Feedback:**
• Some viewers find the topic interesting and relevant
• Basic information is helpful for beginners
• Effort in creating the content is acknowledged

**Critical Feedback:**
• Several comments mention unclear explanations
• Audio quality issues noted by multiple viewers
• Some find the content too basic or too advanced
• Pacing concerns - either too fast or too slow

**Areas Needing Attention:**
• Improve audio/video quality
• Better structure and pacing
• Clearer target audience definition

The content has potential but requires significant improvements to better serve the audience.`
      },
      {
        sentiment: "Negative",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        score: "4.2/10",
        review: `The video has received predominantly negative feedback from viewers, with multiple concerns raised about content quality and presentation.

**Major Issues Identified:**
• Poor audio quality making content hard to follow
• Inaccurate or misleading information noted by viewers
• Lack of clear structure and organization
• Technical issues affecting viewing experience

**Viewer Concerns:**
• Content doesn't match the title/thumbnail promises
• Explanations are confusing or incomplete
• Production quality below expectations
• Limited value provided to the audience

**Recommendations:**
• Complete content restructuring needed
• Invest in better recording equipment
• Fact-check information before publishing
• Consider audience feedback for future improvements

Significant improvements are required to meet viewer expectations and provide genuine value.`
      },
      {
        sentiment: "Controversial",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        score: "5.7/10",
        review: `This video has sparked significant debate among viewers, with strongly divided opinions creating an active discussion in the comments.

**Supportive Comments:**
• Some viewers strongly agree with the presented viewpoints
• Appreciation for tackling difficult or sensitive topics
• Praise for courage in addressing controversial subjects

**Critical Opposition:**
• Strong disagreement with main arguments presented
• Concerns about bias or one-sided presentation
• Requests for more balanced perspective
• Fact-checking challenges from knowledgeable viewers

**Discussion Dynamics:**
• Heated debates between supporters and critics
• Calls for additional sources and evidence
• Polarized reactions with few neutral opinions

While the content generates engagement, the controversial nature may limit its educational value and broader appeal.`
      },
      {
        sentiment: "Neutral",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        score: "6.5/10",
        review: `The video receives moderate feedback with viewers showing neutral to slightly positive reactions. Comments suggest adequate content delivery without strong emotional responses.

**Balanced Feedback:**
• Content is informative but not particularly engaging
• Production quality meets basic standards
• Information is accurate but presentation lacks excitement
• Suitable for educational purposes

**Viewer Observations:**
• Clear delivery but could be more dynamic
• Covers the topic adequately without depth
• Helpful for basic understanding
• Professional but not memorable

**Improvement Opportunities:**
• Add more engaging elements to increase viewer interest
• Include real-world examples or case studies
• Improve visual presentation and graphics

This is competent content that serves its purpose but lacks the spark to create strong viewer engagement or memorable impact.`
      }
    ];

    // Select sentiment based on video ID hash or random for demo
    const selectedSentiment = sentimentTypes[Math.floor(Math.random() * sentimentTypes.length)];
    
    return {
      sentiment: selectedSentiment.sentiment,
      color: selectedSentiment.color,
      bgColor: selectedSentiment.bgColor,
      borderColor: selectedSentiment.borderColor,
      score: selectedSentiment.score,
      review: selectedSentiment.review
    };
  };

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setAnalysis(prev => ({ ...prev, status: 'error', error: 'Please enter a YouTube URL' }));
      return;
    }

    try {
      // Step 1: Extract Video ID
      setAnalysis(prev => ({ ...prev, status: 'extracting', error: '' }));
      const videoId = extractVideoId(url);
      
      if (!videoId) {
        throw new Error("Invalid YouTube URL. Please check the format and try again.");
      }

      setAnalysis(prev => ({ ...prev, videoId, status: 'fetching' }));

      // Step 2: Fetch Comments
      const comments = await mockFetchComments(videoId);
      setAnalysis(prev => ({ ...prev, comments, status: 'analyzing' }));

      // Step 3: Analyze with AI
      const review = await mockAnalyzeComments(comments);
      setAnalysis(prev => ({ ...prev, review, status: 'complete' }));

    } catch (error) {
      setAnalysis(prev => ({ 
        ...prev, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
    }
  };

  const copyToClipboard = async () => {
    try {
      const textToCopy = analysis.review ? 
        `Overall Sentiment: ${analysis.review.sentiment}\nScore: ${analysis.review.score}\n\n${analysis.review.review}` : '';
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const resetAnalysis = () => {
    setAnalysis({
      status: 'idle',
      videoId: null,
      comments: [],
      review: null,
      error: ''
    });
    setUrl('');
  };

  const getStatusMessage = () => {
    switch (analysis.status) {
      case 'extracting':
        return 'Extracting video ID...';
      case 'fetching':
        return 'Fetching comments from YouTube...';
      case 'analyzing':
        return 'Analyzing comments with AI...';
      default:
        return '';
    }
  };

  const isLoading = ['extracting', 'fetching', 'analyzing'].includes(analysis.status);

  const getFloatingIcons = () => {
    if (analysis.status !== 'complete' || !analysis.review) return [];
    
    const iconSets = {
      'Highly Positive': [Heart, ThumbsUp, Star, Award, TrendingUp, Smile],
      'Positive': [ThumbsUp, Star, Smile, CheckCircle, TrendingUp],
      'Mixed': [Meh, Users, MessageCircle, TrendingUp, TrendingDown],
      'Negative': [ThumbsDown, Frown, X, TrendingDown, AlertCircle],
      'Controversial': [Zap, Users, MessageCircle, TrendingUp, TrendingDown],
      'Neutral': [Meh, Users, MessageCircle, Star]
    };
    
    return iconSets[analysis.review.sentiment] || iconSets['Neutral'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Floating Background Icons */}
      {analysis.status === 'complete' && analysis.review && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {getFloatingIcons().slice(0, 8).map((Icon, index) => (
            <div
              key={index}
              className={`absolute opacity-10 ${analysis.review?.color || 'text-gray-400'}`}
              style={{
                left: `${10 + (index * 12) % 70}%`,
                top: `${15 + (index * 8) % 60}%`,
                animationDelay: `${index * 0.8}s`,
                animation: `floatIcon 6s ease-in-out infinite alternate`,
              }}
            >
              <Icon className="h-16 w-16" />
            </div>
          ))}
        </div>
      )}
      
      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes floatIcon {
          0% { 
            transform: translateY(0px) translateX(0px) rotate(-2deg); 
            opacity: 0.08;
          }
          50% { 
            opacity: 0.15;
          }
          100% { 
            transform: translateY(-40px) translateX(15px) rotate(2deg); 
            opacity: 0.08;
          }
        }
      `}</style>
      
      {/* Floating Background Icons */}
      
      {/* Dynamic Background Overlay */}
      {analysis.status === 'complete' && analysis.review && (
        <div className={`fixed inset-0 transition-all duration-1000 opacity-20 ${analysis.review.bgColor}`} />
      )}
      
      {/* Header */}
      <header className={`shadow-lg border-b backdrop-blur-sm transition-all duration-700 ${
        analysis.status === 'complete' && analysis.review 
          ? `${analysis.review.bgColor}/80 ${analysis.review.borderColor}` 
          : 'bg-white/90'
      }`}>
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-3 rounded-xl shadow-lg">
              <Play className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                YouTube Review Analyzer
              </h1>
              <p className="text-sm text-gray-600 font-medium">AI-powered comment analysis and sentiment review</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`relative z-10 max-w-5xl mx-auto px-6 py-12 transition-all duration-700 ${
        analysis.status === 'complete' && analysis.review 
          ? analysis.review.bgColor 
          : ''
      }`}>
        {/* Input Section */}
        <div className={`rounded-2xl shadow-xl border backdrop-blur-sm p-10 mb-12 transition-all duration-700 ${
          analysis.status === 'complete' && analysis.review 
            ? 'bg-white/95' 
            : 'bg-white/95'
        }`}>
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Analyze Video Comments</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="youtubeURL" className="block text-sm font-semibold text-gray-800 mb-3">
                Paste YouTube Video Link
              </label>
              <input
                type="url"
                id="youtubeURL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-lg font-medium placeholder-gray-400 bg-gray-50/50"
                disabled={isLoading}
              />
            </div>
            
            <button
              id="analyzeButton"
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-10 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader className="h-6 w-6 animate-spin" />
                  <span className="text-lg">Analyzing...</span>
                </>
              ) : (
                <>
                  <Brain className="h-6 w-6" />
                  <span className="text-lg">Analyze Comments</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Section */}
        {isLoading && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border p-8 mb-12">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl">
                <Loader className="h-6 w-6 text-white animate-spin" />
              </div>
              <span className="text-gray-800 font-semibold text-lg">{getStatusMessage()}</span>
            </div>
            <div className="mt-6">
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                  style={{
                    width: analysis.status === 'extracting' ? '25%' :
                           analysis.status === 'fetching' ? '50%' :
                           analysis.status === 'analyzing' ? '75%' : '100%'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error Section */}
        {analysis.status === 'error' && (
          <div className="bg-red-50/95 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-8 mb-12 shadow-xl">
            <div className="flex items-start space-x-4">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-red-900 font-bold text-lg">Analysis Failed</h3>
                <p className="text-red-800 mt-2 font-medium">{analysis.error}</p>
                <button
                  onClick={resetAnalysis}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysis.status === 'complete' && analysis.review && (
          <div className={`rounded-2xl shadow-2xl border-2 p-10 bg-white/95 backdrop-blur-sm border-gray-200`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Analysis Complete</h2>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-all duration-200 py-2 px-4 rounded-lg font-medium"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Video Info and Sentiment Header */}
            <div className={`mb-8 p-6 rounded-xl border-2 shadow-lg ${analysis.review.bgColor} ${analysis.review.borderColor}`}>
              <div className="flex items-start space-x-6">
                {/* Video Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={`https://img.youtube.com/vi/${analysis.videoId}/maxresdefault.jpg`}
                      alt="Video thumbnail"
                      className="w-40 h-24 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                      onError={(e) => {
                        // Fallback to medium quality thumbnail if maxres fails
                        e.currentTarget.src = `https://img.youtube.com/vi/${analysis.videoId}/mqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-70 rounded-full p-3 shadow-lg">
                        <Play className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sentiment Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Overall Sentiment</h3>
                      <span className={`text-3xl font-black ${analysis.review.color}`}>
                        {analysis.review.sentiment}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Recommendation Score</p>
                      <span className={`text-2xl font-black ${analysis.review.color}`}>
                        {analysis.review.score}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t-2 border-gray-100">
                    <p className="text-sm text-gray-700 font-medium">
                      <span className="font-bold">Video ID:</span> {analysis.videoId}
                    </p>
                    <p className="text-sm text-gray-700 font-medium">
                      <span className="font-bold">Comments Analyzed:</span> {analysis.comments.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Review Content */}
            <div 
              id="reviewOutput"
              className="prose prose-gray max-w-none bg-gray-50/50 rounded-xl p-8 border-2 border-gray-100 shadow-inner"
            >
              <div className="whitespace-pre-wrap text-gray-900 leading-relaxed text-base font-medium">
                {analysis.review.review}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-700 font-medium">
                Analysis completed • Click thumbnail to view original video
              </p>
              <button
                onClick={resetAnalysis}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Analyze Another Video
              </button>
            </div>
          </div>
        )}

        {/* Placeholder when idle */}
        {analysis.status === 'idle' && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 p-16 text-center">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Brain className="h-10 w-10 text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Analyze</h3>
            <p className="text-gray-700 max-w-lg mx-auto text-lg font-medium leading-relaxed">
              Enter a YouTube video URL above to get an AI-powered analysis of viewer comments and overall sentiment.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t-2 mt-20 transition-all duration-700 ${
        analysis.status === 'complete' && analysis.review 
          ? `${analysis.review.bgColor}/90 backdrop-blur-sm ${analysis.review.borderColor}` 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="text-center text-gray-600 space-y-2">
            <p className="text-base font-semibold text-gray-800">
              <strong>Note:</strong> This demo uses simulated data. In production, you would need:
            </p>
            <ul className="text-sm space-y-2 text-gray-600 font-medium">
              <li>• YouTube Data API v3 key for fetching real comments</li>
              <li>• OpenAI API integration for actual AI analysis</li>
              <li>• Backend service to handle API calls securely</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;