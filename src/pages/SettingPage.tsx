import { AppSettings } from '@sharedTypes/setting';
import { useState, useEffect } from 'react';

const SettingPage = () => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    appLanguage: 'en',
    platform: 'darwin',
    window: {
      width: 800,
      height: 600,
      isMaximized: false,
      leftPanelWidth: 200,
      rightPanelWidth: 200,
    },
    openai: {
      apiKey: '',
      apiModel: '',
      apiUrl: '',
      apiUrlPath: '',
      targetLanguage: '',
    },
  });
  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await window.settings.getAllSettings();
      setSettings(settings);
    };
    fetchSettings();
  }, []);
  return (
    <div>
      <h1>SettingPage</h1>
      <div>
        <h2>Theme</h2>
        <select
          value={settings.theme}
          onChange={e => setSettings({ ...settings, theme: e.target.value })}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
};
export default SettingPage;
