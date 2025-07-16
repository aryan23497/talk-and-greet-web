export interface IndianKanoonResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface LegalQuery {
  query: string;
  context?: string;
}

class IndianKanoonService {
  private baseUrl = 'http://localhost:5001';

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<IndianKanoonResponse> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body && method === 'POST') {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async searchCases(query: string, pagenum: number = 0, maxpages: number = 10): Promise<IndianKanoonResponse> {
    return this.makeRequest('/search', 'POST', {
      query,
      pagenum,
      maxpages
    });
  }

  async getCaseDetails(caseId: string): Promise<IndianKanoonResponse> {
    return this.makeRequest(`/doc/${caseId}`);
  }

  async getDocumentMeta(caseId: string): Promise<IndianKanoonResponse> {
    return this.makeRequest(`/docmeta/${caseId}`);
  }

  async getDocumentFragment(caseId: string, query: string): Promise<IndianKanoonResponse> {
    return this.makeRequest(`/docfragment/${caseId}`, 'POST', {
      formInput: query
    });
  }

  async getLegalAdvice(query: LegalQuery): Promise<IndianKanoonResponse> {
    // Search for cases related to the legal query
    const casesResponse = await this.searchCases(query.query, 0, 10);
    if (!casesResponse.success) {
      return {
        success: false,
        error: 'Unable to fetch legal information. Please check your query and try again.'
      };
    }

    // If we have cases, try to get more details for the first few cases
    const cases = casesResponse.data?.docs || [];
    const detailedCases = [];

    for (let i = 0; i < Math.min(cases.length, 3); i++) {
      const caseDetail = await this.getCaseDetails(cases[i].tid);
      if (caseDetail.success) {
        detailedCases.push({
          ...cases[i],
          details: caseDetail.data
        });
      }
    }

    return {
      success: true,
      data: {
        cases: detailedCases,
        totalFound: casesResponse.data?.found || 0,
        query: query.query,
        context: query.context
      }
    };
  }

  async healthCheck(): Promise<IndianKanoonResponse> {
    return this.makeRequest('/health');
  }
}

export const indianKanoonService = new IndianKanoonService(); 