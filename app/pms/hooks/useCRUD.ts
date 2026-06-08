'use client';

import { useState, useCallback } from 'react';

export interface CRUDState<T> {
  items: T[];
  selectedItem: T | null;
  isModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CRUDActions<T> {
  create: (item: T) => void;
  update: (id: string, updates: Partial<T>) => void;
  delete: (id: string) => void;
  setSelectedItem: (item: T | null) => void;
  openModal: () => void;
  closeModal: () => void;
  setItems: (items: T[]) => void;
  setError: (error: string | null) => void;
}

export function useCRUD<T extends { id: string }>(initialItems: T[]): [CRUDState<T>, CRUDActions<T>] {
  const [state, setState] = useState<CRUDState<T>>({
    items: initialItems,
    selectedItem: null,
    isModalOpen: false,
    isLoading: false,
    error: null,
  });

  const create = useCallback((item: T) => {
    setState((prev) => ({
      ...prev,
      items: [...prev.items, item],
      isModalOpen: false,
      error: null,
    }));
  }, []);

  const update = useCallback((id: string, updates: Partial<T>) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
      isModalOpen: false,
      error: null,
    }));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
      error: null,
    }));
  }, []);

  const setSelectedItem = useCallback((item: T | null) => {
    setState((prev) => ({
      ...prev,
      selectedItem: item,
    }));
  }, []);

  const openModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isModalOpen: true,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isModalOpen: false,
      selectedItem: null,
    }));
  }, []);

  const setItems = useCallback((items: T[]) => {
    setState((prev) => ({
      ...prev,
      items,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  const actions: CRUDActions<T> = {
    create,
    update,
    delete: deleteItem,
    setSelectedItem,
    openModal,
    closeModal,
    setItems,
    setError,
  };

  return [state, actions];
}
