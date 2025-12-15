import {
  MdSettings,
  MdMenuBook,
  MdTranslate,
  MdCloud,
  MdMonitor,
} from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { updateSetting } from '@store/slices/settingsSlice';
import { RootState } from '@store/store';
import SettingSection from '@components/settings/SettingSection';
import SettingItem from '@components/settings/SettingItem';

const SettingPage = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  console.log(settings);

  const handleSettingChange = async (path: string, value: unknown) => {
    dispatch(updateSetting({ path, value }));
    try {
      await window.settings.setSetting(path, value);
    } catch (error) {
      console.error('Failed to save setting:', error);
    }
  };

  const handlePathChange = async (path: string) => {
    //pick directory
    const directory = await window.settings.openDialog({
      properties: ['openDirectory'],
    });
    if (directory.length > 0) {
      handleSettingChange(path, directory[0]);
    }
  };

  return (
    <div className="w-full h-full flex bg-main">
      {/* sidebar-navigation */}
      <nav className="w-48 border-r split-line bg-emphasis">
        <ul>
          <li className="flex items-center justify-start p-1 hover:bg-main transition-colors rounded-md">
            <a href="#network-ai">
              <button className="w-full h-full flex items-center justify-start">
                <div className="w-8 h-8 flex items-center justify-center text-theme-base">
                  <MdCloud />
                </div>
                <span className="text-sm ml-2 text-theme-base">
                  Network & AI
                </span>
              </button>
            </a>
          </li>
          <li className="flex items-center justify-start p-1 hover:bg-main transition-colors rounded-md">
            <a href="#general">
              <button className="w-full h-full flex items-center justify-start">
                <div className="w-8 h-8 flex items-center justify-center text-theme-base">
                  <MdSettings />
                </div>
                <span className="text-sm ml-2 text-theme-base">General</span>
              </button>
            </a>
          </li>
          <li className="flex items-center justify-start p-1 hover:bg-main transition-colors rounded-md">
            <a href="#dictionary">
              <button className="w-full h-full flex items-center justify-start">
                <div className="w-8 h-8 flex items-center justify-center text-theme-base">
                  <MdMenuBook />
                </div>
                <span className="text-sm ml-2 text-theme-base">Dictionary</span>
              </button>
            </a>
          </li>
          <li className="flex items-center justify-start p-1 hover:bg-main transition-colors rounded-md">
            <a href="#translation">
              <button className="w-full h-full flex items-center justify-start">
                <div className="w-8 h-8 flex items-center justify-center text-theme-base">
                  <MdTranslate />
                </div>
                <span className="text-sm ml-2 text-theme-base">
                  Translation
                </span>
              </button>
            </a>
          </li>
          <li className="flex items-center justify-start p-1 hover:bg-main transition-colors rounded-md">
            <a href="#display">
              <button className="w-full h-full flex items-center justify-start">
                <div className="w-8 h-8 flex items-center justify-center text-theme-base">
                  <MdMonitor />
                </div>
                <span className="text-sm ml-2 text-theme-base">Display</span>
              </button>
            </a>
          </li>
        </ul>
      </nav>

      {/* main content area */}
      <div className="w-full h-full overflow-y-auto scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-theme">
        <div className="w-full flex flex-col items-center justify-start relative max-w-3xl mx-auto">
          {/* Network & AI Section */}
          <SettingSection id="network-ai" title="Network & AI">
            <SettingItem
              label="API Key"
              type="text"
              value={settings.openai.apiKey}
              onChange={() => {
                console.log('api key');
              }}
            />
            <SettingItem
              label="API Model"
              type="text"
              value={settings.openai.apiModel}
              onChange={() => {
                console.log('api model');
              }}
            />
            <SettingItem
              label="API URL"
              type="text"
              value={settings.openai.apiUrl}
              onChange={() => {
                console.log('api url');
              }}
            />
          </SettingSection>
          {/* General Section */}
          <SettingSection id="general" title="General">
            <SettingItem
              label="Theme"
              type="select"
              value={settings.theme}
              onChange={v => handleSettingChange('theme', v)}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
            <SettingItem
              label="App Language"
              type="select"
              value={settings.appLanguage}
              onChange={v => handleSettingChange('appLanguage', v)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'zh', label: 'Chinese(coming soon)', disabled: true },
              ]}
            />
            <SettingItem
              label="Foreign Language"
              type="select"
              value={settings.foreignLanguage}
              onChange={v => handleSettingChange('foreignLanguage', v)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'zh', label: 'Chinese(coming soon)', disabled: true },
                { value: 'de', label: 'German(coming soon)', disabled: true },
                { value: 'ko', label: 'Korean(coming soon)', disabled: true },
              ]}
            />
            <SettingItem
              label="Working Directory"
              type="path-picker"
              value={settings.workingDirectory}
              onChange={() => handlePathChange('workingDirectory')}
            />
          </SettingSection>

          {/* Dictionary Section */}
          <SettingSection id="dictionary" title="Dictionary">
            <SettingItem
              label="Youdao Dictionary"
              type="checkbox"
              value={settings.dictionary.youdaoEnabled}
              onChange={v => handleSettingChange('dictionary.youdaoEnabled', v)}
            />
            <SettingItem
              label="Cambridge Dictionary"
              type="checkbox"
              value={settings.dictionary.cambridgeEnabled}
              onChange={v =>
                handleSettingChange('dictionary.cambridgeEnabled', v)
              }
            />
          </SettingSection>

          {/* Translation Engine Section */}
          <SettingSection id="translation" title="Translation Engine">
            <SettingItem
              label="Translation Engine"
              type="select"
              value={settings.translationEngine}
              onChange={v => handleSettingChange('translationEngine', v)}
              options={[
                { value: 'youdao', label: 'Youdao' },
                { value: 'none', label: 'None' },
              ]}
            />
          </SettingSection>

          {/* Network Section */}
          {/* <SettingSection id="network" title="Network">
            <SettingItem
              label="Enable Proxy"
              type="checkbox"
              value={settings.network.enableProxy}
              onChange={v => handleSettingChange('network.enableProxy', v)}
            />
            <SettingItem
              label="Server Port"
              type="number"
              value={settings.network.serverPort}
              onChange={v => handleSettingChange('network.serverPort', v)}
              min={1024}
              max={65535}
            />
          </SettingSection> */}

          {/* Display Section */}
          <SettingSection id="display" title="Display">
            <SettingItem
              label="Dashboard Page Size"
              type="number"
              value={settings.display.dashboardPageSize}
              onChange={v =>
                handleSettingChange('display.dashboardPageSize', v)
              }
              min={5}
              max={100}
            />
            <SettingItem
              label="Reading Page Size"
              type="number"
              value={settings.display.readingPageSize}
              onChange={v => handleSettingChange('display.readingPageSize', v)}
              min={5}
              max={100}
            />
          </SettingSection>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
