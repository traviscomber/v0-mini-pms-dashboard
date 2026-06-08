'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  Property, Room, Reservation, Guest, Payment, Task, Alert, User, AuditLog,
  BilingualText, Language
} from '../types';

interface PmsStore {
  properties: Property[];
  rooms: Room[];
  reservations: Reservation[];
  guests: Guest[];
  payments: Payment[];
  tasks: Task[];
  alerts: Alert[];
  users: User[];
  auditLogs: AuditLog[];
}

const STORAGE_KEY = 'pms-data';

export function usePmsStore() {
  const [store, setStore] = useState<PmsStore>({
    properties: [],
    rooms: [],
    reservations: [],
    guests: [],
    payments: [],
    tasks: [],
    alerts: [],
    users: [],
    auditLogs: [],
  });

  const [isMounted, setIsMounted] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setStore(parsed);
      }
    } catch (e) {
      console.error('Failed to load PMS data:', e);
    }
    setIsMounted(true);
  }, []);

  // Save to localStorage whenever store changes
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      } catch (e) {
        console.error('Failed to save PMS data:', e);
      }
    }
  }, [store, isMounted]);

  // === PROPERTY OPERATIONS ===
  const addProperty = useCallback((property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProperty: Property = {
      ...property,
      id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStore(prev => ({
      ...prev,
      properties: [...prev.properties, newProperty],
    }));
    return newProperty;
  }, []);

  const updateProperty = useCallback((id: string, updates: Partial<Property>) => {
    setStore(prev => ({
      ...prev,
      properties: prev.properties.map(p => 
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
    }));
  }, []);

  const deleteProperty = useCallback((id: string) => {
    setStore(prev => ({
      ...prev,
      properties: prev.properties.filter(p => p.id !== id),
      rooms: prev.rooms.filter(r => r.propertyId !== id),
      reservations: prev.reservations.filter(r => r.propertyId !== id),
      tasks: prev.tasks.filter(t => t.propertyId !== id),
    }));
  }, []);

  const getProperty = useCallback((id: string) => {
    return store.properties.find(p => p.id === id);
  }, [store.properties]);

  // === ROOM OPERATIONS ===
  const addRoom = useCallback((room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRoom: Room = {
      ...room,
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStore(prev => ({
      ...prev,
      rooms: [...prev.rooms, newRoom],
    }));
    return newRoom;
  }, []);

  const updateRoom = useCallback((id: string, updates: Partial<Room>) => {
    setStore(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => 
        r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
      ),
    }));
  }, []);

  const deleteRoom = useCallback((id: string) => {
    setStore(prev => ({
      ...prev,
      rooms: prev.rooms.filter(r => r.id !== id),
    }));
  }, []);

  const getRoomsByProperty = useCallback((propertyId: string) => {
    return store.rooms.filter(r => r.propertyId === propertyId);
  }, [store.rooms]);

  // === GUEST OPERATIONS ===
  const addGuest = useCallback((guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGuest: Guest = {
      ...guest,
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStore(prev => ({
      ...prev,
      guests: [...prev.guests, newGuest],
    }));
    return newGuest;
  }, []);

  const updateGuest = useCallback((id: string, updates: Partial<Guest>) => {
    setStore(prev => ({
      ...prev,
      guests: prev.guests.map(g => 
        g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g
      ),
    }));
  }, []);

  const getGuest = useCallback((id: string) => {
    return store.guests.find(g => g.id === id);
  }, [store.guests]);

  // === RESERVATION OPERATIONS ===
  const addReservation = useCallback((reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReservation: Reservation = {
      ...reservation,
      id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStore(prev => ({
      ...prev,
      reservations: [...prev.reservations, newReservation],
    }));
    return newReservation;
  }, []);

  const updateReservation = useCallback((id: string, updates: Partial<Reservation>) => {
    setStore(prev => ({
      ...prev,
      reservations: prev.reservations.map(r => 
        r.id === id ? { ...r, ...updates, updatedAt: new Date() } : r
      ),
    }));
  }, []);

  const cancelReservation = useCallback((id: string) => {
    setStore(prev => ({
      ...prev,
      reservations: prev.reservations.map(r => 
        r.id === id ? { ...r, reservationStatus: 'cancelled', updatedAt: new Date() } : r
      ),
    }));
  }, []);

  const getReservationsByProperty = useCallback((propertyId: string) => {
    return store.reservations.filter(r => r.propertyId === propertyId);
  }, [store.reservations]);

  const getReservationsByRoom = useCallback((roomId: string) => {
    return store.reservations.filter(r => r.roomId === roomId);
  }, [store.reservations]);

  // === PAYMENT OPERATIONS ===
  const addPayment = useCallback((payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStore(prev => ({
      ...prev,
      payments: [...prev.payments, newPayment],
    }));
    
    // Update reservation payment status
    const reservation = store.reservations.find(r => r.id === payment.reservationId);
    if (reservation) {
      const newPaidAmount = reservation.paidAmount + newPayment.amount;
      updateReservation(payment.reservationId, {
        paidAmount: newPaidAmount,
        balanceDue: Math.max(0, reservation.totalAmount - newPaidAmount),
        paymentStatus: newPaidAmount >= reservation.totalAmount ? 'paid' : 'partially_paid',
      });
    }
    
    return newPayment;
  }, [store.reservations, updateReservation]);

  const getPaymentsByReservation = useCallback((reservationId: string) => {
    return store.payments.filter(p => p.reservationId === reservationId);
  }, [store.payments]);

  // === TASK OPERATIONS ===
  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStore(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setStore(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    }));
  }, []);

  const completeTask = useCallback((id: string) => {
    setStore(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === id ? { ...t, status: 'completed', completedAt: new Date(), updatedAt: new Date() } : t
      ),
    }));
  }, []);

  const getTasksByRoom = useCallback((roomId: string) => {
    return store.tasks.filter(t => t.roomId === roomId);
  }, [store.tasks]);

  // === ALERT OPERATIONS ===
  const addAlert = useCallback((alert: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStore(prev => ({
      ...prev,
      alerts: [...prev.alerts, newAlert],
    }));
    return newAlert;
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setStore(prev => ({
      ...prev,
      alerts: prev.alerts.map(a => 
        a.id === id ? { ...a, isActive: false, dismissedAt: new Date(), updatedAt: new Date() } : a
      ),
    }));
  }, []);

  const getActiveAlerts = useCallback((propertyId: string) => {
    return store.alerts.filter(a => a.propertyId === propertyId && a.isActive);
  }, [store.alerts]);

  return {
    store,
    isMounted,
    // Properties
    addProperty, updateProperty, deleteProperty, getProperty,
    // Rooms
    addRoom, updateRoom, deleteRoom, getRoomsByProperty,
    // Guests
    addGuest, updateGuest, getGuest,
    // Reservations
    addReservation, updateReservation, cancelReservation, getReservationsByProperty, getReservationsByRoom,
    // Payments
    addPayment, getPaymentsByReservation,
    // Tasks
    addTask, updateTask, completeTask, getTasksByRoom,
    // Alerts
    addAlert, dismissAlert, getActiveAlerts,
  };
}
