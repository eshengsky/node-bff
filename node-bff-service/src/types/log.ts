export interface ILog {
  time: number;
  level: 'log' | 'info' | 'warn' | 'error';
  messages: any[];
}
