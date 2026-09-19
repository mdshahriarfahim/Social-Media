import { io } from 'socket.io-client';
import { API_BASE } from './api';

// পুরো অ্যাপে একটাই socket connection ব্যবহার হবে
export const socket = io(API_BASE, { autoConnect: false });