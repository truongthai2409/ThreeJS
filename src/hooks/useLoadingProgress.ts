import { useState, useCallback } from 'react';
import type { LoadingState } from '../types';

export const useLoadingProgress = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    progress: 0,
    status: 'Khởi tạo...'
  });

  const updateProgress = useCallback((progress: number, status?: string) => {
    setLoadingState(prev => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
      status: status || prev.status
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean, status?: string) => {
    setLoadingState(prev => ({
      ...prev,
      isLoading,
      status: status || prev.status
    }));
  }, []);

  const startLoading = useCallback((status = 'Đang tải...') => {
    setLoadingState({
      isLoading: true,
      progress: 0,
      status
    });
  }, []);

  const finishLoading = useCallback(() => {
    setLoadingState(prev => ({
      ...prev,
      isLoading: false,
      progress: 100,
      status: 'Hoàn thành!'
    }));
  }, []);

  return {
    loadingState,
    updateProgress,
    setLoading,
    startLoading,
    finishLoading
  };
};
