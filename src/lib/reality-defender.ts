// For browser compatibility, we'll use direct API calls instead of the Node.js SDK
import { usageTracker } from './usage-tracker';
import { explanationGenerator } from './explanation-generator';
import type { DetailedExplanation } from './types';

interface AnalysisResult {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  confidence: number;
  prediction: 'authentic' | 'manipulated' | 'inconclusive';
  details: {
    overallScore: number;
    categoryBreakdown: {
      authentic: number;
      manipulated: number;
      inconclusive: number;
    };
    frameAnalysis?: Array<{
      frame: number;
      timestamp: number;
      confidence: number;
      anomalies?: string[];
    }>;
    audioAnalysis?: {
      segments: Array<{
        start: number;
        end: number;
        confidence: number;
        anomalies?: string[];
      }>;
      waveformData?: number[];
    };
    metadata: {
      duration?: number;
      resolution?: string;
      codec?: string;
      bitrate?: number;
      modelsAnalyzed?: number;
      completedModels?: number;
    };
  };
  processingTime: number;
  timestamp: string;
  thumbnailUrl?: string;
  explanation?: DetailedExplanation;
}

interface AnalysisError {
  error: string;
  message: string;
  code?: string;
}

class RealityDefenderAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_RD_API_KEY || '';
    this.baseUrl = process.env.NEXT_PUBLIC_RD_API_URL || 'https://api.prd.realitydefender.xyz';
    
    if (!this.apiKey) {
      throw new Error('NEXT_PUBLIC_RD_API_KEY is required. Please configure your Reality Defender API key.');
    }
    
    console.log('Reality Defender API initialized:', {
      hasApiKey: !!this.apiKey,
      apiKeyPrefix: this.apiKey.substring(0, 10) + '...',
      baseUrl: this.baseUrl
    });
  }

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }

  async analyzeMedia(file: File, progressCallback?: (progress: any) => void): Promise<AnalysisResult> {
    console.log('Analyzing with Reality Defender API:', file.name);
    
    const result = await this.analyzeWithDirectAPI(file, progressCallback);
    const normalizedResult = this.normalizeAnalysisResult(result, file);
    
    // Generate detailed explanation
    try {
      const explanation = explanationGenerator.generateExplanation(normalizedResult);
      normalizedResult.explanation = explanation;
      console.log('✨ Generated detailed explanation:', explanation.summary.primaryReason);
    } catch (error) {
      console.warn('Failed to generate explanation:', error);
    }
    
    // Track usage for free tier monitoring
    if (typeof window !== 'undefined') {
      usageTracker.incrementUsage(
        file.type,
        file.name,
        normalizedResult.confidence,
        normalizedResult.prediction
      );
    }
    
    return normalizedResult;
  }

  private async analyzeWithDirectAPI(file: File, progressCallback?: (progress: any) => void): Promise<any> {
    try {
      // Step 1: Get signed URL for upload via server-side proxy
      progressCallback?.({
        percentage: 5,
        stage: 'upload',
        message: 'Preparing secure upload...',
        stagesCompleted: [],
      });
      
      const signedUrlResponse = await fetch('/api/rd/signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name
        }),
      });

      if (!signedUrlResponse.ok) {
        throw new Error(`Failed to get signed URL: ${signedUrlResponse.status}`);
      }

      const signedUrlData = await signedUrlResponse.json();
      console.log('Got signed URL:', signedUrlData);
      
      // Step 2: Upload file to signed URL (direct to S3)
      progressCallback?.({
        percentage: 15,
        stage: 'upload',
        message: 'Uploading to Reality Defender servers...',
        stagesCompleted: [],
      });

      const uploadResponse = await fetch(signedUrlData.response.signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file: ${uploadResponse.status}`);
      }

      console.log('File uploaded successfully');
      
      progressCallback?.({
        percentage: 25,
        stage: 'preprocessing',
        message: 'Upload complete! Processing media...',
        stagesCompleted: ['upload'],
      });

      // Step 3: Poll for results with progress updates
      const result = await this.pollForResults(signedUrlData.requestId, progressCallback);
      
      return result;
    } catch (error) {
      console.error('Direct API call failed:', error);
      throw error;
    }
  }

  private async pollForResults(requestId: string, progressCallback?: (progress: any) => void, maxAttempts = 60): Promise<any> {
    const startTime = Date.now();
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`/api/rd/result/${requestId}`, {
          method: 'GET',
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`Polling attempt ${attempt + 1}:`, JSON.stringify(result, null, 2));
          
          // Check various status indicators from Reality Defender API
          const overallStatus = result.overallStatus || result.status || result.resultsSummary?.status || result.state;
          
          // Also check individual model statuses
          const modelStatuses = result.models ? result.models.map((m: any) => m.status) : [];
          const hasAnalyzingModels = modelStatuses.some((s: any) => s === 'ANALYZING' || s === 'PROCESSING' || s === 'QUEUED');
          const hasCompletedModels = modelStatuses.some((s: any) => s !== 'ANALYZING' && s !== 'PROCESSING' && s !== 'QUEUED' && s !== 'NOT_APPLICABLE');
          
          // Calculate progress based on model completion
          const totalModels = result.models ? result.models.filter((m: any) => m.status !== 'NOT_APPLICABLE').length : 0;
          const completedModels = result.models ? result.models.filter((m: any) => 
            m.status !== 'ANALYZING' && m.status !== 'PROCESSING' && m.status !== 'QUEUED' && m.status !== 'NOT_APPLICABLE'
          ).length : 0;
          
          const analysisProgress = totalModels > 0 ? (completedModels / totalModels) * 70 : 0; // 70% of total progress for analysis
          const currentProgress = 25 + analysisProgress; // 25% was upload/preprocessing
          
          // Get active models for display
          const activeModels = result.models ? result.models
            .filter((m: any) => m.status === 'ANALYZING' || m.status === 'PROCESSING')
            .map((m: any) => m.name.replace('rd-', '').replace('-', ' '))
            .slice(0, 3) : [];
          
          // Update progress callback
          if (progressCallback) {
            const timeElapsed = Date.now() - startTime;
            const estimatedTotal = totalModels > 0 ? (timeElapsed / completedModels) * totalModels : 60000;
            const estimatedRemaining = Math.max(0, estimatedTotal - timeElapsed);
            
            progressCallback({
              percentage: Math.min(95, Math.round(currentProgress)),
              stage: hasCompletedModels ? 'analysis' : 'preprocessing',
              message: hasAnalyzingModels ? `AI models analyzing: ${completedModels}/${totalModels} complete` : 'Finalizing analysis...',
              stagesCompleted: ['upload', 'preprocessing'],
              analysisDetails: {
                activeModels,
                completedModels,
                totalModels,
                modelStatuses: result.models?.reduce((acc: any, m: any) => ({ ...acc, [m.name]: m.status }), {}) || {},
                currentPhase: hasAnalyzingModels ? 'Model Analysis' : 'Results Compilation'
              },
              timeElapsed: Math.round(timeElapsed / 1000),
              estimatedTimeRemaining: Math.round(estimatedRemaining / 1000)
            });
          }
          
          console.log(`Status check: Overall=${overallStatus}, Models=${modelStatuses}, HasCompleted=${hasCompletedModels}, Progress=${Math.round(currentProgress)}%`);
          
          // Return results if:
          // 1. Overall status is not analyzing, OR
          // 2. We have at least one completed model and no more analyzing models
          if ((overallStatus !== 'ANALYZING' && overallStatus !== 'PROCESSING' && overallStatus !== 'QUEUED') || 
              (hasCompletedModels && !hasAnalyzingModels)) {
            console.log('Analysis complete, returning result');
            
            progressCallback?.({
              percentage: 100,
              stage: 'results',
              message: 'Analysis complete! Generating results...',
              stagesCompleted: ['upload', 'preprocessing', 'analysis'],
              timeElapsed: Math.round((Date.now() - startTime) / 1000)
            });
            
            return result;
          }
          
          console.log(`Status: ${overallStatus}, continuing to poll...`);
        } else {
          console.warn(`Polling failed with status ${response.status}`);
        }

        // Wait 2 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn(`Polling attempt ${attempt + 1} failed:`, error);
        if (attempt === maxAttempts - 1) throw error;
      }
    }

    throw new Error('Analysis timeout - taking longer than expected. Please try again.');
  }

  private getAnalysisType(fileType: string): string {
    if (fileType.startsWith('image/')) return 'image';
    if (fileType.startsWith('video/')) return 'video';
    if (fileType.startsWith('audio/')) return 'audio';
    return 'unknown';
  }


  private normalizeAnalysisResult(apiResult: any, file: File): AnalysisResult {
    console.log('🔍 Raw API Result for', file.name, ':', JSON.stringify(apiResult, null, 2));
    console.log('📊 Models in response:', apiResult.models?.map((m: any) => ({ name: m.name, status: m.status, score: m.normalizedPredictionNumber })));
    
    // Reality Defender API structure - extract from models array
    let overallScore = 0;
    let hasCompletedAnalysis = false;
    
    // Check if we have completed model results
    if (apiResult.models && Array.isArray(apiResult.models)) {
      const completedModels = apiResult.models.filter((model: any) => 
        model.status !== 'ANALYZING' && 
        model.status !== 'PROCESSING' && 
        model.status !== 'QUEUED' &&
        model.status !== 'NOT_APPLICABLE'
      );
      
      if (completedModels.length > 0) {
        // Extract scores from completed models
        const scores = completedModels
          .filter((model: any) => model.normalizedPredictionNumber !== null && model.normalizedPredictionNumber !== undefined)
          .map((model: any) => model.normalizedPredictionNumber);
          
        if (scores.length > 0) {
          // Use ensemble or highest confidence score
          const ensembleModel = completedModels.find((model: any) => model.name.includes('ensemble'));
          if (ensembleModel && ensembleModel.normalizedPredictionNumber !== null) {
            overallScore = ensembleModel.normalizedPredictionNumber;
          } else {
            // Average of all model scores
            overallScore = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
          }
          hasCompletedAnalysis = true;
        }
      }
    }
    
    // Fallback to resultsSummary if available
    if (!hasCompletedAnalysis) {
      const results = apiResult.resultsSummary || apiResult.results || apiResult;
      overallScore = results.overallScore || results.confidence || results.score || 0;
    }
    
    // Convert RD score to our confidence scale (RD scores are 0-1, higher = more likely manipulated)
    // Ensure all values are in proper 0-1 range first
    const normalizedScore = overallScore > 1 ? overallScore / 100 : overallScore;
    
    let prediction: 'authentic' | 'manipulated' | 'inconclusive';
    if (normalizedScore >= 0.7) {
      prediction = 'manipulated';
    } else if (normalizedScore >= 0.3) {
      prediction = 'inconclusive';
    } else {
      prediction = 'authentic';
    }
    
    console.log(`🎯 Analysis Results: Score=${normalizedScore}, Prediction=${prediction}, Completed=${hasCompletedAnalysis}`);
    
    // Calculate category breakdown based on the normalized score
    const authenticPercentage = Math.round(Math.max(0, (1 - normalizedScore)) * 100);
    const manipulatedPercentage = Math.round(normalizedScore * 100);
    const inconclusivePercentage = Math.round(Math.abs(0.5 - normalizedScore) * 40);
    
    const categoryBreakdown = {
      authentic: authenticPercentage,
      manipulated: manipulatedPercentage,
      inconclusive: inconclusivePercentage,
    };
    
    return {
      id: apiResult.requestId || apiResult.id || `rd_${Date.now()}`,
      filename: file.name,
      fileType: file.type,
      fileSize: file.size,
      confidence: normalizedScore,
      prediction,
      details: {
        overallScore: normalizedScore,
        categoryBreakdown,
        frameAnalysis: apiResult.frameAnalysis,
        audioAnalysis: apiResult.audioAnalysis,
        metadata: {
          ...apiResult.metadata,
          processingTime: apiResult.processingTime,
          modelsAnalyzed: apiResult.models?.length || 0,
          completedModels: hasCompletedAnalysis ? apiResult.models?.filter((m: any) => m.status !== 'ANALYZING' && m.status !== 'NOT_APPLICABLE').length : 0,
        },
      },
      processingTime: apiResult.processingTime || 0,
      timestamp: apiResult.timestamp || new Date().toISOString(),
      thumbnailUrl: apiResult.thumbnailUrl,
    };
  }

  async checkApiStatus(): Promise<{ status: string; version?: string }> {

    try {
      // Test the actual API endpoint that we use via proxy
      const response = await fetch('/api/rd/signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: 'status-check.jpg'
        }),
      });

      if (response.ok) {
        return { status: 'online', version: '1.0.0' };
      } else if (response.status === 401) {
        return { status: 'unauthorized' };
      }
      
      return { status: 'error' };
    } catch (error) {
      console.error('API status check failed:', error);
      return { status: 'offline' };
    }
  }
}

export const realityDefenderAPI = new RealityDefenderAPI();
export type { AnalysisResult, AnalysisError };