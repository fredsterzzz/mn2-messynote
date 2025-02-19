interface Window {
  gtag?: (
    command: 'js' | 'config' | 'consent' | 'event',
    timestamp?: Date | string,
    config?: {
      ad_storage?: 'granted' | 'denied';
      analytics_storage?: 'granted' | 'denied';
      [key: string]: any;
    }
  ) => void;
  dataLayer?: any[];
}
