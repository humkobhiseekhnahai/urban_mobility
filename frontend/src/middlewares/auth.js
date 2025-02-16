export const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return { valid: false, role: null };
  
    try {
      // Try the user endpoint first
      const response = await fetch('http://localhost:3000/auth/check-user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        return { valid: true, role: 'user' };
      }
      
      // Try operator endpoint
      const operatorResponse = await fetch('http://localhost:3000/auth/check-operator', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (operatorResponse.ok) {
        const data = await operatorResponse.json();
        return { valid: true, role: 'operator' };
      }
    
      // Try partner endpoint
      const partnerResponse = await fetch('http://localhost:3000/auth/check-partner', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (partnerResponse.ok) {
        const data = await partnerResponse.json();
        return { valid: true, role: 'partner' };
      }
      
      return { valid: false, role: null };
    } catch (error) {
      console.error("Auth check failed:", error);
      return { valid: false, role: null };
    }
  };
  
  export const roleGuard = (requiredRole) => async () => {
    const { valid, role } = await checkAuth();
    if (!valid || (requiredRole && role !== requiredRole)) {
      window.location.href = '/login';
      return false;
    }
    return true;
  };