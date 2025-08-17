import { useEffect } from 'react';

export const useSecurityMonitoring = () => {
  useEffect(() => {
    // Monitor for suspicious activity patterns - now logs to console only
    const monitorSuspiciousActivity = () => {
      // Track page navigation patterns
      let pageViews = 0;
      let lastViewTime = Date.now();

      const handlePageView = () => {
        const currentTime = Date.now();
        const timeSinceLastView = currentTime - lastViewTime;
        
        pageViews++;
        
        // Detect rapid page navigation (potential bot behavior)
        if (timeSinceLastView < 100 && pageViews > 10) {
          console.warn('Security Alert: Suspicious navigation detected', {
            event_type: 'suspicious_navigation',
            event_details: {
              page_views: pageViews,
              time_window: timeSinceLastView,
              user_agent: navigator.userAgent,
              timestamp: new Date().toISOString()
            },
            risk_level: 'medium'
          });
        }
        
        lastViewTime = currentTime;
      };

      // Monitor form interaction patterns
      const monitorFormInteractions = () => {
        let formInteractions = 0;
        let suspiciousFillTime = 0;

        const handleFormFocus = () => {
          formInteractions++;
          const startTime = Date.now();

          const handleFormSubmit = () => {
            const fillTime = Date.now() - startTime;
            
            // Detect suspiciously fast form completion (potential automation)
            if (fillTime < 1000 && formInteractions > 3) {
              suspiciousFillTime++;
              
              if (suspiciousFillTime > 2) {
                console.warn('Security Alert: Suspicious form behavior detected', {
                  event_type: 'suspicious_form_behavior',
                  event_details: {
                    fill_time: fillTime,
                    interactions: formInteractions,
                    timestamp: new Date().toISOString()
                  },
                  risk_level: 'high'
                });
              }
            }
          };

          document.addEventListener('submit', handleFormSubmit, { once: true });
        };

        document.addEventListener('focusin', (e) => {
          if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
            handleFormFocus();
          }
        });
      };

      // Monitor for developer tools usage
      const monitorDevTools = () => {
        let devtools = false;
        const threshold = 160;

        const checkDevTools = () => {
          if (window.outerHeight - window.innerHeight > threshold || 
              window.outerWidth - window.innerWidth > threshold) {
            if (!devtools) {
              devtools = true;
              console.info('Security Info: Developer tools detected', {
                event_type: 'developer_tools_detected',
                event_details: {
                  screen_dimensions: {
                    outer: { width: window.outerWidth, height: window.outerHeight },
                    inner: { width: window.innerWidth, height: window.innerHeight }
                  },
                  timestamp: new Date().toISOString()
                },
                risk_level: 'low'
              });
            }
          } else {
            devtools = false;
          }
        };

        setInterval(checkDevTools, 1000);
      };

      // Monitor for copy/paste of sensitive data
      const monitorClipboard = () => {
        document.addEventListener('paste', (e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'INPUT' && target.getAttribute('type') === 'password') {
            console.warn('Security Alert: Password paste detected', {
              event_type: 'password_paste_detected',
              event_details: {
                timestamp: new Date().toISOString()
              },
              risk_level: 'medium'
            });
          }
        });
      };

      // Initialize monitoring
      handlePageView();
      monitorFormInteractions();
      monitorDevTools();
      monitorClipboard();

      // Monitor visibility changes (potential tab switching during forms)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          console.info('Security Info: Tab hidden during session', {
            event_type: 'tab_hidden_during_session',
            event_details: {
              timestamp: new Date().toISOString()
            },
            risk_level: 'low'
          });
        }
      });
    };

    monitorSuspiciousActivity();
  }, []);
};