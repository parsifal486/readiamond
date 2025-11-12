import { AppSettings } from '@sharedTypes/setting';
import { useState, useEffect } from 'react';
import { MdSettings } from 'react-icons/md';
import { MdMenuBook } from 'react-icons/md';
import { MdTranslate } from 'react-icons/md';
import { MdCloud } from 'react-icons/md';
import { MdMonitor } from 'react-icons/md';

const SettingPage = () => {
  // selected section state (default: language)
  const [selectedSection, setSelectedSection] = useState('language');

  // settings data state
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    appLanguage: 'en',
    foreignLanguage: 'zh',
    platform: 'darwin',
    dictionary: {
      youdaoEnabled: true,
    },
    translationEngine: {
      youdaoEnabled: true,
    },
    network: {
      serverPort: 3000,
    },
    display: {
      dashboardPageSize: 10,
      readingPageSize: 10,
    },
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
      targetLanguage: 'zh',
    },
  });

  //setting section for rendering
  const settingSections = [
    {
      id: 'general',
      label: 'General',
      icon: <MdSettings />,
      items: [
        {
          id: 'theme',
          value: settings.theme,
          onChange: (value: string) => handleSettingChange('theme', value),
        },
        {
          id: 'appLanguage',
          value: settings.appLanguage,
          onChange: (value: string) =>
            handleSettingChange('appLanguage', value),
        },
        {
          id: 'foreignLanguage',
          value: settings.foreignLanguage,
          onChange: (value: string) =>
            handleSettingChange('foreignLanguage', value),
        },
      ],
    },
    {
      id: 'dictionary',
      label: 'Dictionary',
      icon: <MdMenuBook />,
      items: [
        {
          id: 'youdaoEnabled',
          value: settings.dictionary.youdaoEnabled,
          onChange: (value: boolean) =>
            handleSettingChange('dictionary.youdaoEnabled', value),
        },
      ],
    },
    {
      id: 'translationEngine',
      label: 'Translation Engine',
      icon: <MdTranslate />,
      items: [
        {
          id: 'youdaoEnabled',
          value: settings.translationEngine.youdaoEnabled,
          onChange: (value: boolean) =>
            handleSettingChange('translationEngine.youdaoEnabled', value),
        },
      ],
    },
    {
      id: 'network',
      label: 'Network',
      icon: <MdCloud />,
      items: [
        {
          id: 'serverPort',
          value: settings.network.serverPort,
          onChange: (value: number) =>
            handleSettingChange('network.serverPort', value),
        },
      ],
    },
    {
      id: 'display',
      label: 'Display',
      icon: <MdMonitor />,
      items: [
        {
          id: 'dashboardPageSize',
          value: settings.display.dashboardPageSize,
          onChange: (value: number) =>
            handleSettingChange('display.dashboardPageSize', value),
        },
        {
          id: 'readingPageSize',
          value: settings.display.readingPageSize,
          onChange: (value: number) =>
            handleSettingChange('display.readingPageSize', value),
        },
      ],
    },
  ];

  // load settings data
  // useEffect(() => {
  //   const fetchSettings = async () => {
  //     const settings = await window.settings.getAllSettings();
  //     setSettings(settings);
  //   };
  //   fetchSettings();
  // }, []);

  // update settings function - save to electron in real time
  // const handleSettingChange = async (path: string, value: any) => {
  //   // 根据路径更新嵌套的对象
  //   const keys = path.split('.'); // 例如 "network.serverPort" 分割成 ["network", "serverPort"]

  //   setSettings(prev => {
  //     const newSettings = { ...prev };
  //     if (keys.length === 1) {
  //       // 顶层属性，如 theme
  //       (newSettings as any)[keys[0]] = value;
  //     } else if (keys.length === 2) {
  //       // 嵌套属性，如 network.serverPort
  //       (newSettings as any)[keys[0]] = {
  //         ...(newSettings as any)[keys[0]],
  //         [keys[1]]: value,
  //       };
  //     }
  //     return newSettings;
  //   });

  //   // 保存到 electron
  //   await window.settings.setSetting(path, value);
  // };

  //
  return (
    <div className="w-full h-full flex bg-main">
      {/* side bar */}
      <nav className="w-48 border-r split-line bg-emphasis">
        <ul>
          {settingSections.map(section => (
            <li
              key={section.id}
              className="flex items-center justify-start p-1"
            >
              <a href={`#${section.id}`}>
                <button
                  onClick={() => setSelectedSection(section.id)}
                  className="w-full h-full flex items-center justify-start"
                >
                  <div className="w-8 h-8 flex items-center justify-center ">
                    {section.icon}
                  </div>
                  <span className="text-sm ml-2">{section.label}</span>
                </button>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* main setting content */}
      <div className="w-full h-full flex flex-col items-center justify-start">
        {/* general setting content */}
        <div
          id="general"
          className="flex flex-col items-center justify-start p-4 bg-emphasis border-b split-line m-5 w-100% "
        >
          <div className="flex items-center justify-start">
            <span>theme</span>
            <select className="border-2 border-gray-300 rounded-md p-1">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className="flex items-center justify-start">
            <span>appLanguage</span>
            <select className="border-2 border-gray-300 rounded-md p-1">
              <option value="en">English</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </div>
        <div id="dictionary">
          <h1>Dictionary</h1>
        </div>
        <div id="translationEngine">
          <h1>Translation Engine</h1>
        </div>
        <div id="network">
          <h1>Network</h1>
        </div>
        <div id="display">
          <h1>Display</h1>
        </div>
      </div>
    </div>
  );
};
export default SettingPage;
