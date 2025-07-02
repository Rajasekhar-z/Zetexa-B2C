export async function fetchWithInterceptor(
    url: string,
    options: RequestInit = {}
  ): Promise<any> {
    try {
      let authToken = '';
      // Get customer token from localStorage if available
      if (typeof window !== 'undefined') {
        authToken = localStorage.getItem('customerToken') || '';
        if (authToken) {
          authToken = 'Token ' + authToken;
        }
      }
  
      const modifiedOptions = {
        ...options,
        headers: {
          ...(options.headers || {}),
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: authToken } : {}),
        },
      };
  
      const response = await fetch(url, modifiedOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }
  