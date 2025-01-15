import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export interface NotificationOptions {
  sticky?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly pMessageService = inject(MessageService);

  public success(title: string, text: string, options?: NotificationOptions) {
    this.pMessageService.add({
      severity: 'success', summary: title, detail: text, ...options,
    });
  }

  public info(title: string, text: string, options?: NotificationOptions) {
    this.pMessageService.add({
      severity: 'info', summary: title, detail: text, ...options,
    });
  }

  public warn(title: string, text: string, options?: NotificationOptions) {
    this.pMessageService.add({
      severity: 'warn', summary: title, detail: text, ...options,
    });
  }

  public error(title: string, text: string, options?: NotificationOptions) {
    this.pMessageService.add({
      severity: 'error', summary: title, detail: text, ...options,
    });
  }

  public secondary(title: string, text: string, options?: NotificationOptions) {
    this.pMessageService.add({
      severity: 'secondary', summary: title, detail: text, ...options,
    });
  }

  public contrast(title: string, text: string, options?: NotificationOptions) {
    this.pMessageService.add({
      severity: 'contrast', summary: title, detail: text, ...options,
    });
  }

  public clear() {
    this.pMessageService.clear();
  }
}
