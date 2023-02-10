import { InjectionToken } from '@angular/core';
import { DashboardService, EventService } from '../..';

export const CP_CONFIG = new InjectionToken<string>('CpConfig');
export const EVENT_SERVICE_TOKEN = new InjectionToken<EventService>('EventService');
export const DASHBOARD_TOKEN = new InjectionToken<DashboardService>('Dashbaord');
